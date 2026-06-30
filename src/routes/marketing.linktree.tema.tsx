import { createRoute, redirect } from "@tanstack/react-router";
import { authLayout } from "./_auth";

export const marketingLinktreeTemaRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/linktree/tema",
  beforeLoad: () => {
    throw redirect({ to: "/linktree/tema" });
  },
  component: () => null,
});
