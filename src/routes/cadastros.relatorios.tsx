import { createRoute, useNavigate } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useState, useEffect } from "react";
import { supabase } from "~/lib/supabase";
import { useAuth } from "~/lib/auth";
import {
  STATUS_LABEL,
  STATUS_COLOR,
  type CadastroStatus,
} from "~/features/clientes";
import {
  getDocumentosStatusMap,
  DOC_STATUS_LABEL,
  DOC_STATUS_COLOR,
  type DocStatus,
} from "~/features/documentos";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Link2,
  Users,
  TrendingUp,
  ArrowUpRight,
  BarChart3,
} from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { EmptyState } from "~/components/ui/empty-state";
import toast from "react-hot-toast";

export const relatoriosRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/cadastros/relatorios",
  component: RelatoriosPage,
});

function RelatoriosPage() {
  const { user, profile, permissoes } = useAuth();
  const navigate = useNavigate();
  const verTodos = permissoes?.ver_todos_cadastros === true;
  const [periodo, setPeriodo] = useState("30");
  const [filtroStatus, setFiltroStatus] = useState<CadastroStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [docsStatus, setDocsStatus] = useState<Record<string, DocStatus>>({});

  useEffect(() => {
    carregar();
  }, [periodo]);

  async function carregar() {
    setLoading(true);
    try {
      const diasAtras = new Date();
      diasAtras.setDate(diasAtras.getDate() - Number(periodo));
      let query = supabase
        .from("cadastros")
        .select("*")
        .gte("created_at", diasAtras.toISOString());
      if (!verTodos && user?.id) {
        query = query.eq("created_by", user.id);
      }
      const { data: cadastros } = await query.order("created_at", {
        ascending: false,
      });
      setData(cadastros || []);
      const items = cadastros || [];
      if (items.length > 0) {
        const status = await getDocumentosStatusMap(
          items.map((c: any) => ({ id: c.id, tipo_pessoa: c.tipo_pessoa })),
        );
        setDocsStatus(status);
      }
    } catch {
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  const filtered = filtroStatus
    ? data.filter((c) => c.status === filtroStatus)
    : data;

  const stats = {
    total: filtered.length,
    link_gerado: filtered.filter((c) => c.status === "link_gerado").length,
    dados_enviados: filtered.filter((c) => c.status === "dados_enviados")
      .length,
    em_analise: filtered.filter((c) => c.status === "em_analise").length,
    em_correcao: filtered.filter((c) => c.status === "em_correcao").length,
    aprovados: filtered.filter((c) => c.status === "aprovado").length,
    reprovados: filtered.filter((c) => c.status === "reprovado").length,
  };

  const taxaAprovacao =
    stats.total > 0 ? Math.round((stats.aprovados / stats.total) * 100) : 0;
  const pendentes = stats.em_analise + stats.dados_enviados + stats.em_correcao;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            Relatórios
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Filtre e exporte dados do sistema
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className="w-full sm:w-48 h-12 rounded-xl border border-border bg-input-bg px-4 text-sm text-text-main font-medium focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
        >
          <option value="7">Últimos 7 dias</option>
          <option value="30">Últimos 30 dias</option>
          <option value="90">Últimos 90 dias</option>
          <option value="365">Último ano</option>
        </select>
        <select
          value={filtroStatus}
          onChange={(e) =>
            setFiltroStatus(e.target.value as CadastroStatus | "")
          }
          className="w-full sm:w-48 h-12 rounded-xl border border-border bg-input-bg px-4 text-sm text-text-main font-medium focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
        >
          <option value="">Todos os status</option>
          <option value="link_gerado">Link Gerado</option>
          <option value="dados_enviados">Dados Enviados</option>
          <option value="em_analise">Em Análise</option>
          <option value="em_correcao">Em Correção</option>
          <option value="aprovado">Aprovado</option>
          <option value="reprovado">Reprovado</option>
        </select>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border border-accent/20 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:border-accent/40">
            <div className="absolute top-4 right-4 flex items-center justify-center w-12 h-12 rounded-xl bg-accent/15 text-accent group-hover:scale-110 transition-transform duration-300">
              <Users size={22} />
            </div>
            <p className="text-xs font-semibold text-accent/80 uppercase tracking-wider">
              Total
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-text-main mt-2">
              {stats.total}
            </p>
            <p className="text-xs text-text-muted mt-2">Cadastros no período</p>
          </div>

          {/* Pendentes */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500/20 via-yellow-500/10 to-transparent border border-yellow-500/20 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 hover:border-yellow-500/40">
            <div className="absolute top-4 right-4 flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/15 text-yellow-400 group-hover:scale-110 transition-transform duration-300">
              <Clock size={22} />
            </div>
            <p className="text-xs font-semibold text-yellow-400/80 uppercase tracking-wider">
              Pendentes
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-text-main mt-2">
              {pendentes}
            </p>
            <p className="text-xs text-text-muted mt-2">Aguardando ação</p>
          </div>

          {/* Aprovados */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent border border-green-500/20 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 hover:border-green-500/40">
            <div className="absolute top-4 right-4 flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/15 text-green-400 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle size={22} />
            </div>
            <p className="text-xs font-semibold text-green-400/80 uppercase tracking-wider">
              Aprovados
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-text-main mt-2">
              {stats.aprovados}
            </p>
            <p className="text-xs text-text-muted mt-2">Cadastros ativos</p>
          </div>

          {/* Taxa de Aprovação */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent border border-blue-500/20 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/40">
            <div className="absolute top-4 right-4 flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/15 text-blue-400 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp size={22} />
            </div>
            <p className="text-xs font-semibold text-blue-400/80 uppercase tracking-wider">
              Taxa Aprovação
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-text-main mt-2">
              {taxaAprovacao}%
            </p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-blue-500/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000"
                style={{ width: `${taxaAprovacao}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Status Breakdown */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {[
            {
              label: "Links",
              value: stats.link_gerado,
              icon: Link2,
              color: "text-blue-400",
              bg: "bg-blue-500/10",
              border: "border-blue-500/20",
            },
            {
              label: "Enviados",
              value: stats.dados_enviados,
              icon: Clock,
              color: "text-cyan-400",
              bg: "bg-cyan-500/10",
              border: "border-cyan-500/20",
            },
            {
              label: "Análise",
              value: stats.em_analise,
              icon: AlertTriangle,
              color: "text-yellow-400",
              bg: "bg-yellow-500/10",
              border: "border-yellow-500/20",
            },
            {
              label: "Correção",
              value: stats.em_correcao,
              icon: AlertTriangle,
              color: "text-orange-400",
              bg: "bg-orange-500/10",
              border: "border-orange-500/20",
            },
            {
              label: "Aprovados",
              value: stats.aprovados,
              icon: CheckCircle,
              color: "text-green-400",
              bg: "bg-green-500/10",
              border: "border-green-500/20",
            },
            {
              label: "Reprovados",
              value: stats.reprovados,
              icon: XCircle,
              color: "text-red-400",
              bg: "bg-red-500/10",
              border: "border-red-500/20",
            },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() =>
                setFiltroStatus(
                  filtroStatus === "" ? "" : filtroStatus,
                )
              }
              className={`flex items-center gap-3 rounded-xl ${item.bg} border ${item.border} p-3 transition-all duration-200 hover:scale-[1.02]`}
            >
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-lg ${item.bg}`}
              >
                <item.icon size={16} className={item.color} />
              </div>
              <div>
                <p className={`text-lg font-bold ${item.color}`}>
                  {item.value}
                </p>
                <p className="text-[11px] text-text-muted font-medium">
                  {item.label}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Cadastros Recentes */}
      {!loading && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-main">
              Cadastros Recentes
            </h2>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<BarChart3 className="w-10 h-10 text-text-muted/30" />}
              title="Nenhum cadastro encontrado"
              description="Ajuste os filtros ou aguarde novos cadastros."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.slice(0, 30).map((c: any, i: number) => (
                <button
                  key={c.id}
                  onClick={() =>
                    navigate({
                      to: "/cadastros/solicitacoes/$id",
                      params: { id: c.id },
                    })
                  }
                  className="group flex items-center gap-4 rounded-xl bg-surface border border-border p-4 transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5 w-full text-left"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {/* Avatar */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent font-bold text-sm shrink-0 group-hover:bg-accent/20 transition-colors">
                    {(c.lead_nome || c.nome_temporario || "S")[0].toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-main truncate group-hover:text-accent transition-colors">
                      {c.lead_nome || c.nome_temporario || "Sem nome"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[c.status as CadastroStatus]}`}
                      >
                        {STATUS_LABEL[c.status as CadastroStatus]}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${DOC_STATUS_COLOR[docsStatus[c.id]]}`}
                      >
                        {DOC_STATUS_LABEL[docsStatus[c.id]]}
                      </span>
                      {c.codigo_cliente && (
                        <span className="text-xs text-text-muted">
                          #{c.codigo_cliente}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status icon */}
                  <div className="flex shrink-0">
                    {c.status === "aprovado" ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : c.status === "reprovado" ? (
                      <XCircle size={16} className="text-red-400" />
                    ) : c.status === "em_correcao" ? (
                      <AlertTriangle size={16} className="text-orange-400" />
                    ) : (
                      <Clock size={16} className="text-yellow-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
