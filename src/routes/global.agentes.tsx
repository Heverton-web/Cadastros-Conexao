import { createRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { authLayout } from "./_auth";
import { RequireSuperAdmin } from "~/components/guards";
import { RouteFallback } from "~/components/ui/route-fallback";

const GlobalAgentesPage = lazy(() =>
  import("~/features/agentes/components/GlobalAgentesPage").then((m) => ({ default: m.GlobalAgentesPage })),
);

export const globalAgentesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/global/agentes",
  component: () => (
    <RequireSuperAdmin>
      <Suspense fallback={<RouteFallback />}>
        <GlobalAgentesPage />
      </Suspense>
    </RequireSuperAdmin>
  ),
});
