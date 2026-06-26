import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubDashboardPage } from "~/features/hub/pages/HubDashboardPage";

export const hubGestorDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/gestor/dashboard",
  component: () => <HubDashboardPage roleFilter="manager" conquistasPath="/hub/gestor/conquistas" />,
});
