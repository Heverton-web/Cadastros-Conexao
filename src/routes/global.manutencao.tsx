import { createRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { authLayout } from "./_auth";
import { RequireSuperAdmin } from "~/components/guards";
import { RouteFallback } from "~/components/ui/route-fallback";

const ManutencaoPanel = lazy(() =>
  import("~/features/manutencao/components/ManutencaoPanel").then((m) => ({ default: m.ManutencaoPanel })),
);

export const globalManutencaoRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/global/manutencao",
  component: () => (
    <RequireSuperAdmin>
      <Suspense fallback={<RouteFallback />}>
        <ManutencaoPanel />
      </Suspense>
    </RequireSuperAdmin>
  ),
});
