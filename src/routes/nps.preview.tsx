import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import NpsPreviewPage from "~/features/nps/components/dashboard/NpsPreviewPage";

export const npsPreviewRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/nps/preview",
  component: NpsPreviewPage,
});
