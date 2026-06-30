import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PlanejamentoRotasPage } from "~/features/rotas/components/PlanejamentoRotasPage";

export const rotasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/rotas",
  component: PlanejamentoRotasPage,
});
