import { createRoute, redirect } from "@tanstack/react-router";
import { authLayout } from "./_auth";

export const marketingLinktreeEditorRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/linktree/editor",
  beforeLoad: () => {
    throw redirect({ to: "/linktree/empresa/editor" });
  },
  component: () => null,
});
