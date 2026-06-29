import { GitBranch, LayoutDashboard, Palette } from "lucide-react";
import { registerModule, registerNavItem, registerPermission, registerPermissionDefaults } from "~/registry";
import type { ModuleDefinition } from "~/registry";
import { FUNIS_PERMISSIONS } from "./permissions";

export const funisModule: ModuleDefinition = {
  key: "funis",
  nome: "Funis",
  descricao: "Gerenciamento de funis Kanban para fluxos de trabalho",
  icon: GitBranch,
  routes: ["/funis/dashboard", "/funis/funil/$funilId", "/funis/design"],
  permissions: FUNIS_PERMISSIONS.map((p) => p.key),
  ambientes: ["cadastro", "consultor", "tecnologia"],
  abas: [
    { key: "geral", label: "Geral", descricao: "Configurações gerais do Funis" },
    { key: "permissoes", label: "Permissões", descricao: "Gerenciar permissões do módulo" },
    { key: "credenciais", label: "Credenciais", descricao: "Credenciais com escopo no Funis" },
    { key: "eventos", label: "Eventos", descricao: "Eventos e webhooks do Funis" },
  ],
  events: [
    { key: "funil.criado", label: "Funil Criado", descricao: "Quando um novo funil é criado", type: "status_change" },
    { key: "funil.atualizado", label: "Funil Atualizado", descricao: "Quando um funil é editado", type: "status_change" },
    { key: "funil.excluido", label: "Funil Excluído", descricao: "Quando um funil é removido", type: "status_change" },
    { key: "tarefa.criada", label: "Tarefa Criada", descricao: "Quando uma nova tarefa é adicionada", type: "status_change" },
    { key: "tarefa.concluida", label: "Tarefa Concluída", descricao: "Quando uma tarefa é marcada como concluída", type: "button_action" },
    { key: "tarefa.movida", label: "Tarefa Movida", descricao: "Quando uma tarefa é movida entre colunas", type: "button_action" },
  ],
  hasCredentialScopes: true,
  hasDesignConfig: true,
  designRoute: "/funis/design",
  setup: () => {
    for (const p of FUNIS_PERMISSIONS) {
      registerPermission({ key: p.key, label: p.label, description: p.description, group: p.group });
    }

    registerNavItem({
      id: "funis-dashboard",
      label: "Dashboard Funis",
      icon: LayoutDashboard,
      to: "/funis/dashboard",
      permissionCheck: (perms) => perms?.funis_ver_dashboard === true,
      order: 20,
      moduloKey: "funis",
    });

    registerNavItem({
      id: "funis-design",
      label: "Design",
      icon: Palette,
      to: "/funis/design",
      permissionCheck: (perms) => perms?.funis_editar_funil === true,
      order: 99,
      moduloKey: "funis",
    });

    registerPermissionDefaults("funis", {
      cadastro: {
        funis_ver_dashboard: true, funis_criar_funil: true, funis_editar_funil: true,
        funis_excluir_funil: false, funis_gerir_colunas: true, funis_gerir_tarefas: true,
        funis_compartilhar: true, funis_ver_relatorios: true,
      },
      consultor: {
        funis_ver_dashboard: true, funis_criar_funil: false, funis_editar_funil: false,
        funis_excluir_funil: false, funis_gerir_colunas: false, funis_gerir_tarefas: true,
        funis_compartilhar: false, funis_ver_relatorios: false,
      },
      tecnologia: {
        funis_ver_dashboard: true, funis_criar_funil: true, funis_editar_funil: true,
        funis_excluir_funil: true, funis_gerir_colunas: true, funis_gerir_tarefas: true,
        funis_compartilhar: true, funis_ver_relatorios: true,
      },
      suporte: {
        funis_ver_dashboard: false, funis_criar_funil: false, funis_editar_funil: false,
        funis_excluir_funil: false, funis_gerir_colunas: false, funis_gerir_tarefas: false,
        funis_compartilhar: false, funis_ver_relatorios: false,
      },
    });
  },
};
