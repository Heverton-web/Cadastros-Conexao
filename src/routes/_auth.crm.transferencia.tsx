import { createRoute, Outlet } from "@tanstack/react-router";
import { authLayout } from "./_auth";

export const crmTransferenciaRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/crm/transferencia",
  component: () => <Outlet />,
});
