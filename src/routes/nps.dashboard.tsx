import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { NpsDashboardPage } from "~/features/nps/components/dashboard/NpsDashboardPage";

export const npsDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/nps/dashboard",
  component: NpsDashboardPage,
});
