import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";

export const empresaNpsDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/nps/design",
  component: () => <ModuloDesignPage moduloKey="nps" moduloNome="NPS" />,
});
