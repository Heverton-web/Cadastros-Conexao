import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { AdminChatbotPage } from "~/features/hub/pages/admin/AdminChatbotPage";
import { RequirePermission } from "~/components/guards";

export const empresaHubChatbotRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/hub/chatbot",
  component: () => (
    <RequirePermission modulo="empresas-core">
      <AdminChatbotPage />
    </RequirePermission>
  ),
});
