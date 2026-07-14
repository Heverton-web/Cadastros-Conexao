import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RequirePermission } from "~/components/guards";
import { AgentesPage } from "~/features/agentes/components/AgentesPage";

export const empresaAgentesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/agentes",
  component: () => (
    <RequirePermission modulo="agentes-ia" permissions={["agentes_ver"]}>
      <AgentesPage />
    </RequirePermission>
  ),
});
