import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubConquistasPage } from "~/features/hub/pages/HubConquistasPage";

export const hubConquistasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/conquistas",
  component: HubConquistasPage,
});
