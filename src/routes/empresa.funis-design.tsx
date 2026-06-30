import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";

export const empresaFunisDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/funis/design",
  component: () => <ModuloDesignPage moduloKey="funis" moduloNome="Funis de Venda" />,
});
