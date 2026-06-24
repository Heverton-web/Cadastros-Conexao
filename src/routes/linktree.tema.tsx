import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { LinktreeTemaPage } from "~/features/linktree/components/LinktreeTemaPage";

export const linktreeTemaRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/linktree/tema",
  component: LinktreeTemaPage,
});
