import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { CalendarioGrid } from "~/features/marketing/calendario-editorial/components/CalendarioGrid";

export const marketingCalendarioRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/calendario",
  component: CalendarioGrid,
});
