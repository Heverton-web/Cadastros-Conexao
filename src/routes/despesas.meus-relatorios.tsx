import { createRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { authLayout } from "./_auth";
import { RequirePermission } from "~/components/guards";
import { RouteFallback } from "~/components/ui/route-fallback";

const MeusRelatoriosPage = lazy(() =>
  import("~/features/despesas/components/colaborador/MeusRelatoriosPage").then((m) => ({ default: m.MeusRelatoriosPage })),
);

export const despesasMeusRelatoriosRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/despesas/meus-relatorios",
  component: () => (
    <RequirePermission modulo="despesas" permissions={["despesas_lancar", "despesas_enviar"]}>
      <Suspense fallback={<RouteFallback />}>
        <MeusRelatoriosPage />
      </Suspense>
    </RequirePermission>
  ),
});
