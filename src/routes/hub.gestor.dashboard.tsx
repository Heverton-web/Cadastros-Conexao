import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubGestorDashboardPage } from "~/features/hub/pages/gestor/HubGestorDashboardPage";

export const hubGestorDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/gestor/dashboard",
  component: HubGestorDashboardPage,
});
