import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubDistribuidorDashboardPage } from "~/features/hub/pages/distribuidor/HubDistribuidorDashboardPage";

export const hubDistribuidorDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/distribuidor/dashboard",
  component: HubDistribuidorDashboardPage,
});
