import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { MetaConnect } from "~/features/marketing/meta-bm/components/MetaConnect";

export const marketingMetaBmRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/meta-bm",
  component: MetaConnect,
});
