import { createRoute, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { AppLayout } from "~/components/layout/AppLayout";
import { Loader2 } from "lucide-react";
import { useAuth } from "~/lib/auth";
import { getModule, getAllModules } from "~/registry";
import { useRef } from "react";

export const authLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthGuard,
});

function AuthGuard() {
  const { user, profile, permissoes, modulosAtivos, loading } = useAuth();
  const navigate = useNavigate();
  const modulesInitialized = useRef(false);

  if (profile && permissoes && !modulesInitialized.current) {
    const mods = profile.is_super_admin
      ? getAllModules().map((m) => m.key)
      : modulosAtivos;

    for (const key of mods) {
      const mod = getModule(key);
      mod?.setup?.();
    }

    modulesInitialized.current = true;
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    navigate({ to: "/" });
    return null;
  }

  return <AppLayout />;
}
