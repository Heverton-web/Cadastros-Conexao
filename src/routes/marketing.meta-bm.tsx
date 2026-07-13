import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { MetaConnect } from "~/features/marketing/meta-bm/components/MetaConnect";
import { RequirePermission } from "~/components/guards";

export const marketingMetaBmRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/meta-bm",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_meta_ver_campanhas"]}>
      <MetaConnect />
    </RequirePermission>
  ),
});
