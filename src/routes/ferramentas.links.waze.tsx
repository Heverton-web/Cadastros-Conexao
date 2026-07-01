import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PageHeader } from "~/components/ui/page-header";
import { WazeGenerator } from "~/features/gerador-links/components/sections/WazeGenerator";

function WazePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Waze"
        description="Gere link de navegação para o Waze com coordenadas"
      />
      <WazeGenerator />
    </div>
  );
}

export const ferramentasLinksWazeRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/ferramentas/links/waze",
  component: WazePage,
});
