import { ShoppingCart, Check, Eye, Plus } from "lucide-react"
import toast from "react-hot-toast"
import { addToCart, formatBRL, mockPreco } from "~/features/catalogo/services/carrinho.service"
import { playCoinSound } from "~/features/catalogo/services/audio.service"
import type { ProductSheetTipo } from "~/features/catalogo/types"
import { ProductThumb } from "./ProductThumb"
import { openImageViewer } from "~/features/catalogo/services/ui.service"

const TIPO_LABEL: Record<string, string> = {
  fresa: "Fresa",
  chave: "Chave",
  acessorio: "Acessório",
  instrumental: "Instrumental",
  implante: "Implante",
}

interface BomTableProps {
  items: { tipo: string; sku: string; nome: string; quantidade: number }[]
}

export function BomTable({ items }: BomTableProps) {
  const handleAdd = (item: { tipo: string; sku: string; nome: string }) => {
    const preco = mockPreco(item.tipo as ProductSheetTipo, item.sku)
    addToCart({ sku: item.sku, nome: item.nome, tipo: item.tipo as ProductSheetTipo, cor: "#c9a655", preco })
    playCoinSound()
    toast.success(`${item.nome} adicionado`, {
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
  }

  const getColor = (tipo: string) => {
    switch(tipo) {
      case 'instrumental': return '#8b5cf6';
      case 'fresa': return '#3b82f6';
      case 'chave': return '#eab308';
      case 'acessorio': return '#22c55e';
      case 'implante': return '#c9a655';
      default: return '#94a3b8';
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-white text-lg">Peças de Reposição Avulsas (BOM)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => {
          const color = getColor(item.tipo);
          return (
            <div
              key={`${item.tipo}-${item.sku}`}
              className="flex flex-col rounded-xl border bg-[var(--color-surface)]/80 overflow-hidden"
              style={{ borderColor: `${color}40` }}
            >
              {/* Header: imagem + nome + código */}
              <div className="flex items-center gap-3 p-3 pb-2">
                <ProductThumb tipo={item.tipo} size="sm" cor={color} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm leading-tight truncate">{item.nome}</p>
                  <p className="text-[10px] font-mono text-[var(--color-text-muted)] mt-0.5">{item.sku}</p>
                </div>
              </div>

              {/* Body: quantidade + preço unitário */}
              <div className="px-3 py-2 space-y-0.5 text-center">
                <p className="text-xs text-[var(--color-text-muted)]">
                  Qtd no kit: <span className="font-semibold" style={{ color }}>{item.quantidade}</span>
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Valor un: <span className="font-semibold" style={{ color }}>{formatBRL(mockPreco(item.tipo as ProductSheetTipo, item.sku))}</span>
                </p>
              </div>

              {/* Botões */}
              <div className="flex items-center gap-2 p-3 pt-2 mt-auto border-t border-[var(--color-border-subtle)]">
                <button
                  onClick={() => openImageViewer("", item.nome)}
                  className="flex items-center justify-center px-3 py-2 rounded-lg border border-[var(--color-border-subtle)] bg-white/5 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAdd(item)}
                  className="flex items-center justify-center gap-1.5 flex-1 px-3 py-2 rounded-lg border border-[#c9a655]/40 text-[#c9a655] text-xs font-bold transition-colors hover:bg-[#c9a655]/15"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
