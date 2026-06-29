import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { AprovacaoDespesasPage } from "~/features/despesas/components/responsavel/AprovacaoDespesasPage";

export const despesasAprovacaoRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/despesas/aprovacao",
  component: AprovacaoDespesasPage,
});
