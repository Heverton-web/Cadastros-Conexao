import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PageHeader } from "~/components/ui/page-header";
import { UtmGenerator } from "~/features/gerador-links/components/sections/UtmGenerator";

function UtmPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="UTM"
        description="Gere URLs com parâmetros UTM para campanhas de marketing"
      />
      <UtmGenerator />
    </div>
  );
}

export const ferramentasLinksUtmRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/ferramentas/links/utm",
  component: UtmPage,
});
