import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { AdminIdentityPage } from "~/features/hub/pages/admin/AdminIdentityPage";

export const hubAdminIdentityRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/admin/identity",
  component: AdminIdentityPage,
});
