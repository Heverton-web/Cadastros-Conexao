import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { AdminUsuariosPage } from "~/features/hub/pages/admin/AdminUsuariosPage";

export const hubAdminUsuariosRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/admin/usuarios",
  component: AdminUsuariosPage,
});
