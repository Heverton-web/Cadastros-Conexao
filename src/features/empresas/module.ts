import { Building2, Database, Shield, Palette, Image, Webhook, Receipt, Settings, Bot, Paintbrush } from "lucide-react";
import { registerModule, registerNavItem } from "~/registry";
import type { ModuleDefinition } from "~/registry";

export const empresasModule: ModuleDefinition = {
  key: "empresas-core",
  nome: "Empresa",
  descricao: "Gerenciamento de empresas",
  icon: Building2,
  routes: [
    "/global/empresas",
    "/empresa",
    "/empresa/design",
    "/empresa/despesas-config",
    "/empresa/rotas/config",
    "/empresa/nps/tema",
    "/empresa/nps/design",
    "/empresa/linktree/tema",
    "/empresa/linktree/design",
    "/empresa/hub/chatbot",
    "/empresa/hub/design",
    "/empresa/mapas/design",
    "/empresa/funis/design",
    "/empresa/crm/design",
    "/empresa/cadastros/design",
    "/empresa/despesas/design",
    "/empresa/rotas/design",
  ],
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
  hasDesignConfig: true,
  designRoute: "/empresa/design",
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
      to: "/empresa/design",
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

    registerNavItem({
      id: "empresa-despesas-config",
      label: "Despesas",
      icon: Receipt,
      to: "/empresa/despesas-config",
      permissionCheck: () => true,
      order: 70,
      moduloKey: "empresas-core",
    });

    registerNavItem({
      id: "empresa-rotas-config",
      label: "Config. Rotas",
      icon: Settings,
      to: "/empresa/rotas/config",
      permissionCheck: () => true,
      order: 80,
      moduloKey: "empresas-core",
    });

    registerNavItem({
      id: "empresa-nps-tema",
      label: "NPS Tema",
      icon: Paintbrush,
      to: "/empresa/nps/tema",
      permissionCheck: () => true,
      order: 81,
      moduloKey: "empresas-core",
    });

    registerNavItem({
      id: "empresa-nps-design",
      label: "NPS Design",
      icon: Palette,
      to: "/empresa/nps/design",
      permissionCheck: () => true,
      order: 82,
      moduloKey: "empresas-core",
    });

    registerNavItem({
      id: "empresa-linktree-tema",
      label: "Linktree Tema",
      icon: Paintbrush,
      to: "/empresa/linktree/tema",
      permissionCheck: () => true,
      order: 83,
      moduloKey: "empresas-core",
    });

    registerNavItem({
      id: "empresa-linktree-design",
      label: "Linktree Design",
      icon: Palette,
      to: "/empresa/linktree/design",
      permissionCheck: () => true,
      order: 84,
      moduloKey: "empresas-core",
    });

    registerNavItem({
      id: "empresa-hub-chatbot",
      label: "Hub Chatbot",
      icon: Bot,
      to: "/empresa/hub/chatbot",
      permissionCheck: () => true,
      order: 85,
      moduloKey: "empresas-core",
    });

    registerNavItem({
      id: "empresa-hub-design",
      label: "Hub Design",
      icon: Palette,
      to: "/empresa/hub/design",
      permissionCheck: () => true,
      order: 86,
      moduloKey: "empresas-core",
    });

    registerNavItem({
      id: "empresa-mapas-design",
      label: "Mapas Design",
      icon: Palette,
      to: "/empresa/mapas/design",
      permissionCheck: () => true,
      order: 87,
      moduloKey: "empresas-core",
    });

    registerNavItem({
      id: "empresa-funis-design",
      label: "Funis Design",
      icon: Palette,
      to: "/empresa/funis/design",
      permissionCheck: () => true,
      order: 88,
      moduloKey: "empresas-core",
    });

    registerNavItem({
      id: "empresa-crm-design",
      label: "CRM Design",
      icon: Palette,
      to: "/empresa/crm/design",
      permissionCheck: () => true,
      order: 89,
      moduloKey: "empresas-core",
    });

    registerNavItem({
      id: "empresa-cadastros-design",
      label: "Cadastros Design",
      icon: Palette,
      to: "/empresa/cadastros/design",
      permissionCheck: () => true,
      order: 90,
      moduloKey: "empresas-core",
    });

    registerNavItem({
      id: "empresa-despesas-design",
      label: "Despesas Design",
      icon: Palette,
      to: "/empresa/despesas/design",
      permissionCheck: () => true,
      order: 91,
      moduloKey: "empresas-core",
    });

    registerNavItem({
      id: "empresa-rotas-design",
      label: "Rotas Design",
      icon: Palette,
      to: "/empresa/rotas/design",
      permissionCheck: () => true,
      order: 92,
      moduloKey: "empresas-core",
    });
  },
};
