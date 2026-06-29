import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RelatoriosDespesasPage } from "~/features/despesas/components/admin/RelatoriosDespesasPage";

export const despesasRelatoriosRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/despesas/relatorios",
  component: RelatoriosDespesasPage,
});
