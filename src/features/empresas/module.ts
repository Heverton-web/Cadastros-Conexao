import { Building2, Database, Shield, Palette, Image, Webhook } from "lucide-react";
import { registerModule, registerNavItem } from "~/registry";
import type { ModuleDefinition } from "~/registry";

export const empresasModule: ModuleDefinition = {
  key: "empresas-core",
  nome: "Empresa",
  descricao: "Gerenciamento de empresas",
  icon: Building2,
  routes: ["/global/empresas", "/empresa"],
  permissions: [],
  ambientes: [],
  abas: [
    { key: "empresa-banco", label: "Banco de Dados", descricao: "Acesso às configurações de banco de dados da empresa" },
    { key: "empresa-dados", label: "Dados da Empresa", descricao: "Acesso ao perfil e informações principais da empresa" },
    { key: "empresa-permissoes", label: "Permissões", descricao: "Gerenciamento de credenciais e permissões" },
    { key: "empresa-design", label: "Design", descricao: "Configuração do tema visual (Cores, Fontes)" },
    { key: "empresa-branding", label: "Branding", descricao: "Configuração de marca (Logo, Favicon)" }
  ],
  events: [],
  setup: () => {
    registerNavItem({
      id: "empresa-banco",
      label: "Banco de Dados",
      icon: Database,
      to: "/empresa/banco",
      permissionCheck: () => true,
      order: 10,
      moduloKey: "empresas-core",
    });

    registerNavItem({
      id: "empresa-dados",
      label: "Dados da Empresa",
      icon: Building2,
      to: "/empresa",
      permissionCheck: () => true,
      order: 20,
      moduloKey: "empresas-core",
      noChildMatch: true,
    });

    registerNavItem({
      id: "empresa-permissoes",
      label: "Permissões",
      icon: Shield,
      to: "/empresa/permissoes",
      permissionCheck: () => true,
      order: 30,
      moduloKey: "empresas-core",
    });

    registerNavItem({
      id: "empresa-design",
      label: "Design",
      icon: Palette,
      to: "/empresa/tema",
      permissionCheck: () => true,
      order: 40,
      moduloKey: "empresas-core",
    });

    registerNavItem({
      id: "empresa-branding",
      label: "Branding",
      icon: Image,
      to: "/empresa/branding",
      permissionCheck: () => true,
      order: 50,
      moduloKey: "empresas-core",
    });

    registerNavItem({
      id: "empresa-acoes",
      label: "Central de Ações",
      icon: Webhook,
      to: "/empresa/acoes",
      permissionCheck: () => true,
      order: 60,
      moduloKey: "empresas-core",
    });
  },
};
