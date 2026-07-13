import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { DashboardPage } from "~/features/gerador-links/components/DashboardPage";
import { RequirePermission } from "~/components/guards";

export const ferramentasLinksRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/ferramentas/links",
  component: () => (
    <RequirePermission modulo="gerador-links" permissions={["lk_ver"]}>
      <DashboardPage />
    </RequirePermission>
  ),
});
