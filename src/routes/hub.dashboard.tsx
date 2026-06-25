import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubDashboardPage } from "~/features/hub/pages/HubDashboardPage";

export const hubDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/dashboard",
  component: HubDashboardPage,
});
