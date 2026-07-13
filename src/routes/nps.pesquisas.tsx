import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { NpsPesquisasPage } from "~/features/nps/components/dashboard/NpsPesquisasPage";
import { RequirePermission } from "~/components/guards";

export const npsPesquisasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/nps/pesquisas",
  component: () => (
    <RequirePermission modulo="nps" permissions={["nps_gerenciar_perguntas"]}>
      <NpsPesquisasPage />
    </RequirePermission>
  ),
});
