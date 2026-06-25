import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { AdminConfigPage } from "~/features/hub/pages/admin/AdminConfigPage";

export const hubAdminConfigRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/admin/config",
  component: AdminConfigPage,
});
