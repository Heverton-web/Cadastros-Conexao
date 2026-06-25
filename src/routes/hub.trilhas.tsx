import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubTrilhasPage } from "~/features/hub/pages/HubTrilhasPage";

export const hubTrilhasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/trilhas",
  component: HubTrilhasPage,
});
