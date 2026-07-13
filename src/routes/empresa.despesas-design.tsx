import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";
import { RequirePermission } from "~/components/guards";

export const empresaDespesasDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/despesas/design",
  component: () => (
    <RequirePermission modulo="empresas-core">
      <ModuloDesignPage moduloKey="despesas" moduloNome="Despesas em Rota" />
    </RequirePermission>
  ),
});
