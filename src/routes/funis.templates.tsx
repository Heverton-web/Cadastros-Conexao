import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { TemplateManager } from "~/features/funis/components/TemplateManager";

export const funisTemplatesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/funis/templates",
  component: TemplateManager,
});
