import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { MetaPostsList } from "~/features/marketing/meta-bm/components/MetaPostsList";
import { RequirePermission } from "~/components/guards";

export const marketingMetaBmPostsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/meta-bm/posts",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_meta_ver_campanhas"]}>
      <MetaPostsList />
    </RequirePermission>
  ),
});
