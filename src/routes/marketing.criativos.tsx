import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { CriativosList } from "~/features/marketing/criativos/components/CriativosList";

export const marketingCriativosRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/criativos",
  component: CriativosList,
});
