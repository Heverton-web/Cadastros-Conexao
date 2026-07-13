import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubConquistasPage } from "~/features/hub/pages/HubConquistasPage";
import { RequirePermission } from "~/components/guards";

export const hubGestorConquistasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/gestor/conquistas",
  component: () => (
    <RequirePermission modulo="hub" permissions={["hub_ver_analytics"]}>
      <HubConquistasPage />
    </RequirePermission>
  ),
});
