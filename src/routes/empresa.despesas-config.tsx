import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ConfigDespesasPage } from "~/features/despesas/components/admin/ConfigDespesasPage";
import { RequirePermission } from "~/components/guards";

export const empresaDespesasConfigRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/despesas-config",
  component: () => (
    <RequirePermission modulo="empresas-core">
      <ConfigDespesasPage />
    </RequirePermission>
  ),
});
