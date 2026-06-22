import {
  LayoutDashboard, Users, UserCircle, BarChart3, Settings,
} from "lucide-react";
import { registerModule, registerNavItem, registerPermission } from "~/registry";
import type { ModuleDefinition } from "~/registry";
import { ALL_PERMISSIONS } from "./permissions";

export const cadastrosModule: ModuleDefinition = {
  key: "cadastros-conexao",
  nome: "Cadastros",
  descricao: "Gestao de cadastro de clientes PF/PJ",
  icon: Users,
  routes: ["/dashboard", "/clientes", "/consultor", "/relatorios", "/admin/config", "/admin/tema"],
  permissions: ALL_PERMISSIONS.map((p) => p.key),
  ambientes: ["cadastro", "consultor", "tecnologia", "suporte"],
  abas: [
    { key: "geral", label: "Geral", descricao: "Configurações gerais do módulo" },
    { key: "permissoes", label: "Permissões", descricao: "Gerenciar permissões do módulo" },
    { key: "credenciais", label: "Credenciais", descricao: "Credenciais com escopo no módulo" },
    { key: "eventos", label: "Eventos", descricao: "Eventos e webhooks do módulo" },
    { key: "laboratorio", label: "Laboratório", descricao: "Testes e experimentos" },
    { key: "acoes", label: "Ações", descricao: "Ações customizadas" },
    { key: "formularios", label: "Formulários", descricao: "Campos e formulários dinâmicos" },
    { key: "apis", label: "APIs", descricao: "Conectores de API" },
  ],
  events: [
    { key: "cadastro.criado", label: "Cadastro Criado", descricao: "Dispara quando um novo cadastro é criado" },
    { key: "cadastro.aprovado", label: "Cadastro Aprovado", descricao: "Dispara quando um cadastro é aprovado" },
    { key: "cadastro.reprovado", label: "Cadastro Reprovado", descricao: "Dispara quando um cadastro é reprovado" },
    { key: "documento.aprovado", label: "Documento Aprovado", descricao: "Dispara quando um documento é aprovado" },
    { key: "documento.reprovado", label: "Documento Reprovado", descricao: "Dispara quando um documento é reprovado" },
    { key: "link.gerado", label: "Link Gerado", descricao: "Dispara quando um link de cadastro é gerado" },
  ],
  hasCredentialScopes: true,
  hasLaboratorio: true,
  hasFormulario: true,
  hasCustomActions: true,
  hasApiConnectors: true,
  setup: () => {
    for (const p of ALL_PERMISSIONS) {
      registerPermission({
        key: p.key,
        label: p.label,
        description: p.description,
        group: p.group,
      });
    }

    registerNavItem({
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/dashboard",
      permissionCheck: (perms) => perms?.ver_todos_cadastros === true,
      order: 1,
      moduloKey: "cadastros-conexao",
    });

    registerNavItem({
      id: "clientes",
      label: "Clientes",
      icon: Users,
      to: "/clientes",
      permissionCheck: (perms) =>
        perms?.ver_todos_cadastros === true || perms?.gerar_links === true,
      order: 2,
      moduloKey: "cadastros-conexao",
    });

    registerNavItem({
      id: "consultor",
      label: "Consultor",
      icon: UserCircle,
      to: "/consultor",
      permissionCheck: (perms) => perms?.gerar_links === true,
      order: 3,
      moduloKey: "cadastros-conexao",
    });

    registerNavItem({
      id: "relatorios",
      label: "Relatorios",
      icon: BarChart3,
      to: "/relatorios",
      permissionCheck: (perms) => perms?.ver_relatorios === true,
      order: 4,
      moduloKey: "cadastros-conexao",
    });

    // credenciais removido — agora está em Configuração (nav lateral do módulo empresas-core)

    // admin-config removido — é item global, não específico de módulo
  },
};
