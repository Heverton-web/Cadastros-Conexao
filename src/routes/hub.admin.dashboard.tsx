import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubDashboardPage } from "~/features/hub/pages/HubDashboardPage";

export const hubAdminDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/admin/dashboard",
  component: () => <HubDashboardPage conquistasPath="/hub/admin/badges" />,
});
