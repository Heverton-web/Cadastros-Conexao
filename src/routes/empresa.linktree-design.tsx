import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";
import { RequirePermission } from "~/components/guards";

export const empresaLinktreeDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/linktree/design",
  component: () => (
    <RequirePermission modulo="empresas-core">
      <ModuloDesignPage moduloKey="linktree" moduloNome="LinkTree" />
    </RequirePermission>
  ),
});
