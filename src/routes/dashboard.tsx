import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useState, useEffect } from "react";
import {
  listarCadastros,
  STATUS_LABEL,
  STATUS_COLOR,
  type Cadastro,
} from "~/features/clientes";
import {
  getDocumentosStatusMap,
  DOC_STATUS_LABEL,
  DOC_STATUS_COLOR,
  type DocStatus,
} from "~/features/documentos";
import { useAuth } from "~/lib/auth";
import { Link } from "@tanstack/react-router";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Link2,
  Clock,
  AlertTriangle,
  HelpCircle,
  Users,
  ArrowUpRight,
  BarChart3,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { TutoriaisPopup } from "~/components/ui/tutoriais-popup";
import { Skeleton } from "~/components/ui/skeleton";
import { EmptyState } from "~/components/ui/empty-state";
import toast from "react-hot-toast";

export const dashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/dashboard",
  component: DashboardPage,
});

function DashboardPage() {
  const { profile } = useAuth();
  const [data, setData] = useState<
    (Cadastro & { profiles: { nome: string } | null })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showTutoriais, setShowTutoriais] = useState(false);
  const [docsStatus, setDocsStatus] = useState<Record<string, DocStatus>>({});

  useEffect(() => {
    listarCadastros()
      .then(async (res) => {
        setData(res);
        const status = await getDocumentosStatusMap(
          res.map((c: any) => ({ id: c.id, tipo_pessoa: c.tipo_pessoa })),
        );
        setDocsStatus(status);
      })
      .catch(() => {
        toast.error("Erro ao carregar dados do dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: data.length,
    link_gerado: data.filter((c) => c.status === "link_gerado").length,
    dados_enviados: data.filter((c) => c.status === "dados_enviados").length,
    em_analise: data.filter((c) => c.status === "em_analise").length,
    em_correcao: data.filter((c) => c.status === "em_correcao").length,
    aprovados: data.filter((c) => c.status === "aprovado").length,
    reprovados: data.filter((c) => c.status === "reprovado").length,
  };

  const taxaAprovacao =
    stats.total > 0 ? Math.round((stats.aprovados / stats.total) * 100) : 0;
  const pendentes = stats.em_analise + stats.dados_enviados + stats.em_correcao;
  const recentes = data.slice(0, 9);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            Olá, {profile?.nome?.split(" ")[0] || "Usuário"}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Aqui está o resumo das suas solicitações de cadastro
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTutoriais(true)}
            className="flex items-center gap-2 rounded-xl bg-surface border border-border px-4 py-2.5 text-sm text-text-muted hover:text-text-main hover:border-accent/30 transition-all duration-200 min-h-[44px]"
          >
            <HelpCircle size={16} className="text-accent" />
            <span>Tutoriais</span>
          </button>
          <Link
            to="/clientes"
            className="flex items-center gap-2 rounded-xl bg-accent text-accent-fg px-4 py-2.5 text-sm font-semibold hover:bg-accent-hover transition-all duration-200 min-h-[44px] shadow-lg shadow-accent/20"
          >
            <UserPlus size={16} />
            <span>Novo Cliente</span>
          </Link>
        </div>
      </div>
      <TutoriaisPopup
        open={showTutoriais}
        onClose={() => setShowTutoriais(false)}
      />

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
            <p className="text-4xl font-bold text-text-main mt-2">
              {stats.total}
            </p>
            <p className="text-xs text-text-muted mt-2">Clientes cadastrados</p>
          </div>

          {/* Pendentes */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500/20 via-yellow-500/10 to-transparent border border-yellow-500/20 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 hover:border-yellow-500/40">
            <div className="absolute top-4 right-4 flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/15 text-yellow-400 group-hover:scale-110 transition-transform duration-300">
              <Clock size={22} />
            </div>
            <p className="text-xs font-semibold text-yellow-400/80 uppercase tracking-wider">
              Pendentes
            </p>
            <p className="text-4xl font-bold text-text-main mt-2">
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
            <p className="text-4xl font-bold text-text-main mt-2">
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
            <p className="text-4xl font-bold text-text-main mt-2">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
            <div
              key={item.label}
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
            </div>
          ))}
        </div>
      )}

      {/* Solicitações Recentes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-main">
            Solicitações Recentes
          </h2>
          <Link
            to="/clientes"
            className="flex items-center gap-1 text-sm text-accent hover:text-accent-hover transition-colors font-medium"
          >
            Ver todas <ArrowUpRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : recentes.length === 0 ? (
          <EmptyState
            icon={<BarChart3 className="w-10 h-10 text-text-muted/30" />}
            title="Nenhuma solicitação recente"
            description="Quando novos cadastros forem criados, eles aparecerão aqui."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentes.map((c, i) => (
              <Link
                key={c.id}
                to="/clientes/$id"
                params={{ id: c.id }}
                className="group flex items-center gap-4 rounded-xl bg-surface border border-border p-4 transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5"
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
                  <div className="flex items-center gap-2 mt-1">
                    {c.profiles?.nome && (
                      <span className="text-xs text-text-muted">
                        Por: {c.profiles.nome}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLOR[c.status]}`}
                  >
                    {STATUS_LABEL[c.status]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
