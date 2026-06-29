import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useState, useEffect } from "react";
import { listarCadastros, STATUS_LABEL, STATUS_COLOR, type Cadastro } from "~/features/clientes";
import { getDocumentosStatusMap, DOC_STATUS_LABEL, DOC_STATUS_COLOR, type DocStatus } from "~/features/documentos";
import { useAuth } from "~/lib/auth";
import { Link } from "@tanstack/react-router";
import { Loader2, CheckCircle, XCircle, Link2, Clock, AlertTriangle, HelpCircle, Users, TrendingUp } from "lucide-react";
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
  const [data, setData] = useState<(Cadastro & { profiles: { nome: string } | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTutoriais, setShowTutoriais] = useState(false);
  const [docsStatus, setDocsStatus] = useState<Record<string, DocStatus>>({});

  useEffect(() => {
    listarCadastros().then(async (res) => {
      setData(res);
      const status = await getDocumentosStatusMap(res.map((c: any) => ({ id: c.id, tipo_pessoa: c.tipo_pessoa })));
      setDocsStatus(status);
    }).catch(() => {
      toast.error("Erro ao carregar dados do dashboard");
    }).finally(() => setLoading(false));
  }, []);

  const stats = {
    total: data.length,
    link_gerado: data.filter(c => c.status === "link_gerado").length,
    dados_enviados: data.filter(c => c.status === "dados_enviados").length,
    em_analise: data.filter(c => c.status === "em_analise").length,
    em_correcao: data.filter(c => c.status === "em_correcao").length,
    aprovados: data.filter(c => c.status === "aprovado").length,
    reprovados: data.filter(c => c.status === "reprovado").length,
  };

  const recentes = data.slice(0, 10);

  return (
    <div className="flex flex-col gap-6 p-4 pb-24 lg:p-8 lg:pb-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-main">Dashboard</h1>
          <p className="text-sm text-text-muted">Gerencie e aprove solicitações de cadastro</p>
        </div>
        <button
          onClick={() => setShowTutoriais(true)}
          className="flex items-center gap-1.5 rounded-lg bg-card border border-border px-3 py-2 text-xs text-text-muted hover:text-text-main hover:border-hover-border transition-all duration-150 min-h-[44px]"
        >
          <HelpCircle size={14} className="text-accent" /> Tutoriais
        </button>
      </div>
      <TutoriaisPopup open={showTutoriais} onClose={() => setShowTutoriais(false)} />

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="Total" value={stats.total} icon={<Users size={16} />} color="text-accent" bgColor="bg-accent/10" />
          <StatCard label="Links" value={stats.link_gerado} icon={<Link2 size={16} />} color="text-blue-400" bgColor="bg-blue-400/10" />
          <StatCard label="Enviados" value={stats.dados_enviados} icon={<Clock size={16} />} color="text-cyan-400" bgColor="bg-cyan-400/10" />
          <StatCard label="Análise" value={stats.em_analise} icon={<AlertTriangle size={16} />} color="text-yellow-400" bgColor="bg-yellow-400/10" />
          <StatCard label="Correção" value={stats.em_correcao} icon={<AlertTriangle size={16} />} color="text-orange-400" bgColor="bg-orange-400/10" />
          <StatCard label="Aprovados" value={stats.aprovados} icon={<CheckCircle size={16} />} color="text-green-400" bgColor="bg-green-400/10" />
        </div>
      )}

      {/* Solicitações Recentes */}
      <div>
        <h2 className="mb-3 text-sm font-bold text-text-main">Solicitações Recentes</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : recentes.length === 0 ? (
          <EmptyState
            icon={<CheckCircle className="w-8 h-8 text-success/50" />}
            title="Tudo limpo por aqui!"
            description="Nenhuma solicitação recente encontrada."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentes.map((c) => (
              <Link key={c.id} to="/clientes/$id" params={{ id: c.id }}
                className="flex items-center justify-between rounded-xl bg-card border border-border p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-hover-border hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <span className="text-sm font-medium text-text-main truncate">{c.lead_nome || c.nome_temporario || "Sem nome"}</span>
                  {c.profiles?.nome && (
                    <span className="text-xs text-text-muted">Por: {c.profiles.nome}</span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOR[c.status]}`}>{STATUS_LABEL[c.status]}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${DOC_STATUS_COLOR[docsStatus[c.id]]}`}>{DOC_STATUS_LABEL[docsStatus[c.id]]}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, bgColor }: { label: string; value: number; icon: React.ReactNode; color: string; bgColor: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-card border border-border p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-hover-border hover:-translate-y-0.5">
      <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${bgColor}`}>
        <span className={color}>{icon}</span>
      </div>
      <div>
        <span className="text-2xl font-bold text-text-main">{value}</span>
        <p className="text-xs text-text-muted font-medium uppercase tracking-wider mt-0.5">{label}</p>
      </div>
    </div>
  );
}
