import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { LeadDetail } from "~/features/marketing/leads/components/LeadDetail";

export const marketingLeadsDetailRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/leads/$id",
  component: LeadDetail,
});
