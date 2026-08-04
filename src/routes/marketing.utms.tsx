import { lazy, Suspense } from "react";
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RequirePermission } from "~/components/guards";
import { RouteFallback } from "~/components/ui/route-fallback";

const UtmHistory = lazy(() =>
  import("~/features/marketing/utms/components/UtmHistory").then((m) => ({
    default: m.UtmHistory,
  })),
);

export const marketingUtmsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/utms",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_utm_ver"]}>
      <Suspense fallback={<RouteFallback />}>
        <UtmHistory />
      </Suspense>
    </RequirePermission>
  ),
});
