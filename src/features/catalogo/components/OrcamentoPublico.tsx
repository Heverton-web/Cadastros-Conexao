import { useState, useEffect } from "react"
import { Check, X, Loader2 } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "~/components/ui/table"
import { buscarOrcamentoPorToken, atualizarStatusOrcamento } from "../services/orcamentos.service"
import type { CatalogoOrcamento } from "../types/orcamentos"
import { STATUS_ORCAMENTO_LABEL, STATUS_ORCAMENTO_COLOR } from "../types/orcamentos"

interface OrcamentoPublicoProps {
  token: string
}

export function OrcamentoPublico({ token }: OrcamentoPublicoProps) {
  const [orcamento, setOrcamento] = useState<CatalogoOrcamento | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const data = await buscarOrcamentoPorToken(token)
        if (!data) {
          setError("Orçamento não encontrado ou link expirado.")
        } else {
          setOrcamento(data)
        }
      } catch {
        setError("Erro ao carregar orçamento.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  async function handleAprovar() {
    if (!orcamento) return
    setActionLoading(true)
    try {
      await atualizarStatusOrcamento(orcamento.id, "aprovado")
      setSuccess("Orçamento aprovado com sucesso!")
      setOrcamento({ ...orcamento, status: "aprovado" })
    } catch {
      setError("Erro ao aprovar orçamento.")
    } finally {
      setActionLoading(false)
    }
  }

  async function handleReprovar() {
    if (!orcamento) return
    setActionLoading(true)
    try {
      await atualizarStatusOrcamento(orcamento.id, "reprovado")
      setSuccess("Orçamento reprovado.")
      setOrcamento({ ...orcamento, status: "reprovado" })
    } catch {
      setError("Erro ao reprovar orçamento.")
    } finally {
      setActionLoading(false)
    }
  }

  function formatBRL(v: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
        <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin" />
      </div>
    )
  }

  if (error && !orcamento) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </div>
    )
  }

  if (!orcamento) return null

  const isPending = orcamento.status === "rascunho" || orcamento.status === "enviado"
  const isTerminal = ["aprovado", "reprovado", "pedido", "expirado"].includes(orcamento.status)

  return (
    <div className="min-h-screen bg-[#0a0e1a] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Orçamento</h1>
          <p className="text-[var(--color-text-muted)]">
            {orcamento.cliente_nome && `Olá, ${orcamento.cliente_nome}! `}
            Confira os itens abaixo.
          </p>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border-subtle)] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-[var(--color-text-muted)]">
              Orçamento #{orcamento.id.slice(0, 8)}
            </span>
            <Badge className={STATUS_ORCAMENTO_COLOR[orcamento.status]}>
              {STATUS_ORCAMENTO_LABEL[orcamento.status]}
            </Badge>
          </div>

          {orcamento.itens && orcamento.itens.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-center">Qtd</TableHead>
                  <TableHead className="text-right">Preço Unit.</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orcamento.itens.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.produto_nome}</TableCell>
                    <TableCell className="text-center">{item.quantidade}</TableCell>
                    <TableCell className="text-right">{formatBRL(item.preco_unitario)}</TableCell>
                    <TableCell className="text-right">{formatBRL(item.preco_unitario * item.quantidade)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="flex justify-end mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
            <div className="text-right">
              <p className="text-sm text-[var(--color-text-muted)]">Total</p>
              <p className="text-2xl font-bold text-[var(--color-accent)]">
                {formatBRL(orcamento.valor_total)}
              </p>
            </div>
          </div>

          {orcamento.observacoes && (
            <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
              <p className="text-sm text-[var(--color-text-muted)]">Observações:</p>
              <p className="text-sm">{orcamento.observacoes}</p>
            </div>
          )}
        </div>

        {success && (
          <div className="bg-green-900/30 border border-green-500/20 rounded-xl p-4 mb-6 text-center">
            <p className="text-green-400">{success}</p>
          </div>
        )}

        {isPending && (
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleAprovar}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Aprovar Orçamento
            </Button>
            <Button
              onClick={handleReprovar}
              disabled={actionLoading}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-900/20"
            >
              <X className="w-4 h-4 mr-2" />
              Reprovar
            </Button>
          </div>
        )}

        {isTerminal && !success && (
          <div className="text-center">
            <p className="text-[var(--color-text-muted)]">
              {orcamento.status === "aprovado" && "Orçamento aprovado. Aguardando conversão em pedido."}
              {orcamento.status === "reprovado" && "Orçamento reprovado."}
              {orcamento.status === "pedido" && "Orçamento convertido em pedido."}
              {orcamento.status === "expirado" && "Orçamento expirado."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
