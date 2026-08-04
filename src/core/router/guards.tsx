import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "~/core/auth";
import { RouteFallback } from "~/components/ui/route-fallback";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/" });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <RouteFallback />;
  }

  return <>{children}</>;
}
