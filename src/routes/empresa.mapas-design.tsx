import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";
import { RequirePermission } from "~/components/guards";

export const empresaMapasDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/mapas/design",
  component: () => (
    <RequirePermission modulo="empresas-core">
      <ModuloDesignPage moduloKey="mapas-interativos" moduloNome="Mapas" />
    </RequirePermission>
  ),
});
