import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { LinktreeTemaPage } from "~/features/linktree/components/LinktreeTemaPage";

export const empresaLinktreeTemaRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/linktree/tema",
  component: LinktreeTemaPage,
});
