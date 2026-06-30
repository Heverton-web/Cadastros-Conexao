import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PageHeader } from "~/components/ui/page-header";
import { EmptyState } from "~/components/ui/empty-state";
import { Palette } from "lucide-react";

function CriativosList() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Criativos" description="Gerencie seus criativos de marketing" />
      <EmptyState icon={Palette} title="Criativos" description="Adicione imagens, videos e criativos para suas campanhas." />
    </div>
  );
}

export const marketingCriativosRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/criativos",
  component: CriativosList,
});
