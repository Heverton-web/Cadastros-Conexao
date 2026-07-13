import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PlanejamentoRotasPage } from "~/features/rotas/components/PlanejamentoRotasPage";
import { RequirePermission } from "~/components/guards";

export const rotasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/rotas",
  component: () => (
    <RequirePermission modulo="rotas" permissions={["rotas_planejar", "rotas_executar"]}>
      <PlanejamentoRotasPage />
    </RequirePermission>
  ),
});
