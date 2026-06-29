import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";

export const crmDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/crm/design",
  component: () => <ModuloDesignPage moduloKey="crm" moduloNome="CRM" />,
});
