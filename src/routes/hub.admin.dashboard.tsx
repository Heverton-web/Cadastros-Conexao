import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { AdminDashboardPage } from "~/features/hub/pages/admin/AdminDashboardPage";

export const hubAdminDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/admin/dashboard",
  component: AdminDashboardPage,
});
