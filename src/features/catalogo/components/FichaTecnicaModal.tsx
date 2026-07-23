import { X, FileText, Package, Link2 } from "lucide-react"
import { createPortal } from "react-dom"
import { formatBRL } from "~/features/catalogo/services/carrinho.service"

export interface FichaTecnicaSection {
  title: string
  specs: Array<{ label: string; value: string | number | null | undefined }>
}

export interface FichaTecnicaVinculo {
  nome: string
  sku: string
  valor?: number | null
}

export interface FichaTecnicaComposicaoItem {
  nome: string
  quantidade?: number
  sku?: string
}

interface FichaTecnicaModalProps {
  open: boolean
  onClose: () => void
  nome: string
  sku: string
  cor: string
  imagemUrl?: string | null
  /** @deprecated Use `sections` instead */
  specs?: Array<{ label: string; value: string | number | null | undefined }>
  sections?: FichaTecnicaSection[]
  vinculacoes?: FichaTecnicaVinculo[]
  composicao?: FichaTecnicaComposicaoItem[]
}

export function FichaTecnicaModal({ open, onClose, nome, sku, cor, imagemUrl, specs, sections, vinculacoes, composicao }: FichaTecnicaModalProps) {
  if (!open) return null

  // Backward compat: convert flat specs to a single section
  const resolvedSections: FichaTecnicaSection[] = sections?.length
    ? sections
    : specs?.length
      ? [{ title: "Especificações", specs }]
      : []

  const hasVinculacoes = vinculacoes && vinculacoes.length > 0
  const hasComposicao = composicao && composicao.length > 0

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-[var(--color-border-subtle)]/50 bg-[#0f172a] shadow-2xl shadow-black/40 overflow-hidden max-h-[90dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-[var(--color-accent)]/20 via-[var(--color-accent)]/10 to-transparent px-5 sm:px-6 pt-5 sm:pt-6 pb-5 sm:pb-6 border-b border-[var(--color-border-subtle)]/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0" style={{ backgroundColor: `${cor}1a`, color: cor }}>
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">{nome}</h3>
                <p className="font-mono text-[10px] text-[var(--color-text-muted)] mt-0.5">SKU: {sku}</p>
              </div>
            </div>
            <button onClick={onClose} className="shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-4 h-4 text-[var(--color-text-muted)]" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 sm:px-6 py-5 sm:py-6 flex-1 overflow-y-auto space-y-5">
          {/* Imagem */}
          {imagemUrl && (
            <div className="w-full h-36 sm:h-40 rounded-xl overflow-hidden bg-gradient-to-br from-[var(--color-surface)] to-[#0f172a] border border-[var(--color-border-subtle)] flex items-center justify-center">
              <img src={imagemUrl} alt={nome} className="w-full h-full object-contain" loading="lazy" />
            </div>
          )}

          {/* Seções */}
          {resolvedSections.length > 0 ? (
            resolvedSections.map((section) => {
              const validSpecs = section.specs.filter((s) => s.value != null && s.value !== "")
              if (validSpecs.length === 0) return null
              return (
                <div key={section.title} className="space-y-2.5">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-accent)]">{section.title}</h4>
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                    {validSpecs.map((s) => (
                      <div key={s.label} className="p-3 rounded-lg bg-[var(--color-surface)]/60 border border-[var(--color-border-subtle)]">
                        <span className="block text-[9px] font-bold uppercase tracking-[0.15em] mb-1 text-[var(--color-text-muted)]">{s.label}</span>
                        <span className="block text-sm font-bold text-white">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })
          ) : (
            !hasVinculacoes && !hasComposicao && <p className="text-xs text-[var(--color-text-muted)] text-center py-4">Nenhuma especificação disponível</p>
          )}

          {/* Vinculações */}
          {hasVinculacoes && (
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-accent)]">Vinculações</h4>
              {/* Header da tabela */}
              <div className="grid grid-cols-[1fr_80px_70px] gap-2 px-3 text-[8px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                <span>Nome</span>
                <span className="text-right">SKU</span>
                <span className="text-right">Valor</span>
              </div>
              <div className="space-y-1">
                {vinculacoes!.map((v, i) => (
                  <div key={i} className="grid grid-cols-[1fr_80px_70px] gap-2 items-center p-2.5 rounded-lg bg-[var(--color-surface)]/60 border border-[var(--color-border-subtle)]">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md shrink-0" style={{ backgroundColor: `${cor}15`, color: cor }}>
                        <Link2 className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-bold text-white truncate">{v.nome}</span>
                    </div>
                    <span className="font-mono text-[10px] text-[var(--color-text-muted)] text-right truncate">{v.sku}</span>
                    <span className="text-xs font-bold text-white text-right">{v.valor != null ? formatBRL(v.valor) : "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Composição */}
          {hasComposicao && (
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-accent)]">Composição</h4>
              <div className="space-y-1.5">
                {composicao!.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-[var(--color-surface)]/60 border border-[var(--color-border-subtle)]">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: `${cor}15`, color: cor }}>
                      <Package className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{item.nome}</p>
                      {item.sku && <p className="font-mono text-[9px] text-[var(--color-text-muted)]">{item.sku}</p>}
                    </div>
                    {item.quantidade != null && item.quantidade > 1 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] shrink-0">
                        ×{item.quantidade}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
