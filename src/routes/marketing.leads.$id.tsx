import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PageHeader } from "~/components/ui/page-header";
import { EmptyState } from "~/components/ui/empty-state";
import { Users } from "lucide-react";

function LeadDetail() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Detalhe do Lead" description="Informacoes detalhadas do lead" />
      <EmptyState icon={Users} title="Lead" description="Detalhes do lead selecionado." />
    </div>
  );
}

export const marketingLeadsDetailRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/leads/$id",
  component: LeadDetail,
});
