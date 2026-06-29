import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { AutomationRules } from "~/features/funis/components/AutomationRules";

export const funilAutomationsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/funis/funil/$funilId/automations",
  component: AutomationRules,
});
