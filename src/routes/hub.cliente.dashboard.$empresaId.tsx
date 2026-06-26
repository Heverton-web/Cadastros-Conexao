import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { HubDashboardPage } from "~/features/hub/pages/HubDashboardPage";

export const hubClienteDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hub/cliente/dashboard/$empresaId",
  component: () => <HubDashboardPage roleFilter="client" />,
});
