import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { TemplateManager } from "~/features/funis/components/TemplateManager";
import { RequirePermission } from "~/components/guards";

export const funisTemplatesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/funis/templates",
  component: () => (
    <RequirePermission modulo="funis" permissions={["funis_criar_funil"]}>
      <TemplateManager />
    </RequirePermission>
  ),
});
