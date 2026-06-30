import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { DetalheRotaPage } from "~/features/rotas/components/DetalheRotaPage";

export const rotaDetailRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/rotas/$id",
  component: () => {
    const { id } = rotaDetailRoute.useParams();
    return <DetalheRotaPage id={id} />;
  },
});
