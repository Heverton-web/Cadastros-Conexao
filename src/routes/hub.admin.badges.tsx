import { lazy, Suspense } from "react";
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RequirePermission } from "~/components/guards";
import { RouteFallback } from "~/components/ui/route-fallback";

const AdminBadgesPage = lazy(() =>
  import("~/features/hub/pages/admin/AdminBadgesPage").then((m) => ({
    default: m.AdminBadgesPage,
  })),
);

export const hubAdminBadgesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/admin/badges",
  component: () => (
    <RequirePermission modulo="hub" permissions={["hub_gerenciar_config"]}>
      <Suspense fallback={<RouteFallback />}>
        <AdminBadgesPage />
      </Suspense>
    </RequirePermission>
  ),
});
