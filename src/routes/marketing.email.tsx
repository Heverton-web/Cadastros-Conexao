import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { EmailCampanhasList } from "~/features/marketing/email-marketing/components/EmailCampanhasList";

export const marketingEmailRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/email",
  component: EmailCampanhasList,
});
