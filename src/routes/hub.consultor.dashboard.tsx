import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubConsultorDashboardPage } from "~/features/hub/pages/consultor/HubConsultorDashboardPage";

export const hubConsultorDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/consultor/dashboard",
  component: HubConsultorDashboardPage,
});
