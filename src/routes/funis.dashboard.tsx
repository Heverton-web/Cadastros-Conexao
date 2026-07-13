import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { FunisDashboardPage } from "~/features/funis/components/FunisDashboardPage";
import { RequirePermission } from "~/components/guards";

export const funisDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/funis/dashboard",
  component: () => (
    <RequirePermission modulo="funis" permissions={["funis_ver_dashboard"]}>
      <FunisDashboardPage />
    </RequirePermission>
  ),
});
