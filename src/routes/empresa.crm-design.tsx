import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";

export const empresaCrmDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/crm/design",
  component: () => <ModuloDesignPage moduloKey="crm" moduloNome="CRM" />,
});
