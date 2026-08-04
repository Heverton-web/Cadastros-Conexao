import { lazy, Suspense } from "react";
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RequirePermission } from "~/components/guards";
import { RouteFallback } from "~/components/ui/route-fallback";

const SeoAuditoria = lazy(() =>
  import("~/features/marketing/seo/components/SeoAuditoria").then((m) => ({
    default: m.SeoAuditoria,
  })),
);

export const marketingSeoRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/seo",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_seo_ver"]}>
      <Suspense fallback={<RouteFallback />}>
        <SeoAuditoria />
      </Suspense>
    </RequirePermission>
  ),
});
