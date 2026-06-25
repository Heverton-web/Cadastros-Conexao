import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubGestorUsuariosPage } from "~/features/hub/pages/HubGestorPage";

export const hubGestorUsuariosRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/gestor/usuarios",
  component: HubGestorUsuariosPage,
});
