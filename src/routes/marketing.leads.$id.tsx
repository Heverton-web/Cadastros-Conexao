import { lazy, Suspense } from "react";
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RequirePermission } from "~/components/guards";
import { RouteFallback } from "~/components/ui/route-fallback";

const LeadDetail = lazy(() =>
  import("~/features/marketing/leads/components/LeadDetail").then((m) => ({
    default: m.LeadDetail,
  })),
);

export const marketingLeadsDetailRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/leads/$id",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_lead_ver"]}>
      <Suspense fallback={<RouteFallback />}>
        <LeadDetail />
      </Suspense>
    </RequirePermission>
  ),
});
