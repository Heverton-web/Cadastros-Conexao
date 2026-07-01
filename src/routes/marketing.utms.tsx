import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { UtmHistory } from "~/features/marketing/utms/components/UtmHistory";

export const marketingUtmsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/utms",
  component: UtmHistory,
});
