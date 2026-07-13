import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { MeusRelatoriosPage } from "~/features/despesas/components/colaborador/MeusRelatoriosPage";
import { RequirePermission } from "~/components/guards";

export const despesasMeusRelatoriosRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/despesas/meus-relatorios",
  component: () => (
    <RequirePermission modulo="despesas" permissions={["despesas_lancar", "despesas_enviar"]}>
      <MeusRelatoriosPage />
    </RequirePermission>
  ),
});
