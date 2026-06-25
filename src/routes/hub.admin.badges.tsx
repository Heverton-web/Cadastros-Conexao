import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { AdminBadgesPage } from "~/features/hub/pages/admin/AdminBadgesPage";

export const hubAdminBadgesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/admin/badges",
  component: AdminBadgesPage,
});
