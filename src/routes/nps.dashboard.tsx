import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { NpsDashboardPage } from "~/features/nps/components/dashboard/NpsDashboardPage";
import { RequirePermission } from "~/components/guards";

export const npsDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/nps/dashboard",
  component: () => (
    <RequirePermission modulo="nps" permissions={["nps_ver_dashboard"]}>
      <NpsDashboardPage />
    </RequirePermission>
  ),
});
