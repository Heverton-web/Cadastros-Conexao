import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PixelsList } from "~/features/marketing/pixels/components/PixelsList";

export const marketingPixelsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/pixels",
  component: PixelsList,
});
