import { lazy, Suspense } from "react";
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RouteFallback } from "~/components/ui/route-fallback";
const ThemeEditorPanel = lazy(() =>
  import("~/features/hub/components/admin/ThemeEditorPanel").then((m) => ({ default: m.ThemeEditorPanel })),
);
import { RequirePermission } from "~/components/guards";

export const empresaHubTemaRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/hub/tema",
  component: () => (
    <RequirePermission modulo="empresas-core">
      <Suspense fallback={<RouteFallback />}>
        <ThemeEditorPanel />
      </Suspense>
    </RequirePermission>
  ),
});
