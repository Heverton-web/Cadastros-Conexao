import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { DashboardPage } from "~/features/gerador-links/components/DashboardPage";

export const ferramentasLinksRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/ferramentas/links",
  component: DashboardPage,
});
