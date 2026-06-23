import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { NpsPesquisasPage } from "~/features/nps/components/dashboard/NpsPesquisasPage";

export const npsPesquisasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/nps/pesquisas",
  component: NpsPesquisasPage,
});
