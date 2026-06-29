import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { MinhasDespesasPage } from "~/features/despesas/components/colaborador/MinhasDespesasPage";

export const despesasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/despesas",
  component: MinhasDespesasPage,
});
