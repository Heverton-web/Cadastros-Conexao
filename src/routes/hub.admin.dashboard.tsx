import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubDashboardPage } from "~/features/hub/pages/HubDashboardPage";
import { RequirePermission } from "~/components/guards";

export const hubAdminDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/admin/dashboard",
  component: () => (
    <RequirePermission modulo="hub" permissions={["hub_gerenciar_config"]}>
      <HubDashboardPage conquistasPath="/hub/admin/badges" />
    </RequirePermission>
  ),
});
