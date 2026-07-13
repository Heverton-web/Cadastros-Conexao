import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { MetaCampanhasList } from "~/features/marketing/meta-bm/components/MetaCampanhasList";
import { RequirePermission } from "~/components/guards";

export const marketingMetaBmCampanhasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/meta-bm/campanhas",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_meta_ver_campanhas"]}>
      <MetaCampanhasList />
    </RequirePermission>
  ),
});
