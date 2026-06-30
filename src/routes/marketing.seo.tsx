import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { SeoAuditoria } from "~/features/marketing/seo/components/SeoAuditoria";

export const marketingSeoRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/seo",
  component: SeoAuditoria,
});
