import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { FunilDetallePage } from "~/features/funis/components/FunilDetallePage";

export const funilDetalleRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/funis/funil/$funilId",
  component: FunilDetallePage,
});
