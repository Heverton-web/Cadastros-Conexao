import { GitBranch } from "lucide-react";
import {
  registerModule,
  registerNavItem,
  registerPermission,
  registerPermissionDefaults,
} from "~/registry";
import type { ModuleDefinition } from "~/registry";

export const marketingLinktreeModule: ModuleDefinition = {
  key: "mktg-linktree",
  nome: "LinkTree",
  descricao: "LinkTree corporativo dentro do Marketing",
  icon: GitBranch,
  routes: ["/marketing/linktree"],
  permissions: ["lt_ver", "lt_editar", "lt_excluir"],
  ambientes: ["cadastro", "tecnologia"],
  abas: [],
  events: [],
  setup: () => {
    registerNavItem({
      id: "mktg-linktree",
      label: "LinkTree",
      icon: GitBranch,
      to: "/marketing/linktree",
      permissionCheck: (perms) => perms?.lt_ver === true,
      order: 120,
      moduloKey: "marketing",
    });
  },
};
