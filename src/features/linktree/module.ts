import { Link2 } from "lucide-react";
import { registerModule, registerNavItem, registerPermission } from "~/registry";
import type { ModuleDefinition } from "~/registry";
import { LINKTREE_PERMISSIONS } from "./permissions";

export const linktreeModule: ModuleDefinition = {
  key: "linktree-conexao",
  nome: "LinkTree Corporativo",
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
      label: "LinkTree",
      icon: Link2,
      to: "/linktree/dashboard",
      permissionCheck: (perms) => perms?.lt_ver_dashboard === true,
      order: 25,
      moduloKey: "linktree-conexao",
    });
  },
};
