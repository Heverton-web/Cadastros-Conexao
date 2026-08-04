import { lazy, Suspense } from "react";
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RouteFallback } from "~/components/ui/route-fallback";
const ModuloDesignPage = lazy(() =>
  import("~/design-system/components/ModuloDesignPage").then((m) => ({ default: m.ModuloDesignPage })),
);
import { RequirePermission } from "~/components/guards";

export const empresaMapasDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/mapas/design",
  component: () => (
    <RequirePermission modulo="empresas-core">
      <Suspense fallback={<RouteFallback />}>
        <ModuloDesignPage moduloKey="mapas-interativos" moduloNome="Mapas" />
      </Suspense>
    </RequirePermission>
  ),
});
