import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubAdminPage } from "~/features/hub/pages/HubAdminPage";

export const hubAdminRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/admin",
  component: HubAdminPage,
});
