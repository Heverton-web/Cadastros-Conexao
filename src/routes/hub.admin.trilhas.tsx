import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { AdminTrilhasPage } from "~/features/hub/pages/admin/AdminTrilhasPage";
import { RequirePermission } from "~/components/guards";

export const hubAdminTrilhasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/admin/trilhas",
  component: () => (
    <RequirePermission modulo="hub" permissions={["hub_gerenciar_config"]}>
      <AdminTrilhasPage />
    </RequirePermission>
  ),
});
