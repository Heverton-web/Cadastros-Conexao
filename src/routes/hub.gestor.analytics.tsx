import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { AdminAnalyticsPage } from "~/features/hub/pages/admin/AdminAnalyticsPage";
import { RequirePermission } from "~/components/guards";

export const hubGestorAnalyticsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/gestor/analytics",
  component: () => (
    <RequirePermission modulo="hub" permissions={["hub_ver_analytics"]}>
      <AdminAnalyticsPage />
    </RequirePermission>
  ),
});
