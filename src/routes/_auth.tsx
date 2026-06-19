import { createRoute, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { AppLayout } from "~/components/layout/AppLayout";
import { Loader2 } from "lucide-react";
import { useAuth } from "~/lib/auth";

export const authLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthGuard,
});

function AuthGuard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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
