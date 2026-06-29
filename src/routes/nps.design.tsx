import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";

export const npsDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/nps/design",
  component: () => <ModuloDesignPage moduloKey="nps" moduloNome="NPS" />,
});
