import { createRoute, useNavigate } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useState, useEffect } from "react";
import { supabase } from "~/lib/supabase";
import { useAuth } from "~/lib/auth";
import { STATUS_LABEL, STATUS_COLOR, type CadastroStatus } from "~/lib/clientes";
import { getDocumentosStatusMap, DOC_STATUS_LABEL, DOC_STATUS_COLOR, type DocStatus } from "~/lib/documentos";
import { Loader2, ArrowLeft, CheckCircle, XCircle, Clock, ArrowRight, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export const relatoriosRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/relatorios",
  component: RelatoriosPage,
});

function RelatoriosPage() {
  const { user, permissoes } = useAuth();
  const navigate = useNavigate();
  const verTodos = permissoes?.ver_todos_cadastros === true;
  const [periodo, setPeriodo] = useState("30");
  const [filtroStatus, setFiltroStatus] = useState<CadastroStatus | "">("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [docsStatus, setDocsStatus] = useState<Record<string, DocStatus>>({});

  useEffect(() => { carregar(); }, [periodo]);

  async function carregar() {
    setLoading(true);
    try {
      const diasAtras = new Date();
      diasAtras.setDate(diasAtras.getDate() - Number(periodo));
      let query = supabase
        .from("cadastros")
        .select("*")
        .gte("created_at", diasAtras.toISOString())
      if (!verTodos && user?.id) {
        query = query.eq("created_by", user.id);
      }
      const { data: cadastros } = await query.order("created_at", { ascending: false });
      setData(cadastros || []);
      const items = cadastros || [];
      if (items.length > 0) {
        const status = await getDocumentosStatusMap(items.map((c: any) => ({ id: c.id, tipo_pessoa: c.tipo_pessoa })));
        setDocsStatus(status);
      }
    } catch {
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  const filtered = filtroStatus ? data.filter(c => c.status === filtroStatus) : data;

  const stats = {
    total: filtered.length,
    link_gerado: filtered.filter(c => c.status === "link_gerado").length,
    dados_enviados: filtered.filter(c => c.status === "dados_enviados").length,
    em_analise: filtered.filter(c => c.status === "em_analise").length,
    em_correcao: filtered.filter(c => c.status === "em_correcao").length,
    aprovados: filtered.filter(c => c.status === "aprovado").length,
    reprovados: filtered.filter(c => c.status === "reprovado").length,
  };

  return (
    <div className="flex flex-col gap-6 p-4 pb-24 lg:p-8 lg:pb-8">
      <div className="flex items-center gap-3">
        <button onClick={() => window.history.back()} className="text-text-muted hover:text-text-main"><ArrowLeft size={20} /></button>
        <h1 className="text-lg font-bold text-text-main">Relatórios</h1>
      </div>
      <p className="text-xs text-text-muted">Filtre e exporte dados do sistema</p>

      <div className="flex gap-2">
        <div className="flex-1">
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}
            className="w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]">
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
            <option value="365">Último ano</option>
          </select>
        </div>
        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value as CadastroStatus | "")}
          className="rounded-lg border border-input-border bg-input-bg px-3 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]">
          <option value="">Todos</option>
          <option value="link_gerado">Link Gerado</option>
          <option value="dados_enviados">Dados Enviados</option>
          <option value="em_analise">Em Análise</option>
          <option value="em_correcao">Em Correção</option>
          <option value="aprovado">Aprovado</option>
          <option value="reprovado">Reprovado</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 size={24} className="animate-spin text-accent" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <StatCard label="Total" value={stats.total} color="text-accent" />
            <StatCard label="Links" value={stats.link_gerado} color="text-blue-400" />
            <StatCard label="Enviados" value={stats.dados_enviados} color="text-cyan-400" />
            <StatCard label="Análise" value={stats.em_analise} color="text-yellow-400" />
            <StatCard label="Aprovados" value={stats.aprovados} color="text-green-400" />
            <StatCard label="Reprovados" value={stats.reprovados} color="text-red-400" />
          </div>

          {filtered.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-bold text-text-main">Cadastros Recentes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filtered.slice(0, 30).map((c: any) => (
                  <button key={c.id} onClick={() => navigate({ to: "/clientes/$id", params: { id: c.id } })}
                    className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-lg transition active:scale-[0.98] w-full text-left hover:ring-1 hover:ring-accent/30"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      {c.status === "aprovado" ? <CheckCircle size={16} className="text-green-400" /> :
                       c.status === "reprovado" ? <XCircle size={16} className="text-red-400" /> :
                       <AlertTriangle size={16} className="text-yellow-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-main truncate">{c.lead_nome || c.nome_temporario || "—"}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${STATUS_COLOR[c.status as CadastroStatus]}`}>{STATUS_LABEL[c.status as CadastroStatus]}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${DOC_STATUS_COLOR[docsStatus[c.id]]}`}>{DOC_STATUS_LABEL[docsStatus[c.id]]}</span>
                        {c.codigo_cliente && <span className="text-[10px] text-text-muted">#{c.codigo_cliente}</span>}
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-text-muted shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return <div className="flex flex-col gap-2 rounded-xl bg-card p-4 shadow-lg hover:-translate-y-1 transition-transform"><span className={`text-2xl font-bold ${color}`}>{value}</span><p className="text-xs text-text-muted font-medium uppercase tracking-wider">{label}</p></div>;
}
