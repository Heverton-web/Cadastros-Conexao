import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useState, useEffect } from "react";
import { listarCadastros, STATUS_LABEL, STATUS_COLOR, type Cadastro } from "~/features/clientes";
import { getDocumentosStatusMap, DOC_STATUS_LABEL, DOC_STATUS_COLOR, type DocStatus } from "~/features/documentos";
import { useAuth } from "~/lib/auth";
import { Link } from "@tanstack/react-router";
import { Loader2, CheckCircle, XCircle, Link2, Clock, AlertTriangle, HelpCircle } from "lucide-react";
import { TutoriaisPopup } from "~/components/ui/tutoriais-popup";

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
    }).catch(console.error).finally(() => setLoading(false));
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
    <div className="flex flex-col gap-6 p-4 pb-24 lg:p-8 lg:pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-text-main">Dashboard</h1>
          <p className="text-xs text-text-muted">Gerencie e aprove solicitações de cadastro de clientes</p>
        </div>
        <button onClick={() => setShowTutoriais(true)} className="flex items-center gap-1 rounded-lg bg-card px-3 py-2 text-xs text-text-muted hover:text-text-main transition">
          <HelpCircle size={14} className="text-accent" /> Tutoriais
        </button>
      </div>
      <TutoriaisPopup open={showTutoriais} onClose={() => setShowTutoriais(false)} />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Links" value={stats.link_gerado} icon={<Link2 size={16} />} color="text-blue-400" />
        <StatCard label="Enviados" value={stats.dados_enviados} icon={<Clock size={16} />} color="text-cyan-400" />
        <StatCard label="Análise" value={stats.em_analise} icon={<AlertTriangle size={16} />} color="text-yellow-400" />
        <StatCard label="Correção" value={stats.em_correcao} icon={<AlertTriangle size={16} />} color="text-orange-400" />
        <StatCard label="Aprovados" value={stats.aprovados} icon={<CheckCircle size={16} />} color="text-green-400" />
        <StatCard label="Reprovados" value={stats.reprovados} icon={<XCircle size={16} />} color="text-red-400" />
      </div>



      <div>
        <h2 className="mb-3 text-sm font-bold text-text-main">Solicitações Recentes</h2>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-accent" /></div>
        ) : recentes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-input-border bg-input-bg/20">
            <CheckCircle size={40} className="text-text-muted/30 mb-3" />
            <p className="text-sm font-medium text-text-muted">Tudo limpo por aqui!</p>
            <p className="text-xs text-text-muted mt-1">Nenhuma solicitação recente encontrada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentes.map((c) => (
              <Link key={c.id} to="/clientes/$id" params={{ id: c.id }}
                className="flex items-center justify-between rounded-xl bg-card p-3 shadow-lg transition active:scale-[0.98]"
              >
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <span className="text-sm font-medium text-text-main truncate">{c.lead_nome || c.nome_temporario || "Sem nome"}</span>
                  <span className="text-[10px] text-text-muted">{c.profiles?.nome ? `Por: ${c.profiles.nome}` : ""}</span>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${STATUS_COLOR[c.status]}`}>{STATUS_LABEL[c.status]}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${DOC_STATUS_COLOR[docsStatus[c.id]]}`}>{DOC_STATUS_LABEL[docsStatus[c.id]]}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-card p-4 shadow-lg hover:-translate-y-1 transition-transform">
      <div className={`flex items-center gap-2 ${color}`}>{icon}<span className="text-2xl font-bold">{value}</span></div>
      <span className="text-xs text-text-muted font-medium uppercase tracking-wider">{label}</span>
    </div>
  );
}
