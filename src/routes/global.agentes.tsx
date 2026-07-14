import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RequireSuperAdmin } from "~/components/guards";
import { GlobalAgentesPage } from "~/features/agentes/components/GlobalAgentesPage";

export const globalAgentesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/global/agentes",
  component: () => (
    <RequireSuperAdmin>
      <GlobalAgentesPage />
    </RequireSuperAdmin>
  ),
});
