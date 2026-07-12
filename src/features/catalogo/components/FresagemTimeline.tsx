import { useState } from "react"
import toast from "react-hot-toast"
import { Eye, ShoppingCart, Check } from "lucide-react"
import { addToCart, formatBRL, mockPreco } from "~/features/catalogo/services/carrinho.service"
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

  const handleAddFresa = (sku: string, nome: string) => {
    const preco = mockPreco("fresa", sku)
    addToCart({ sku, nome, tipo: "fresa", cor: "#c9a655", preco })
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

      {/* Lista */}
      <div className="space-y-3">
        {filtered.map((p) => {
          const isAdded = addedSkus.has(p.fresa_sku)
          const nome = p.fresa?.nome ?? `Fresa ${p.fresa_sku}`
          return (
            <div
              key={p.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface)]/60 border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-surface-hover)] transition-all group"
            >
              <ProductThumb tipo="fresa" size="sm" cor="#c9a655" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
                  Etapa {p.ordem_uso}
                </p>
                <p className="font-bold text-white text-sm mt-1 truncate">
                  {nome}
                </p>
                <p className="text-xs font-mono text-[var(--color-text-muted)] mt-0.5">
                  SKU {p.fresa_sku} {p.fresa?.diametro_mm ? `· Ø ${p.fresa.diametro_mm}` : ""} · {formatBRL(mockPreco("fresa", p.fresa_sku))}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openImageViewer("", nome)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleAddFresa(p.fresa_sku, nome)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                    isAdded
                      ? "bg-[var(--color-success)] text-white"
                      : "border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-fg)]"
                  }`}
                >
                  {isAdded ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
                  {isAdded ? "OK" : "+ Add"}
                </button>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <p className="text-sm text-center py-8 text-[var(--color-text-muted)]">
            Nenhuma fresa cadastrada para Osso {tab.split(" ")[0]}
          </p>
        )}
      </div>
    </div>
  )
}
