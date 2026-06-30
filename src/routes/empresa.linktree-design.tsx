import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";

export const empresaLinktreeDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/linktree/design",
  component: () => <ModuloDesignPage moduloKey="linktree" moduloNome="LinkTree" />,
});
