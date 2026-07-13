import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RelatoriosDespesasPage } from "~/features/despesas/components/admin/RelatoriosDespesasPage";
import { RequirePermission } from "~/components/guards";

export const despesasRelatoriosRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/despesas/relatorios",
  component: () => (
    <RequirePermission modulo="despesas" permissions={["despesas_ver_relatorios"]}>
      <RelatoriosDespesasPage />
    </RequirePermission>
  ),
});
