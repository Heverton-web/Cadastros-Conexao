import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { EmpresaLinktreeDashboard } from "~/features/linktree/components/EmpresaLinktreeDashboard";
import { RequirePermission } from "~/components/guards";

export const empresaLinktreeDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/linktree/empresa",
  component: () => (
    <RequirePermission modulo="linktree" permissions={["lt_empresa_ver"]}>
      <EmpresaLinktreeDashboard />
    </RequirePermission>
  ),
});
