import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubConsultorRankingPage } from "~/features/hub/pages/consultor/HubConsultorRankingPage";

export const hubConsultorRankingRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/consultor/ranking",
  component: HubConsultorRankingPage,
});
