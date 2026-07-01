import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HistoricoList } from "~/features/gerador-links/components/HistoricoList";

export const ferramentasLinksHistoricoRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/ferramentas/links/historico",
  component: HistoricoList,
});
