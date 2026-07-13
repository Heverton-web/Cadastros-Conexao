import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { WhatsappMarketing } from "~/features/marketing/whatsapp/components/WhatsappMarketing";
import { RequirePermission } from "~/components/guards";

export const marketingWhatsappRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/whatsapp",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_email_ver"]}>
      <WhatsappMarketing />
    </RequirePermission>
  ),
});
