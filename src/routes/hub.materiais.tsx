import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubMateriaisPage } from "~/features/hub/pages/HubMateriaisPage";

export const hubMateriaisRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/materiais",
  component: HubMateriaisPage,
});
