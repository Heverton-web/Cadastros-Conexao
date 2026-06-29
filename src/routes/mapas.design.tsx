import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";

export const mapasDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/mapas/design",
  component: () => <ModuloDesignPage moduloKey="mapas-interativos" moduloNome="Mapas" />,
});
