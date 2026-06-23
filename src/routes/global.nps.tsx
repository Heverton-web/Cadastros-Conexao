import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { GlobalNpsDashboardPage } from "~/features/nps/components/dashboard/GlobalNpsDashboardPage";

export const globalNpsDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/global/nps",
  component: GlobalNpsDashboardPage,
});
