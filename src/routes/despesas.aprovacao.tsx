import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { AprovacaoDespesasPage } from "~/features/despesas/components/responsavel/AprovacaoDespesasPage";
import { RequirePermission } from "~/components/guards";

export const despesasAprovacaoRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/despesas/aprovacao",
  component: () => (
    <RequirePermission modulo="despesas" permissions={["despesas_aprovar", "despesas_reprovar"]}>
      <AprovacaoDespesasPage />
    </RequirePermission>
  ),
});
