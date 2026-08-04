import { lazy, Suspense } from "react";
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RequirePermission } from "~/components/guards";
import { RouteFallback } from "~/components/ui/route-fallback";

const HubDashboardPage = lazy(() =>
  import("~/features/hub/pages/HubDashboardPage").then((m) => ({
    default: m.HubDashboardPage,
  })),
);

export const hubConsultorDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/consultor/dashboard",
  component: () => (
    <RequirePermission modulo="hub" permissions={["hub_ver_materiais"]}>
      <Suspense fallback={<RouteFallback />}>
        <HubDashboardPage
          roleFilter="consultant"
          conquistasPath="/hub/consultor/conquistas"
        />
      </Suspense>
    </RequirePermission>
  ),
});
