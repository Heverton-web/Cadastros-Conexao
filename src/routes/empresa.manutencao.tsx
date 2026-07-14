import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RequireEmpresaAdmin } from "~/components/guards";
import { ManutencaoPanel } from "~/features/manutencao/components/ManutencaoPanel";

export const empresaManutencaoRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/manutencao",
  component: () => (
    <RequireEmpresaAdmin>
      <ManutencaoPanel scope="empresa" />
    </RequireEmpresaAdmin>
  ),
});
