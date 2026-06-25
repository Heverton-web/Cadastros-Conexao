import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubConsultorPage } from "~/features/hub/pages/HubConsultorPage";

export const hubConsultorRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/consultor",
  component: HubConsultorPage,
});
