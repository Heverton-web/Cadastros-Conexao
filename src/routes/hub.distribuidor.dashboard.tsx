import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubDashboardPage } from "~/features/hub/pages/HubDashboardPage";
import { RequirePermission } from "~/components/guards";

export const hubDistribuidorDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/distribuidor/dashboard",
  component: () => (
    <RequirePermission modulo="hub" permissions={["hub_ver_materiais"]}>
      <HubDashboardPage
        roleFilter="distributor"
        conquistasPath="/hub/distribuidor/conquistas"
      />
    </RequirePermission>
  ),
});
