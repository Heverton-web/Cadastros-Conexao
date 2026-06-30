import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { LeadsList } from "~/features/marketing/leads/components/LeadsList";

export const marketingLeadsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/leads",
  component: LeadsList,
});
