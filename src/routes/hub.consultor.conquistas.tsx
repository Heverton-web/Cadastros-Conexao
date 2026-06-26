import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubConsultorConquistasPage } from "~/features/hub/pages/consultor/HubConsultorConquistasPage";

export const hubConsultorConquistasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/consultor/conquistas",
  component: HubConsultorConquistasPage,
});
