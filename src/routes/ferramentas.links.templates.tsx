import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { TemplateManager } from "~/features/gerador-links/components/TemplateManager";

export const ferramentasLinksTemplatesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/ferramentas/links/templates",
  component: TemplateManager,
});
