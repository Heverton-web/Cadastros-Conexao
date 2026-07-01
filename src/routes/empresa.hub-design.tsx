import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";

export const empresaHubDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/hub/design",
  component: () => (
    <ModuloDesignPage moduloKey="hub" moduloNome="Hub de Engajamento" />
  ),
});
