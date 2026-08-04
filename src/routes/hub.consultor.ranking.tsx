import { lazy, Suspense } from "react";
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RequirePermission } from "~/components/guards";
import { RouteFallback } from "~/components/ui/route-fallback";

const HubRankingPage = lazy(() =>
  import("~/features/hub/pages/HubRankingPage").then((m) => ({
    default: m.HubRankingPage,
  })),
);

export const hubConsultorRankingRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/consultor/ranking",
  component: () => (
    <RequirePermission modulo="hub" permissions={["hub_ver_materiais"]}>
      <Suspense fallback={<RouteFallback />}>
        <HubRankingPage />
      </Suspense>
    </RequirePermission>
  ),
});
