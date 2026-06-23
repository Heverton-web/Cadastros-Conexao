import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { FunisDashboardPage } from "~/features/funis/components/FunisDashboardPage";

export const funisDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/funis/dashboard",
  component: FunisDashboardPage,
});
