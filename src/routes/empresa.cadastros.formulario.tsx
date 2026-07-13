import { createRoute, useNavigate } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useAuth } from "~/lib/auth";
import { FormBuilderTab } from "~/components/admin/FormBuilderTab";
import { useState, useEffect } from "react";
import { listarEmpresas, type Empresa } from "~/features/empresas";
import { ArrowLeft, FormInput, Building2, Loader2 } from "lucide-react";
import { RequirePermission } from "~/components/guards";

export const empresaCadastrosFormularioRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/cadastros/formulario",
  component: () => (
    <RequirePermission modulo="empresas-core">
      <AdminEmpresaCadastrosFormulario />
    </RequirePermission>
  ),
});

function AdminEmpresaCadastrosFormulario() {
  const { profile: authProfile } = useAuth();
  const isSuper = authProfile?.is_super_admin === true;
  const minhaEmpresaId = authProfile?.empresa_id as string | undefined;
  const navigate = useNavigate();

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaId, setEmpresaId] = useState(minhaEmpresaId || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSuper) {
      listarEmpresas().then((emps) => {
        setEmpresas(emps);
        setEmpresaId((prev) => prev || emps[0]?.id || "");
        setLoading(false);
      });
    } else {
      setEmpresaId(minhaEmpresaId || "");
      setLoading(false);
    }
  }, []);

  if (loading)
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 text-accent shrink-0">
              <FormInput size={20} />
            </span>
            <div>
              <div className="h-7 w-48 rounded-lg bg-surface animate-pulse" />
              <div className="h-4 w-32 rounded-lg bg-surface animate-pulse mt-2" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="h-12 rounded-xl bg-surface animate-pulse" />
          <div className="h-64 rounded-2xl bg-surface animate-pulse" />
        </div>
      </div>
    );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/empresa" })}
            className="flex items-center justify-center w-10 h-10 rounded-xl text-text-muted hover:text-text-main hover:bg-surface-hover hover:border-accent/30 border border-border transition-all duration-200 shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 text-accent shrink-0">
              <FormInput size={20} />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
                Formulário de Lead
              </h1>
              <p className="text-sm text-text-muted mt-0.5">
                Configure campos e documentos do formulário
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seletor de empresa (Super Admin) */}
      {isSuper && (
        <div className="rounded-xl bg-surface border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/10 shrink-0">
              <Building2 size={16} className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-text-muted mb-1.5">
                Empresa
              </p>
              <select
                value={empresaId}
                onChange={(e) => setEmpresaId(e.target.value)}
                className="w-full h-11 rounded-xl border border-border bg-input-bg px-4 text-sm text-text-main font-medium focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
              >
                <option value="">Selecione empresa</option>
                {empresas.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo */}
      {!empresaId ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4">
            <FormInput className="w-8 h-8 text-text-muted/30" />
          </div>
          <p className="text-lg font-semibold text-text-main mb-1">
            Nenhuma empresa selecionada
          </p>
          <p className="text-sm text-text-muted">
            Selecione uma empresa para configurar o formulário.
          </p>
        </div>
      ) : (
        <FormBuilderTab empresaId={empresaId} isSuper={isSuper} />
      )}
    </div>
  );
}
