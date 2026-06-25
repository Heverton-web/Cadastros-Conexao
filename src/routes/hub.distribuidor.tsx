import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubDistribuidorPage } from "~/features/hub/pages/HubDistribuidorPage";

export const hubDistribuidorRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/distribuidor",
  component: HubDistribuidorPage,
});
