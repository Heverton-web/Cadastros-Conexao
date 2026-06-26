import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ThemeEditorPanel } from "~/features/hub/components/admin/ThemeEditorPanel";

export const empresaHubTemaRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/hub/tema",
  component: ThemeEditorPanel,
});
