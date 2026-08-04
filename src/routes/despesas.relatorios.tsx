import { createRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { authLayout } from "./_auth";
import { RequirePermission } from "~/components/guards";
import { RouteFallback } from "~/components/ui/route-fallback";

const RelatoriosDespesasPage = lazy(() =>
  import("~/features/despesas/components/admin/RelatoriosDespesasPage").then((m) => ({ default: m.RelatoriosDespesasPage })),
);

export const despesasRelatoriosRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/despesas/relatorios",
  component: () => (
    <RequirePermission modulo="despesas" permissions={["despesas_ver_relatorios"]}>
      <Suspense fallback={<RouteFallback />}>
        <RelatoriosDespesasPage />
      </Suspense>
    </RequirePermission>
  ),
});
