import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import { registerSW } from "~/pwa/registerSW";
import { DesignSystemProvider } from "~/design-system";

registerSW();

export const rootRoute = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <DesignSystemProvider>
      <Outlet />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--color-surface)",
            color: "var(--color-text-main)",
            border: "1px solid var(--color-border-subtle)",
          },
        }}
      />
    </DesignSystemProvider>
  );
}

