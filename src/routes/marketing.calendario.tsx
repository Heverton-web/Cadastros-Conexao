import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { CalendarioGrid } from "~/features/marketing/calendario-editorial/components/CalendarioGrid";
import { RequirePermission } from "~/components/guards";

export const marketingCalendarioRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/calendario",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_cal_ver"]}>
      <CalendarioGrid />
    </RequirePermission>
  ),
});
