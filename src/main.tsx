import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { AuthProvider } from "~/lib/auth";
import { registerModule } from "~/registry";
import { cadastrosModule } from "~/features/cadastros/module";
import { empresasModule } from "~/features/empresas/module";
import { mapasModule } from "~/features/mapas/module";
import "~/styles/globals.css";

registerModule(cadastrosModule);
registerModule(empresasModule);
registerModule(mapasModule);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
