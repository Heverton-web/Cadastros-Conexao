import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ConfigRotasPage } from "~/features/rotas/components/ConfigRotasPage";

export const empresaRotasConfigRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/rotas/config",
  component: ConfigRotasPage,
});
