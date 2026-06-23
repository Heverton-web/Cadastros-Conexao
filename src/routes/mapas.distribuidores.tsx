import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PublicMapShell } from "~/features/mapas/components/PublicMapShell";

export const mapasDistribuidoresRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/mapas/distribuidores",
  component: () => <PublicMapShell variant="distribuidores" />,
});
