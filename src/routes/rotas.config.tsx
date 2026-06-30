import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ConfigRotasPage } from "~/features/rotas/components/ConfigRotasPage";

export const rotasConfigRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/rotas/config",
  component: ConfigRotasPage,
});
