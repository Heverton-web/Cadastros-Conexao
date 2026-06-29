import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";

export const despesasDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/despesas/design",
  component: () => <ModuloDesignPage moduloKey="despesas" moduloNome="Despesas em Rota" />,
});
