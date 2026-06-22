import { Settings, Building2, Puzzle, KeyRound, Globe, Database, Cable, FlaskConical, Palette, Image, Shield, Beaker, type LucideIcon } from "lucide-react";
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
  const { profile, permissoes } = useAuth();
  const p = permissoes;

  return useMemo(() => {
    const sections: NavSection[] = [];

    const registryItems = getNavItems(p as Record<string, boolean> | null, selectedModuleKey);
    const regNav: NavItem[] = registryItems.map((ri) => ({
      path: ri.to,
      label: ri.label,
      icon: ri.icon,
    }));

    const isSuper = profile?.is_super_admin === true;
    const isCompanyAdmin = !isSuper && profile?.role === "admin" && !!profile?.empresa_id;

    // Section: Navegação (registry items)
    // Global (selectedModuleKey === undefined) é exclusivo do Super Admin
    if (isSuper || selectedModuleKey) {
      const navItems: NavItem[] = [...regNav];
      // Config só aparece em módulos que não são sistema (exclui empresas-core)
      if (selectedModuleKey && selectedModuleKey !== "empresas-core" && (isSuper || p?.gerenciar_config === true)) {
        navItems.push({ path: "/admin/config", label: "Config", icon: Settings });
      }
      if (navItems.length > 0) {
        sections.push({ label: selectedModuleKey ? "Navegação" : "Itens Globais", items: navItems });
      }
    }

    // Section: Administração (super admin, global only)
    if (isSuper && !selectedModuleKey) {
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
    const showConfig = (isSuper && selectedModuleKey === "empresas-core") || isCompanyAdmin;
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
  }, [p, profile?.is_super_admin, profile?.role, profile?.empresa_id, selectedModuleKey]);
}

export function useModulos() {
  const { profile } = useAuth();
  return useMemo(() => {
    if (!profile?.is_super_admin) return [];
    return getAllModules().map((m) => ({
      key: m.key,
      nome: m.nome,
      icon: m.icon,
    }));
  }, [profile?.is_super_admin]);
}
