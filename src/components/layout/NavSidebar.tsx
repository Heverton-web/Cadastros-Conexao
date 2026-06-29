import { Globe, PanelLeftClose, PanelLeft, type LucideIcon } from "lucide-react";
import { useNavItems } from "./useNavItems";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { cn } from "~/lib/utils";

import { useAuth } from "~/lib/auth";

type ModuleInfo = {
  key: string;
  nome: string;
  icon: LucideIcon;
};

export function NavSidebar({
  selectedModuleKey,
  onModuleChange,
  modulos,
  collapsed,
  onToggleCollapse,
}: {
  selectedModuleKey?: string;
  onModuleChange: (key: string | undefined) => void;
  modulos: ModuleInfo[];
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const { profile } = useAuth();
  const sections = useNavItems(selectedModuleKey);
  const location = useLocation();
  const navigate = useNavigate();

  const w = collapsed ? "w-[72px]" : "w-64";

  const mostrarGlobal = profile?.is_super_admin === true;
  const exibirSecaoModulos = mostrarGlobal || modulos.length > 1;

  return (
    <aside className={cn("hidden lg:flex flex-col fixed left-0 top-0 bottom-0 border-r border-border/50 bg-card z-30 transition-all duration-300 ease-in-out", w)}>
      {/* Logo area */}
      <div className="flex items-center h-[70px] px-4 border-b border-border/50">
        {collapsed ? (
          <div className="flex items-center justify-center w-full">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <span className="text-accent font-bold text-sm">C</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
              <span className="text-accent font-bold text-sm">C</span>
            </div>
            <span className="text-sm font-bold text-text-main truncate">Conexão ERP</span>
          </div>
        )}
      </div>

      {exibirSecaoModulos && (
        <div className={cn("flex flex-col gap-1 px-3 py-4 border-b border-border/30", collapsed && "items-center")}>
          {!collapsed && <p className="text-[10px] font-bold text-text-muted/60 uppercase tracking-widest px-3 mb-2">Módulos</p>}
          {mostrarGlobal && modulos.length > 0 && (
            <button
              onClick={() => onModuleChange(undefined)}
              title={collapsed ? "Global" : undefined}
              aria-label="Global"
              className={cn(
                "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200",
                collapsed ? "justify-center p-2.5" : "px-3 py-2.5",
                selectedModuleKey === undefined
                  ? "bg-accent/15 text-accent shadow-sm shadow-accent/10"
                  : "text-text-muted hover:text-text-main hover:bg-surface-hover"
              )}
            >
              <Globe size={18} />
              {!collapsed && "Global"}
            </button>
          )}
          {modulos.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.key}
                onClick={() => onModuleChange(mod.key)}
                title={collapsed ? mod.nome : undefined}
                aria-label={mod.nome}
                className={cn(
                  "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200",
                  collapsed ? "justify-center p-2.5" : "px-3 py-2.5",
                  selectedModuleKey === mod.key
                    ? "bg-accent/15 text-accent shadow-sm shadow-accent/10"
                    : "text-text-muted hover:text-text-main hover:bg-surface-hover"
                )}
              >
                <Icon size={18} />
                {!collapsed && mod.nome}
              </button>
            );
          })}
        </div>
      )}

      <div className={cn("flex-1 overflow-y-auto py-4 scrollbar-thin", collapsed ? "px-2" : "px-3")}>
        {sections.map((section) => (
          <div key={section.label} className={cn("mb-5 last:mb-0", collapsed && "flex flex-col items-center")}>
            {!collapsed && (
              <p className="text-[10px] font-bold text-text-muted/60 uppercase tracking-widest px-3 mb-2">
                {section.label}
              </p>
            )}
            <div className={cn("flex flex-col gap-0.5", collapsed && "items-center")}>
              {section.items.map((item) => {
                const isActive = location.pathname === item.path || (item.matchPaths || []).includes(location.pathname) || (!item.noChildMatch && location.pathname.startsWith(item.path + "/"));
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate({ to: item.path })}
                    title={collapsed ? item.label : undefined}
                    aria-label={item.label}
                    className={cn(
                      "flex items-center gap-3 rounded-xl text-sm transition-all duration-200 relative group",
                      collapsed ? "justify-center p-2.5" : "px-3 py-2.5",
                      isActive
                        ? "bg-accent/15 text-accent font-semibold"
                        : "text-text-muted hover:text-text-main hover:bg-surface-hover"
                    )}
                  >
                    {/* Active indicator bar */}
                    {isActive && !collapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent rounded-r-full" />
                    )}
                    <item.icon size={18} className={cn(isActive && "text-accent")} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Toggle */}
      <div className={cn("border-t border-border/30 p-3", collapsed && "flex justify-center")}>
        <button
          onClick={onToggleCollapse}
          className={cn(
            "flex items-center gap-2 rounded-xl text-xs font-medium text-text-muted hover:text-text-main hover:bg-surface-hover transition-all duration-200",
            collapsed ? "justify-center p-2.5" : "px-3 py-2.5 w-full"
          )}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? <PanelLeft size={18} /> : <><PanelLeftClose size={18} /> <span>Recolher</span></>}
        </button>
      </div>
    </aside>
  );
}
