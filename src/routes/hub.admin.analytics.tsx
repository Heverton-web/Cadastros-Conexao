import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { AdminAnalyticsPage } from "~/features/hub/pages/admin/AdminAnalyticsPage";
import { RequirePermission } from "~/components/guards";

export const hubAdminAnalyticsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/admin/analytics",
  component: () => (
    <RequirePermission modulo="hub" permissions={["hub_gerenciar_config"]}>
      <AdminAnalyticsPage />
    </RequirePermission>
  ),
});
