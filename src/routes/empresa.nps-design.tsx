import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";
import { RequirePermission } from "~/components/guards";

export const empresaNpsDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/nps/design",
  component: () => (
    <RequirePermission modulo="empresas-core">
      <ModuloDesignPage moduloKey="nps" moduloNome="NPS" />
    </RequirePermission>
  ),
});
