import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ThemeEditorPanel } from "~/features/hub/components/admin/ThemeEditorPanel";

export const hubAdminThemesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/admin/themes",
  component: ThemeEditorPanel,
});
