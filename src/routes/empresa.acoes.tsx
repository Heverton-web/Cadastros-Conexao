import { createRoute, useNavigate } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { CentralAcoesTab } from "~/components/admin/CentralAcoesTab";
import { Webhook as WebhookIcon, ArrowLeft, Building2, Loader2 } from "lucide-react";
import { useAuth } from "~/lib/auth";
import { useState, useEffect } from "react";
import { listarEmpresas, type Empresa } from "~/lib/empresas";

export const adminEmpresaConfigAcoesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/acoes",
  component: EmpresaAcoesPage,
});

function EmpresaAcoesPage() {
  const { profile: authProfile } = useAuth();
  const isSuper = authProfile?.is_super_admin === true;
  const minhaEmpresaId = authProfile?.empresa_id as string | undefined;
  const navigate = useNavigate();

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaId, setEmpresaId] = useState(minhaEmpresaId || "");
  const [loading, setLoading] = useState(isSuper);

  useEffect(() => {
    if (isSuper) {
      listarEmpresas().then((emps) => {
        setEmpresas(emps);
        const eid = empresaId || emps[0]?.id || "";
        setEmpresaId(eid);
        setLoading(false);
      });
    } else if (minhaEmpresaId) {
      setEmpresaId(minhaEmpresaId);
    }
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-accent" /></div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-28">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => navigate({ to: "/empresa" })} className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
          <WebhookIcon size={20} className="text-accent" />
          <h1 className="text-lg font-bold text-text-main">Central de Ações</h1>
        </div>
      </div>

      <p className="text-xs text-text-muted max-w-3xl mb-4">
        Configure automações, chamadas de API (Webhooks) e defina quais notificações internas devem ser disparadas para os eventos e botões disponíveis.
        Estas regras se aplicam <strong>apenas à empresa selecionada</strong>.
      </p>



      {isSuper && (
        <div className="mb-4 p-3 rounded-lg bg-card border border-border-subtle">
          <div className="flex items-center gap-2">
            <Building2 size={14} className="text-text-muted shrink-0" />
            <select value={empresaId} onChange={(e) => setEmpresaId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-input-bg border border-input-border text-text-main text-sm">
              <option value="">Selecione uma empresa</option>
              {empresas.map((emp) => <option key={emp.id} value={emp.id}>{emp.nome}</option>)}
            </select>
          </div>
        </div>
      )}

      {empresaId ? (
        <CentralAcoesTab empresaId={empresaId} />
      ) : (
        <p className="text-center text-sm text-text-muted py-8">Selecione uma empresa.</p>
      )}
    </div>
  );
}
