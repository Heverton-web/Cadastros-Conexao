import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubRankingPage } from "~/features/hub/pages/HubRankingPage";

export const hubRankingRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/ranking",
  component: HubRankingPage,
});
