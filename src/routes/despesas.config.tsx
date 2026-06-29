import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ConfigDespesasPage } from "~/features/despesas/components/admin/ConfigDespesasPage";

export const despesasConfigRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/despesas/config",
  component: ConfigDespesasPage,
});
