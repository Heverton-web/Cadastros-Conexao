import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubConquistasPage } from "~/features/hub/pages/HubConquistasPage";

export const hubGestorConquistasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/gestor/conquistas",
  component: HubConquistasPage,
});
