import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PublicMapShell } from "~/features/mapas/components/PublicMapShell";
import { RequirePermission } from "~/components/guards";

export const mapasDistribuidoresRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/mapas/distribuidores",
  component: () => (
    <RequirePermission modulo="mapas-interativos" permissions={["mapas_ver_mapa_publico"]}>
      <PublicMapShell variant="distribuidores" />
    </RequirePermission>
  ),
});
