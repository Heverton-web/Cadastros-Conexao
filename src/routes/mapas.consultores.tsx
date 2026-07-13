import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PublicMapShell } from "~/features/mapas/components/PublicMapShell";
import { RequirePermission } from "~/components/guards";

export const mapasConsultoresRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/mapas/consultores",
  component: () => (
    <RequirePermission modulo="mapas-interativos" permissions={["mapas_ver_mapa_publico"]}>
      <PublicMapShell variant="consultores" />
    </RequirePermission>
  ),
});
