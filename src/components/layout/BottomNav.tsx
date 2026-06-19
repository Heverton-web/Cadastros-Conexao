import { useNavigate, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Users, UserRound, BarChart3, Link2, Shield, Settings } from "lucide-react";
import { cn } from "~/lib/utils";
import { useAuth } from "~/lib/auth";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const amb = profile?.ambiente;
  const isAdmin = amb === "cadastro" || amb === "ambos" || profile?.role === "admin";
  const isConsultor = amb === "consultor" || amb === "ambos";
  const isSuperAdmin = profile?.is_super_admin === true;

  const navItems = (isConsultor && !isAdmin ? [
    { path: "/consultor", label: "Gerar Links", icon: Link2, matchPaths: [] },
    { path: "/clientes", label: "Clientes", icon: Users, matchPaths: ["/consultor/clientes"] },
    { path: "/relatorios", label: "Relatórios", icon: BarChart3, matchPaths: [] },
  ] : [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, show: isAdmin, matchPaths: [] },
    { path: "/consultor", label: "Consultor", icon: Link2, show: isConsultor, matchPaths: [] },
    { path: "/clientes", label: "Clientes", icon: Users, matchPaths: ["/consultor/clientes"] },
    { path: "/relatorios", label: "Relatórios", icon: BarChart3, show: isAdmin, matchPaths: [] },
    { path: "/credenciais", label: "Credenciais", icon: Shield, show: isAdmin, matchPaths: [] },
    { path: "/admin/config", label: "Config", icon: Settings, show: isSuperAdmin, matchPaths: [] },
  ] as const).filter(item => item.show !== false);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border-subtle bg-header-bg/95 backdrop-blur-lg"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
        {(() => {
          const path = location.pathname;
          const matchScore = (item: typeof navItems[number]) =>
            path === item.path ? 3 : item.matchPaths.includes(path) ? 2 : path.startsWith(item.path + "/") ? 1 : 0;
          const bestMatch = navItems.reduce<string | null>((best, item) => {
            const score = matchScore(item);
            if (!score) return best;
            if (!best) return item.path;
            const bestScore = matchScore(navItems.find(i => i.path === best)!);
            if (score > bestScore) return item.path;
            if (score < bestScore) return best;
            return item.path.length > best.length ? item.path : best;
          }, null);
          return navItems.map((item) => {
            const isActive = bestMatch === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate({ to: item.path })}
                className={cn(
                  "flex min-h-[48px] flex-col items-center justify-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors",
                  isActive ? "text-accent" : "text-text-muted hover:text-text-main"
                )}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          });
        })()}
      </div>
    </nav>
  );
}
