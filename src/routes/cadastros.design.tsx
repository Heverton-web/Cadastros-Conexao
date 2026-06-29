import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";

export const cadastrosDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/cadastros/design",
  component: () => <ModuloDesignPage moduloKey="cadastros" moduloNome="Cadastros" />,
});
