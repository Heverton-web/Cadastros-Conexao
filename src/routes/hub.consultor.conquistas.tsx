import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubConquistasPage } from "~/features/hub/pages/HubConquistasPage";

export const hubConsultorConquistasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/consultor/conquistas",
  component: HubConquistasPage,
});
