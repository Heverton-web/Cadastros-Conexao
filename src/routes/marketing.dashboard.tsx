import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { MarketingDashboard } from "~/features/marketing/dashboard/components/MarketingDashboard";
import { RequirePermission } from "~/components/guards";

export const marketingDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/dashboard",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_dashboard_ver"]}>
      <MarketingDashboard />
    </RequirePermission>
  ),
});
