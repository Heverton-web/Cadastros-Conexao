import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { NpsRelatoriosPage } from "~/features/nps/components/dashboard/NpsRelatoriosPage";
import { RequirePermission } from "~/components/guards";

export const npsRelatoriosRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/nps/relatorios",
  component: () => (
    <RequirePermission modulo="nps" permissions={["nps_ver_relatorios"]}>
      <NpsRelatoriosPage />
    </RequirePermission>
  ),
});
