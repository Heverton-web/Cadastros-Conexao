import { lazy, Suspense } from "react";
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RequirePermission } from "~/components/guards";
import { RouteFallback } from "~/components/ui/route-fallback";

const WhatsappMarketing = lazy(() =>
  import("~/features/marketing/whatsapp/components/WhatsappMarketing").then((m) => ({
    default: m.WhatsappMarketing,
  })),
);

export const marketingWhatsappRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/whatsapp",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_wpp_ver"]}>
      <Suspense fallback={<RouteFallback />}>
        <WhatsappMarketing />
      </Suspense>
    </RequirePermission>
  ),
});
