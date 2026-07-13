import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { LinktreeDashboardPage } from "~/features/linktree/components/LinktreeDashboardPage";
import { RequirePermission } from "~/components/guards";

export const linktreeDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/linktree/dashboard",
  component: () => (
    <RequirePermission modulo="linktree" permissions={["lt_ver_dashboard"]}>
      <LinktreeDashboardPage />
    </RequirePermission>
  ),
});
