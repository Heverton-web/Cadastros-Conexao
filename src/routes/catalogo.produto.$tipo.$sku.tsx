import { createRoute, useParams, useNavigate, useSearch } from "@tanstack/react-router"
import { rootRoute } from "./__root"
import { StoreLayout, useCatalogoVisibility } from "~/features/catalogo/components/StoreLayout"
import { useImplanteDetalhe, useAbutmentDetalhe, useKitDetalhe, usePromocionalDetalhe, useProtocoloFresagem, useGuias, useImagensProduto, useChavesDoImplante, useCicatrizadoresDoImplante, useAbutmentsDaFamilia, useKitsComChavesEmComum } from "~/features/catalogo/hooks/useCatalogo"
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
import { useTabIcons, TabIconsProvider } from "~/features/catalogo/contexts/TabIconsContext"

export const catalogoProdutoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalogo/produto/$tipo/$sku",
  component: () => (
    <TabIconsProvider>
      <ProdutoPage />
    </TabIconsProvider>
  ),
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
    if (tipo === 'abutment') return navigate({ to: '/catalogo/componentes/$familiaId/$tipoReabId/$tipoAbutmentId', params: { familiaId: search.familia!, tipoReabId: search.tipoReab!, tipoAbutmentId: search.tipoAbutment! }, search: { empresa } })
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

function ProductImage({ cor, nome, onClick, imageUrl }: { cor: string; nome: string; onClick: () => void; imageUrl?: string | null }) {
  return (
    <div
      onClick={onClick}
      className="cursor-zoom-in aspect-square rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[#0f172a] border border-[var(--color-border-subtle)] overflow-hidden relative flex flex-col items-center justify-center group transition-all duration-300 hover:shadow-[0_0_60px_rgba(201,166,85,0.08)]"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={nome}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <>
          <div className="absolute inset-0 opacity-10 group-hover:opacity-25 mix-blend-screen transition-opacity duration-500" style={{ background: `radial-gradient(circle at 30% 30%, ${cor} 0%, transparent 60%)` }} />
          <Box className="w-28 h-28 sm:w-36 sm:h-36 opacity-[0.07] relative z-10 transition-transform group-hover:scale-110 duration-700" style={{ color: cor }} />
        </>
      )}
      <div className="absolute bottom-6 px-4 py-2 rounded-full border border-[var(--color-border-subtle)] bg-[#0f172a]/60 backdrop-blur-md">
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
  const { showPrices } = useCatalogoVisibility()
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
            {showPrices ? `ADICIONAR — ${formatBRL(preco)}` : "ADICIONAR"}
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
type SectionTab = { key: string; label: string; count?: number }

function SectionTabs({ tabs, active, onChange, renderIcon }: { tabs: SectionTab[]; active: string; onChange: (key: string) => void; renderIcon: (key: string) => React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {tabs.map((t) => {
        const isActive = active === t.key
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`group flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${
              isActive
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 shadow-[0_0_20px_rgba(201,166,85,0.1)]"
                : "border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 hover:border-white/20 hover:bg-[var(--color-surface)]/60"
            }`}
          >
            <span className={`transition-colors ${isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)] group-hover:text-white/70"}`}>
              {renderIcon(t.key)}
            </span>
            <span className={`text-[9px] font-bold uppercase tracking-wider leading-tight text-center transition-colors ${isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)] group-hover:text-white/70"}`}>
              {t.label}
            </span>
            {t.count != null && (
              <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]" : "bg-[var(--color-surface)] text-[var(--color-text-muted)]"}`}>
                {t.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
function EmptyState({ msg, hint }: { msg: string; hint?: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-sm font-bold text-[var(--color-text-muted)]">{msg}</p>
      {hint && <p className="text-xs text-[var(--color-text-muted)]/60 mt-1">{hint}</p>}
    </div>
  )
}


/* ─── Implante Detail ──────────────────────────────────────────────── */

/** Small product card for related items in tabs (cicatrizadores, abutments, kits, chaves) */
function RelatedProductCard({
  nome, sku, cor, preco, tipo, imageUrl, onImageClick, children,
}: {
  nome: string; sku: string; cor: string; preco?: number | null
  tipo: ProductSheetTipo; imageUrl?: string | null
  onImageClick: () => void; children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/40 hover:border-[var(--color-accent)]/40 transition-all">
      {/* Thumbnail */}
      <div
        onClick={onImageClick}
        className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden cursor-zoom-in bg-gradient-to-br from-[var(--color-surface)] to-[#0f172a] border border-[var(--color-border-subtle)] flex items-center justify-center"
      >
        {imageUrl ? (
          <img src={imageUrl} alt={nome} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <Box className="w-8 h-8 opacity-10" style={{ color: cor }} />
        )}
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <h4 className="text-sm font-bold text-white truncate">{nome}</h4>
        <p className="font-mono text-[10px] text-[var(--color-text-muted)]">SKU: {sku}</p>
        {children}
      </div>
      {/* CTA */}
      <div className="shrink-0 flex items-center">
        <AddButton tipo={tipo} sku={sku} nome={nome} cor={cor} precoDB={preco} compact />
      </div>
    </div>
  )
}

function ImplanteDetail({ sku }: { sku: string }) {
  const { getIcon } = useTabIcons()
  const { data: impl } = useImplanteDetalhe(sku)
  const { data: protocolos } = useProtocoloFresagem(sku)
  const { data: imagens } = useImagensProduto("implante", sku)
  const { data: chaves } = useChavesDoImplante(sku)
  const { data: cicatrizadores } = useCicatrizadoresDoImplante(sku)
  const { data: abutments } = useAbutmentsDaFamilia(impl?.familia_id)
  const { data: kits } = useKitsComChavesEmComum(sku)
  const [activeTab, setActiveTab] = useState("ficha")

  if (!impl) return <LoadingState />

  // ── Inativo: não renderiza ──
  if (!impl.ativo) return null

  const cor = impl.linha?.familia?.cor_identificacao ?? "#c9a655"
  const nome = `${impl.linha?.familia?.nome ?? ""} ${impl.diametro_mm}×${impl.comprimento_mm}`
  const imageUrl = imagens?.[0]?.url_imagem ?? null

  // ── Filtra dados nulos/vazios ──
  const specs: Array<{ label: string; value: string }> = [
    { label: "Diâmetro", value: `${impl.diametro_mm} mm` },
    { label: "Comprimento", value: `${impl.comprimento_mm} mm` },
    impl.diametro_plataforma_mm != null ? { label: "Ø Plataforma", value: `${impl.diametro_plataforma_mm} mm` } : null,
    impl.rosca_interna ? { label: "Rosca Interna", value: impl.rosca_interna } : null,
    impl.torque_insercao != null ? { label: "Torque Max", value: `${impl.torque_insercao} N·cm` } : null,
    impl.regiao_apical ? { label: "Região Apical", value: impl.regiao_apical } : null,
    impl.regiao_cervical ? { label: "Região Cervical", value: impl.regiao_cervical } : null,
    impl.macrogeometria ? { label: "Macrogeometria", value: impl.macrogeometria } : null,
    (impl.detalhes_extras as Record<string, unknown>)?.material
      ? { label: "Material", value: String((impl.detalhes_extras as Record<string, unknown>).material) } : null,
    (impl.detalhes_extras as Record<string, unknown>)?.superficie
      ? { label: "Superfície", value: String((impl.detalhes_extras as Record<string, unknown>).superficie) } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>

  // ── Filtra itens ativos ──
  const chavesAtivas = chaves?.filter((c) => c.ativo) ?? []
  const cicatAtivos = cicatrizadores?.filter((c) => c.ativo) ?? []
  const abutAtivos = abutments?.filter((a) => a.ativo) ?? []
  const kitsAtivos = kits?.filter((k) => k.ativo) ?? []

  // ── Tabs (só inclui se tiver dados) ──
  const tabs: SectionTab[] = [
    { key: "ficha", label: "Ficha", count: specs.length },
    { key: "fresagem", label: "Protocolos", count: protocolos?.length ?? 0 },
    { key: "chaves", label: "Chaves", count: chavesAtivas.length },
    { key: "kits", label: "Kits", count: kitsAtivos.length },
    { key: "cicatrizadores", label: "Cicatriz.", count: cicatAtivos.length },
    { key: "abutments", label: "Abutments", count: abutAtivos.length },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Sidebar — Imagem + CTA */}
      <div className="lg:col-span-4 xl:col-span-5">
        <div className="lg:sticky lg:top-28 space-y-6">
          <ProductImage cor={cor} nome={nome} onClick={() => openImageViewer(imageUrl ?? "", nome)} imageUrl={imageUrl} />
          {/* Miniaturas */}
          {imagens && imagens.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {imagens.map((img) => (
                <button
                  key={img.id}
                  onClick={() => openImageViewer(img.url_imagem, nome)}
                  className="shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)] transition-colors"
                >
                  <img src={img.url_imagem} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
          <div className="hidden lg:block">
            <AddButton tipo="implante" sku={impl.sku} nome={nome} cor={cor} precoDB={impl.preco} />
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="lg:col-span-8 xl:col-span-7 space-y-8">
        <ProductHeader cor={cor} badge={impl.linha?.familia?.nome} nome={nome} sku={impl.sku} />

        <div className="lg:hidden">
          <AddButton tipo="implante" sku={impl.sku} nome={nome} cor={cor} precoDB={impl.preco} />
        </div>

        {/* Tabs */}
        <SectionTabs tabs={tabs} active={activeTab} onChange={setActiveTab} renderIcon={(key) => { const I = getIcon(key); return <I className="w-5 h-5" /> }} />

        {/* ─── Ficha Técnica ─── */}
        {activeTab === "ficha" && (
          <div className="space-y-6">
            {/* Breadcrumb hierárquico */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
              {impl.categoria_id && <span>{impl.linha?.familia?.conexao?.categoria?.nome ?? impl.categoria_id}</span>}
              {impl.conexao_id && (
                <>
                  {impl.categoria_id && <span className="opacity-40">/</span>}
                  <span>{impl.linha?.familia?.conexao?.nome ?? impl.conexao_id}</span>
                </>
              )}
              {impl.familia_id && (
                <>
                  {(impl.categoria_id || impl.conexao_id) && <span className="opacity-40">/</span>}
                  <span>{impl.linha?.familia?.nome ?? impl.familia_id}</span>
                </>
              )}
              {impl.linha_id && (
                <>
                  <span className="opacity-40">/</span>
                  <span>{impl.linha?.nome ?? impl.linha_id}</span>
                </>
              )}
            </div>

            {/* Sigla + Descrição */}
            {impl.sigla && (
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/40">
                <Tag className="w-3 h-3 mr-1.5 text-[var(--color-text-muted)]" />
                <span className="text-xs font-bold text-white/80">{impl.sigla}</span>
              </div>
            )}

            {impl.descricao && (
              <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 p-4 sm:p-6">
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{impl.descricao}</p>
              </div>
            )}

            {/* Specs — só renderiza não nulos */}
            {specs.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map((s) => (
                  <SpecCard key={s.label} label={s.label} value={s.value} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Protocolos de Fresagem ─── */}
        {activeTab === "fresagem" && (
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 p-4 sm:p-6 shadow-lg shadow-black/20 backdrop-blur-sm">
            {protocolos && protocolos.length > 0 ? (
              <FresagemTimeline implanteSku={impl.sku} protocolos={protocolos} />
            ) : (
              <EmptyState msg="Nenhum protocolo de fresagem cadastrado" hint="Adicione uma sequência de fresagem na edição do implante." />
            )}
          </div>
        )}

        {/* ─── Chaves ─── */}
        {activeTab === "chaves" && (
          <div className="space-y-3">
            {chavesAtivas.map((chave) => (
              <RelatedProductCard
                key={chave.sku}
                nome={chave.nome}
                sku={chave.sku}
                cor={cor}
                preco={chave.preco}
                tipo="chave"
                imageUrl={chave.imagens?.[0]?.url_imagem}
                onImageClick={() => openImageViewer(chave.imagens?.[0]?.url_imagem ?? "", chave.nome)}
              >
                {chave.tipo_chave?.nome && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    {chave.tipo_chave.nome}
                  </span>
                )}
              </RelatedProductCard>
            ))}
          </div>
        )}

        {/* ─── Kits ─── */}
        {activeTab === "kits" && (
          <div className="space-y-3">
            {kitsAtivos.map((kit) => (
              <RelatedProductCard
                key={kit.sku}
                nome={kit.nome}
                sku={kit.sku}
                cor={cor}
                preco={kit.preco}
                tipo="kit"
                imageUrl={kit.imagens?.[0]?.url_imagem}
                onImageClick={() => openImageViewer(kit.imagens?.[0]?.url_imagem ?? "", kit.nome)}
              >
                {kit.tipo_kit?.nome && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    {kit.tipo_kit.nome}
                  </span>
                )}
              </RelatedProductCard>
            ))}
          </div>
        )}

        {/* ─── Cicatrizadores ─── */}
        {activeTab === "cicatrizadores" && (
          <div className="space-y-3">
            {cicatAtivos.map((cic) => (
              <RelatedProductCard
                key={cic.sku}
                nome={cic.nome}
                sku={cic.sku}
                cor={cor}
                preco={cic.preco}
                tipo="cicatrizador"
                imageUrl={cic.imagens?.[0]?.url_imagem}
                onImageClick={() => openImageViewer(cic.imagens?.[0]?.url_imagem ?? "", cic.nome)}
              >
                {cic.sigla && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    {cic.sigla}
                  </span>
                )}
              </RelatedProductCard>
            ))}
          </div>
        )}

        {/* ─── Abutments ─── */}
        {activeTab === "abutments" && (
          <div className="space-y-3">
            {abutAtivos.map((ab) => (
              <RelatedProductCard
                key={ab.sku}
                nome={`${ab.tipo_abutment?.nome ?? ""} ${ab.familia?.nome ?? ""}`.trim()}
                sku={ab.sku}
                cor={cor}
                preco={ab.preco}
                tipo="abutment"
                imageUrl={ab.imagens?.[0]?.url_imagem}
                onImageClick={() => openImageViewer(ab.imagens?.[0]?.url_imagem ?? "", ab.nome ?? ab.sku)}
              >
                {ab.tipo_abutment?.nome && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    {ab.tipo_abutment.nome}
                  </span>
                )}
              </RelatedProductCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
/* ─── Abutment Detail ──────────────────────────────────────────────── */

function AbutmentDetail({ sku }: { sku: string }) {
  const { getIcon } = useTabIcons()
  const { data: ab } = useAbutmentDetalhe(sku)
  const { data: guias } = useGuias({ familia_id: ab?.familia_id })
  const { data: imagens } = useImagensProduto("abutment", sku)
  const { data: kits } = useKitsComChavesEmComum(sku)
  const [activeTab, setActiveTab] = useState("ficha")

  if (!ab) return <LoadingState />

  // ── Inativo: não renderiza ──
  if (!ab.ativo) return null

  const cor = ab.familia?.cor_identificacao ?? "#c9a655"
  const nome = `${ab.tipo_abutment?.nome ?? ""} ${ab.familia?.nome ?? ""}`
  const imageUrl = imagens?.[0]?.url_imagem ?? null

  // ── Filtra dados nulos/vazios ──
  const specs: Array<{ label: string; value: string }> = [
    { label: "Plataforma", value: ab.diametro_plataforma ? `${ab.diametro_plataforma} mm` : "—" },
    { label: "Angulação", value: ab.angulacao_graus != null ? `${ab.angulacao_graus}°` : "—" },
    { label: "Transmucoso", value: ab.altura_transmucoso != null ? `${ab.altura_transmucoso} mm` : "—" },
    { label: "Corpo", value: ab.altura_corpo != null ? `${ab.altura_corpo} mm` : "—" },
    { label: "Torque", value: ab.torque_ncm != null ? `${ab.torque_ncm} N·cm` : "—" },
    ab.material ? { label: "Material", value: ab.material } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>

  // ── Filtra kits ativos ──
  const kitsAtivos = kits?.filter((k) => k.ativo) ?? []

  // ── Tabs ──
  const tabs: SectionTab[] = [
    { key: "ficha", label: "Ficha", count: specs.length },
    { key: "sequencia", label: "Sequência", count: 1 },
    { key: "kits", label: "Kits", count: kitsAtivos.length },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Sidebar — Imagem + CTA */}
      <div className="lg:col-span-4 xl:col-span-5">
        <div className="lg:sticky lg:top-28 space-y-6">
          <ProductImage cor={cor} nome={nome} onClick={() => openImageViewer(imageUrl ?? "", nome)} imageUrl={imageUrl} />
          {/* Miniaturas */}
          {imagens && imagens.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {imagens.map((img) => (
                <button
                  key={img.id}
                  onClick={() => openImageViewer(img.url_imagem, nome)}
                  className="shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)] transition-colors"
                >
                  <img src={img.url_imagem} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
          <div className="hidden lg:block">
            <AddButton tipo="abutment" sku={ab.sku} nome={nome} cor={cor} precoDB={ab.preco} />
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="lg:col-span-8 xl:col-span-7 space-y-8">
        <ProductHeader cor={cor} badge={ab.familia?.nome} nome={nome} sku={ab.sku} />

        <div className="lg:hidden">
          <AddButton tipo="abutment" sku={ab.sku} nome={nome} cor={cor} precoDB={ab.preco} />
        </div>

        {/* Tabs */}
        <SectionTabs tabs={tabs} active={activeTab} onChange={setActiveTab} renderIcon={(key) => { const I = getIcon(key); return <I className="w-5 h-5" /> }} />

        {/* ─── Ficha Técnica ─── */}
        {activeTab === "ficha" && (
          <div className="space-y-6">
            {/* Sigla + Descrição */}
            {ab.sigla && (
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/40">
                <Tag className="w-3 h-3 mr-1.5 text-[var(--color-text-muted)]" />
                <span className="text-xs font-bold text-white/80">{ab.sigla}</span>
              </div>
            )}

            {ab.descricao && (
              <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 p-4 sm:p-6">
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{ab.descricao}</p>
              </div>
            )}

            {/* Specs — só renderiza não nulos */}
            {specs.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map((s) => (
                  <SpecCard key={s.label} label={s.label} value={s.value} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Sequência Protética ─── */}
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

        {/* ─── Kits ─── */}
        {activeTab === "kits" && (
          <div className="space-y-3">
            {kitsAtivos.length > 0 ? (
              kitsAtivos.map((kit) => (
                <RelatedProductCard
                  key={kit.sku}
                  nome={kit.nome}
                  sku={kit.sku}
                  cor={cor}
                  preco={kit.preco}
                  tipo="kit"
                  imageUrl={kit.imagens?.[0]?.url_imagem}
                  onImageClick={() => openImageViewer(kit.imagens?.[0]?.url_imagem ?? "", kit.nome)}
                >
                  {kit.tipo_kit?.nome && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                      {kit.tipo_kit.nome}
                    </span>
                  )}
                </RelatedProductCard>
              ))
            ) : (
              <EmptyState msg="Nenhum kit disponível" hint="Nenhum kit com chaves em comum foi encontrado." />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Kit Detail ───────────────────────────────────────────────────── */

function KitDetail({ sku }: { sku: string }) {
  const { getIcon } = useTabIcons()
  const { data: kit } = useKitDetalhe(sku)
  const { data: imagens } = useImagensProduto("kit", sku)
  const [activeTab, setActiveTab] = useState("ficha")

  if (!kit) return <LoadingState />

  // ── Inativo: não renderiza ──
  if (!kit.ativo) return null

  const cor = "#c9a655"
  const nome = kit.nome
  const imageUrl = imagens?.[0]?.url_imagem ?? null

  // ── Specs da ficha técnica ──
  const specs: Array<{ label: string; value: string }> = [
    { label: "Nome do Kit", value: kit.nome },
    kit.tipo_kit?.nome ? { label: "Tipo", value: kit.tipo_kit.nome } : null,
    kit.descricao ? { label: "Descrição", value: kit.descricao } : null,
    { label: "SKU", value: kit.sku },
  ].filter(Boolean) as Array<{ label: string; value: string }>

  // ── Filtra itens inativos do BOM ──
  const rawBom = ((kit as unknown as Record<string, unknown[]>).composicao ?? []) as Record<string, unknown>[]
  const bomItems = rawBom
    .filter((item) => {
      const related = item.fresa ?? item.chave ?? item.acessorio ?? item.instrumental ?? item.implante
      if (related && typeof related === "object" && "ativo" in (related as Record<string, unknown>)) {
        return (related as Record<string, unknown>).ativo !== false
      }
      return true
    })
    .map((item) => resolveBOMItem(item as Parameters<typeof resolveBOMItem>[0]))
    .filter(Boolean) as { tipo: string; sku: string; nome: string; quantidade: number; preco?: number }[]

  const tabs: SectionTab[] = [
    { key: "ficha", label: "Ficha", count: specs.length },
    { key: "composicao", label: "Composição", count: bomItems.length },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Sidebar — Imagem + CTA */}
      <div className="lg:col-span-4 xl:col-span-5">
        <div className="lg:sticky lg:top-28 space-y-6">
          <ProductImage cor={cor} nome={nome} onClick={() => openImageViewer(imageUrl ?? "", nome)} imageUrl={imageUrl} />
          {/* Miniaturas */}
          {imagens && imagens.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {imagens.map((img) => (
                <button
                  key={img.id}
                  onClick={() => openImageViewer(img.url_imagem, nome)}
                  className="shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)] transition-colors"
                >
                  <img src={img.url_imagem} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
          <div className="hidden lg:block">
            <AddButton tipo="kit" sku={kit.sku} nome={nome} cor={cor} precoDB={kit.preco} />
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="lg:col-span-8 xl:col-span-7 space-y-8">
        <ProductHeader cor={cor} badge={kit.tipo_kit?.nome} nome={nome} sku={kit.sku} />

        <div className="lg:hidden">
          <AddButton tipo="kit" sku={kit.sku} nome={nome} cor={cor} precoDB={kit.preco} />
        </div>

        {/* Tabs */}
        <SectionTabs tabs={tabs} active={activeTab} onChange={setActiveTab} renderIcon={(key) => { const I = getIcon(key); return <I className="w-5 h-5" /> }} />

        {/* ─── Ficha Técnica ─── */}
        {activeTab === "ficha" && (
          <div className="space-y-6">
            {/* Specs — só renderiza não nulos */}
            {specs.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map((s) => (
                  <SpecCard key={s.label} label={s.label} value={s.value} />
                ))}
              </div>
            ) : (
              <EmptyState msg="Nenhuma especificação cadastrada" hint="Preencha os dados técnicos na edição do kit." />
            )}
          </div>
        )}

        {/* ─── Composição ─── */}
        {activeTab === "composicao" && (
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 p-4 sm:p-6 shadow-lg shadow-black/20 backdrop-blur-sm">
            {bomItems.length > 0 ? (
              <BomTable items={bomItems} />
            ) : (
              <EmptyState msg="Nenhum item na composição" hint="Adicione itens à composição na edição do kit." />
            )}
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
  const { getIcon } = useTabIcons()
  const { data: promo } = usePromocionalDetalhe(id)
  const [activeTab, setActiveTab] = useState("ficha")

  if (!promo) return <LoadingState />

  if (!promo.ativo) return null

  const itens = promo.itens ?? []
  const itensResolvidos = itens.map((item) => {
    const preco = mockPreco(item.tipo as ProductSheetTipo, item.sku)
    const nome = TIPO_NOME_MAP[item.tipo] ?? item.tipo
    return { ...item, precoResolvido: preco, nomeResolvido: `${nome} — ${item.sku}` }
  })
  const totalItens = itensResolvidos.reduce((acc, i) => acc + i.precoResolvido, 0)
  const economia = totalItens - promo.preco
  const percentualEconomia = totalItens > 0 ? Math.round((economia / totalItens) * 100) : 0

  const cor = "#c9a655"

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

  const tabs: SectionTab[] = [
    { key: "ficha", label: "Ficha", count: 3 },
    { key: "itens", label: "Itens", count: itensResolvidos.length },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Sidebar — Imagem + CTA */}
      <div className="lg:col-span-4 xl:col-span-5">
        <div className="lg:sticky lg:top-28 space-y-6">
          <ProductImage cor={cor} nome={promo.nome} onClick={() => openImageViewer("", promo.nome)} />
          <div className="hidden lg:block">
            <AddButton tipo={"promocional" as ProductSheetTipo} sku={promo.id} nome={promo.nome} cor={cor} precoDB={promo.preco} />
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="lg:col-span-8 xl:col-span-7 space-y-8">
        <ProductHeader cor={cor} badge="Oferta Especial" nome={promo.nome} sku={promo.id} />

        <div className="lg:hidden">
          <AddButton tipo={"promocional" as ProductSheetTipo} sku={promo.id} nome={promo.nome} cor={cor} precoDB={promo.preco} />
        </div>

        {/* Tabs */}
        <SectionTabs tabs={tabs} active={activeTab} onChange={setActiveTab} renderIcon={(key) => { const I = getIcon(key); return <I className="w-5 h-5" /> }} />

        {/* ─── Ficha Técnica ─── */}
        {activeTab === "ficha" && (
          <div className="space-y-6">
            {promo.descricao && (
              <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 p-4 sm:p-6">
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{promo.descricao}</p>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <SpecCard label="Preço Original" value={formatBRL(totalItens)} />
              <SpecCard label="Preço Promocional" value={formatBRL(promo.preco)} />
              <SpecCard label="Economia" value={economia > 0 ? `${percentualEconomia}%` : "—"} />
            </div>
          </div>
        )}

        {/* ─── Itens do Pacote ─── */}
        {activeTab === "itens" && (
          <div className="space-y-3">
            {itensResolvidos.length > 0 ? (
              itensResolvidos.map((item, idx) => (
                <RelatedProductCard
                  key={item.id ?? idx}
                  nome={item.nomeResolvido}
                  sku={item.sku}
                  cor={tipoColor(item.tipo)}
                  preco={item.precoResolvido}
                  tipo={item.tipo as ProductSheetTipo}
                  onImageClick={() => openImageViewer("", item.nomeResolvido)}
                >
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    {TIPO_NOME_MAP[item.tipo] ?? item.tipo}
                  </span>
                </RelatedProductCard>
              ))
            ) : (
              <EmptyState msg="Nenhum item neste pacote" hint="Adicione itens ao pacote na edição." />
            )}
          </div>
        )}
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
