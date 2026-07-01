import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";

export const empresaDespesasDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/despesas/design",
  component: () => (
    <ModuloDesignPage moduloKey="despesas" moduloNome="Despesas em Rota" />
  ),
});
