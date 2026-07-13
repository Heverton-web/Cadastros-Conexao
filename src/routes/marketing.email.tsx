import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { EmailCampanhasList } from "~/features/marketing/email-marketing/components/EmailCampanhasList";
import { RequirePermission } from "~/components/guards";

export const marketingEmailRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/email",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_email_ver"]}>
      <EmailCampanhasList />
    </RequirePermission>
  ),
});
