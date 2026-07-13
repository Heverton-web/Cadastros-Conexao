import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { AutomationRules } from "~/features/funis/components/AutomationRules";
import { RequirePermission } from "~/components/guards";

export const funilAutomationsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/funis/funil/$funilId/automations",
  component: () => (
    <RequirePermission modulo="funis" permissions={["funis_gerir_colunas"]}>
      <AutomationRules />
    </RequirePermission>
  ),
});
