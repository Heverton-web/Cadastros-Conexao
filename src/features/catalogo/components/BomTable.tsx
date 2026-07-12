import { ShoppingCart, Check } from "lucide-react"
import toast from "react-hot-toast"
import { addToCart, formatBRL, mockPreco } from "~/features/catalogo/services/carrinho.service"
import { playCoinSound } from "~/features/catalogo/services/audio.service"
import type { ProductSheetTipo } from "~/features/catalogo/types"
import { ProductThumb } from "./ProductThumb"
import { openProductSheet } from "~/features/catalogo/services/ui.service"

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
      case 'instrumental': return '#8b5cf6'; // Roxo
      case 'fresa': return '#3b82f6'; // Azul
      case 'chave': return '#eab308'; // Amarelo
      case 'acessorio': return '#22c55e'; // Verde
      case 'implante': return '#c9a655'; // Gold
      default: return '#94a3b8'; // Slate
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-white text-lg">Peças de Reposição Avulsas (BOM)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const color = getColor(item.tipo);
          return (
            <div
              key={`${item.tipo}-${item.sku}`}
              className="flex items-center gap-4 rounded-xl border p-4 bg-[var(--color-surface)]/80 transition-colors hover:bg-[var(--color-surface-hover)]"
              style={{ borderColor: `${color}40` }}
            >
              <ProductThumb tipo={item.tipo} size="sm" cor={color} />
              <div className="flex-1 min-w-0">
                <button className="flex items-center gap-1 mb-1 group" onClick={() => openProductSheet(item.sku, item.tipo as ProductSheetTipo)}>
                  <span className="text-[10px] font-black uppercase tracking-widest transition-colors" style={{ color: color }}>
                    {TIPO_LABEL[item.tipo] || item.tipo} - VER FICHA
                  </span>
                  <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: color }}>➔</span>
                </button>
                <p className="font-bold text-white truncate text-sm leading-tight">{item.nome}</p>
                <p className="text-xs font-mono text-[var(--color-text-muted)] mt-1">
                  SKU: {item.sku} · Qtd: {item.quantidade}
                </p>
              </div>
              
              <button
                onClick={() => handleAdd(item)}
                className="shrink-0 flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-md border border-[var(--color-border-subtle)] hover:bg-[#c9a655]/10 text-[var(--color-text-muted)] text-xs font-bold transition-colors"
                style={{ borderColor: 'rgba(201,166,85,0.3)', color: '#c9a655' }}
              >
                + Add
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
