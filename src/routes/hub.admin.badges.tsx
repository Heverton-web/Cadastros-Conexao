import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { AdminBadgesPage } from "~/features/hub/pages/admin/AdminBadgesPage";
import { RequirePermission } from "~/components/guards";

export const hubAdminBadgesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/admin/badges",
  component: () => (
    <RequirePermission modulo="hub" permissions={["hub_gerenciar_config"]}>
      <AdminBadgesPage />
    </RequirePermission>
  ),
});
