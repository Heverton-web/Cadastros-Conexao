import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { HubClienteDashboardPage } from "~/features/hub/pages/cliente/HubClienteDashboardPage";

export const hubClienteDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hub/cliente/dashboard/$empresaId",
  component: HubClienteDashboardPage,
});
