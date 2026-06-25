import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { AdminAnalyticsPage } from "~/features/hub/pages/admin/AdminAnalyticsPage";

export const hubAdminAnalyticsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/admin/analytics",
  component: AdminAnalyticsPage,
});
