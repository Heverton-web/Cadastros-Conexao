import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "~/core/auth";
import { buscarTemaConfig, salvarTemaConfig } from "~/features/linktree/index";
import { LinktreeThemeEditor } from "./LinktreeThemeEditor";
import { normalizeLinktreeTheme, type LinktreeThemeConfig } from "~/features/linktree/types";

export function LinktreeTemaPage() {
  const { profile, permissoes } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<LinktreeThemeConfig>(normalizeLinktreeTheme(null));
  const [loading, setLoading] = useState(true);

  const can = (key: string) => permissoes?.[key] === true;

  useEffect(() => {
    if (!permissoes && !profile?.is_super_admin) return;
    if (!profile?.is_super_admin && !can("lt_gerenciar_tema")) {
      toast.error("Voce nao tem permissao para gerenciar o tema");
      navigate({ to: "/linktree/dashboard", replace: true });
    }
  }, [permissoes, profile, navigate]);

  useEffect(() => {
    if (!profile) return;
    buscarTemaConfig(profile.empresa_id ?? undefined)
      .then(setTheme)
      .catch(() => toast.error("Erro ao carregar tema"))
      .finally(() => setLoading(false));
  }, [profile]);

  async function handleSave(t: LinktreeThemeConfig) {
    await salvarTemaConfig(profile?.empresa_id ?? null, t);
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

  return <LinktreeThemeEditor initialTheme={theme} onSave={handleSave} />;
}
