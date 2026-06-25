import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { HubWebhooksPage } from "~/features/hub/pages/HubWebhooksPage";

export const hubWebhooksRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/webhooks",
  component: HubWebhooksPage,
});
