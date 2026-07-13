import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { LeadsList } from "~/features/marketing/leads/components/LeadsList";
import { RequirePermission } from "~/components/guards";

export const marketingLeadsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/leads",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_lead_ver"]}>
      <LeadsList />
    </RequirePermission>
  ),
});
