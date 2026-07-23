import { supabase } from "~/lib/supabase"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { Check, Plus, ArrowLeft, Box } from "lucide-react"
import { addToCart } from "~/features/catalogo/services/carrinho.service"
import { playCoinSound } from "~/features/catalogo/services/audio.service"
import { openImageViewer } from "~/features/catalogo/services/ui.service"
import { useCatalogoEmpresaId } from "~/features/catalogo/hooks/useCatalogoEmpresa"

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

  useEffect(() => {
    if (!abutmentSku || !empresaId) return
    setLoading(true)
    supabase.from("catalogo_seq_protetica_abutments").select("seq_id").eq("abutment_sku", abutmentSku)
      .then(async ({ data: pivots }) => {
        const seqIds = (pivots ?? []).map((r: { seq_id: string }) => r.seq_id)
        if (seqIds.length === 0) { setWorkflows([]); return }

        const [{ data: etapasData }, { data: compData }, { data: seqInfo }] = await Promise.all([
          supabase.from("catalogo_seq_protetica_etapas").select("seq_id, etapa_id, etapa:catalogo_cps_etapas_workflows(id, nome, ordem, tipo_workflow:catalogo_cps_tipos_workflows(nome))").in("seq_id", seqIds),
          supabase.from("catalogo_seq_protetica_componentes").select("seq_id, componente_sku, componente:catalogo_componentes(sku, nome, preco, descricao)").in("seq_id", seqIds),
          supabase.from("catalogo_seq_proteticas").select("id, nome").in("id", seqIds),
        ])

        const groups: Record<string, WorkflowGroup> = {}
        for (const e of etapasData ?? []) {
          const seqId = (e as { seq_id: string }).seq_id
          const etapa = (e as { etapa: { id: string; nome: string; ordem: number; tipo_workflow: { nome: string } | null } | null }).etapa
          const wfName = etapa?.tipo_workflow?.nome ?? (seqInfo?.find((s: { id: string }) => s.id === seqId)?.nome ?? "Workflow")
          if (!groups[seqId]) groups[seqId] = { id: seqId, nome: wfName, etapas: [] }
          groups[seqId].etapas.push({ id: etapa?.id ?? (e as { etapa_id: string }).etapa_id, nome: etapa?.nome ?? "", ordem: etapa?.ordem ?? 0, componentes: [] })
        }
        for (const c of compData ?? []) {
          const seqId = (c as { seq_id: string }).seq_id
          const comp = (c as { componente: { sku: string; nome: string; preco: number | null; descricao: string | null } | null }).componente
          if (!groups[seqId]) {
            const wfName = seqInfo?.find((s: { id: string }) => s.id === seqId)?.nome ?? "Componentes"
            groups[seqId] = { id: seqId, nome: wfName, etapas: [] }
          }
          groups[seqId].etapas.push({
            id: (c as { componente_sku: string }).componente_sku,
            nome: comp?.nome ?? (c as { componente_sku: string }).componente_sku,
            ordem: 999,
            componentes: [{ sku: comp?.sku ?? (c as { componente_sku: string }).componente_sku, nome: comp?.nome ?? "", preco: Number(comp?.preco) || undefined, descricao: comp?.descricao ?? undefined }],
          })
        }
        for (const g of Object.values(groups)) g.etapas.sort((a, b) => a.ordem - b.ordem)
        setWorkflows(Object.values(groups))
      })
      .catch(() => setWorkflows([]))
      .finally(() => setLoading(false))
  }, [abutmentSku, empresaId])

  const handleAdd = (sku: string, nome: string) => {
    addToCart({ sku, nome, tipo: "acessorio", cor: "#c9a655", preco: 0 })
    playCoinSound()
    setAddedSkus((prev) => new Set(prev).add(sku))
    toast.success(`${nome} adicionado`, { icon: <Check className="w-4 h-4" />, duration: 2000 })
    setTimeout(() => setAddedSkus((prev) => { const next = new Set(prev); next.delete(sku); return next }), 2000)
  }

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
              return (
                <div key={comp.sku} className="flex items-center gap-4 p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/40 hover:border-[var(--color-accent)]/40 transition-all">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[var(--color-surface)] to-[#0f172a] border border-[var(--color-border-subtle)] flex items-center justify-center shrink-0 cursor-zoom-in" onClick={() => openImageViewer("", comp.nome)}>
                    <Box className="w-6 h-6 opacity-10 text-[var(--color-accent)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{comp.nome}</p>
                    <p className="text-[10px] font-mono text-[var(--color-text-muted)]">SKU: {comp.sku}</p>
                    {comp.preco != null && comp.preco > 0 && <p className="text-sm font-bold text-[var(--color-accent)] mt-0.5">R$ {comp.preco.toFixed(2).replace(".", ",")}</p>}
                  </div>
                  <div className="shrink-0 flex flex-col gap-2">
                    <button onClick={() => openImageViewer("", comp.nome)} className="px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-white hover:border-[var(--color-accent)]/60 transition-all">Ver Ficha</button>
                    <button onClick={() => handleAdd(comp.sku, comp.nome)} className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${isAdded ? "bg-[var(--color-success)] text-white" : "border border-[#c9a655]/40 text-[#c9a655] hover:bg-[#c9a655]/15"}`}>
                      {isAdded ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      {isAdded ? "OK" : "Add"}
                    </button>
                  </div>
                </div>
              )
            }) : <p className="text-xs text-[var(--color-text-muted)] italic pl-2">Nenhum componente nesta etapa</p>}
          </div>
        ))}
      </div>
    )
  }

  return (
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
  )
}
