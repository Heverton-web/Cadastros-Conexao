import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { FunilDetallePage } from "~/features/funis/components/FunilDetallePage";
import { RequirePermission } from "~/components/guards";

export const funilDetalleRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/funis/funil/$funilId",
  component: () => (
    <RequirePermission modulo="funis" permissions={["funis_ver_dashboard"]}>
      <FunilDetallePage />
    </RequirePermission>
  ),
});
