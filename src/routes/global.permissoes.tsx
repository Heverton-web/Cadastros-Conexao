import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";

export const adminSuperPermissoesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/global/permissoes",
  component: () => <div>Route Removed (Single Tenant)</div>,
});
