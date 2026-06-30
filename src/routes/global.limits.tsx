import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useAuth } from "~/lib/auth";
import { supabase } from "~/core/supabase";
import { getAllModules } from "~/registry";
import { useState, useEffect, useMemo } from "react";
import {
  Shield,
  Save,
  Loader2,
  Building2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "~/lib/utils";

export const globalLimitsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/global/limits",
  component: GlobalLimitsPage,
});

type EmpresaModuloLimit = {
  id: string;
  empresa_id: string;
  modulo_key: string;
  max_credenciais: number;
};

type Empresa = {
  id: string;
  nome: string;
};

function GlobalLimitsPage() {
  const { profile } = useAuth();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [limits, setLimits] = useState<EmpresaModuloLimit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedEmpresa, setExpandedEmpresa] = useState<string | null>(null);

  const modulos = useMemo(() => getAllModules(), []);

  useEffect(() => {
    if (profile?.is_super_admin) carregarDados();
  }, [profile]);

  async function carregarDados() {
    setLoading(true);
    try {
      const [empresasRes, limitsRes] = await Promise.all([
        supabase.from("empresas").select("id, nome").order("nome"),
        supabase.from("empresa_modulo_limits").select("*"),
      ]);

      if (empresasRes.data) setEmpresas(empresasRes.data);
      if (limitsRes.data) setLimits(limitsRes.data);

      if (empresasRes.data?.length && !expandedEmpresa) {
        setExpandedEmpresa(empresasRes.data[0].id);
      }
    } catch (e: any) {
      toast.error("Erro ao carregar dados: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  function getLimit(empresaId: string, moduloKey: string): number {
    const found = limits.find(
      (l) => l.empresa_id === empresaId && l.modulo_key === moduloKey,
    );
    return found?.max_credenciais ?? 0;
  }

  function setLimitLocal(empresaId: string, moduloKey: string, value: number) {
    setLimits((prev) => {
      const existing = prev.find(
        (l) => l.empresa_id === empresaId && l.modulo_key === moduloKey,
      );
      if (existing) {
        return prev.map((l) =>
          l.empresa_id === empresaId && l.modulo_key === moduloKey
            ? { ...l, max_credenciais: value }
            : l,
        );
      } else {
        return [
          ...prev,
          {
            id: "",
            empresa_id: empresaId,
            modulo_key: moduloKey,
            max_credenciais: value,
          },
        ];
      }
    });
  }

  async function handleSaveAll() {
    setSaving(true);
    try {
      const toUpsert = limits
        .filter((l) => l.max_credenciais > 0)
        .map((l) => ({
          empresa_id: l.empresa_id,
          modulo_key: l.modulo_key,
          max_credenciais: l.max_credenciais,
        }));

      const toDelete = limits
        .filter((l) => l.max_credenciais === 0 && l.id)
        .map((l) => l.id);

      if (toDelete.length > 0) {
        await supabase
          .from("empresa_modulo_limits")
          .delete()
          .in("id", toDelete);
      }

      if (toUpsert.length > 0) {
        const { error } = await supabase
          .from("empresa_modulo_limits")
          .upsert(toUpsert, {
            onConflict: "empresa_id,modulo_key",
            ignoreDuplicates: false,
          });
        if (error) throw error;
      }

      toast.success("Limites salvos com sucesso!");
      carregarDados();
    } catch (e: any) {
      toast.error("Erro ao salvar: " + (e.message || "desconhecido"));
    } finally {
      setSaving(false);
    }
  }

  if (!profile?.is_super_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted">Acesso restrito a Super Admin.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
              <Shield size={24} className="text-accent" />
              Limites de Credenciais por Módulo
            </h1>
            <p className="text-sm text-text-muted">
              Defina quantas credenciais cada empresa pode ter com acesso a cada
              módulo
            </p>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-fg text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Salvar
          </button>
        </div>

        {/* Info */}
        <div className="rounded-xl bg-card border border-border-subtle p-4">
          <p className="text-xs text-text-muted leading-relaxed">
            <strong className="text-text-main">Como funciona:</strong> O limite
            define quantas credenciais <em>ativas</em> cada empresa pode ter com
            acesso a cada módulo. Se o limite for <strong>0</strong>, significa{" "}
            <strong>ilimitado</strong>. Quando a empresa atingir o limite, o
            administrador não poderá dar acesso a novas credenciais naquele
            módulo.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-accent" />
          </div>
        ) : (
          <div className="space-y-3">
            {empresas.map((empresa) => {
              const isOpen = expandedEmpresa === empresa.id;
              const modulosComLimite = modulos.filter(
                (m) => getLimit(empresa.id, m.key) > 0,
              ).length;
              return (
                <div
                  key={empresa.id}
                  className="rounded-xl bg-card border border-border-subtle overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedEmpresa(isOpen ? null : empresa.id)
                    }
                    className="w-full flex items-center justify-between p-4 hover:bg-surface-hover transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <Building2 size={16} className="text-accent" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-text-main block">
                          {empresa.nome}
                        </span>
                        <span className="text-xs text-text-muted">
                          {modulosComLimite} módulo(s) com limite definido
                        </span>
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronDown size={16} className="text-text-muted" />
                    ) : (
                      <ChevronRight size={16} className="text-text-muted" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-2 border-t border-border-subtle/50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {modulos.map((mod) => {
                          const current = getLimit(empresa.id, mod.key);
                          const Icon = mod.icon;
                          return (
                            <div
                              key={mod.key}
                              className={cn(
                                "rounded-lg p-3 border transition-colors",
                                current > 0
                                  ? "bg-accent/5 border-accent/20"
                                  : "bg-input-bg border-border-subtle/50",
                              )}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div
                                  className={cn(
                                    "p-1 rounded",
                                    current > 0
                                      ? "bg-accent/10 text-accent"
                                      : "bg-bg-dark text-text-muted",
                                  )}
                                >
                                  <Icon size={12} />
                                </div>
                                <label className="text-xs font-bold text-text-muted uppercase tracking-wider truncate">
                                  {mod.nome}
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  value={current}
                                  onChange={(e) =>
                                    setLimitLocal(
                                      empresa.id,
                                      mod.key,
                                      Math.max(
                                        0,
                                        parseInt(e.target.value) || 0,
                                      ),
                                    )
                                  }
                                  className="w-full rounded-md border border-input-border bg-input-bg px-3 py-1.5 text-sm text-text-main outline-none focus:border-accent text-center"
                                />
                                <span className="text-xs text-text-muted whitespace-nowrap">
                                  {current === 0
                                    ? "Ilimitado"
                                    : `máx ${current}`}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {empresas.length === 0 && (
              <div className="text-center py-12 text-text-muted text-sm">
                Nenhuma empresa cadastrada.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
