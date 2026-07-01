import { Users } from "lucide-react";
import {
  registerModule,
  registerNavItem,
  registerPermission,
  registerPermissionDefaults,
} from "~/registry";
import type { ModuleDefinition } from "~/registry";
import { LEADS_PERMISSIONS } from "./permissions";

export const leadsModule: ModuleDefinition = {
  key: "mktg-leads",
  nome: "Leads",
  descricao: "Gestao e qualificacao de leads",
  icon: Users,
  routes: ["/marketing/leads"],
  permissions: LEADS_PERMISSIONS.map((p) => p.key),
  ambientes: ["cadastro", "tecnologia"],
  abas: [],
  events: [],
  setup: () => {
    for (const p of LEADS_PERMISSIONS)
      registerPermission({
        key: p.key,
        label: p.label,
        description: p.description,
        group: p.group,
      });
    registerNavItem({
      id: "mktg-leads",
      label: "Leads",
      icon: Users,
      to: "/marketing/leads",
      permissionCheck: (perms) => perms?.mktg_lead_ver === true,
      order: 100,
      moduloKey: "marketing",
    });
    registerPermissionDefaults("mktg-leads", {
      cadastro: { mktg_lead_ver: true, mktg_lead_criar: true, mktg_lead_editar: true, mktg_lead_excluir: true },
      tecnologia: { mktg_lead_ver: true, mktg_lead_criar: true, mktg_lead_editar: true, mktg_lead_excluir: true },
      consultor: { mktg_lead_ver: false, mktg_lead_criar: false, mktg_lead_editar: false, mktg_lead_excluir: false },
      suporte: { mktg_lead_ver: false, mktg_lead_criar: false, mktg_lead_editar: false, mktg_lead_excluir: false },
    });
  },
};
