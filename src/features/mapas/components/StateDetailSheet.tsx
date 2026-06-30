import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { UF_NAMES, type UF } from "../constants/brazil-states";
import type { Entity } from "../types";

interface Props {
  uf: UF | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entities: Entity[];
}

export function StateDetailSheet({ uf, open, onOpenChange, entities }: Props) {
  const ufName = uf ? UF_NAMES[uf] : "";
  const distCount = entities.filter((e) => e.kind === "distributor").length;
  const consCount = entities.filter((e) => e.kind === "consultant").length;
  const [tab, setTab] = useState<"all" | "distributors" | "consultants">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = entities;
    if (tab === "distributors") list = entities.filter((e) => e.kind === "distributor");
    if (tab === "consultants") list = entities.filter((e) => e.kind === "consultant");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) => {
        const name = e.item.name.toLowerCase();
        const code = e.kind === "distributor" ? e.item.code ?? "" : e.item.registration ?? "";
        const city = e.kind === "distributor" ? e.item.city ?? "" : e.item.region ?? "";
        return name.includes(q) || code.toLowerCase().includes(q) || city.toLowerCase().includes(q);
      });
    }
    return list;
  }, [entities, tab, search]);

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setSearch("");
      setTab("all");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-md overflow-hidden border-surface bg-card p-0 gap-0 sm:rounded-2xl">
        <DialogHeader className="border-b border-surface px-5 py-4 pb-3 text-left">
          <DialogTitle className="text-lg">{uf ? `${ufName} (${uf})` : ""}</DialogTitle>
          <DialogDescription className="mt-1.5 flex flex-wrap gap-2 text-xs">
            {distCount > 0 && (
              <button
                onClick={() => setTab(tab === "distributors" ? "all" : "distributors")}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                  tab === "distributors" ? "bg-accent text-accent-fg" : "border border-accent/40 text-accent hover:bg-accent/10"
                }`}
              >
                {distCount} distribuidor(es)
              </button>
            )}
            {consCount > 0 && (
              <button
                onClick={() => setTab(tab === "consultants" ? "all" : "consultants")}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                  tab === "consultants" ? "bg-accent text-accent-fg" : "border border-accent/40 text-accent hover:bg-accent/10"
                }`}
              >
                {consCount} consultor(es)
              </button>
            )}
            {entities.length === 0 && (
              <span className="rounded-full border border-accent/40 px-2.5 py-0.5 text-xs text-accent">Sem registros</span>
            )}
          </DialogDescription>
          {entities.length > 0 && (
            <div className="relative mt-3">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, código ou cidade..."
                className="w-full rounded-lg border border-surface bg-surface/50 py-1.5 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
              />
            </div>
          )}
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] px-5 py-3 pt-2">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {search ? "Nenhum resultado encontrado." : "Sem presença neste estado."}
            </p>
          ) : (
            <ul className="w-full space-y-2">
              {filtered.map((e) => {
                const badgeText = e.kind === "distributor" ? e.item.code?.trim() : e.item.registration?.trim();
                return (
                  <li key={`${e.kind}-${e.item.id}`} className="w-full flex items-start gap-3 rounded-lg border border-surface bg-surface/50 p-3 border-l-2"
                    style={{ borderLeftColor: e.item.pin_color ?? "var(--accent)" }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium uppercase text-accent">
                          {e.kind === "distributor" ? "Dist" : "Cons"}
                        </span>
                        <p className="truncate text-sm font-medium text-foreground">{e.item.name}</p>
                        {badgeText && <span className="shrink-0 rounded-md bg-surface px-1.5 py-0.5 text-[10px] text-muted-foreground border border-surface">{badgeText}</span>}
                      </div>
                      {e.kind === "distributor" ? (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{e.item.city ?? "—"} · {e.item.category === "EXCLUSIVE" ? "Exclusivo" : "Não-exclusivo"}</p>
                      ) : (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{e.item.region ?? "—"}{e.item.supervisor ? ` · ${e.item.supervisor}` : ""}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
