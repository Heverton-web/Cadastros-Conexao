import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubDashboardPage } from "~/features/hub/pages/HubDashboardPage";
import { RequireSuperAdmin } from "~/components/guards";

export const globalHubRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/global/hub",
  component: () => (
    <RequireSuperAdmin>
      <HubDashboardPage />
    </RequireSuperAdmin>
  ),
});
