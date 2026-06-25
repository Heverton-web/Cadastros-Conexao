import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubGestorTrilhasPage } from "~/features/hub/pages/HubGestorPage";

export const hubGestorTrilhasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/gestor/trilhas",
  component: HubGestorTrilhasPage,
});
