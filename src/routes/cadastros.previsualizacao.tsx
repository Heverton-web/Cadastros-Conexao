import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import PrevisualizacaoPage from "~/features/precadastro/PrevisualizacaoPage";

export const previsualizacaoRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/cadastros/previsualizacao",
  component: PrevisualizacaoPage,
});
