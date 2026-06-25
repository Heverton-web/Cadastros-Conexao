import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { AdminChatbotPage } from "~/features/hub/pages/admin/AdminChatbotPage";

export const hubAdminChatbotRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/hub/admin/chatbot",
  component: AdminChatbotPage,
});
