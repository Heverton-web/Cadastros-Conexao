import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubDistribuidorConquistasPage } from "~/features/hub/pages/distribuidor/HubDistribuidorConquistasPage";

export const hubDistribuidorConquistasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/distribuidor/conquistas",
  component: HubDistribuidorConquistasPage,
});
