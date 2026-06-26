import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubDashboardPage } from "~/features/hub/pages/HubDashboardPage";

export const hubDistribuidorDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/distribuidor/dashboard",
  component: () => <HubDashboardPage roleFilter="distributor" conquistasPath="/hub/distribuidor/conquistas" />,
});
