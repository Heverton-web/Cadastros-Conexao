import { createRoute } from "@tanstack/react-router";
import { funisRoute } from "./funis";
import { FunisDashboardPage } from "~/features/funis/components/FunisDashboardPage";

export const funisDashboardRoute = createRoute({
  getParentRoute: () => funisRoute,
  path: "/",
  component: FunisDashboardPage,
});
