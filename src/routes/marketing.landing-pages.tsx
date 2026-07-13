import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { LandingPagesList } from "~/features/marketing/landing-pages/components/LandingPagesList";
import { RequirePermission } from "~/components/guards";

export const marketingLandingPagesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/landing-pages",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_lp_ver"]}>
      <LandingPagesList />
    </RequirePermission>
  ),
});
