import { createRoute, Link } from "@tanstack/react-router"
import { rootRoute } from "./__root"
import { StoreLayout } from "~/features/catalogo/components/StoreLayout"
import { useState, useEffect } from "react"
import { supabase } from "~/lib/supabase"
import { Loader2, Crosshair, ShieldCheck, Box, Tag, Package, Layers, ShoppingBag, Percent, Star, Heart, Diamond, Circle, Zap, Target, Award, Gem, Hexagon, Pentagon, Triangle, Square, type LucideIcon } from "lucide-react"
import { EMPRESA_ID } from "~/config/empresa"
import { getCatalogoDesign, mergeWithDefaults, type CatalogoDesignConfig } from "~/features/catalogo/services/design.service"
import { WatermarkShape } from "~/features/catalogo/components/WatermarkShape"

const ICON_MAP: Record<string, LucideIcon> = {
  Crosshair, ShieldCheck, Box, Tag,
  Package, Layers, ShoppingBag, Percent,
  Star, Heart, Diamond, Circle,
  Hexagon, Pentagon, Triangle, Square,
  Zap, Target, Award, Gem,
}

function withProtocol(url: string): string {
  if (!/^https?:\/\//i.test(url)) return `https://${url}`
  return url
}

export const catalogoIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalogo",
  component: CatalogoIndexPage,
})

function CatalogoIndexPage() {
  return <CatalogoStoreContent empresaId={EMPRESA_ID} />
}

function CatalogoStoreContent({ empresaId }: { empresaId: string }) {
  const [config, setConfig] = useState<CatalogoDesignConfig | null>(null)
  const [empresaNome, setEmpresaNome] = useState<string>("")

  useEffect(() => {
    getCatalogoDesign().then(setConfig)
    supabase.from("empresas").select("nome").eq("id", empresaId).single().then(({ data }) => {
      if (data?.nome) setEmpresaNome(data.nome)
    })
  }, [empresaId])

  if (!config) {
    return (
      <StoreLayout empresaId={empresaId}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={24} className="animate-spin text-[var(--color-accent)]" />
        </div>
      </StoreLayout>
    )
  }

  const { texts, cards, visibility, effects, footer } = config
  const cardKeys = ["implantes", "componentes", "kits", "promocionais"] as const
  const visibleCards = cardKeys.filter((key) => cards[key]?.enabled)
  const visibleCount = visibleCards.length

  const gridColsClass = visibleCount <= 1
    ? "grid-cols-1 max-w-xs mx-auto"
    : visibleCount === 2
      ? "grid-cols-2 max-w-md mx-auto"
      : visibleCount === 3
        ? "grid-cols-2 sm:grid-cols-3 max-w-3xl mx-auto"
        : "grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto"

  return (
    <StoreLayout empresaId={empresaId}>
      {/* Wrapper flex-1 para empurrar footer ao fundo */}
      <div className="flex-1 flex flex-col">
      {/* Hero */}
      {visibility.showHeroSection && (
        <div className="relative shrink-0" style={{ backgroundImage: 'var(--catalogo-hero-bg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          {effects.enableBlobs && (
            <div
              className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
              style={{ backgroundColor: effects.blobColor, opacity: effects.blobOpacity, filter: `blur(${effects.blobBlur}px)` }}
            />
          )}
          <div className="px-5 sm:px-6 lg:px-16 pt-5 pb-2 sm:pt-10 sm:pb-4 lg:pt-14 lg:pb-8 max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-[var(--color-accent-muted)] bg-[var(--color-surface)]/50 backdrop-blur-md mb-3 sm:mb-4 lg:mb-4">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
                {texts.storeTagline}
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black mb-2 sm:mb-3 lg:mb-4 uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 leading-tight">
              {texts.heroTitle}
            </h2>
            <p className="text-xs sm:text-base lg:text-lg text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
              {texts.heroSubtitle}
            </p>
          </div>
        </div>
      )}

      {/* Cards */}
      {visibility.showCategoryCards && visibleCount > 0 && (
        <div className="px-4 sm:px-6 lg:px-16 pt-3 pb-6 sm:pt-5 sm:pb-10 max-w-7xl mx-auto w-full flex-1">
          <div className={`grid ${gridColsClass} gap-3 sm:gap-5 lg:gap-8 auto-rows-fr w-full`}>
            {visibleCards.map((key) => {
              const card = cards[key]
              const Icon = ICON_MAP[card!.icon]
              return (
                <Link
                  key={key}
                  to={`/catalogo/${key}` as any}
                  className="card-catalogo group relative rounded-2xl sm:rounded-3xl backdrop-blur-xl transition-all duration-300 overflow-hidden flex flex-col items-center justify-start pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 no-underline shadow-xl hover:-translate-y-1 sm:hover:-translate-y-2 aspect-square"
                  style={{
                    backgroundColor: card!.cardBg || "var(--color-surface)",
                    border: "0.7px solid var(--color-border-subtle)",
                  }}
                >
                  <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-[var(--color-accent-muted)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {visibility.showWatermark !== false && (
                    <WatermarkShape
                      shape={cards.watermarkShape || "diamond"}
                      color={card!.watermarkColor || card!.iconColor}
                      className="bottom-0 right-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-36 lg:h-36"
                    />
                  )}
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl bg-[var(--color-input-bg)] border border-[var(--color-border-subtle)] flex items-center justify-center mb-3 sm:mb-4 lg:mb-6 relative z-10 group-hover:border-[var(--color-accent)] transition-colors shadow-xl"
                    style={{ color: card!.iconColor }}
                  >
                    {Icon && <Icon size={22} className="sm:hidden" />}
                    {Icon && <Icon size={26} className="hidden sm:block lg:hidden" />}
                    {Icon && <Icon size={32} className="hidden lg:block" />}
                  </div>
                  <h3 className="text-sm sm:text-lg lg:text-2xl font-bold relative z-10 text-center leading-tight" style={{ color: card!.titleColor }}>{card!.title}</h3>
                  <p className="text-[9px] sm:text-xs lg:text-sm mt-1 sm:mt-2 relative z-10 group-hover:opacity-80 transition-colors text-center leading-snug hidden sm:block" style={{ color: card!.descColor }}>{card!.description}</p>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      {visibility.showFooter && footer && (
        <div className="shrink-0 px-4 sm:px-6 lg:px-16 pb-6 pt-2.5 flex items-center justify-center gap-3">
          <p className="text-[10px] sm:text-xs" style={{ color: footer.textColor }}>
            {empresaNome || footer.text} &copy; {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-1 sm:gap-2">
            {footer.socialLinks.instagram && (
              <a href={withProtocol(footer.socialLinks.instagram)} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all hover:opacity-80"
                style={{ backgroundColor: footer.iconBgColor, border: `1px solid ${footer.iconBorderColor}`, color: footer.iconColor }}>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            )}
            {footer.socialLinks.facebook && (
              <a href={withProtocol(footer.socialLinks.facebook)} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all hover:opacity-80"
                style={{ backgroundColor: footer.iconBgColor, border: `1px solid ${footer.iconBorderColor}`, color: footer.iconColor }}>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            )}
            {footer.socialLinks.twitter && (
              <a href={withProtocol(footer.socialLinks.twitter)} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all hover:opacity-80"
                style={{ backgroundColor: footer.iconBgColor, border: `1px solid ${footer.iconBorderColor}`, color: footer.iconColor }}>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            )}
            {footer.socialLinks.linkedin && (
              <a href={withProtocol(footer.socialLinks.linkedin)} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all hover:opacity-80"
                style={{ backgroundColor: footer.iconBgColor, border: `1px solid ${footer.iconBorderColor}`, color: footer.iconColor }}>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            )}
            {footer.socialLinks.youtube && (
              <a href={withProtocol(footer.socialLinks.youtube)} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all hover:opacity-80"
                style={{ backgroundColor: footer.iconBgColor, border: `1px solid ${footer.iconBorderColor}`, color: footer.iconColor }}>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            )}
            {footer.socialLinks.whatsapp && (
              <a href={`https://wa.me/${footer.socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all hover:opacity-80"
                style={{ backgroundColor: footer.iconBgColor, border: `1px solid ${footer.iconBorderColor}`, color: footer.iconColor }}>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            )}
            {footer.socialLinks.tiktok && (
              <a href={withProtocol(footer.socialLinks.tiktok)} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all hover:opacity-80"
                style={{ backgroundColor: footer.iconBgColor, border: `1px solid ${footer.iconBorderColor}`, color: footer.iconColor }}>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
            )}
            {footer.socialLinks.site && (
              <a href={withProtocol(footer.socialLinks.site)} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all hover:opacity-80"
                style={{ backgroundColor: footer.iconBgColor, border: `1px solid ${footer.iconBorderColor}`, color: footer.iconColor }}>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </a>
            )}
            {footer.socialLinks.email && (
              <a href={`mailto:${footer.socialLinks.email}`}
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all hover:opacity-80"
                style={{ backgroundColor: footer.iconBgColor, border: `1px solid ${footer.iconBorderColor}`, color: footer.iconColor }}>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            )}
            {footer.socialLinks.telefone && (
              <a href={`tel:${footer.socialLinks.telefone}`}
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all hover:opacity-80"
                style={{ backgroundColor: footer.iconBgColor, border: `1px solid ${footer.iconBorderColor}`, color: footer.iconColor }}>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </a>
            )}
            {footer.socialLinks.endereco && (
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(footer.socialLinks.endereco)}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all hover:opacity-80"
                style={{ backgroundColor: footer.iconBgColor, border: `1px solid ${footer.iconBorderColor}`, color: footer.iconColor }}
                title={footer.socialLinks.endereco}>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </a>
            )}
          </div>
        </div>
      )}
    </div>{/* end flex-1 wrapper */}
    </StoreLayout>
  )
}
