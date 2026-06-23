import { Building2, Database, Shield, Palette, Image } from "lucide-react";
import { registerModule, registerNavItem } from "~/registry";
import type { ModuleDefinition } from "~/registry";

export const empresasModule: ModuleDefinition = {
  key: "empresas-core",
  nome: "Empresa",
  descricao: "Gerenciamento de empresas",
  icon: Building2,
  routes: ["/admin/super/empresas", "/admin/empresa"],
  permissions: [],
  ambientes: [],
  abas: [],
  events: [],
  setup: () => {
    registerNavItem({
      id: "empresa-banco",
      label: "Banco de Dados",
      icon: Database,
      to: "/admin/empresa/config/banco",
      permissionCheck: () => true,
      order: 10,
      moduloKey: "empresas-core",
    });

    registerNavItem({
      id: "empresa-dados",
      label: "Dados da Empresa",
      icon: Building2,
      to: "/admin/empresa",
      permissionCheck: () => true,
      order: 20,
      moduloKey: "empresas-core",
      noChildMatch: true,
    });

    registerNavItem({
      id: "empresa-permissoes",
      label: "Permissões",
      icon: Shield,
      to: "/admin/permissoes",
      permissionCheck: () => true,
      order: 30,
      moduloKey: "empresas-core",
    });

    registerNavItem({
      id: "empresa-design",
      label: "Design",
      icon: Palette,
      to: "/admin/tema",
      permissionCheck: () => true,
      order: 40,
      moduloKey: "empresas-core",
    });

    registerNavItem({
      id: "empresa-branding",
      label: "Branding",
      icon: Image,
      to: "/admin/empresa/config/branding",
      permissionCheck: () => true,
      order: 50,
      moduloKey: "empresas-core",
    });
  },
};
