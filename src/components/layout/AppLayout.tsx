import { Outlet, useNavigate, useLocation, Link } from "@tanstack/react-router";
import { BottomNav } from "./BottomNav";
import { useAuth } from "~/lib/auth";
import { LogOut } from "lucide-react";
import { useNavItems } from "./useNavItems";
import { cn } from "~/lib/utils";

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, logout } = useAuth();
  const navItems = useNavItems();

  return (
    <div className="min-h-dvh bg-bg-dark">
      <header className="sticky top-0 z-40 border-b border-border-subtle bg-header-bg/95 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-8">
            <img src="/logos/logo-horizontal-branco.png" alt="Conexão" className="h-6 object-contain" />
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/") || (item.matchPaths || []).includes(location.pathname);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive ? "bg-accent/10 text-accent" : "text-text-muted hover:bg-input-bg hover:text-text-main"
                    )}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
          <span className="text-[11px] text-text-muted block truncate max-w-[120px]">{profile?.nome}</span>
          <button onClick={() => { logout(); navigate({ to: "/" }); }} className="flex items-center gap-1 text-xs text-text-muted hover:text-red-400 transition-colors">
            <LogOut size={16} />
          </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl w-full">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
