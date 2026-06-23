import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { NpsRelatoriosPage } from "~/features/nps/components/dashboard/NpsRelatoriosPage";

export const npsRelatoriosRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/nps/relatorios",
  component: NpsRelatoriosPage,
});
