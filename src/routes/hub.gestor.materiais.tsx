import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubGestorMateriaisPage } from "~/features/hub/pages/HubGestorPage";

export const hubGestorMateriaisRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/gestor/materiais",
  component: HubGestorMateriaisPage,
});
