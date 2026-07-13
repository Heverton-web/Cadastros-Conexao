import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";
import { RequirePermission } from "~/components/guards";

export const empresaRotasDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/rotas/design",
  component: () => (
    <RequirePermission modulo="empresas-core">
      <ModuloDesignPage moduloKey="rotas" moduloNome="Rotas de Visitas" />
    </RequirePermission>
  ),
});
