import { useState } from "react"
import toast from "react-hot-toast"
import { Eye, ShoppingCart, Check, Plus } from "lucide-react"
import { addToCart } from "~/features/catalogo/services/carrinho.service"
import { playCoinSound } from "~/features/catalogo/services/audio.service"
import { ProductThumb } from "./ProductThumb"
import { openImageViewer } from "~/features/catalogo/services/ui.service"

interface SequenciaProteticaProps {
  familiaId: string
  tipoAbutmentId: string
  familiaNome: string
  tipoAbutmentNome: string
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

export function SequenciaProtetica({ familiaId, tipoAbutmentId, familiaNome, tipoAbutmentNome }: SequenciaProteticaProps) {
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
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-accent)]">{tipoAbutmentNome}</p>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tighter">
            Workflow: <span className="text-[var(--color-accent)]">{workflow?.nome}</span>
          </h3>
          <p className="text-sm text-[var(--color-text-muted)]">Clique em uma peça para ver seu descritivo técnico.</p>
        </div>

        <div className="h-px bg-[var(--color-border-subtle)]" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {workflow?.etapas.map((etapa) => {
            const isAdded = addedSkus.has(etapa.acessorioSku)
            return (
              <div
                key={etapa.acessorioSku}
                className="flex flex-col rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/80 overflow-hidden"
              >
                {/* Header: imagem + nome + código */}
                <div className="flex items-center gap-3 p-3 pb-2">
                  <ProductThumb tipo="acessorio" size="sm" cor="#c9a655" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
                      Etapa {etapa.ordem}: {etapa.etapaNome}
                    </p>
                    <p className="font-bold text-white text-sm leading-tight truncate mt-0.5">
                      {etapa.acessorioNome}
                    </p>
                    <p className="text-[10px] font-mono text-[var(--color-text-muted)] mt-0.5">
                      SKU {etapa.acessorioSku}
                    </p>
                  </div>
                </div>

                {/* Botões */}
                <div className="flex items-center gap-2 p-3 pt-2 mt-auto border-t border-[var(--color-border-subtle)]">
                  <button
                    onClick={() => openImageViewer("", etapa.acessorioNome)}
                    className="flex items-center justify-center px-3 py-2 rounded-lg border border-[var(--color-border-subtle)] bg-white/5 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAdd(etapa.acessorioSku, etapa.acessorioNome)}
                    className={`flex items-center justify-center gap-1.5 flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                      isAdded
                        ? "bg-[var(--color-success)] text-white"
                        : "border border-[#c9a655]/40 text-[#c9a655] hover:bg-[#c9a655]/15"
                    }`}
                  >
                    {isAdded ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    {isAdded ? "OK" : "Add"}
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
                  {tipoAbutmentNome}
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
