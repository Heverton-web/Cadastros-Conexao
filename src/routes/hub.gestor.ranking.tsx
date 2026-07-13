import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubRankingPage } from "~/features/hub/pages/HubRankingPage";
import { RequirePermission } from "~/components/guards";

export const hubGestorRankingRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/gestor/ranking",
  component: () => (
    <RequirePermission modulo="hub" permissions={["hub_ver_analytics"]}>
      <HubRankingPage />
    </RequirePermission>
  ),
});
