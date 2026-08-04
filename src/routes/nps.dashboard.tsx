import { lazy, Suspense } from "react";
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RequirePermission } from "~/components/guards";
import { RouteFallback } from "~/components/ui/route-fallback";

const NpsDashboardPage = lazy(() =>
  import("~/features/nps/components/dashboard/NpsDashboardPage").then(
    (m) => ({ default: m.NpsDashboardPage }),
  ),
);

export const npsDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/nps/dashboard",
  component: () => (
    <RequirePermission modulo="nps" permissions={["nps_ver_dashboard"]}>
      <Suspense fallback={<RouteFallback />}>
        <NpsDashboardPage />
      </Suspense>
    </RequirePermission>
  ),
});
