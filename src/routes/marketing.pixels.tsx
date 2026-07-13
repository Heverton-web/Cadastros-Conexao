import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PixelsList } from "~/features/marketing/pixels/components/PixelsList";
import { RequirePermission } from "~/components/guards";

export const marketingPixelsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/pixels",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_pixel_ver"]}>
      <PixelsList />
    </RequirePermission>
  ),
});
