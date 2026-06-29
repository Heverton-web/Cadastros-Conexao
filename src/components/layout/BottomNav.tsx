import { useNavigate, useLocation } from "@tanstack/react-router";
import { cn } from "~/lib/utils";
import { useNavItems } from "./useNavItems";

export function BottomNav({ selectedModuleKey }: { selectedModuleKey?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const sections = useNavItems(selectedModuleKey);
  const navItems = sections.flatMap((s) => s.items);

  const path = location.pathname;
  const matchScore = (item: { path: string; matchPaths?: string[] }) =>
    path === item.path ? 3 : (item.matchPaths || []).includes(path) ? 2 : path.startsWith(item.path + "/") ? 1 : 0;
  const bestMatch = navItems.reduce<string | null>((best, item) => {
    const score = matchScore(item);
    if (!score) return best;
    if (!best) return item.path;
    const bestScore = matchScore(navItems.find(i => i.path === best)!);
    if (score > bestScore) return item.path;
    if (score < bestScore) return best;
    return item.path.length > best.length ? item.path : best;
  }, null);

  const maxItems = 5;
  const visibleItems = navItems.slice(0, maxItems);
  const overflowItems = navItems.length > maxItems ? navItems.slice(maxItems) : [];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-header-bg/95 backdrop-blur-lg lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      role="navigation"
      aria-label="Navegação mobile"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 pt-1.5 pb-1">
        {visibleItems.map((item) => {
          const isActive = bestMatch === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate({ to: item.path })}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center min-w-[56px] min-h-[52px] px-1 py-1 rounded-lg transition-colors duration-150",
                isActive
                  ? "text-accent"
                  : "text-text-muted hover:text-text-main"
              )}
            >
              <item.icon size={20} />
              <span className={cn(
                "text-xs mt-0.5 leading-tight truncate max-w-[52px]",
                isActive ? "font-semibold" : "font-medium"
              )}>
                {item.label}
              </span>
              {isActive && (
                <span className="mt-0.5 w-1 h-1 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
        {overflowItems.length > 0 && (
          <button
            className="flex flex-col items-center justify-center min-w-[56px] min-h-[52px] px-1 py-1 rounded-lg text-text-muted hover:text-text-main transition-colors duration-150"
            aria-label="Mais opções"
          >
            <span className="text-lg leading-none">···</span>
            <span className="text-xs mt-0.5 font-medium">Mais</span>
          </button>
        )}
      </div>
    </nav>
  );
}
