import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubMaterialDetailPage } from "~/features/hub/pages/HubMaterialDetailPage";

export const hubMaterialDetailRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/materiais/$materialId",
  component: HubMaterialDetailPage,
});
