import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { LinktreeDashboardPage } from "~/features/linktree/components/LinktreeDashboardPage";

export const linktreeDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/linktree/dashboard",
  component: LinktreeDashboardPage,
});
