import { lazy, Suspense } from "react";
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RouteFallback } from "~/components/ui/route-fallback";
const ConfigDespesasPage = lazy(() =>
  import("~/features/despesas/components/admin/ConfigDespesasPage").then((m) => ({
    default: m.ConfigDespesasPage,
  })),
);
import { RequirePermission } from "~/components/guards";

export const empresaDespesasConfigRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/despesas-config",
  component: () => (
    <RequirePermission modulo="empresas-core">
      <Suspense fallback={<RouteFallback />}>
        <ConfigDespesasPage />
      </Suspense>
    </RequirePermission>
  ),
});
