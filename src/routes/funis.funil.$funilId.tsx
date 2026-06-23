import { createRoute } from "@tanstack/react-router";
import { funisRoute } from "./funis";
import { FunilDetallePage } from "~/features/funis/components/FunilDetallePage";

export const funilDetalleRoute = createRoute({
  getParentRoute: () => funisRoute,
  path: "/funil/$funilId",
  component: FunilDetallePage,
});
