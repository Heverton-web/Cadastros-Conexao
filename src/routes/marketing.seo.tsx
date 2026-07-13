import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { SeoAuditoria } from "~/features/marketing/seo/components/SeoAuditoria";
import { RequirePermission } from "~/components/guards";

export const marketingSeoRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/seo",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_seo_ver"]}>
      <SeoAuditoria />
    </RequirePermission>
  ),
});
