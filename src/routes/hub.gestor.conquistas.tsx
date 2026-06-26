import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubGestorConquistasPage } from "~/features/hub/pages/gestor/HubGestorConquistasPage";

export const hubGestorConquistasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/gestor/conquistas",
  component: HubGestorConquistasPage,
});
