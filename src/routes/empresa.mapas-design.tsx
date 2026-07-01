import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";

export const empresaMapasDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/mapas/design",
  component: () => (
    <ModuloDesignPage moduloKey="mapas-interativos" moduloNome="Mapas" />
  ),
});
