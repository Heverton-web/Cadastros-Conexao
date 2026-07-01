import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";

export const empresaRotasDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/rotas/design",
  component: () => (
    <ModuloDesignPage moduloKey="rotas" moduloNome="Rotas de Visitas" />
  ),
});
