import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubRankingPage } from "~/features/hub/pages/HubRankingPage";

export const hubConsultorRankingRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/consultor/ranking",
  component: HubRankingPage,
});
