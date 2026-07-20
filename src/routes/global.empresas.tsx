import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";

export const adminSuperEmpresasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/global/empresas",
  component: () => <div>Route Removed (Single Tenant)</div>,
});
