import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { HubClientePage } from "~/features/hub/pages/HubClientePage";

export const hubClienteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hub/cliente",
  component: HubClientePage,
});
