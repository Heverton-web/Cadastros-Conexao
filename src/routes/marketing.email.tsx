import { lazy, Suspense } from "react";
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RequirePermission } from "~/components/guards";
import { RouteFallback } from "~/components/ui/route-fallback";

const EmailCampanhasList = lazy(() =>
  import("~/features/marketing/email-marketing/components/EmailCampanhasList").then((m) => ({
    default: m.EmailCampanhasList,
  })),
);

export const marketingEmailRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/email",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_email_ver"]}>
      <Suspense fallback={<RouteFallback />}>
        <EmailCampanhasList />
      </Suspense>
    </RequirePermission>
  ),
});
