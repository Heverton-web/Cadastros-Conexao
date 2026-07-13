import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubRankingPage } from "~/features/hub/pages/HubRankingPage";
import { RequirePermission } from "~/components/guards";

export const hubConsultorRankingRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/consultor/ranking",
  component: () => (
    <RequirePermission modulo="hub" permissions={["hub_ver_materiais"]}>
      <HubRankingPage />
    </RequirePermission>
  ),
});
