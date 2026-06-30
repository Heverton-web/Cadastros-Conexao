import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PageHeader } from "~/components/ui/page-header";
import { EmptyState } from "~/components/ui/empty-state";
import { FileText } from "lucide-react";

function LandingPagesList() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Landing Pages" description="Criacao e gerenciamento de landing pages" />
      <EmptyState icon={FileText} title="Landing Pages" description="Crie sua primeira landing page para comecar a capturar leads." />
    </div>
  );
}

export const marketingLandingPagesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/landing-pages",
  component: LandingPagesList,
});
