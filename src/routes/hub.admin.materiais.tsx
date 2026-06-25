import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { AdminMateriaisPage } from "~/features/hub/pages/admin/AdminMateriaisPage";

export const hubAdminMateriaisRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/admin/materiais",
  component: AdminMateriaisPage,
});
