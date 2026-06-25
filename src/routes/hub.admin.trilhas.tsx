import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { AdminTrilhasPage } from "~/features/hub/pages/admin/AdminTrilhasPage";

export const hubAdminTrilhasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/admin/trilhas",
  component: AdminTrilhasPage,
});
