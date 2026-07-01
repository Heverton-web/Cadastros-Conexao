import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PageHeader } from "~/components/ui/page-header";
import { WhatsappGenerator } from "~/features/gerador-links/components/sections/WhatsappGenerator";

function WhatsappPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="WhatsApp"
        description="Gere links wa.me paraWhatsApp com mensagem personalizada"
      />
      <WhatsappGenerator />
    </div>
  );
}

export const ferramentasLinksWhatsappRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/ferramentas/links/whatsapp",
  component: WhatsappPage,
});
