import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { AdminMateriaisPage } from "~/features/hub/pages/admin/AdminMateriaisPage";
import { RequirePermission } from "~/components/guards";

export const hubAdminMateriaisRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/admin/materiais",
  component: () => (
    <RequirePermission modulo="hub" permissions={["hub_gerenciar_config"]}>
      <AdminMateriaisPage />
    </RequirePermission>
  ),
});
