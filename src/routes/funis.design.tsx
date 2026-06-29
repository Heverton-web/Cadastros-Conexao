import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";

export const funisDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/funis/design",
  component: () => <ModuloDesignPage moduloKey="funis" moduloNome="Funis" />,
});
