import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { AuthProvider } from "~/lib/auth";
import { registerModule } from "~/registry";
import { cadastrosModule } from "~/features/cadastros/module";
import { empresasModule } from "~/features/empresas/module";
import { mapasModule } from "~/features/mapas/module";
import { npsModule } from "~/features/nps/module";
import { funisModule } from "~/features/funis/module";
import { linktreeModule } from "~/features/linktree/module";
import { hubModule } from "~/features/hub/module";
import { crmModule } from "~/features/crm/module";
import { despesasModule } from "~/features/despesas/module";
import { rotasModule } from "~/features/rotas/module";
import {
  marketingModule,
  dashboardModule,
  landingPagesModule,
  metaBmModule,
  utmsModule,
  criativosModule,
  emailMarketingModule,
  seoModule,
  calendarioModule,
  leadsModule,
  pixelsModule,
  marketingLinktreeModule,
  whatsappMarketingModule,
} from "~/features/marketing";
import { initSentry } from "~/core/monitoring/sentry";
import "~/styles/globals.css";

initSentry();

registerModule(empresasModule);
registerModule(cadastrosModule);
registerModule(mapasModule);
registerModule(npsModule);
registerModule(funisModule);
registerModule(linktreeModule);
registerModule(hubModule);
registerModule(crmModule);
registerModule(despesasModule);
registerModule(rotasModule);

registerModule(marketingModule);
registerModule(dashboardModule);
registerModule(landingPagesModule);
registerModule(metaBmModule);
registerModule(utmsModule);
registerModule(criativosModule);
registerModule(emailMarketingModule);
registerModule(seoModule);
registerModule(calendarioModule);
registerModule(leadsModule);
registerModule(pixelsModule);
registerModule(marketingLinktreeModule);
registerModule(whatsappMarketingModule);

const router = createRouter({ routeTree });
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000 } },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
