import { Link2, Palette } from "lucide-react";
import { registerModule, registerNavItem, registerPermission, registerPermissionDefaults } from "~/registry";
import type { ModuleDefinition } from "~/registry";
import { LINKTREE_PERMISSIONS } from "./permissions";

export const linktreeModule: ModuleDefinition = {
  key: "linktree-conexao",
  nome: "LinkTree",
  descricao: "Cartoes digitais e QR Codes dos colaboradores",
  icon: Link2,
  routes: ["/linktree/dashboard", "/linktree/tema"],
  permissions: LINKTREE_PERMISSIONS.map((p) => p.key),
  ambientes: ["cadastro", "consultor", "tecnologia"],
  abas: [
    { key: "geral", label: "Geral", descricao: "Configuracoes gerais do LinkTree" },
    { key: "permissoes", label: "Permissoes", descricao: "Gerenciar permissoes do modulo" },
    { key: "credenciais", label: "Credenciais", descricao: "Credenciais com escopo no LinkTree" },
    { key: "eventos", label: "Eventos", descricao: "Eventos e webhooks do LinkTree" },
  ],
  events: [
    { key: "colaborador.criado", label: "Colaborador Criado", descricao: "Dispara quando um novo colaborador e cadastrado", type: "status_change" },
    { key: "colaborador.ativado", label: "Colaborador Ativado", descricao: "Dispara quando um colaborador e ativado", type: "status_change" },
    { key: "colaborador.inativado", label: "Colaborador Inativado", descricao: "Dispara quando um colaborador e inativado", type: "status_change" },
  ],
  hasCredentialScopes: true,
  setup: () => {
    for (const p of LINKTREE_PERMISSIONS) {
      registerPermission({ key: p.key, label: p.label, description: p.description, group: p.group });
    }

    registerNavItem({
      id: "linktree-dashboard",
      label: "Dashboard",
      icon: Link2,
      to: "/linktree/dashboard",
      permissionCheck: (perms) => perms?.lt_ver_dashboard === true,
      order: 25,
      moduloKey: "linktree-conexao",
    });

    registerNavItem({
      id: "linktree-tema",
      label: "Tema",
      icon: Palette,
      to: "/linktree/tema",
      permissionCheck: (perms) => perms?.lt_gerenciar_tema === true,
      order: 26,
      moduloKey: "linktree-conexao",
    });

    registerPermissionDefaults("linktree-conexao", {
      cadastro: {
        lt_ver_dashboard: true, lt_criar_colaborador: true, lt_editar_colaborador: true,
        lt_excluir_colaborador: true, lt_toggle_status: true, lt_ver_link: true,
        lt_ver_qr: true, lt_baixar_qr: true, lt_gerenciar_tema: true,
      },
      consultor: {
        lt_ver_dashboard: true, lt_criar_colaborador: false, lt_editar_colaborador: false,
        lt_excluir_colaborador: false, lt_toggle_status: false, lt_ver_link: true,
        lt_ver_qr: true, lt_baixar_qr: true, lt_gerenciar_tema: false,
      },
      tecnologia: {
        lt_ver_dashboard: true, lt_criar_colaborador: true, lt_editar_colaborador: true,
        lt_excluir_colaborador: true, lt_toggle_status: true, lt_ver_link: true,
        lt_ver_qr: true, lt_baixar_qr: true, lt_gerenciar_tema: true,
      },
      suporte: {
        lt_ver_dashboard: false, lt_criar_colaborador: false, lt_editar_colaborador: false,
        lt_excluir_colaborador: false, lt_toggle_status: false, lt_ver_link: false,
        lt_ver_qr: false, lt_baixar_qr: false, lt_gerenciar_tema: false,
      },
    });
  },
};
