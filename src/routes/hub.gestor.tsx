import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubGestorPage } from "~/features/hub/pages/HubGestorPage";

export const hubGestorRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/gestor",
  component: HubGestorPage,
});
