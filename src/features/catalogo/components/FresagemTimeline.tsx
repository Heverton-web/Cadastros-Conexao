import { useState } from "react"
import toast from "react-hot-toast"
import { Eye, ShoppingCart, Check, Plus } from "lucide-react"
import { addToCart, formatBRL, getPrecoFromDB } from "~/features/catalogo/services/carrinho.service"
import { playCoinSound } from "~/features/catalogo/services/audio.service"
import type { ProductSheetTipo, CatalogoProtocoloFresagem } from "~/features/catalogo/types"
import { ProductThumb } from "./ProductThumb"
import { openImageViewer } from "~/features/catalogo/services/ui.service"

interface FresagemTimelineProps {
  implanteSku: string
  protocolos: CatalogoProtocoloFresagem[]
}

export function FresagemTimeline({ implanteSku, protocolos }: FresagemTimelineProps) {
  const [tab, setTab] = useState<"Hard (I-II)" | "Soft (III-IV)">("Hard (I-II)")
  const [addedSkus, setAddedSkus] = useState<Set<string>>(new Set())

  const filtered = protocolos
    .filter((p) => p.tipo_osso === tab)
    .sort((a, b) => a.ordem_uso - b.ordem_uso)

  const handleAddFresa = (sku: string, nome: string, preco?: number) => {
    const precoFinal = getPrecoFromDB(preco, "fresa", sku)
    addToCart({ sku, nome, tipo: "fresa", cor: "#c9a655", preco: precoFinal })
    playCoinSound()
    setAddedSkus((prev) => new Set(prev).add(sku))
    toast.success(`${nome} adicionado`, {
      icon: <Check className="w-4 h-4" />,
      style: {
        background: "var(--color-surface)",
        color: "var(--color-text-main)",
        border: "1px solid var(--color-accent)",
        fontSize: "13px",
        fontWeight: 600,
      },
      duration: 2000,
    })
    setTimeout(() => {
      setAddedSkus((prev) => {
        const next = new Set(prev)
        next.delete(sku)
        return next
      })
    }, 2000)
  }

  return (
    <div className="space-y-4">
      {/* Header com Tabs */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Protocolo de Fresagem</h3>
        <div className="flex gap-2">
          {(["Hard (I-II)", "Soft (III-IV)"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                tab === t ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]" : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]"
              }`}
            >
              Osso {t.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-[var(--color-border-subtle)]" />

      {/* Lista em cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((p) => {
          const isAdded = addedSkus.has(p.fresa_sku)
          const nome = p.fresa?.nome ?? `Fresa ${p.fresa_sku}`
          return (
            <div
              key={p.id}
              className="flex flex-col rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/80 overflow-hidden"
            >
              {/* Header: imagem + nome + código */}
              <div className="flex items-center gap-3 p-3 pb-2">
                <ProductThumb tipo="fresa" size="sm" cor="#c9a655" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
                    Etapa {p.ordem_uso}
                  </p>
                  <p className="font-bold text-white text-sm leading-tight truncate mt-0.5">
                    {nome}
                  </p>
                  <p className="text-[10px] font-mono text-[var(--color-text-muted)] mt-0.5">
                    SKU {p.fresa_sku}
                  </p>
                </div>
              </div>

              {/* Body: diâmetro + preço */}
              <div className="px-3 py-2 space-y-0.5 text-center">
                {p.fresa?.diametro_mm && (
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Diâmetro: <span className="font-semibold text-[#c9a655]">Ø {p.fresa.diametro_mm} mm</span>
                  </p>
                )}
                <p className="text-xs text-[var(--color-text-muted)]">
                  Valor un: <span className="font-semibold text-[#c9a655]">{formatBRL(getPrecoFromDB(p.fresa?.preco, "fresa", p.fresa_sku))}</span>
                </p>
              </div>

              {/* Botões */}
              <div className="flex items-center gap-2 p-3 pt-2 mt-auto border-t border-[var(--color-border-subtle)]">
                <button
                  onClick={() => openImageViewer("", nome)}
                  className="flex items-center justify-center px-3 py-2 rounded-lg border border-[var(--color-border-subtle)] bg-white/5 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAddFresa(p.fresa_sku, nome, p.fresa?.preco)}
                  className={`flex items-center justify-center gap-1.5 flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                    isAdded
                      ? "bg-[var(--color-success)] text-white"
                      : "border border-[#c9a655]/40 text-[#c9a655] hover:bg-[#c9a655]/15"
                  }`}
                >
                  {isAdded ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  {isAdded ? "OK" : "Add"}
                </button>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <p className="text-sm text-center py-8 text-[var(--color-text-muted)] col-span-full">
            Nenhuma fresa cadastrada para Osso {tab.split(" ")[0]}
          </p>
        )}
      </div>
    </div>
  )
}
