import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { UtmHistory } from "~/features/marketing/utms/components/UtmHistory";
import { RequirePermission } from "~/components/guards";

export const marketingUtmsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/utms",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_utm_ver"]}>
      <UtmHistory />
    </RequirePermission>
  ),
});
