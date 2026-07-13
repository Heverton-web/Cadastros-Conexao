import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ThemeEditorPanel } from "~/features/hub/components/admin/ThemeEditorPanel";
import { RequirePermission } from "~/components/guards";

export const empresaHubTemaRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/hub/tema",
  component: () => (
    <RequirePermission modulo="empresas-core">
      <ThemeEditorPanel />
    </RequirePermission>
  ),
});
