import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { WhatsappMarketing } from "~/features/marketing/whatsapp/components/WhatsappMarketing";

export const marketingWhatsappRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/whatsapp",
  component: WhatsappMarketing,
});
