import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PageHeader } from "~/components/ui/page-header";
import { GoogleMapsGenerator } from "~/features/gerador-links/components/sections/GoogleMapsGenerator";

function GoogleMapsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Google Maps"
        description="Gere link de navegação para o Google Maps com coordenadas"
      />
      <GoogleMapsGenerator />
    </div>
  );
}

export const ferramentasLinksMapsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/ferramentas/links/maps",
  component: GoogleMapsPage,
});
