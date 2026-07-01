import { createRoute, redirect } from "@tanstack/react-router";
import { authLayout } from "./_auth";

export const marketingLinktreeDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/linktree/design",
  beforeLoad: () => {
    throw redirect({ to: "/linktree/design" });
  },
  component: () => null,
});
