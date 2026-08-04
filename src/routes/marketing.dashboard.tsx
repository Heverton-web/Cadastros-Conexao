import { lazy, Suspense } from "react";
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RequirePermission } from "~/components/guards";
import { RouteFallback } from "~/components/ui/route-fallback";

const MarketingDashboard = lazy(() =>
  import("~/features/marketing/dashboard/components/MarketingDashboard").then((m) => ({
    default: m.MarketingDashboard,
  })),
);

export const marketingDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/dashboard",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_dashboard_ver"]}>
      <Suspense fallback={<RouteFallback />}>
        <MarketingDashboard />
      </Suspense>
    </RequirePermission>
  ),
});
