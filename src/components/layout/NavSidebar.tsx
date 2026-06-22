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

  const w = collapsed ? "w-16" : "w-60";

  const mostrarGlobal = profile?.is_super_admin === true;
  const exibirSecaoModulos = mostrarGlobal || modulos.length > 1;

  return (
    <aside className={cn("hidden lg:flex flex-col fixed left-0 top-[70px] bottom-0 border-r border-border-subtle bg-card z-30 transition-all duration-200", w)}>
      {exibirSecaoModulos && (
        <div className={cn("flex flex-col gap-0.5 px-2 py-3 border-b border-border-subtle/50", collapsed && "items-center")}>
          {!collapsed && <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-3 mb-2">Módulos</p>}
          {mostrarGlobal && modulos.length > 0 && (
            <button
              onClick={() => onModuleChange(undefined)}
              title={collapsed ? "Global" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-lg text-sm font-medium transition-colors",
                collapsed ? "justify-center p-2" : "px-3 py-2",
                selectedModuleKey === undefined ? "bg-accent/10 text-accent" : "text-text-main hover:bg-input-bg"
              )}
            >
              <Globe size={16} />
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
                className={cn(
                  "flex items-center gap-2.5 rounded-lg text-sm font-medium transition-colors",
                  collapsed ? "justify-center p-2" : "px-3 py-2",
                  selectedModuleKey === mod.key ? "bg-accent/10 text-accent" : "text-text-main hover:bg-input-bg"
                )}
              >
                <Icon size={16} />
                {!collapsed && mod.nome}
              </button>
            );
          })}
        </div>
      )}

      <div className={cn("flex-1 overflow-y-auto py-3", collapsed ? "px-1" : "px-2")}>
        {sections.map((section) => (
          <div key={section.label} className={cn("mb-4 last:mb-0", collapsed && "flex flex-col items-center")}>
            {!collapsed && (
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-3 mb-2">
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
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg text-sm transition-colors",
                      collapsed ? "justify-center p-2" : "px-3 py-2",
                      isActive ? "bg-accent/10 text-accent" : "text-text-muted hover:text-text-main hover:bg-input-bg"
                    )}
                  >
                    <item.icon size={16} />
                    {!collapsed && item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Toggle */}
      <div className={cn("border-t border-border-subtle/50 p-2", collapsed && "flex justify-center")}>
        <button onClick={onToggleCollapse}
          className={cn("flex items-center gap-2 rounded-lg text-xs font-medium text-text-muted hover:text-text-main hover:bg-input-bg transition-colors", collapsed ? "justify-center p-2" : "px-3 py-2 w-full")}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? <PanelLeft size={16} /> : <><PanelLeftClose size={16} /> Recolher</>}
        </button>
      </div>
    </aside>
  );
}
