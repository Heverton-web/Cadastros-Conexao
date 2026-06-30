import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PageHeader } from "~/components/ui/page-header";
import { EmptyState } from "~/components/ui/empty-state";
import { Crosshair } from "lucide-react";

function PixelsList() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Pixels" description="Gerenciamento de pixels de rastreamento" />
      <EmptyState icon={Crosshair} title="Pixels" description="Configure pixels para rastrear conversoes." />
    </div>
  );
}

export const marketingPixelsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/pixels",
  component: PixelsList,
});
