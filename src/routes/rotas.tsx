import { createRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { authLayout } from "./_auth";
import { RequirePermission } from "~/components/guards";
import { RouteFallback } from "~/components/ui/route-fallback";

const PlanejamentoRotasPage = lazy(() =>
  import("~/features/rotas/components/PlanejamentoRotasPage").then((m) => ({ default: m.PlanejamentoRotasPage })),
);

export const rotasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/rotas",
  component: () => (
    <RequirePermission modulo="rotas" permissions={["rotas_planejar", "rotas_executar"]}>
      <Suspense fallback={<RouteFallback />}>
        <PlanejamentoRotasPage />
      </Suspense>
    </RequirePermission>
  ),
});
