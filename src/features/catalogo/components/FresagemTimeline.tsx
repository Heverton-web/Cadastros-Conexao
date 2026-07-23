import { useState, useMemo } from "react"
import toast from "react-hot-toast"
import { Check, ShoppingCart, FileText, Box } from "lucide-react"
import { addToCart, formatBRL, getPrecoFromDB } from "~/features/catalogo/services/carrinho.service"
import { playCoinSound } from "~/features/catalogo/services/audio.service"
import { useImagensBatch, useTiposOsso } from "~/features/catalogo/hooks/useCatalogo"
import type { CatalogoProtocoloFresagem } from "~/features/catalogo/types"
import { openImageViewer } from "~/features/catalogo/services/ui.service"
import { FichaTecnicaModal } from "./FichaTecnicaModal"

interface FresagemTimelineProps {
  implanteSku: string
  protocolos: CatalogoProtocoloFresagem[]
}

export function FresagemTimeline({ implanteSku, protocolos }: FresagemTimelineProps) {
  const { data: tiposOsso } = useTiposOsso()
  const [fichaModal, setFichaModal] = useState<{ open: boolean; nome: string; sku: string; imagemUrl?: string | null; sections: Array<{ title: string; specs: Array<{ label: string; value: string | number | null | undefined }> }>; vinculacoes?: Array<{ nome: string; sku: string; valor?: number | null }> }>({ open: false, nome: "", sku: "", sections: [] })

  // Mapeia tipo_osso (sigla) → categoria (hard/soft)
  const getCategoria = (tipoOsso: string | null | undefined): string | null => {
    if (!tipoOsso) return null
    return tiposOsso?.find((t) => t.sigla === tipoOsso)?.categoria ?? null
  }

  // Gera tabs únicas por categoria (SOFT / HARD)
  const uniqueCats = useMemo(() => {
    const seen = new Set<string>()
    const cats = protocolos
      .map((p) => getCategoria(p.tipo_osso))
      .filter((c): c is string => { if (!c || seen.has(c)) return false; seen.add(c); return true })
    // Ordem fixa: SOFT primeiro, HARD depois
    return cats.sort((a, b) => (a === "soft" ? 0 : 1) - (b === "soft" ? 0 : 1))
  }, [protocolos, tiposOsso])
  const [tab, setTab] = useState<string>("soft")

  const filtered = protocolos
    .filter((p) => getCategoria(p.tipo_osso) === tab)
    .sort((a, b) => a.ordem_uso - b.ordem_uso)

  const fresaSkus = filtered.map((p) => p.fresa_sku).filter(Boolean)
  const { data: imagensFresas } = useImagensBatch("fresa", fresaSkus)

  return (
    <div className="space-y-4">
      {/* Header com Tabs */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Protocolo de Fresagem</h3>
        <div className="flex gap-2">
          {uniqueCats.map((c) => (
            <button
              key={c}
              onClick={() => setTab(c)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                tab === c ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]" : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]"
              }`}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-[var(--color-border-subtle)]" />

      {/* Lista em cards */}
      <div className="space-y-3">
        {filtered.map((p) => {
          const nome = p.fresa?.nome ?? `Fresa ${p.fresa_sku}`
          const preco = getPrecoFromDB(p.fresa?.preco, "fresa", p.fresa_sku)
          const img = imagensFresas?.get(p.fresa_sku)?.[0]?.url_imagem ?? null
          return (
            <FresaCard
              key={p.id}
              ordem={p.ordem_uso}
              nome={nome}
              sku={p.fresa_sku}
              preco={preco}
              diametroMm={p.fresa?.diametro_mm}
              imageUrl={img}
              onImageClick={() => openImageViewer(img ?? "", nome)}
              onVerFicha={() => setFichaModal({
                open: true,
                nome,
                sku: p.fresa_sku,
                imagemUrl: img,
                sections: [
                  { title: "Identificação", specs: [
                    { label: "SKU", value: p.fresa_sku },
                    { label: "Nome", value: nome },
                    { label: "Diâmetro", value: p.fresa?.diametro_mm ? `${p.fresa.diametro_mm} mm` : null },
                    { label: "Comprimento", value: p.fresa?.comprimento },
                    { label: "Material", value: p.fresa?.material },
                    { label: "Tipo", value: p.fresa?.tipo_fresa?.nome },
                  ]},
                  { title: "Comercial", specs: [
                    { label: "Preço", value: preco ? formatBRL(preco) : null },
                  ]},
                ]
              })}
            />
          )
        })}

        {filtered.length === 0 && (
          <p className="text-sm text-center py-8 text-[var(--color-text-muted)]">
            Nenhuma fresa cadastrada para {tab.toUpperCase()}
          </p>
        )}
      </div>

      <FichaTecnicaModal
        open={fichaModal.open}
        onClose={() => setFichaModal((p) => ({ ...p, open: false }))}
        nome={fichaModal.nome}
        sku={fichaModal.sku}
        cor="#c9a655"
        imagemUrl={fichaModal.imagemUrl}
        sections={fichaModal.sections}
        vinculacoes={fichaModal.vinculacoes}
      />
    </div>
  )
}

function FresaCard({ ordem, nome, sku, preco, diametroMm, imageUrl, onImageClick, onVerFicha }: {
  ordem: number; nome: string; sku: string; preco: number; diametroMm?: number | null
  imageUrl?: string | null; onImageClick: () => void; onVerFicha: () => void
}) {
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    if (!preco || preco <= 0) return
    addToCart({ sku, nome, tipo: "fresa", cor: "#c9a655", preco })
    playCoinSound()
    setAdded(true)
    toast.success(`${nome} adicionado ao carrinho`, {
      icon: <Check className="w-4 h-4" />,
      style: {
        background: "var(--color-surface)",
        color: "var(--color-text-main)",
        border: "1px solid var(--color-accent)",
        fontSize: "13px",
        fontWeight: 600,
      },
      duration: 2500,
    })
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/40 hover:border-[var(--color-accent)]/40 transition-all duration-200">
      {/* Thumbnail */}
      <div
        onClick={onImageClick}
        className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden cursor-zoom-in bg-gradient-to-br from-[var(--color-surface)] to-[#0f172a] border border-[var(--color-border-subtle)] flex items-center justify-center"
      >
        {imageUrl ? (
          <img src={imageUrl} alt={nome} className="w-full h-full object-contain" loading="lazy" />
        ) : (
          <Box className="w-7 h-7 sm:w-8 sm:h-8 opacity-10 text-[#c9a655]" />
        )}
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#c9a655]/10 text-[#c9a655]">
            Etapa {ordem}
          </span>
          {diametroMm != null && (
            <span className="text-[10px] text-[var(--color-text-muted)]">Ø {diametroMm} mm</span>
          )}
        </div>
        <h4 className="text-sm font-bold text-white truncate">{nome}</h4>
        <p className="font-mono text-[10px] text-[var(--color-text-muted)]">SKU: {sku}</p>
      </div>
      {/* CTA */}
      <div className="shrink-0 flex flex-row sm:flex-col items-center sm:items-end gap-2">
        <button
          onClick={onVerFicha}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-white hover:border-[var(--color-accent)]/60 transition-all min-h-[32px]"
        >
          <FileText className="w-3 h-3" />
          Ver Ficha
        </button>
        {preco > 0 && (
          <button
            onClick={handleAdd}
            className={`group relative overflow-hidden rounded-xl font-bold text-sm transition-all duration-300 min-h-[44px] px-5 py-2.5 ${
              added
                ? "bg-[var(--color-success)] text-white shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                : "border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-fg)] hover:shadow-[0_0_30px_rgba(201,166,85,0.15)]"
            }`}
          >
            <span className="flex items-center justify-center gap-2.5">
              {added ? (
                <>
                  <Check className="h-4 w-4" />
                  ADICIONADO
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Add {formatBRL(preco)}
                </>
              )}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
