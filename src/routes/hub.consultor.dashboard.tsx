import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubDashboardPage } from "~/features/hub/pages/HubDashboardPage";
import { RequirePermission } from "~/components/guards";

export const hubConsultorDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/consultor/dashboard",
  component: () => (
    <RequirePermission modulo="hub" permissions={["hub_ver_materiais"]}>
      <HubDashboardPage
        roleFilter="consultant"
        conquistasPath="/hub/consultor/conquistas"
      />
    </RequirePermission>
  ),
});
