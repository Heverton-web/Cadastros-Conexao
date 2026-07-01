import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { LandingPagesList } from "~/features/marketing/landing-pages/components/LandingPagesList";

export const marketingLandingPagesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/landing-pages",
  component: LandingPagesList,
});
