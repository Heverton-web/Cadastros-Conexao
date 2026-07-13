import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";
import { RequirePermission } from "~/components/guards";

export const empresaFunisDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/funis/design",
  component: () => (
    <RequirePermission modulo="empresas-core">
      <ModuloDesignPage moduloKey="funis" moduloNome="Funis de Venda" />
    </RequirePermission>
  ),
});
