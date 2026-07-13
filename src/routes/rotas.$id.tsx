import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { DetalheRotaPage } from "~/features/rotas/components/DetalheRotaPage";
import { RequirePermission } from "~/components/guards";

export const rotaDetailRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/rotas/$id",
  component: () => {
    const { id } = rotaDetailRoute.useParams();
    return (
      <RequirePermission modulo="rotas" permissions={["rotas_planejar", "rotas_executar"]}>
        <DetalheRotaPage id={id} />
      </RequirePermission>
    );
  },
});
