import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { MeusRelatoriosPage } from "~/features/despesas/components/colaborador/MeusRelatoriosPage";

export const despesasMeusRelatoriosRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/despesas/meus-relatorios",
  component: MeusRelatoriosPage,
});
