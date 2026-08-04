import { lazy, Suspense } from "react";
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RequirePermission } from "~/components/guards";
import { RouteFallback } from "~/components/ui/route-fallback";

const AdminMateriaisPage = lazy(() =>
  import("~/features/hub/pages/admin/AdminMateriaisPage").then((m) => ({
    default: m.AdminMateriaisPage,
  })),
);

export const hubAdminMateriaisRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/admin/materiais",
  component: () => (
    <RequirePermission modulo="hub" permissions={["hub_gerenciar_config"]}>
      <Suspense fallback={<RouteFallback />}>
        <AdminMateriaisPage />
      </Suspense>
    </RequirePermission>
  ),
});
