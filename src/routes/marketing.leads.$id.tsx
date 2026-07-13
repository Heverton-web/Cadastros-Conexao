import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { LeadDetail } from "~/features/marketing/leads/components/LeadDetail";
import { RequirePermission } from "~/components/guards";

export const marketingLeadsDetailRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/leads/$id",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_lead_ver"]}>
      <LeadDetail />
    </RequirePermission>
  ),
});
