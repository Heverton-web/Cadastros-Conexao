import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PageHeader } from "~/components/ui/page-header";
import { QrCodeGenerator } from "~/features/gerador-links/components/sections/QrCodeGenerator";

function QrCodePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="QR Code"
        description="Gere QR Codes para qualquer URL"
      />
      <QrCodeGenerator />
    </div>
  );
}

export const ferramentasLinksQrcodeRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/ferramentas/links/qrcode",
  component: QrCodePage,
});
