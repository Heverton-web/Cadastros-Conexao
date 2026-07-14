import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { RequireSuperAdmin } from "~/components/guards";
import { ManutencaoPanel } from "~/features/manutencao/components/ManutencaoPanel";

export const globalManutencaoRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/global/manutencao",
  component: () => (
    <RequireSuperAdmin>
      <ManutencaoPanel scope="global" />
    </RequireSuperAdmin>
  ),
});
