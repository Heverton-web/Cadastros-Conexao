import { X, FileText } from "lucide-react"
import { createPortal } from "react-dom"

interface FichaTecnicaModalProps {
  open: boolean
  onClose: () => void
  nome: string
  sku: string
  cor: string
  imagemUrl?: string | null
  specs: Array<{ label: string; value: string | number | null | undefined }>
}

export function FichaTecnicaModal({ open, onClose, nome, sku, cor, imagemUrl, specs }: FichaTecnicaModalProps) {
  if (!open) return null
  const validSpecs = specs.filter((s) => s.value != null && s.value !== "")
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-[var(--color-border-subtle)]/50 bg-[#0f172a] shadow-2xl shadow-black/40 overflow-hidden max-h-[90dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
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
        <div className="px-5 sm:px-6 py-5 sm:py-6 flex-1 overflow-y-auto space-y-4">
          {imagemUrl && (
            <div className="w-full h-36 sm:h-40 rounded-xl overflow-hidden bg-gradient-to-br from-[var(--color-surface)] to-[#0f172a] border border-[var(--color-border-subtle)] flex items-center justify-center">
              <img src={imagemUrl} alt={nome} className="w-full h-full object-contain" loading="lazy" />
            </div>
          )}
          {validSpecs.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {validSpecs.map((s) => (
                <div key={s.label} className="p-3 rounded-lg bg-[var(--color-surface)]/60 border border-[var(--color-border-subtle)]">
                  <span className="block text-[9px] font-bold uppercase tracking-[0.15em] mb-1 text-[var(--color-text-muted)]">{s.label}</span>
                  <span className="block text-sm font-bold text-white">{s.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--color-text-muted)] text-center py-4">Nenhuma especificação disponível</p>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
