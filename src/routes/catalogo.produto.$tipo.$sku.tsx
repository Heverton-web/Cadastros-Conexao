import { createRoute, useParams, useNavigate, useSearch } from "@tanstack/react-router"
import { rootRoute } from "./__root"
import { StoreLayout } from "~/features/catalogo/components/StoreLayout"
import { useImplanteDetalhe, useAbutmentDetalhe, useKitDetalhe, usePromocionalDetalhe, useProtocoloFresagem, useGuias } from "~/features/catalogo/hooks/useCatalogo"
import { addToCart, formatBRL, getPrecoFromDB, mockPreco, resolveBOMItem } from "~/features/catalogo/services/carrinho.service"
import { playCoinSound } from "~/features/catalogo/services/audio.service"
import { FresagemTimeline } from "~/features/catalogo/components/FresagemTimeline"
import { SequenciaProtetica } from "~/features/catalogo/components/SequenciaProtetica"
import { BomTable } from "~/features/catalogo/components/BomTable"
import type { ProductSheetTipo } from "~/features/catalogo/types"
import { useState } from "react"
import toast from "react-hot-toast"
import { ArrowLeft, ShoppingCart, Box, Zap, ExternalLink, Check, Tag, TrendingDown } from "lucide-react"
import { openImageViewer } from "~/features/catalogo/services/ui.service"

export const catalogoProdutoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalogo/produto/$tipo/$sku",
  component: ProdutoPage,
})

function ProdutoPage() {
  const params = useParams({ strict: false })
  const tipo = (params as Record<string, string>).tipo
  const sku = (params as Record<string, string>).sku
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as Record<string, string | null>
  const empresa = search.empresa

  const backTo = () => {
    if (tipo === 'implante') return navigate({ to: '/catalogo/implantes/$conexaoId/$familiaId/$linhaId', params: { conexaoId: search.conexao!, familiaId: search.familia!, linhaId: search.linha! }, search: { empresa } })
    if (tipo === 'abutment') return navigate({ to: '/catalogo/componentes/$tipoReabId/$familiaId/$tipoAbutmentId', params: { tipoReabId: search.tipoReab!, familiaId: search.familia!, tipoAbutmentId: search.tipoAbutment! }, search: { empresa } })
    if (tipo === 'kit') return navigate({ to: '/catalogo/kits', search: { empresa } })
    if (tipo === 'promocional') return navigate({ to: '/catalogo/promocionais', search: { empresa } })
    navigate({ to: '/catalogo', search: { empresa } })
  }

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <button
          onClick={backTo}
          className="group shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface)] hover:border-[var(--color-accent)] transition-all mb-6 sm:mb-8"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
        </button>

        {tipo === "implante" && <ImplanteDetail sku={sku} />}
        {tipo === "abutment" && <AbutmentDetail sku={sku} />}
        {tipo === "kit" && <KitDetail sku={sku} />}
        {tipo === "promocional" && <PromocionalDetail id={sku} />}
      </div>
    </StoreLayout>
  )
}

/* ─── Shared Components ────────────────────────────────────────────── */

function ProductImage({ cor, nome, onClick }: { cor: string; nome: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="cursor-zoom-in aspect-square rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[#0f172a] border border-[var(--color-border-subtle)] overflow-hidden relative flex flex-col items-center justify-center group transition-all duration-300 hover:shadow-[0_0_60px_rgba(201,166,85,0.08)]"
    >
      <div className="absolute inset-0 opacity-10 group-hover:opacity-25 mix-blend-screen transition-opacity duration-500" style={{ background: `radial-gradient(circle at 30% 30%, ${cor} 0%, transparent 60%)` }} />
      <Box className="w-28 h-28 sm:w-36 sm:h-36 opacity-[0.07] relative z-10 transition-transform group-hover:scale-110 duration-700" style={{ color: cor }} />
      <div className="absolute bottom-6 px-4 py-2 rounded-full border border-[var(--color-border-subtle)] bg-[#0f172a]/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <p className="font-mono text-[10px] tracking-widest text-white flex items-center gap-2">
          <ExternalLink className="w-3 h-3" /> Toque para ampliar
        </p>
      </div>
    </div>
  )
}

function ProductHeader({ cor, badge, nome, sku }: { cor: string; badge?: string; nome: string; sku: string }) {
  return (
    <div className="space-y-4 rounded-2xl bg-gradient-to-br from-[var(--color-surface)]/40 to-transparent border border-[var(--color-border-subtle)]/60 p-5 sm:p-6 backdrop-blur-sm">
      {badge && (
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border shadow-lg" style={{ borderColor: cor, backgroundColor: `${cor}1a`, color: cor, boxShadow: `0 0 24px ${cor}22` }}>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{badge}</span>
        </div>
      )}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[0.95] text-white tracking-tighter text-balance">{nome}</h1>
      <p className="font-mono text-sm text-[var(--color-text-muted)]">SKU: <span className="text-white/80">{sku}</span></p>
    </div>
  )
}

function AddButton({ tipo, sku, nome, cor, precoDB, compact }: { tipo: ProductSheetTipo; sku: string; nome: string; cor: string; precoDB?: number | null; compact?: boolean }) {
  const [added, setAdded] = useState(false)
  const preco = getPrecoFromDB(precoDB, tipo, sku)

  const handleAdd = () => {
    addToCart({ sku, nome, tipo, cor, preco })
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
    <button
      onClick={handleAdd}
      className={`w-full group relative overflow-hidden rounded-xl font-bold text-sm transition-all duration-300 ${
        added
          ? "bg-[var(--color-success)] text-white shadow-[0_0_20px_rgba(34,197,94,0.2)]"
          : "border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-fg)] hover:shadow-[0_0_30px_rgba(201,166,85,0.15)]"
      } ${compact ? "px-6 py-3" : "px-8 py-4"}`}
    >
      <span className="flex items-center justify-center gap-3">
        {added ? (
          <>
            <Check className="h-4 w-4" />
            ADICIONADO
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4 transition-transform group-hover:scale-110" />
            ADICIONAR — {formatBRL(preco)}
          </>
        )}
      </span>
    </button>
  )
}

function SpecCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-[var(--color-surface)]/60 border border-[var(--color-border-subtle)] shadow-sm transition-all duration-300 hover:shadow-md">
      <span className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5 text-[var(--color-text-muted)]">{label}</span>
      <span className="block text-lg font-bold text-white">{value}</span>
    </div>
  )
}

function SectionTabs({ tabs, active, onChange }: { tabs: { key: string; label: string; count?: number }[]; active: string; onChange: (key: string) => void }) {
  return (
    <div className="flex gap-1 border-b border-[var(--color-border-subtle)]">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`relative px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
            active === t.key
              ? "text-[var(--color-accent)]"
              : "text-[var(--color-text-muted)] hover:text-white/70"
          }`}
        >
          <span className="flex items-center gap-2">
            {t.label}
            {t.count != null && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active === t.key ? "bg-[var(--color-accent)]/15 text-[var(--color-accent)]" : "bg-[var(--color-surface)] text-[var(--color-text-muted)]"}`}>
                {t.count}
              </span>
            )}
          </span>
          {active === t.key && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent)] rounded-full" />
          )}
        </button>
      ))}
    </div>
  )
}

/* ─── Implante Detail ──────────────────────────────────────────────── */

function ImplanteDetail({ sku }: { sku: string }) {
  const { data: impl } = useImplanteDetalhe(sku)
  const { data: protocolos } = useProtocoloFresagem(sku)
  const [activeTab, setActiveTab] = useState("ficha")

  if (!impl) return <LoadingState />

  const cor = impl.linha?.familia?.cor_identificacao ?? "#c9a655"
  const nome = `${impl.linha?.familia?.nome ?? ""} ${impl.diametro_mm}×${impl.comprimento_mm}`
  const qtdProtocolo = protocolos?.length ?? 0

  const tabs = [
    { key: "ficha", label: "Ficha Técnica" },
    { key: "fresagem", label: "Protocolo de Fresagem", count: qtdProtocolo },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Sidebar — Imagem + CTA */}
      <div className="lg:col-span-4 xl:col-span-5">
        <div className="lg:sticky lg:top-28 space-y-6">
          <ProductImage cor={cor} nome={nome} onClick={() => openImageViewer("", nome)} />
          <div className="hidden lg:block">
            <AddButton tipo="implante" sku={impl.sku} nome={nome} cor={cor} precoDB={(impl as unknown as Record<string, unknown>).preco as number | null} />
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="lg:col-span-8 xl:col-span-7 space-y-8">
        <ProductHeader cor={cor} badge={impl.linha?.familia?.nome} nome={nome} sku={impl.sku} />

        <div className="lg:hidden">
          <AddButton tipo="implante" sku={impl.sku} nome={nome} cor={cor} precoDB={(impl as unknown as Record<string, unknown>).preco as number | null} />
        </div>

        {/* Tabs */}
        {tabs.length > 0 && (
          <SectionTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        )}

        {/* Ficha Técnica */}
        {activeTab === "ficha" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <SpecCard label="Diâmetro" value={`${impl.diametro_mm} mm`} />
              <SpecCard label="Comprimento" value={`${impl.comprimento_mm} mm`} />
              <SpecCard label="Rosca Interna" value={impl.rosca_interna || "—"} />
              <SpecCard label="Torque Max" value={impl.torque_insercao ? `${impl.torque_insercao} N·cm` : "—"} />
              <SpecCard label="Região Apical" value={impl.regiao_apical || "—"} />
              <SpecCard label="Região Cervical" value={impl.regiao_cervical || "—"} />
            </div>
          </div>
        )}

        {/* Protocolo de Fresagem */}
        {activeTab === "fresagem" && (
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 p-4 sm:p-6 shadow-lg shadow-black/20 backdrop-blur-sm">
            {qtdProtocolo > 0 ? (
              <FresagemTimeline implanteSku={impl.sku} protocolos={protocolos!} />
            ) : (
              <div className="text-center py-12">
                <p className="text-sm font-bold text-[var(--color-text-muted)]">Nenhum protocolo de fresagem cadastrado</p>
                <p className="text-xs text-[var(--color-text-muted)]/60 mt-1">Adicione uma sequência de fresagem na edição do implante.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Abutment Detail ──────────────────────────────────────────────── */

function AbutmentDetail({ sku }: { sku: string }) {
  const { data: ab } = useAbutmentDetalhe(sku)
  const { data: guias } = useGuias({ familia_id: ab?.familia_id })
  const [activeTab, setActiveTab] = useState("ficha")

  if (!ab) return <LoadingState />

  const cor = ab.familia?.cor_identificacao ?? "#c9a655"
  const nome = `${ab.tipo_abutment?.nome ?? ""} ${ab.familia?.nome ?? ""}`

  const tabs = [
    { key: "ficha", label: "Especificações" },
    { key: "sequencia", label: "Sequência Protética" },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-4 xl:col-span-5">
        <div className="lg:sticky lg:top-28 space-y-6">
          <ProductImage cor={cor} nome={nome} onClick={() => openImageViewer("", nome)} />
          <div className="hidden lg:block">
            <AddButton tipo="abutment" sku={ab.sku} nome={nome} cor={cor} precoDB={(ab as unknown as Record<string, unknown>).preco as number | null} />
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 xl:col-span-7 space-y-8">
        <ProductHeader cor={cor} badge={ab.familia?.nome} nome={nome} sku={ab.sku} />

        <div className="lg:hidden">
          <AddButton tipo="abutment" sku={ab.sku} nome={nome} cor={cor} precoDB={(ab as unknown as Record<string, unknown>).preco as number | null} />
        </div>

        <SectionTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

        {activeTab === "ficha" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <SpecCard label="Plataforma" value={ab.diametro_plataforma ? `${ab.diametro_plataforma} mm` : "—"} />
            <SpecCard label="Angulação" value={ab.angulacao_graus != null ? `${ab.angulacao_graus}°` : "—"} />
            <SpecCard label="Transmucoso" value={ab.altura_transmucoso != null ? `${ab.altura_transmucoso} mm` : "—"} />
            <SpecCard label="Corpo" value={ab.altura_corpo != null ? `${ab.altura_corpo} mm` : "—"} />
            <SpecCard label="Torque" value={ab.torque_ncm != null ? `${ab.torque_ncm} Ncm` : "—"} />
          </div>
        )}

        {activeTab === "sequencia" && (
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 p-4 sm:p-6 shadow-lg shadow-black/20 backdrop-blur-sm">
            <SequenciaProtetica
              familiaId={ab.familia_id}
              tipoAbutmentId={ab.tipo_abutment_id}
              familiaNome={ab.familia?.nome ?? ""}
              tipoAbutmentNome={ab.tipo_abutment?.nome ?? ""}
              abutmentSku={ab.sku}
            />
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Kit Detail ───────────────────────────────────────────────────── */

function KitDetail({ sku }: { sku: string }) {
  const { data: kit } = useKitDetalhe(sku)
  const [activeTab, setActiveTab] = useState("ficha")

  if (!kit) return <LoadingState />

  const bomItems = (kit.composicao ?? [])
    .map((item) => resolveBOMItem(item))
    .filter(Boolean) as { tipo: string; sku: string; nome: string; quantidade: number; preco?: number }[]

  const tabs = [
    { key: "ficha", label: "Ficha Técnica" },
    { key: "composicao", label: "Composição", count: bomItems.length },
  ]

  const cor = "#c9a655"
  const nome = kit.nome

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-4 xl:col-span-5">
        <div className="lg:sticky lg:top-28 space-y-6">
          <ProductImage cor={cor} nome={nome} onClick={() => openImageViewer("", nome)} />
          <div className="hidden lg:block">
            <AddButton tipo="kit" sku={kit.sku} nome={nome} cor={cor} precoDB={(kit as unknown as Record<string, unknown>).preco as number | null} />
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 xl:col-span-7 space-y-8">
        <ProductHeader cor={cor} badge="Kit" nome={nome} sku={kit.sku} />

        <div className="lg:hidden">
          <AddButton tipo="kit" sku={kit.sku} nome={nome} cor={cor} precoDB={(kit as unknown as Record<string, unknown>).preco as number | null} />
        </div>

        {tabs.length > 0 && (
          <SectionTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        )}

        {activeTab === "ficha" && (
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 p-4 sm:p-6 shadow-lg shadow-black/20 backdrop-blur-sm space-y-4">
            {kit.descricao ? (
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{kit.descricao}</p>
            ) : (
              <p className="text-sm text-[var(--color-text-muted)]">Sem descrição cadastrada.</p>
            )}
            <div className="pt-2 border-t border-[var(--color-border-subtle)]/60">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">SKU</p>
              <p className="text-lg font-bold text-white font-mono">{kit.sku}</p>
            </div>
          </div>
        )}

        {activeTab === "composicao" && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">Composição do Kit</h3>
            <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 p-4 sm:p-6 shadow-lg shadow-black/20 backdrop-blur-sm">
              {bomItems.length > 0 ? (
                <BomTable items={bomItems} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm font-bold text-[var(--color-text-muted)]">Este kit não possui composição cadastrada</p>
                  <p className="text-xs text-[var(--color-text-muted)]/60 mt-1">Adicione itens à composição na edição do kit.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Promocional Detail ───────────────────────────────────────────── */

const TIPO_NOME_MAP: Record<string, string> = {
  implante: "Implante",
  abutment: "Abutment",
  fresa: "Fresa",
  chave: "Chave",
  acessorio: "Acessório",
  instrumental: "Instrumental",
  kit: "Kit",
}

function PromocionalDetail({ id }: { id: string }) {
  const { data: promo } = usePromocionalDetalhe(id)
  const [added, setAdded] = useState(false)

  if (!promo) return <LoadingState />

  const itens = promo.itens ?? []
  const itensResolvidos = itens.map((item) => {
    const preco = mockPreco(item.tipo as ProductSheetTipo, item.sku)
    const nome = TIPO_NOME_MAP[item.tipo] ?? item.tipo
    return { ...item, precoResolvido: preco, nomeResolvido: `${nome} — ${item.sku}` }
  })
  const totalItens = itensResolvidos.reduce((acc, i) => acc + i.precoResolvido, 0)
  const economia = totalItens - promo.preco
  const percentualEconomia = totalItens > 0 ? Math.round((economia / totalItens) * 100) : 0

  const handleAdd = () => {
    addToCart({ sku: promo.id, nome: promo.nome, tipo: "promocional", cor: "#c9a655", preco: promo.preco })
    playCoinSound()
    setAdded(true)
    toast.success(`${promo.nome} adicionado ao carrinho`, {
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

  const tipoColor = (tipo: string) => {
    switch (tipo) {
      case "implante": return "#c9a655"
      case "abutment": return "#8b5cf6"
      case "fresa": return "#3b82f6"
      case "chave": return "#eab308"
      case "acessorio": return "#22c55e"
      case "instrumental": return "#f43f5e"
      default: return "#94a3b8"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-4 xl:col-span-5">
        <div className="lg:sticky lg:top-28 space-y-6">
          <ProductImage cor="#c9a655" nome={promo.nome} onClick={() => openImageViewer("", promo.nome)} />
          {/* CTA desktop — sticky abaixo da imagem */}
          <div className="hidden lg:block">
            <button
              onClick={handleAdd}
              className={`w-full group relative overflow-hidden flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-black text-sm transition-all duration-300 ${
                added
                  ? "bg-[var(--color-success)] text-white shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                  : "border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-fg)] hover:shadow-[0_0_30px_rgba(201,166,85,0.15)]"
              }`}
            >
              {added ? (
                <><Check className="h-5 w-5" /> ADICIONADO</>
              ) : (
                <><ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" /> ADICIONAR — {formatBRL(promo.preco)}</>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 xl:col-span-7 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
            <Zap className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Oferta Especial</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[0.95] text-white tracking-tighter">{promo.nome}</h1>
          {promo.descricao && <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-lg">{promo.descricao}</p>}
        </div>

        {/* CTA mobile */}
        <div className="lg:hidden">
          <button
            onClick={handleAdd}
            className={`w-full group relative overflow-hidden flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-black text-sm transition-all duration-300 ${
              added
                ? "bg-[var(--color-success)] text-white shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                : "border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-fg)] hover:shadow-[0_0_30px_rgba(201,166,85,0.15)]"
            }`}
          >
            {added ? (
              <><Check className="h-5 w-5" /> ADICIONADO</>
            ) : (
              <><ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" /> ADICIONAR — {formatBRL(promo.preco)}</>
            )}
          </button>
        </div>

        {/* Lista de Produtos do Pacote */}
        {itensResolvidos.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)] flex items-center gap-2">
              <Tag className="w-3.5 h-3.5" />
              Produtos incluídos no pacote
            </h3>
            <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 divide-y divide-[var(--color-border-subtle)] overflow-hidden">
              {itensResolvidos.map((item, idx) => {
                const cor = tipoColor(item.tipo)
                return (
                  <div key={item.id ?? idx} className="flex items-center gap-4 p-4 transition-colors hover:bg-[var(--color-surface)]/50">
                    <div
                      className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border"
                      style={{ borderColor: `${cor}40`, backgroundColor: `${cor}10` }}
                    >
                      <Box className="w-5 h-5" style={{ color: cor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm leading-tight truncate">{item.nomeResolvido}</p>
                      <p className="text-[10px] font-mono text-[var(--color-text-muted)] mt-0.5">{TIPO_NOME_MAP[item.tipo] ?? item.tipo}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-white/30 line-through font-mono">{formatBRL(item.precoResolvido)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Resumo: Preço Total Avulso vs Pacote */}
        <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 p-5 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-text-muted)]">Preço total avulso</span>
            <span className="font-mono text-white/30 line-through">{formatBRL(totalItens)}</span>
          </div>
          {economia > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-success)] flex items-center gap-1.5 font-bold">
                <TrendingDown className="w-3.5 h-3.5" />
                Economia de {percentualEconomia}%
              </span>
              <span className="font-mono text-[var(--color-success)] font-bold">−{formatBRL(economia)}</span>
            </div>
          )}
        </div>

        {/* Preço do Pacote + Comprar */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--color-accent)]/8 to-transparent border border-[var(--color-accent)]/20 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Preço do Pacote</p>
              <p className="text-4xl font-black text-gradient-gold">{formatBRL(promo.preco)}</p>
              {economia > 0 && (
                <p className="text-xs text-[var(--color-success)] font-bold mt-1">Você economiza {formatBRL(economia)}</p>
              )}
            </div>
            <button
              onClick={handleAdd}
              className={`w-full sm:w-auto group relative overflow-hidden flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-black text-sm transition-all duration-300 ${
                added
                  ? "bg-[var(--color-success)] text-white shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                  : "border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-fg)] hover:shadow-[0_0_30px_rgba(201,166,85,0.15)]"
              }`}
            >
              {added ? (
                <>
                  <Check className="h-5 w-5" />
                  ADICIONADO
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                  ADICIONAR AO CARRINHO
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Loading State ────────────────────────────────────────────────── */

function LoadingState() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-4 xl:col-span-5">
        <div className="aspect-square rounded-2xl bg-[var(--color-surface)]/50 border border-[var(--color-border-subtle)] animate-pulse" />
      </div>
      <div className="lg:col-span-8 xl:col-span-7 space-y-6">
        <div className="h-4 w-24 rounded-full bg-[var(--color-surface)]/50 animate-pulse" />
        <div className="h-10 w-64 rounded-lg bg-[var(--color-surface)]/50 animate-pulse" />
        <div className="h-4 w-48 rounded bg-[var(--color-surface)]/50 animate-pulse" />
        <div className="grid grid-cols-3 gap-3 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-[var(--color-surface)]/50 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
