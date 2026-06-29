import { createRoute, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { AppLayout } from "~/components/layout/AppLayout";
import { Loader2 } from "lucide-react";
import { useAuth } from "~/lib/auth";
import { getModule, getAllModules } from "~/registry";
import { useRef, useState } from "react";

export const authLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthGuard,
});

function AuthGuard() {
  const { user, profile, permissoes, modulosAtivos, loading, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const [modulesReady, setModulesReady] = useState(false);

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

  if (profile && permissoes && !modulesReady) {
    const mods = profile.is_super_admin
      ? getAllModules().map((m) => m.key)
      : modulosAtivos;

    for (const key of mods) {
      const mod = getModule(key);
      mod?.setup?.();
    }

    // For super admin, re-fetch profile to get all permission keys (including newly registered ones)
    if (profile.is_super_admin) {
      fetchProfile(user.id);
    }

    setModulesReady(true);
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );
  }

  return <AppLayout />;
}
