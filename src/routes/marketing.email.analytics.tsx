import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PageHeader } from "~/components/ui/page-header";
import { EmptyState } from "~/components/ui/empty-state";
import { BarChart3 } from "lucide-react";

function EmailAnalytics() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Analytics E-mail" description="Metricas das campanhas de e-mail" />
      <EmptyState icon={BarChart3} title="Analytics" description="Visualize as metricas das suas campanhas de e-mail." />
    </div>
  );
}

export const marketingEmailAnalyticsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/email/analytics",
  component: EmailAnalytics,
});
