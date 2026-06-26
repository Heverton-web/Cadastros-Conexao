import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubConquistasPage } from "~/features/hub/pages/HubConquistasPage";

export const hubDistribuidorConquistasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/distribuidor/conquistas",
  component: HubConquistasPage,
});
