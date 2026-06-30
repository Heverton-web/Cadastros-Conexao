import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubDashboardPage } from "~/features/hub/pages/HubDashboardPage";

export const hubConsultorDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/consultor/dashboard",
  component: () => (
    <HubDashboardPage
      roleFilter="consultant"
      conquistasPath="/hub/consultor/conquistas"
    />
  ),
});
