import { X, Globe, type LucideIcon } from "lucide-react";
import { useNavItems, useModulos } from "./useNavItems";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { cn } from "~/lib/utils";

type ModuleInfo = {
  key: string;
  nome: string;
  icon: LucideIcon;
};

export function ModuleDrawer({
  open,
  onClose,
  selectedModuleKey,
  onModuleChange,
  modulos,
}: {
  open: boolean;
  onClose: () => void;
  selectedModuleKey?: string;
  onModuleChange: (key: string | undefined) => void;
  modulos: ModuleInfo[];
}) {
  const sections = useNavItems(selectedModuleKey);
  const location = useLocation();
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-72 max-w-[85vw] bg-card border-l border-border-subtle shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Módulos</span>
          <button onClick={onClose} className="p-1 rounded-lg text-text-muted hover:text-text-main hover:bg-input-bg transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-0.5 px-2 py-3 border-b border-border-subtle/50">
          {modulos.length > 0 && (
            <button
              onClick={() => { onModuleChange(undefined); onClose(); }}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                selectedModuleKey === undefined ? "bg-accent/10 text-accent" : "text-text-main hover:bg-input-bg"
              )}
            >
              <Globe size={16} />
              Global
              {selectedModuleKey === undefined && <span className="ml-auto text-[10px] text-accent">Ativo</span>}
            </button>
          )}
          {modulos.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.key}
                onClick={() => { onModuleChange(mod.key); onClose(); }}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  selectedModuleKey === mod.key ? "bg-accent/10 text-accent" : "text-text-main hover:bg-input-bg"
                )}
              >
                <Icon size={16} />
                {mod.nome}
                {selectedModuleKey === mod.key && <span className="ml-auto text-[10px] text-accent">Ativo</span>}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3">
          {sections.map((section) => (
            <div key={section.label} className="mb-4 last:mb-0">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-3 mb-2">
                {section.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path || (item.matchPaths || []).includes(location.pathname) || (!item.noChildMatch && location.pathname.startsWith(item.path + "/"));
                  return (
                    <button
                      key={item.path}
                      onClick={() => { navigate({ to: item.path }); onClose(); }}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                        isActive ? "bg-accent/10 text-accent" : "text-text-muted hover:text-text-main hover:bg-input-bg"
                      )}
                    >
                      <item.icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
