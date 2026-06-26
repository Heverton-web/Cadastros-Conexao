import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubGestorRankingPage } from "~/features/hub/pages/gestor/HubGestorRankingPage";

export const hubGestorRankingRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/gestor/ranking",
  component: HubGestorRankingPage,
});
