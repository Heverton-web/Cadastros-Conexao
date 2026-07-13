import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";
import { RequirePermission } from "~/components/guards";

export const empresaHubDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/hub/design",
  component: () => (
    <RequirePermission modulo="empresas-core">
      <ModuloDesignPage moduloKey="hub" moduloNome="Hub de Engajamento" />
    </RequirePermission>
  ),
});
