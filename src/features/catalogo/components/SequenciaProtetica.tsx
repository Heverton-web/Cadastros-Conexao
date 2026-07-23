import { supabase } from "~/lib/supabase"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { Check, ArrowLeft, Box, ShoppingCart, FileText } from "lucide-react"
import { addToCart, formatBRL } from "~/features/catalogo/services/carrinho.service"
import { playCoinSound } from "~/features/catalogo/services/audio.service"
import { openImageViewer } from "~/features/catalogo/services/ui.service"
import { useCatalogoEmpresaId } from "~/features/catalogo/hooks/useCatalogoEmpresa"
import { FichaTecnicaModal } from "./FichaTecnicaModal"

interface SequenciaProteticaProps {
  familiaId: string
  tipoAbutmentId: string
  familiaNome: string
  tipoAbutmentNome: string
  abutmentSku?: string
}

interface CompItem { sku: string; nome: string; preco?: number; descricao?: string }

interface EtapaItem {
  id: string
  nome: string
  ordem: number
  componentes: CompItem[]
}

interface WorkflowGroup {
  id: string
  nome: string
  etapas: EtapaItem[]
}

export function SequenciaProtetica({ familiaId, tipoAbutmentId, familiaNome, tipoAbutmentNome, abutmentSku }: SequenciaProteticaProps) {
  const empresaId = useCatalogoEmpresaId()
  const [addedSkus, setAddedSkus] = useState<Set<string>>(new Set())
  const [workflows, setWorkflows] = useState<WorkflowGroup[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [imagensMap, setImagensMap] = useState<Map<string, string>>(new Map())
  const [fichaModal, setFichaModal] = useState<{ open: boolean; nome: string; sku: string; imagemUrl?: string | null; specs: Array<{ label: string; value: string | number | null | undefined }> }>({ open: false, nome: "", sku: "", specs: [] })

  useEffect(() => {
    if (!abutmentSku || !empresaId) return
    setLoading(true)
    supabase.from("catalogo_seq_protetica_abutments").select("seq_id").eq("abutment_sku", abutmentSku)
      .then(async ({ data: pivots }) => {
        const seqIds = (pivots ?? []).map((r: { seq_id: string }) => r.seq_id)
        if (seqIds.length === 0) { setWorkflows([]); return }

        const [{ data: etapasData }, { data: etapaCompData }, { data: seqInfo }] = await Promise.all([
          supabase.from("catalogo_seq_protetica_etapas").select("seq_id, etapa_id, etapa:catalogo_cps_etapas_workflows(id, nome, ordem, tipo_workflow:catalogo_cps_tipos_workflows(nome))").in("seq_id", seqIds),
          supabase.from("catalogo_seq_protetica_etapa_componentes").select("seq_id, etapa_id, componente_sku, componente:catalogo_componentes(sku, nome, preco, descricao)").in("seq_id", seqIds),
          supabase.from("catalogo_seq_proteticas").select("id, nome").in("id", seqIds),
        ])

        // Montar grupos com etapas
        const groups: Record<string, WorkflowGroup> = {}
        for (const e of etapasData ?? []) {
          const seqId = (e as { seq_id: string }).seq_id
          const etapa = (e as { etapa: { id: string; nome: string; ordem: number; tipo_workflow: { nome: string } | null } | null }).etapa
          const wfName = etapa?.tipo_workflow?.nome ?? (seqInfo?.find((s: { id: string }) => s.id === seqId)?.nome ?? "Workflow")
          if (!groups[seqId]) groups[seqId] = { id: seqId, nome: wfName, etapas: [] }
          groups[seqId].etapas.push({ id: etapa?.id ?? (e as { etapa_id: string }).etapa_id, nome: etapa?.nome ?? "", ordem: etapa?.ordem ?? 0, componentes: [] })
        }

        // Vincular componentes às etapas via nova tabela pivô
        for (const c of etapaCompData ?? []) {
          const seqId = (c as { seq_id: string }).seq_id
          const etapaId = (c as { etapa_id: string }).etapa_id
          const comp = (c as { componente: { sku: string; nome: string; preco: number | null; descricao: string | null } | null }).componente
          if (!groups[seqId]) {
            const wfName = seqInfo?.find((s: { id: string }) => s.id === seqId)?.nome ?? "Workflow"
            groups[seqId] = { id: seqId, nome: wfName, etapas: [] }
          }
          // Encontrar a etapa no grupo e adicionar o componente
          const etapa = groups[seqId].etapas.find((e) => e.id === etapaId)
          if (etapa) {
            etapa.componentes.push({ sku: comp?.sku ?? (c as { componente_sku: string }).componente_sku, nome: comp?.nome ?? "", preco: Number(comp?.preco) || undefined, descricao: comp?.descricao ?? undefined })
          }
        }

        for (const g of Object.values(groups)) g.etapas.sort((a, b) => a.ordem - b.ordem)
        setWorkflows(Object.values(groups))

        // Buscar imagens dos componentes
        const allCompSkus = (etapaCompData ?? [])
          .map((c: any) => c.componente?.sku)
          .filter((sku: string | undefined): sku is string => !!sku)
        if (allCompSkus.length > 0) {
          const { data: imgs } = await supabase.from("catalogo_imagens_produto").select("produto_sku, url_imagem").eq("produto_tipo", "componente").in("produto_sku", allCompSkus)
          const map = new Map<string, string>()
          for (const img of imgs ?? []) {
            if (!map.has(img.produto_sku)) map.set(img.produto_sku, img.url_imagem)
          }
          setImagensMap(map)
        }
      })
      .catch(() => setWorkflows([]))
      .finally(() => setLoading(false))
  }, [abutmentSku, empresaId])

  if (loading) return (
    <div className="space-y-2">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-accent)]">{tipoAbutmentNome}</p>
      <h3 className="text-lg font-bold text-white">Sequência Protética</h3>
      <p className="text-sm text-[var(--color-text-muted)]">Carregando...</p>
    </div>
  )

  if (workflows.length === 0) return (
    <div className="text-center px-6 py-12 rounded-xl bg-[var(--color-surface)]/30 border border-[var(--color-border-subtle)]">
      <p className="text-sm font-bold text-[var(--color-text-muted)]">Nenhuma sequência protética cadastrada</p>
      <p className="text-xs text-[var(--color-text-muted)]/60 mt-1">Vincule uma sequência na edição do abutment.</p>
    </div>
  )

  if (selectedWorkflow) {
    const workflow = workflows.find((w) => w.id === selectedWorkflow)
    return (
      <>
      <div className="space-y-4">
        <button onClick={() => setSelectedWorkflow(null)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-accent)]">{tipoAbutmentNome}</p>
          <h3 className="text-xl font-black text-white">{workflow?.nome}</h3>
        </div>
        <div className="h-px bg-[var(--color-border-subtle)]" />
        {workflow?.etapas.map((etapa) => (
          <div key={etapa.id} className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">Etapa {etapa.ordem}: {etapa.nome}</p>
            {etapa.componentes.length > 0 ? etapa.componentes.map((comp) => {
              const isAdded = addedSkus.has(comp.sku)
              const preco = Number(comp.preco)
              const temPreco = Number.isFinite(preco) && preco > 0
              const img = imagensMap.get(comp.sku)
              return (
                <div key={comp.sku} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/40 hover:border-[var(--color-accent)]/40 transition-all">
                  {/* Thumbnail */}
                  <div
                    onClick={() => openImageViewer(img ?? "", comp.nome)}
                    className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden cursor-zoom-in bg-gradient-to-br from-[var(--color-surface)] to-[#0f172a] border border-[var(--color-border-subtle)] flex items-center justify-center"
                  >
                    {img ? (
                      <img src={img} alt={comp.nome} className="w-full h-full object-contain" loading="lazy" />
                    ) : (
                      <Box className="w-8 h-8 opacity-10 text-[var(--color-accent)]" />
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className="text-sm font-bold text-white truncate">{comp.nome}</p>
                    <p className="font-mono text-[10px] text-[var(--color-text-muted)]">SKU: {comp.sku}</p>
                  </div>
                  {/* CTA */}
                  {(temPreco) && (
                    <div className="shrink-0 flex flex-col items-center gap-2">
                      <button
                        onClick={() => setFichaModal({ open: true, nome: comp.nome, sku: comp.sku, imagemUrl: img, specs: [
                          { label: "SKU", value: comp.sku },
                          { label: "Nome", value: comp.nome },
                          { label: "Descricao", value: comp.descricao },
                          { label: "Preco", value: preco ? formatBRL(preco) : null },
                        ] })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-white hover:border-[var(--color-accent)]/60 transition-all"
                      >
                        <FileText className="w-3 h-3" />
                        Ver Ficha
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ sku: comp.sku, nome: comp.nome, tipo: "acessorio", cor: "#c9a655", preco })
                          playCoinSound()
                          setAddedSkus((prev) => new Set(prev).add(comp.sku))
                          toast.success(`${comp.nome} adicionado ao carrinho`, { icon: <Check className="w-4 h-4" />, duration: 2500 })
                          setTimeout(() => setAddedSkus((prev) => { const next = new Set(prev); next.delete(comp.sku); return next }), 2000)
                        }}
                        className={`w-full group relative overflow-hidden rounded-xl font-bold text-sm transition-all duration-300 px-6 py-3 ${
                          isAdded
                            ? "bg-[var(--color-success)] text-white shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                            : "border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-fg)] hover:shadow-[0_0_30px_rgba(201,166,85,0.15)]"
                        }`}
                      >
                        <span className="flex items-center justify-center gap-3">
                          {isAdded ? (
                            <><Check className="h-4 w-4" />ADICIONADO</>
                          ) : (
                            <><ShoppingCart className="h-4 w-4 transition-transform group-hover:scale-110" />ADICIONAR — {formatBRL(preco)}</>
                          )}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )
            }) : <p className="text-xs text-[var(--color-text-muted)] italic pl-2">Nenhum componente nesta etapa</p>}
          </div>
        ))}
      </div>
      <FichaTecnicaModal
        open={fichaModal.open}
        onClose={() => setFichaModal((p) => ({ ...p, open: false }))}
        nome={fichaModal.nome}
        sku={fichaModal.sku}
        cor="#c9a655"
        imagemUrl={fichaModal.imagemUrl}
        specs={fichaModal.specs}
      />
    </>
    )
  }

  return (
    <>
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-accent)]">{tipoAbutmentNome}</p>
        <h3 className="text-lg font-bold text-white">Sequência Protética</h3>
      </div>
      <div className="h-px bg-[var(--color-border-subtle)]" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {workflows.map((wf) => (
          <button key={wf.id} onClick={() => setSelectedWorkflow(wf.id)} className="text-left p-5 rounded-xl bg-[var(--color-surface)]/60 border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)]/40 transition-all group">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-accent)] mb-1">{tipoAbutmentNome}</p>
            <h4 className="font-bold text-white group-hover:text-[var(--color-accent)] transition-colors">{wf.nome}</h4>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">{wf.etapas.length} etapa(s)</p>
          </button>
        ))}
      </div>
    </div>
    <FichaTecnicaModal
      open={fichaModal.open}
      onClose={() => setFichaModal((p) => ({ ...p, open: false }))}
      nome={fichaModal.nome}
      sku={fichaModal.sku}
      cor="#c9a655"
      imagemUrl={fichaModal.imagemUrl}
      specs={fichaModal.specs}
    />
    </>
  )
}
