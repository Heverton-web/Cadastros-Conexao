import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";

export const hubDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/design",
  component: () => <ModuloDesignPage moduloKey="hub" moduloNome="Hub" />,
});
