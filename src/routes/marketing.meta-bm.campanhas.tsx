import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PageHeader } from "~/components/ui/page-header";
import { EmptyState } from "~/components/ui/empty-state";
import { Target } from "lucide-react";

function CampaignDashboard() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Campanhas Meta" description="Gerencie suas campanhas no Facebook e Instagram" />
      <EmptyState icon={Target} title="Campanhas" description="Conecte sua conta Meta para visualizar e gerenciar campanhas." />
    </div>
  );
}

export const marketingMetaBmCampanhasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/meta-bm/campanhas",
  component: CampaignDashboard,
});
