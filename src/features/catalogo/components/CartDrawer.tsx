import { X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import { useUIState, toggleCartDrawer } from "../services/ui.service"
import { useCarrinho, removeFromCart, setQuantidade, cartTotais, formatBRL } from "../services/carrinho.service"
import { Link } from "@tanstack/react-router"
import { useEffect, useMemo } from "react"

export function CartDrawer() {
  const { cartDrawerOpen } = useUIState()
  const cart = useCarrinho()
  const { total } = useMemo(() => cartTotais(cart), [cart])

  useEffect(() => {
    if (cartDrawerOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "auto"
    return () => { document.body.style.overflow = "auto" }
  }, [cartDrawerOpen])

  if (!cartDrawerOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm transition-opacity"
        onClick={() => toggleCartDrawer(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-[#0f172a] border-l border-[var(--color-border-subtle)] shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-[var(--color-accent)]" />
            <h2 className="font-bold text-lg text-white">Sua Sacola</h2>
          </div>
          <button onClick={() => toggleCartDrawer(false)} className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <X className="w-5 h-5 text-[var(--color-text-muted)]" />
          </button>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-[var(--color-text-muted)] opacity-50" />
              </div>
              <p className="text-[var(--color-text-muted)] font-medium">Sua sacola está vazia</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.sku} className="p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/50 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] block mb-1">{item.tipo}</span>
                    <h4 className="font-semibold text-white leading-snug">{item.nome}</h4>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1 font-mono">SKU: {item.sku}</p>
                  </div>
                  <p className="font-bold text-[#c9a655] whitespace-nowrap">{formatBRL(item.preco)}</p>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-subtle)]/50">
                  <div className="flex items-center gap-3 bg-[var(--color-surface)] rounded-lg p-1 border border-[var(--color-border-subtle)]">
                    <button onClick={() => setQuantidade(item.sku, item.quantidade - 1)} className="p-1 rounded-md hover:bg-white/10">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{item.quantidade}</span>
                    <button onClick={() => setQuantidade(item.sku, item.quantidade + 1)} className="p-1 rounded-md hover:bg-white/10">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.sku)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-end mb-6">
              <span className="text-sm text-[var(--color-text-muted)] uppercase tracking-widest font-bold">Total estimado</span>
              <span className="text-3xl font-black text-gradient-gold">{formatBRL(total)}</span>
            </div>
            
            <Link 
              to="/catalogo/checkout" 
              onClick={() => toggleCartDrawer(false)}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm tracking-widest uppercase transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #c9a655, #e8d48b)", color: "#0f172a" }}
            >
              Finalizar Pedido
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
