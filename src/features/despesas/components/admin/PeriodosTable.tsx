import { RefreshCw, Lock } from "lucide-react";
import { usePeriodos, useGerarPeriodos, useFecharPeriodo } from "../../hooks/usePeriodos";
import { Button } from "~/components/ui/button";

function formatarData(data: string) {
  return new Date(data + "T00:00:00").toLocaleDateString("pt-BR");
}

export function PeriodosTable() {
  const { data: periodos, isLoading } = usePeriodos();
  const gerar = useGerarPeriodos();
  const fechar = useFecharPeriodo();

  if (isLoading) {
    return <div className="text-text-muted text-sm">Carregando períodos...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-muted">Períodos de envio de despesas gerados automaticamente.</p>
        <Button onClick={() => gerar.mutate()} size="sm" variant="outline" className="gap-1.5" disabled={gerar.isPending}>
          <RefreshCw size={14} className={gerar.isPending ? "animate-spin" : ""} />
          {gerar.isPending ? "Gerando..." : "Gerar Períodos"}
        </Button>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-hover/30">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-muted uppercase">Período</th>
              <th className="text-center px-4 py-2.5 text-xs font-semibold text-text-muted uppercase">Status</th>
              <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-muted uppercase">Ações</th>
            </tr>
          </thead>
          <tbody>
            {periodos && periodos.length > 0 ? periodos.map((periodo) => (
              <tr key={periodo.id} className="border-b border-border/50 last:border-0 hover:bg-surface-hover/20 transition-colors">
                <td className="px-4 py-2.5 text-text-main font-medium">
                  {formatarData(periodo.data_inicio)} — {formatarData(periodo.data_fim)}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${periodo.status === "aberto" ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"}`}>
                    {periodo.status === "aberto" ? "Aberto" : "Fechado"}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  {periodo.status === "aberto" && (
                    <button
                      onClick={() => fechar.mutate(periodo.id)}
                      className="p-1.5 rounded-md text-text-muted hover:text-warning hover:bg-warning/10 transition-colors"
                      title="Fechar período"
                    >
                      <Lock size={14} />
                    </button>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-text-muted">Nenhum período gerado. Clique em &quot;Gerar Períodos&quot; para criar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
