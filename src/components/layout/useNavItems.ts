import { Building2, Puzzle, KeyRound, Globe, Database, Cable, FlaskConical, Palette, Image, Shield, Beaker, type LucideIcon } from "lucide-react";
import { useAuth } from "~/lib/auth";
import { getNavItems, getAllModules } from "~/registry";
import { useMemo } from "react";

export type NavItem = {
  path: string;
  label: string;
  icon: LucideIcon;
  matchPaths?: string[];
  noChildMatch?: boolean;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

export function useNavItems(selectedModuleKey?: string): NavSection[] {
  const { profile, permissoes, modulosAcesso, modulosAtivos } = useAuth();
  const p = permissoes;

  // Obter chaves de módulos que o usuário de fato tem acesso
  const modulosAcessiveis = useMemo(() => {
    if (profile?.is_super_admin) {
      return getAllModules().map((m) => m.key);
    }
    const ativos = modulosAtivos || [];
    const isCompanyAdmin = profile?.role === "admin";
    return getAllModules()
      .filter((m) => {
        if (m.key === "empresas-core") {
          return isCompanyAdmin || modulosAcesso?.[m.key]?.acessar === true;
        }
        return ativos.includes(m.key) && modulosAcesso?.[m.key]?.acessar === true;
      })
      .map((m) => m.key);
  }, [profile, modulosAtivos, modulosAcesso]);

  return useMemo(() => {
    const sections: NavSection[] = [];

    // Fallback: se não for super admin e não houver modulo selecionado, usa o primeiro módulo que ele tem acesso
    let moduloKey = selectedModuleKey;
    if (!profile?.is_super_admin && !moduloKey && modulosAcessiveis.length > 0) {
      moduloKey = modulosAcessiveis[0];
    }

    let registryItems = getNavItems(p as Record<string, boolean> | null, moduloKey);

    const isSuper = profile?.is_super_admin === true;
    const isCompanyAdmin = !isSuper && profile?.role === "admin" && !!profile?.empresa_id;

    // Filtrar as abas/páginas com base no modulosAcesso do usuário (se não for Super Admin)
    if (!isSuper && moduloKey) {
      if (moduloKey === "empresas-core" && isCompanyAdmin) {
        // não filtra empresas-core para admin da empresa
      } else {
        const paginasPermitidas = modulosAcesso?.[moduloKey]?.paginas ?? [];
        registryItems = registryItems.filter((item) => paginasPermitidas.includes(item.id));
      }
    }

    const regNav: NavItem[] = registryItems.map((ri) => ({
      path: ri.to,
      label: ri.label,
      icon: ri.icon,
      ...(ri.matchPaths ? { matchPaths: ri.matchPaths } : {}),
      ...(ri.noChildMatch ? { noChildMatch: ri.noChildMatch } : {}),
    }));

    // Section: Navegação (registry items)
    // Global (moduloKey === undefined) é exclusivo do Super Admin
    if (isSuper || moduloKey) {
      if (regNav.length > 0) {
        sections.push({ label: moduloKey ? "Navegação" : "Itens Globais", items: regNav });
      }
    }

    // Section: Administração (super admin, global only)
    if (isSuper && !moduloKey) {
      sections.push({
        label: "Administração",
        items: [
          { path: "/admin/super/empresas", label: "Empresas", icon: Building2 },
          { path: "/admin/super/modulos", label: "Módulos", icon: Puzzle },
          { path: "/admin/super/permissoes", label: "Permissões", icon: KeyRound },
          { path: "/admin/super/banco", label: "Banco de Dados", icon: Database },
          { path: "/admin/super/integracoes", label: "Integrações", icon: Cable },
          { path: "/admin/super/demos", label: "Demos", icon: FlaskConical },
          { path: "/admin/laboratorio", label: "Laboratório", icon: Beaker },
        ],
      });
    }

    // Section: Configuração (empresa context)
    const showConfig = (isSuper && moduloKey === "empresas-core") || isCompanyAdmin;
    if (showConfig) {
      sections.push({
        label: "Configuração",
        items: [
          { path: "/admin/empresa/config/banco", label: "Banco de Dados", icon: Database },
          { path: "/admin/empresa", label: "Dados da Empresa", icon: Building2, noChildMatch: true },
          { path: "/credenciais", label: "Credenciais", icon: Shield },
          { path: "/admin/tema", label: "Design", icon: Palette },
          { path: "/admin/empresa/config/branding", label: "Branding", icon: Image },
        ],
      });
    }

    return sections;
  }, [p, profile?.is_super_admin, profile?.role, profile?.empresa_id, modulosAtivos, selectedModuleKey, modulosAcesso, modulosAcessiveis]);
}

export function useModulos() {
  const { profile, modulosAtivos, modulosAcesso } = useAuth();
  return useMemo(() => {
    if (profile?.is_super_admin) {
      return getAllModules().map((m) => ({
        key: m.key,
        nome: m.nome,
        icon: m.icon,
      }));
    }
    const ativos = modulosAtivos || [];
    const isCompanyAdmin = profile?.role === "admin";
    return getAllModules()
      .filter((m) => {
        if (m.key === "empresas-core") {
          return isCompanyAdmin || modulosAcesso?.[m.key]?.acessar === true;
        }
        return ativos.includes(m.key) && modulosAcesso?.[m.key]?.acessar === true;
      })
      .map((m) => ({
        key: m.key,
        nome: m.nome,
        icon: m.icon,
      }));
  }, [profile?.is_super_admin, profile?.role, modulosAtivos, modulosAcesso]);
}
