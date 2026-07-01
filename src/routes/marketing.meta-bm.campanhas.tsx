import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { MetaCampanhasList } from "~/features/marketing/meta-bm/components/MetaCampanhasList";

export const marketingMetaBmCampanhasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/meta-bm/campanhas",
  component: MetaCampanhasList,
});
