import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { LinktreeTemaPage } from "~/features/linktree/components/LinktreeTemaPage";
import { RequirePermission } from "~/components/guards";

export const empresaLinktreeTemaRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/linktree/tema",
  component: () => (
    <RequirePermission modulo="empresas-core">
      <LinktreeTemaPage />
    </RequirePermission>
  ),
});
