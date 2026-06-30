import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ConfigDespesasPage } from "~/features/despesas/components/admin/ConfigDespesasPage";

export const empresaDespesasConfigRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/despesas-config",
  component: ConfigDespesasPage,
});
