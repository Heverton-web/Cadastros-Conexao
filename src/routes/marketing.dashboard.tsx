import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { MarketingDashboard } from "~/features/marketing/dashboard/components/MarketingDashboard";

export const marketingDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/dashboard",
  component: MarketingDashboard,
});
