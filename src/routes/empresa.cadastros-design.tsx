import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";
import { RequirePermission } from "~/components/guards";

export const empresaCadastrosDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/cadastros/design",
  component: () => (
    <RequirePermission modulo="empresas-core">
      <ModuloDesignPage moduloKey="cadastros" moduloNome="Cadastros" />
    </RequirePermission>
  ),
});
