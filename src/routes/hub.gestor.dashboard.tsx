import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubDashboardPage } from "~/features/hub/pages/HubDashboardPage";
import { RequirePermission } from "~/components/guards";

export const hubGestorDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/gestor/dashboard",
  component: () => (
    <RequirePermission modulo="hub" permissions={["hub_ver_analytics"]}>
      <HubDashboardPage
        roleFilter="manager"
        conquistasPath="/hub/gestor/conquistas"
      />
    </RequirePermission>
  ),
});
