import { FileText } from "lucide-react";
import { registerModule, registerNavItem, registerPermission, registerPermissionDefaults } from "~/registry";
import type { ModuleDefinition } from "~/registry";
import { LANDING_PAGES_PERMISSIONS } from "./permissions";

export const landingPagesModule: ModuleDefinition = {
  key: "mktg-landing-pages",
  nome: "Landing Pages",
  descricao: "Criacao e gerenciamento de landing pages",
  icon: FileText,
  hasDesignConfig: true,
  routes: ["/marketing/landing-pages"],
  permissions: LANDING_PAGES_PERMISSIONS.map((p) => p.key),
  ambientes: ["cadastro", "tecnologia"],
  abas: [],
  events: [],
  setup: () => {
    for (const p of LANDING_PAGES_PERMISSIONS) registerPermission({ key: p.key, label: p.label, description: p.description, group: p.group });
    registerNavItem({ id: "mktg-landing-pages", label: "Landing Pages", icon: FileText, to: "/marketing/landing-pages", permissionCheck: (perms) => perms?.mktg_lp_ver === true, order: 20, moduloKey: "marketing" });
    registerPermissionDefaults("mktg-landing-pages", {
      cadastro: { mktg_lp_ver: true, mktg_lp_criar: true, mktg_lp_editar: true, mktg_lp_excluir: true, mktg_lp_publicar: true },
      tecnologia: { mktg_lp_ver: true, mktg_lp_criar: true, mktg_lp_editar: true, mktg_lp_excluir: true, mktg_lp_publicar: true },
      consultor: { mktg_lp_ver: false, mktg_lp_criar: false, mktg_lp_editar: false, mktg_lp_excluir: false, mktg_lp_publicar: false },
      suporte: { mktg_lp_ver: false, mktg_lp_criar: false, mktg_lp_editar: false, mktg_lp_excluir: false, mktg_lp_publicar: false },
    });
  },
};
