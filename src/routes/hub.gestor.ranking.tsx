import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubRankingPage } from "~/features/hub/pages/HubRankingPage";

export const hubGestorRankingRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/gestor/ranking",
  component: HubRankingPage,
});
