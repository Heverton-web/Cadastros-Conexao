import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "~/core/auth";
import { supabase } from "~/core/supabase";
import { buscarTemaConfig, salvarTemaConfig } from "~/features/linktree/index";
import { LinktreeThemeEditor } from "./LinktreeThemeEditor";
import {
  normalizeLinktreeTheme,
  type LinktreeThemeConfig,
} from "~/features/linktree/types";

export function LinktreeTemaPage() {
  const { profile, permissoes } = useAuth();
  const navigate = useNavigate();
  const isSuper = profile?.is_super_admin === true;

  const [theme, setTheme] = useState<LinktreeThemeConfig>(
    normalizeLinktreeTheme(null),
  );
  const [loading, setLoading] = useState(true);
  const [empresas, setEmpresas] = useState<{ id: string; nome: string }[]>([]);
  const [filtroEmpresa, setFiltroEmpresa] = useState<string>(
    profile?.empresa_id ?? "",
  );

  const can = (key: string) => isSuper || permissoes?.[key] === true;

  useEffect(() => {
    if (!permissoes && !isSuper) return;
    if (!isSuper && !can("lt_gerenciar_tema")) {
      toast.error("Voce nao tem permissao para gerenciar o tema");
      navigate({ to: "/linktree/dashboard", replace: true });
    }
  }, [permissoes, isSuper, navigate]);

  useEffect(() => {
    if (!isSuper) return;
    supabase
      .from("empresas")
      .select("id, nome")
      .order("nome")
      .then(({ data }) => {
        setEmpresas(data ?? []);
      });
  }, [isSuper]);

  useEffect(() => {
    if (!isSuper) setFiltroEmpresa(profile?.empresa_id ?? "");
  }, [isSuper, profile]);

  useEffect(() => {
    setLoading(true);
    const empresaId = isSuper
      ? filtroEmpresa || undefined
      : (profile?.empresa_id ?? undefined);
    buscarTemaConfig(empresaId)
      .then(setTheme)
      .catch(() => toast.error("Erro ao carregar tema"))
      .finally(() => setLoading(false));
  }, [filtroEmpresa, profile, isSuper]);

  async function handleSave(t: LinktreeThemeConfig) {
    const empresaId = isSuper
      ? filtroEmpresa || null
      : (profile?.empresa_id ?? null);
    await salvarTemaConfig(empresaId, t);
    setTheme(t);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Carregando...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isSuper && empresas.length > 0 && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-muted-foreground">
            Tema da empresa:
          </label>
          <select
            value={filtroEmpresa}
            onChange={(e) => setFiltroEmpresa(e.target.value)}
            className="h-9 w-full max-w-xs rounded-md border border-border/70 bg-surface/60 px-3 text-sm"
          >
            <option value="">Global (padrao)</option>
            {empresas.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </select>
        </div>
      )}
      <LinktreeThemeEditor initialTheme={theme} onSave={handleSave} />
    </div>
  );
}
