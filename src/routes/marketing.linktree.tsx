import { createRoute, redirect } from "@tanstack/react-router";
import { authLayout } from "./_auth";

export const marketingLinktreeRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/linktree",
  beforeLoad: () => {
    throw redirect({ to: "/linktree/dashboard" });
  },
  component: () => null,
});
