import { Outlet, useNavigate } from "@tanstack/react-router";
import { BottomNav } from "./BottomNav";
import { useAuth } from "~/lib/auth";
import { LogOut } from "lucide-react";

export function AppLayout() {
  const navigate = useNavigate();
  const { profile, logout } = useAuth();

  return (
    <div className="min-h-dvh bg-bg-dark">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border-subtle bg-header-bg/95 backdrop-blur-lg px-4 py-3">
        <div className="flex items-center gap-2">
          <img src="/logos/logo-horizontal-branco.png" alt="Conexão" className="h-6 object-contain" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-text-muted block truncate max-w-[120px]">{profile?.nome}</span>
          <button onClick={() => { logout(); navigate({ to: "/" }); }} className="flex items-center gap-1 text-xs text-text-muted hover:text-red-400 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-lg">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
