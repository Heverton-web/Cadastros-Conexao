import { lazy, Suspense } from "react";
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RequirePermission } from "~/components/guards";
import { RouteFallback } from "~/components/ui/route-fallback";

const FunisDashboardPage = lazy(() =>
  import("~/features/funis/components/FunisDashboardPage").then((m) => ({
    default: m.FunisDashboardPage,
  })),
);

export const funisDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/funis/dashboard",
  component: () => (
    <RequirePermission modulo="funis" permissions={["funis_ver_dashboard"]}>
      <Suspense fallback={<RouteFallback />}>
        <FunisDashboardPage />
      </Suspense>
    </RequirePermission>
  ),
});
