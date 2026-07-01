import { MessageSquare } from "lucide-react";
import { registerNavItem } from "~/registry";
import type { ModuleDefinition } from "~/registry";

export const whatsappMarketingModule: ModuleDefinition = {
  key: "mktg-whatsapp",
  nome: "WhatsApp Marketing",
  descricao: "Disparos e campanhas de mensagens pelo WhatsApp",
  icon: MessageSquare,
  routes: ["/marketing/whatsapp"],
  permissions: ["mktg_wpp_ver", "mktg_wpp_enviar"],
  ambientes: ["cadastro", "tecnologia"],
  abas: [],
  events: [],
  setup: () => {
    registerNavItem({
      id: "mktg-whatsapp",
      label: "WhatsApp Marketing",
      icon: MessageSquare,
      to: "/marketing/whatsapp",
      permissionCheck: (perms) => perms?.mktg_wpp_ver === true,
      order: 75,
      moduloKey: "marketing",
    });
  },
};
