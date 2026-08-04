import { lazy, Suspense } from "react";
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RequirePermission } from "~/components/guards";
import { RouteFallback } from "~/components/ui/route-fallback";

const PixelsList = lazy(() =>
  import("~/features/marketing/pixels/components/PixelsList").then((m) => ({
    default: m.PixelsList,
  })),
);

export const marketingPixelsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/pixels",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_pixel_ver"]}>
      <Suspense fallback={<RouteFallback />}>
        <PixelsList />
      </Suspense>
    </RequirePermission>
  ),
});
