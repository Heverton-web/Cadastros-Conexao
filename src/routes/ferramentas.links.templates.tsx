import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { TemplateManager } from "~/features/gerador-links/components/TemplateManager";
import { RequirePermission } from "~/components/guards";

export const ferramentasLinksTemplatesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/ferramentas/links/templates",
  component: () => (
    <RequirePermission modulo="gerador-links" permissions={["lk_gerenciar_templates"]}>
      <TemplateManager />
    </RequirePermission>
  ),
});
