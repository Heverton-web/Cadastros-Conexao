import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PublicMapShell } from "~/features/mapas/components/PublicMapShell";

export const mapasConsultoresRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/mapas/consultores",
  component: () => <PublicMapShell variant="consultores" />,
});
