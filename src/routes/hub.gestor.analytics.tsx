import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubGestorAnalyticsPage } from "~/features/hub/pages/HubGestorPage";

export const hubGestorAnalyticsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/gestor/analytics",
  component: HubGestorAnalyticsPage,
});
