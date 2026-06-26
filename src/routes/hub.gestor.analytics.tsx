import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { AdminAnalyticsPage } from "~/features/hub/pages/admin/AdminAnalyticsPage";

export const hubGestorAnalyticsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/gestor/analytics",
  component: AdminAnalyticsPage,
});
