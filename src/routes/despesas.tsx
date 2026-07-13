import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { MinhasDespesasPage } from "~/features/despesas/components/colaborador/MinhasDespesasPage";
import { RequirePermission } from "~/components/guards";

export const despesasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/despesas",
  component: () => (
    <RequirePermission modulo="despesas" permissions={["despesas_lancar"]}>
      <MinhasDespesasPage />
    </RequirePermission>
  ),
});
