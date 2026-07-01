import { useState } from "react";
import { Send, CheckCircle, AlertTriangle } from "lucide-react";
import { useMinhasDespesas, useEnviarDespesas } from "../../hooks/useDespesas";
import { usePeriodosAbertos } from "../../hooks/usePeriodos";
import { useCriarOuAtualizarEnvio } from "../../hooks/useEnvios";
import { usePrazoEnvio } from "../../hooks/usePrazoEnvio";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function formatarData(data: string) {
  return new Date(data + "T00:00:00").toLocaleDateString("pt-BR");
}

export function EnviarDespesasModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [periodoId, setPeriodoId] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { data: periodos } = usePeriodosAbertos();
  const { data: despesas, isLoading } = useMinhasDespesas({
    periodo_id: periodoId || undefined,
  });
  const enviar = useEnviarDespesas();
  const criarEnvio = useCriarOuAtualizarEnvio();

  const rascunhos = despesas?.filter((d) => d.status === "rascunho") ?? [];
  const total = rascunhos.reduce((acc, d) => acc + d.valor, 0);
  const {
    prazoExpirado,
    diasRestantes,
    deadline,
    isLoading: prazoLoading,
  } = usePrazoEnvio(periodoId);

  async function handleEnviar() {
    if (!periodoId) return;
    await criarEnvio.mutateAsync(periodoId);
    await enviar.mutateAsync(periodoId);
    setConfirmOpen(false);
    setPeriodoId("");
    onOpenChange(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar Despesas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-muted uppercase">
                Período
              </label>
              <select
                value={periodoId}
                onChange={(e) => setPeriodoId(e.target.value)}
                className="w-full rounded-lg border border-input-border bg-input-bg px-3 py-2.5 text-sm text-text-main"
              >
                <option value="">Selecione o período</option>
                {periodos?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {formatarData(p.data_inicio)} — {formatarData(p.data_fim)}
                  </option>
                ))}
              </select>
            </div>

            {periodoId && (
              <>
                {!prazoLoading && prazoExpirado && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-error/10 border border-error/20">
                    <AlertTriangle
                      size={18}
                      className="text-error shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium text-error">
                        Prazo de envio expirado
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        O prazo para enviar despesas deste período era até{" "}
                        {deadline?.toLocaleDateString("pt-BR")}. Entre em
                        contato com o administrador.
                      </p>
                    </div>
                  </div>
                )}
                {!prazoLoading &&
                  !prazoExpirado &&
                  diasRestantes > 0 &&
                  diasRestantes <= 3 && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-warning/10 border border-warning/20">
                      <AlertTriangle
                        size={18}
                        className="text-warning shrink-0 mt-0.5"
                      />
                      <p className="text-sm text-warning">
                        Prazo de envio termina em {diasRestantes} dia
                        {diasRestantes !== 1 ? "s" : ""}.
                      </p>
                    </div>
                  )}
                {isLoading ? (
                  <div className="text-text-muted text-sm">Carregando...</div>
                ) : rascunhos.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle
                      size={40}
                      className="mx-auto text-success/30 mb-2"
                    />
                    <p className="text-text-muted text-sm">
                      Nenhuma despesa em rascunho para este período.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="border border-border rounded-xl overflow-hidden max-h-[40vh] overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-surface-hover/30">
                          <tr className="border-b border-border">
                            <th className="text-left px-3 py-2 text-xs font-semibold text-text-muted uppercase">
                              Data
                            </th>
                            <th className="text-left px-3 py-2 text-xs font-semibold text-text-muted uppercase">
                              Tipo
                            </th>
                            <th className="text-right px-3 py-2 text-xs font-semibold text-text-muted uppercase">
                              Valor
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rascunhos.map((d) => (
                            <tr
                              key={d.id}
                              className="border-b border-border/50 last:border-0"
                            >
                              <td className="px-3 py-2 text-text-main">
                                {formatarData(d.data_despesa)}
                              </td>
                              <td className="px-3 py-2 text-text-muted">
                                {d.tipo?.nome ?? "—"}
                              </td>
                              <td className="px-3 py-2 text-right text-text-main font-medium">
                                {formatarMoeda(d.valor)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-accent/5 border border-accent/20">
                      <div>
                        <p className="text-sm font-semibold text-text-main">
                          {rascunhos.length} despesa(s)
                        </p>
                        <p className="text-xs text-text-muted">
                          Total: {formatarMoeda(total)}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => setConfirmOpen(true)}
                disabled={
                  !periodoId ||
                  rascunhos.length === 0 ||
                  enviar.isPending ||
                  criarEnvio.isPending ||
                  prazoExpirado
                }
                className="gap-1.5"
              >
                <Send size={16} />
                {prazoExpirado
                  ? "Prazo expirado"
                  : enviar.isPending || criarEnvio.isPending
                    ? "Enviando..."
                    : "Enviar"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Enviar despesas?</AlertDialogTitle>
            <AlertDialogDescription>
              {rascunhos.length} despesa(s) totalizando {formatarMoeda(total)}{" "}
              serão enviadas para aprovação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleEnviar}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
