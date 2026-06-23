import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { Navigate } from "@tanstack/react-router";

export const mapasAdminRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/mapas/admin",
  component: () => <Navigate to="/mapas/admin/insights" />,
});
