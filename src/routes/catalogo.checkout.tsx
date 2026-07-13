import { createRoute, Link } from "@tanstack/react-router"
import { rootRoute } from "./__root"
import { StoreLayout } from "~/features/catalogo/components/StoreLayout"
import { useCarrinho, cartTotais, formatBRL, clearCart } from "~/features/catalogo/services/carrinho.service"
import { useState } from "react"
import { consultarViaCEP } from "~/features/catalogo/services/frete.service"
import { validarCupom, aplicarCupom } from "~/features/catalogo/services/cupons.service"
import { useAuth } from "~/lib/auth"
import type { CatalogoCupom } from "~/features/catalogo/types"
import { CheckCircle, Truck, MapPin, Tag, ShieldCheck, ArrowLeft } from "lucide-react"

export const catalogoCheckoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalogo/checkout",
  component: CheckoutPage,
})

function CheckoutPage() {
  const items = useCarrinho()
  const { profile } = useAuth()
  const { total } = cartTotais(items)
  const [cep, setCep] = useState("")
  const [endereco, setEndereco] = useState<{ logradouro: string; bairro: string; cidade: string; estado: string } | null>(null)
  const [cupomCodigo, setCupomCodigo] = useState("")
  const [cupom, setCupom] = useState<CatalogoCupom | null>(null)
  const [cupomErro, setCupomErro] = useState("")
  const [protocolo, setProtocolo] = useState<string | null>(null)
  const [buscandoCep, setBuscandoCep] = useState(false)

  async function handleBuscarCep() {
    setBuscandoCep(true)
    const result = await consultarViaCEP(cep.replace(/\D/g, ""))
    setEndereco(result)
    setBuscandoCep(false)
  }

  async function handleAplicarCupom() {
    setCupomErro("")
    if (!profile?.empresa_id) return
    const result = await validarCupom(profile.empresa_id, cupomCodigo)
    if (result) setCupom(result)
    else setCupomErro("Cupom inválido ou expirado")
  }

  function handleFinalizar() {
    setProtocolo(`CX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`)
    clearCart()
  }

  if (protocolo) {
    return (
      <StoreLayout>
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(52,211,153,0.3)]">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black mb-4 text-white">Pedido Confirmado!</h1>
          <p className="text-lg text-[var(--color-text-muted)] mb-8">
            Seu pedido foi recebido e está sendo processado. O protocolo de acompanhamento é:
          </p>
          <div className="inline-block px-8 py-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-accent)] mb-12 shadow-[0_0_30px_rgba(201,166,85,0.1)]">
            <span className="text-3xl font-mono font-black text-gradient-gold tracking-widest">{protocolo}</span>
          </div>
          <br/>
          <Link 
            to="/catalogo"
            className="inline-block px-8 py-3 rounded-full border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-white hover:border-[var(--color-accent)] transition-all font-bold uppercase tracking-widest text-sm"
          >
            Voltar ao Catálogo
          </Link>
        </div>
      </StoreLayout>
    )
  }

  const desconto = cupom ? total - aplicarCupom(total, cupom) : 0
  const totalFinal = total - desconto

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link 
          to="/catalogo/carrinho" 
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Carrinho
        </Link>
        
        <h1 className="text-4xl font-black mb-12 uppercase tracking-tighter text-white">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Formulário / Ações */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Seção Frete */}
            <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/50 p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[var(--color-input-bg)] flex items-center justify-center border border-[var(--color-border-subtle)]">
                  <MapPin className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <h3 className="text-xl font-bold text-white">Endereço de Entrega</h3>
              </div>
              
              <div className="flex gap-4">
                <input 
                  value={cep} 
                  onChange={(e) => setCep(e.target.value)} 
                  placeholder="Digite seu CEP..." 
                  className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-input-bg)] border border-[var(--color-input-border)] text-sm focus:border-[var(--color-accent)] focus:outline-none transition-all text-white placeholder-[var(--color-text-muted)]"
                />
                <button 
                  onClick={handleBuscarCep} 
                  disabled={buscandoCep} 
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-[var(--color-surface-hover)] text-white hover:text-[var(--color-accent)] disabled:opacity-50 transition-colors"
                >
                  {buscandoCep ? "Buscando..." : "Buscar CEP"}
                </button>
              </div>
              {endereco && (
                <div className="mt-6 p-4 rounded-xl bg-[var(--color-input-bg)] border border-[var(--color-border-subtle)] flex items-start gap-3">
                  <Truck className="w-5 h-5 text-[var(--color-accent)] mt-1" />
                  <div>
                    <p className="font-semibold text-white">{endereco.logradouro}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">{endereco.bairro}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">{endereco.cidade} - {endereco.estado}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Seção Cupom */}
            <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/50 p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[var(--color-input-bg)] flex items-center justify-center border border-[var(--color-border-subtle)]">
                  <Tag className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <h3 className="text-xl font-bold text-white">Cupom de Desconto</h3>
              </div>
              
              <div className="flex gap-4">
                <input 
                  value={cupomCodigo} 
                  onChange={(e) => setCupomCodigo(e.target.value.toUpperCase())} 
                  placeholder="Código do cupom..." 
                  className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-input-bg)] border border-[var(--color-input-border)] text-sm focus:border-[var(--color-accent)] focus:outline-none transition-all text-white uppercase placeholder:normal-case placeholder-[var(--color-text-muted)]"
                />
                <button 
                  onClick={handleAplicarCupom} 
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-[var(--color-surface-hover)] text-white hover:text-[var(--color-accent)] transition-colors"
                >
                  Aplicar
                </button>
              </div>
              {cupomErro && <p className="text-sm font-bold text-red-400 mt-3">{cupomErro}</p>}
              {cupom && <p className="text-sm font-bold text-green-400 mt-3">Cupom {cupom.codigo} aplicado com sucesso!</p>}
            </div>

          </div>

          {/* Resumo Final */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/80 p-8 backdrop-blur-xl shadow-2xl">
              <h3 className="text-lg font-black uppercase tracking-widest text-white mb-6 border-b border-[var(--color-border-subtle)] pb-4">Resumo da Compra</h3>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.sku} className="flex justify-between items-center text-sm">
                    <span className="text-[var(--color-text-muted)]">
                      <span className="text-white font-semibold">{item.quantidade}x</span> {item.nome}
                    </span>
                    <span className="font-mono text-white">{formatBRL(item.preco * item.quantidade)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 py-6 border-y border-[var(--color-border-subtle)] mb-6">
                <div className="flex justify-between text-sm text-[var(--color-text-muted)]">
                  <span>Subtotal</span>
                  <span className="text-white">{formatBRL(total)}</span>
                </div>
                {desconto > 0 && (
                  <div className="flex justify-between text-sm font-bold text-green-400">
                    <span>Desconto ({cupom?.codigo})</span>
                    <span>-{formatBRL(desconto)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-[var(--color-text-muted)]">
                  <span>Frete</span>
                  <span className="text-[var(--color-accent)] font-semibold">Grátis</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Total a Pagar</span>
                <span className="text-4xl font-black text-gradient-gold">{formatBRL(totalFinal)}</span>
              </div>

              <button
                onClick={handleFinalizar}
                disabled={items.length === 0}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(201,166,85,0.3)] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #c9a655, #e8d48b)", color: "#0f172a" }}
              >
                <ShieldCheck className="w-5 h-5" /> Confirmar Compra
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </StoreLayout>
  )
}
