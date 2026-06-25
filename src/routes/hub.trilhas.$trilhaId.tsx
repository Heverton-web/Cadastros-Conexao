import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubTrilhaDetailPage } from "~/features/hub/pages/HubTrilhaDetailPage";

export const hubTrilhaDetailRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/trilhas/$trilhaId",
  component: HubTrilhaDetailPage,
});
