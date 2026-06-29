import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { EmpresaLinktreeDashboard } from "~/features/linktree/components/EmpresaLinktreeDashboard";

export const empresaLinktreeDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/linktree/empresa",
  component: EmpresaLinktreeDashboard,
});
