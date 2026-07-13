import type { CatalogoDesignConfig } from "../../services/design.service"
import {
  Crosshair, ShieldCheck, Box, Tag,
  Package, Layers, ShoppingBag, Percent,
  Star, Heart, Diamond, Circle,
  Hexagon, Pentagon, Triangle, Square,
  Zap, Target, Award, Gem,
  type LucideIcon,
} from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
  Crosshair, ShieldCheck, Box, Tag,
  Package, Layers, ShoppingBag, Percent,
  Star, Heart, Diamond, Circle,
  Hexagon, Pentagon, Triangle, Square,
  Zap, Target, Award, Gem,
}

interface StoreMiniaturaProps {
  config: CatalogoDesignConfig
}

export function StoreMiniatura({ config }: StoreMiniaturaProps) {
  const { colors, texts, visibility, images, effects, elementBackgrounds, cards } = config

  const cssVars: Record<string, string> = {
    "--color-accent": colors.accent,
    "--color-accent-hover": colors.accentHover,
    "--color-accent-fg": colors.accentFg,
    "--color-bg": colors.bg,
    "--color-surface": colors.surface,
    "--color-surface-hover": colors.surfaceHover,
    "--color-card": colors.card,
    "--color-text-main": colors.textMain,
    "--color-text-muted": colors.textMuted,
    "--color-border-subtle": colors.borderSubtle,
    "--color-input-bg": colors.inputBg,
    "--color-input-border": colors.inputBorder,
    "--color-success": colors.success,
    "--color-error": colors.error,
  }

  return (
    <div className="catalogo-theme h-full flex flex-col" style={cssVars}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 h-12 px-4 flex items-center justify-between border-b"
        style={{
          backgroundColor: elementBackgrounds.headerBg || `${colors.bg}cc`,
          borderColor: colors.borderSubtle,
          backdropFilter: effects.headerBlur ? "blur(12px)" : "none",
        }}
      >
        {images.logoUrl ? (
          <img src={images.logoUrl} className="h-5 w-auto object-contain" alt="Logo" />
        ) : (
          <span className="text-xs font-bold" style={{ color: colors.textMain }}>
            {texts.storeName}
          </span>
        )}
        {visibility.showCartIcon && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
            style={{ backgroundColor: colors.surface, color: colors.textMuted }}
          >
            🛒
          </div>
        )}
      </header>

      {/* Hero Section */}
      {visibility.showHeroSection && (
        <div className="relative px-4 py-6 text-center overflow-hidden">
          {effects.enableBlobs && (
            <>
              <div
                className="absolute top-[20%] left-[10%] w-32 h-32 rounded-full pointer-events-none"
                style={{
                  backgroundColor: effects.blobColor,
                  opacity: effects.blobOpacity,
                  filter: `blur(${effects.blobBlur}px)`,
                }}
              />
              <div
                className="absolute bottom-[10%] right-[10%] w-24 h-24 rounded-full pointer-events-none"
                style={{
                  backgroundColor: effects.blobColor,
                  opacity: effects.blobOpacity * 0.7,
                  filter: `blur(${effects.blobBlur * 0.8}px)`,
                }}
              />
            </>
          )}
          <div className="relative z-10">
            <p
              className="text-[8px] font-bold uppercase tracking-widest mb-1"
              style={{ color: colors.accent }}
            >
              {texts.storeTagline}
            </p>
            <h2
              className="text-sm font-black leading-tight mb-1"
              style={{ color: colors.textMain }}
            >
              {texts.heroTitle}
            </h2>
            <p className="text-[9px]" style={{ color: colors.textMuted }}>
              {texts.heroSubtitle}
            </p>
          </div>
        </div>
      )}

      {/* Barra de Busca */}
      {visibility.showSearchBar && (
        <div className="mx-4 mb-3">
          <div
            className="h-8 rounded-full px-3 flex items-center text-[9px]"
            style={{
              backgroundColor: elementBackgrounds.inputBg || colors.inputBg,
              border: `1px solid ${colors.inputBorder}`,
              color: colors.textMuted,
            }}
          >
            🔍 Buscar por SKU, Linha...
          </div>
        </div>
      )}

      {/* Category Cards */}
      {visibility.showCategoryCards && cards && (
        <div className="px-4 pb-4 grid grid-cols-2 gap-2">
          {(["implantes", "componentes", "kits", "promocionais"] as const).map((key) => {
            const card = cards[key]
            if (!card?.enabled) return null
            const Icon = ICON_MAP[card.icon]
            return (
              <div
                key={key}
                className="rounded-xl p-3 text-center"
                style={{
                  backgroundColor: card.cardBg || colors.surface,
                  border: `1px solid ${card.cardBorder || colors.borderSubtle}`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg mx-auto mb-1.5 flex items-center justify-center"
                  style={{ backgroundColor: colors.inputBg, color: card.iconColor }}
                >
                  {Icon ? <Icon size={16} /> : <span>?</span>}
                </div>
                <p className="text-[9px] font-bold" style={{ color: card.titleColor }}>
                  {card.title}
                </p>
                <p className="text-[7px]" style={{ color: card.descColor }}>
                  {card.description}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer */}
      {visibility.showFooter && (
        <div
          className="mt-auto py-3 text-center border-t"
          style={{ borderColor: colors.borderSubtle }}
        >
          <p className="text-[8px]" style={{ color: colors.textMuted }}>
            {texts.footerText}
          </p>
        </div>
      )}
    </div>
  )
}
