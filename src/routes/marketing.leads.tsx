import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PageHeader } from "~/components/ui/page-header";
import { EmptyState } from "~/components/ui/empty-state";
import { Users } from "lucide-react";

function LeadsList() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Leads" description="Gestao e qualificacao de leads" />
      <EmptyState icon={Users} title="Leads" description="Comece a capturar e gerenciar seus leads." />
    </div>
  );
}

export const marketingLeadsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/leads",
  component: LeadsList,
});
