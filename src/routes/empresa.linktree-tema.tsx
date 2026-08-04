import { lazy, Suspense } from "react";
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RouteFallback } from "~/components/ui/route-fallback";
const LinktreeTemaPage = lazy(() =>
  import("~/features/linktree/components/LinktreeTemaPage").then((m) => ({ default: m.LinktreeTemaPage })),
);
import { RequirePermission } from "~/components/guards";

export const empresaLinktreeTemaRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/linktree/tema",
  component: () => (
    <RequirePermission modulo="empresas-core">
      <Suspense fallback={<RouteFallback />}>
        <LinktreeTemaPage />
      </Suspense>
    </RequirePermission>
  ),
});
