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
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <>
          <div className="absolute inset-0 opacity-10 group-hover:opacity-25 mix-blend-screen transition-opacity duration-500" style={{ background: `radial-gradient(circle at 30% 30%, ${cor} 0%, transparent 60%)` }} />
          <Box className="w-28 h-28 sm:w-36 sm:h-36 opacity-[0.07] relative z-10 transition-transform group-hover:scale-110 duration-700" style={{ color: cor }} />
        </>
      )}
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

