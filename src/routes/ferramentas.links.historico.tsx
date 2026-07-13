import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HistoricoList } from "~/features/gerador-links/components/HistoricoList";
import { RequirePermission } from "~/components/guards";

export const ferramentasLinksHistoricoRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/ferramentas/links/historico",
  component: () => (
    <RequirePermission modulo="gerador-links" permissions={["lk_ver"]}>
      <HistoricoList />
    </RequirePermission>
  ),
});
