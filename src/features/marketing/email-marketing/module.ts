import { Mail } from "lucide-react";
import {
  registerModule,
  registerNavItem,
  registerPermission,
  registerPermissionDefaults,
} from "~/registry";
import type { ModuleDefinition } from "~/registry";
import { EMAIL_MARKETING_PERMISSIONS } from "./permissions";

export const emailMarketingModule: ModuleDefinition = {
  key: "mktg-email",
  nome: "E-mail Marketing",
  descricao: "Campanhas e disparos de e-mail",
  icon: Mail,
  routes: ["/marketing/email"],
  permissions: EMAIL_MARKETING_PERMISSIONS.map((p) => p.key),
  ambientes: ["cadastro", "tecnologia"],
  abas: [],
  events: [],
  hasCredentialScopes: true,
  setup: () => {
    for (const p of EMAIL_MARKETING_PERMISSIONS)
      registerPermission({
        key: p.key,
        label: p.label,
        description: p.description,
        group: p.group,
      });
    registerNavItem({
      id: "mktg-email",
      label: "E-mail Marketing",
      icon: Mail,
      to: "/marketing/email",
      permissionCheck: (perms) => perms?.mktg_email_ver === true,
      order: 70,
      moduloKey: "marketing",
    });
    registerPermissionDefaults("mktg-email", {
      cadastro: { mktg_email_ver: true, mktg_email_criar: true, mktg_email_editar: true, mktg_email_excluir: true, mktg_email_enviar: true },
      tecnologia: { mktg_email_ver: true, mktg_email_criar: true, mktg_email_editar: true, mktg_email_excluir: true, mktg_email_enviar: true },
      consultor: { mktg_email_ver: false, mktg_email_criar: false, mktg_email_editar: false, mktg_email_excluir: false, mktg_email_enviar: false },
      suporte: { mktg_email_ver: false, mktg_email_criar: false, mktg_email_editar: false, mktg_email_excluir: false, mktg_email_enviar: false },
    });
  },
};
