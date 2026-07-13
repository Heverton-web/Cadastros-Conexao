import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";
import { RequirePermission } from "~/components/guards";

export const empresaCrmDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/crm/design",
  component: () => (
    <RequirePermission modulo="empresas-core">
      <ModuloDesignPage moduloKey="crm" moduloNome="CRM" />
    </RequirePermission>
  ),
});
