import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";

export const linktreeDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/linktree/design",
  component: () => <ModuloDesignPage moduloKey="linktree" moduloNome="LinkTree" />,
});
