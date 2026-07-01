import { useEffect, useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  RefreshCw,
  FileText,
  Send,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
  X,
} from "lucide-react";
import { supabase } from "~/core/supabase";
import { toast } from "react-hot-toast";
import { useAuth } from "~/lib/auth";
import type { NpsRelatorioEnvio } from "../../types";

export function NpsRelatoriosPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [relatorios, setRelatorios] = useState<NpsRelatorioEnvio[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState<NpsRelatorioEnvio | null>(null);

  useEffect(() => {
    fetchRelatorios();
  }, [dateFrom, dateTo]);

  if (profile && !profile.is_super_admin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
          <X className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Acesso Negado</h2>
        <p className="text-muted-foreground mt-2">
          Você não tem permissão para visualizar relatórios de envio.
        </p>
      </div>
    );
  }

  const fetchRelatorios = async () => {
    setLoading(true);
    let query = supabase
      .from("nps_relatorios_envio")
      .select("*")
      .order("data_envio", { ascending: false })
      .order("created_at", { ascending: false });

    if (dateFrom) query = query.gte("data_envio", dateFrom);
    if (dateTo) query = query.lte("data_envio", dateTo);

    const { data, error } = await query;
    if (error) toast.error("Erro ao carregar");
    else setRelatorios((data as NpsRelatorioEnvio[]) || []);
    setLoading(false);
  };

  const formatDate = (d: string) =>
    new Date((d || "").slice(0, 10) + "T00:00:00").toLocaleDateString("pt-BR");
  const formatDateTime = (d: string) => new Date(d).toLocaleString("pt-BR");

  const totals = relatorios.reduce(
    (acc, r) => ({
      processado: acc.processado + r.total_processado,
      sucesso: acc.sucesso + r.enviados_sucesso,
      semWhats: acc.semWhats + r.sem_whatsapp,
      menor30: acc.menor30 + r.nps_menor_30,
    }),
    { processado: 0, sucesso: 0, semWhats: 0, menor30: 0 },
  );

  return (
    <div className="flex flex-col gap-6 p-4 pb-24 lg:p-8 lg:pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">
            Relatórios de Envios NPS
          </h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchRelatorios}
          disabled={loading}
        >
          <RefreshCw
            className={`w-4 h-4 mr-1.5 ${loading ? "animate-spin" : ""}`}
          />{" "}
          Atualizar
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-3 bg-card/30 p-3 rounded-xl border border-border/50 backdrop-blur-sm">
        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Data Inicial
          </Label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-[140px] h-9 bg-background/50"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Data Final
          </Label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-[140px] h-9 bg-background/50"
          />
        </div>
        {(dateFrom || dateTo) && (
          <Button
            variant="secondary"
            size="sm"
            className="h-9"
            onClick={() => {
              setDateFrom("");
              setDateTo("");
            }}
          >
            Limpar Filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase font-medium tracking-wider mb-2">
              <FileText className="w-4 h-4 text-primary/70" /> Processados
            </div>
            <div className="text-3xl font-bold text-card-foreground">
              {totals.processado}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 text-green-500 text-xs uppercase font-medium tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4" /> Enviados
            </div>
            <div className="text-3xl font-bold text-card-foreground">
              {totals.sucesso}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 text-yellow-500 text-xs uppercase font-medium tracking-wider mb-2">
              <XCircle className="w-4 h-4" /> Sem WhatsApp
            </div>
            <div className="text-3xl font-bold text-card-foreground">
              {totals.semWhats}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 text-red-500 text-xs uppercase font-medium tracking-wider mb-2">
              <AlertCircle className="w-4 h-4" /> NPS &lt; 30
            </div>
            <div className="text-3xl font-bold text-card-foreground">
              {totals.menor30}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border shadow-sm">
        <CardContent className="pt-0 px-0">
          <div className="flex-1 space-y-6 p-4 pt-6 md:p-8 overflow-x-auto overflow-y-auto bg-background/50 h-full w-full custom-scrollbar">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="text-left py-4 px-6 font-semibold">
                    Data Envio
                  </th>
                  <th className="text-center py-4 px-4 font-semibold">
                    Processados
                  </th>
                  <th className="text-center py-4 px-4 font-semibold">
                    Enviados
                  </th>
                  <th className="text-center py-4 px-4 font-semibold">
                    Sem WhatsApp
                  </th>
                  <th className="text-center py-4 px-4 font-semibold">
                    NPS &lt; 30
                  </th>
                  <th className="text-left py-4 px-6 font-semibold">
                    Registrado em
                  </th>
                  <th className="text-center py-4 px-4 font-semibold w-20">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-16 text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        <RefreshCw className="w-6 h-6 animate-spin text-primary/50" />
                        <p>Carregando relatórios...</p>
                      </div>
                    </td>
                  </tr>
                ) : relatorios.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-20 text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center gap-3 opacity-80">
                        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center border border-border/50">
                          <FileText className="w-8 h-8 text-muted-foreground/60" />
                        </div>
                        <p className="text-base font-medium text-foreground">
                          Nenhum relatório encontrado
                        </p>
                        <p className="text-sm">
                          Tente ajustar os filtros de data para encontrar mais
                          resultados.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  relatorios.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-foreground">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-primary/10 rounded-md">
                            <Send className="w-3.5 h-3.5 text-primary" />
                          </div>
                          {formatDate(r.data_envio)}
                        </div>
                      </td>
                      <td className="text-center py-4 px-4 font-medium text-foreground">
                        {r.total_processado}
                      </td>
                      <td className="text-center py-4 px-4 text-green-500 font-medium">
                        {r.enviados_sucesso}
                      </td>
                      <td className="text-center py-4 px-4 text-yellow-500">
                        {r.sem_whatsapp}
                      </td>
                      <td className="text-center py-4 px-4 text-red-500">
                        {r.nps_menor_30}
                      </td>
                      <td className="py-4 px-6 text-muted-foreground text-xs">
                        {formatDateTime(r.created_at)}
                      </td>
                      <td className="text-center py-4 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
                          onClick={() => setSelected(r)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Relatório de {selected && formatDate(selected.data_envio)}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto rounded-md border border-border bg-white">
            {selected?.html_relatorio ? (
              <iframe
                title="Relatório HTML"
                srcDoc={selected.html_relatorio}
                className="w-full h-[70vh] border-0"
                sandbox="allow-same-origin"
              />
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                Sem conteúdo HTML disponível.
              </div>
            )}
          </div>
          {selected?.clientes_detalhes && (
            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                Ver detalhes textuais
              </summary>
              <pre className="mt-2 p-3 bg-secondary/50 rounded max-h-48 overflow-auto whitespace-pre-wrap">
                {selected.clientes_detalhes}
              </pre>
            </details>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
