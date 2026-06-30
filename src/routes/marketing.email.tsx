import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PageHeader } from "~/components/ui/page-header";
import { EmptyState } from "~/components/ui/empty-state";
import { Mail } from "lucide-react";

function CampanhasList() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="E-mail Marketing" description="Campanhas e disparos de e-mail" />
      <EmptyState icon={Mail} title="Campanhas de E-mail" description="Crie sua primeira campanha de e-mail marketing." />
    </div>
  );
}

export const marketingEmailRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/email",
  component: CampanhasList,
});
