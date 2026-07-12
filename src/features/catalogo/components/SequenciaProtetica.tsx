import { useState } from "react"
import toast from "react-hot-toast"
import { Eye, ShoppingCart, Check } from "lucide-react"
import { addToCart } from "~/features/catalogo/services/carrinho.service"
import { playCoinSound } from "~/features/catalogo/services/audio.service"
import { ProductThumb } from "./ProductThumb"
import { openImageViewer } from "~/features/catalogo/services/ui.service"

interface SequenciaProteticaProps {
  familiaId: string
  tipoAbutmentId: string
  familiaNome: string
}

interface WorkflowItem {
  id: string
  nome: string
  etapas: {
    ordem: number
    etapaNome: string
    acessorioSku: string
    acessorioNome: string
  }[]
}

const MOCK_DATA: WorkflowItem[] = [
  {
    id: "wf-analogico",
    nome: "Analógico Gesso",
    etapas: [
      { ordem: 1, etapaNome: "Cicatrização", acessorioSku: "124220", acessorioNome: "Healing Cap NP 4.5x4.0" },
      { ordem: 2, etapaNome: "Transferência", acessorioSku: "820011", acessorioNome: "Transfer NP Fechado" },
      { ordem: 4, etapaNome: "Parafusamento", acessorioSku: "710055", acessorioNome: "Parafuso Protético NP" },
    ],
  },
  {
    id: "wf-digital",
    nome: "Scan Digital inLego",
    etapas: [
      { ordem: 1, etapaNome: "Cicatrização", acessorioSku: "124215", acessorioNome: "Healing Cap NP 4.5x2.5" },
      { ordem: 2, etapaNome: "Transferência", acessorioSku: "957310", acessorioNome: "Scan Body inLego NP" },
      { ordem: 4, etapaNome: "Parafusamento", acessorioSku: "710055", acessorioNome: "Parafuso Protético NP" },
    ],
  },
]

export function SequenciaProtetica({ familiaId, tipoAbutmentId, familiaNome }: SequenciaProteticaProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)
  const [addedSkus, setAddedSkus] = useState<Set<string>>(new Set())

  const workflows = MOCK_DATA

  const handleAdd = (sku: string, nome: string) => {
    addToCart({ sku, nome, tipo: "acessorio", cor: "#c9a655", preco: 0 })
    playCoinSound()
    setAddedSkus((prev) => new Set(prev).add(sku))
    toast.success(`${nome} adicionado`, {
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
    setTimeout(() => {
      setAddedSkus((prev) => {
        const next = new Set(prev)
        next.delete(sku)
        return next
      })
    }, 2000)
  }

  if (selectedWorkflow) {
    const workflow = workflows.find((w) => w.id === selectedWorkflow)

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedWorkflow(null)}
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
        >
          ← Voltar para workflows
        </button>

        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-accent)]">Família {familiaNome}</p>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tighter">
            Workflow: <span className="text-[var(--color-accent)]">{workflow?.nome}</span>
          </h3>
          <p className="text-sm text-[var(--color-text-muted)]">Clique em uma peça para ver seu descritivo técnico.</p>
        </div>

        <div className="h-px bg-[var(--color-border-subtle)]" />

        <div className="space-y-3">
          {workflow?.etapas.map((etapa) => {
            const isAdded = addedSkus.has(etapa.acessorioSku)
            return (
              <div
                key={etapa.acessorioSku}
                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface)]/60 border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-surface-hover)] transition-all group"
              >
                <ProductThumb tipo="acessorio" size="sm" cor="#c9a655" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
                    Etapa {etapa.ordem}: {etapa.etapaNome}
                  </p>
                  <p className="font-bold text-white text-sm mt-1 truncate">
                    {etapa.acessorioNome}
                  </p>
                  <p className="text-xs font-mono text-[var(--color-text-muted)] mt-0.5">
                    SKU {etapa.acessorioSku}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openImageViewer("", etapa.acessorioNome)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleAdd(etapa.acessorioSku, etapa.acessorioNome)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                      isAdded
                        ? "bg-[var(--color-success)] text-white"
                        : "border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-fg)]"
                    }`}
                  >
                    {isAdded ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
                    {isAdded ? "OK" : "+ Add"}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white">Sequência Protética</h3>
        <div className="h-px bg-[var(--color-border-subtle)]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {workflows.map((workflow) => (
          <button
            key={workflow.id}
            onClick={() => setSelectedWorkflow(workflow.id)}
            className="text-left p-5 rounded-xl bg-[var(--color-surface)]/60 border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-hover)] transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  Família {familiaNome}
                </p>
                <h4 className="font-bold text-white group-hover:text-[var(--color-accent)] transition-colors">
                  {workflow.nome}
                </h4>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {workflow.etapas.length} etapa(s)
                </p>
              </div>
              <span className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors">→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
