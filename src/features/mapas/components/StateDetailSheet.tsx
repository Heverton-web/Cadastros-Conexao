import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { UF_NAMES, type UF } from "../constants/brazil-states";
import type { Entity } from "../types";
import { Search, Building2, Users, X, MapPin } from "lucide-react";

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
    if (tab === "distributors")
      list = entities.filter((e) => e.kind === "distributor");
    if (tab === "consultants")
      list = entities.filter((e) => e.kind === "consultant");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) => {
        const name = e.item.name.toLowerCase();
        const code =
          e.kind === "distributor"
            ? (e.item.code ?? "")
            : (e.item.registration ?? "");
        const city =
          e.kind === "distributor"
            ? (e.item.city ?? "")
            : (e.item.region ?? "");
        return (
          name.includes(q) ||
          code.toLowerCase().includes(q) ||
          city.toLowerCase().includes(q)
        );
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
          <DialogTitle className="flex items-center gap-2.5 text-lg">
            <MapPin size={18} className="text-accent" />
            {uf ? `${ufName} (${uf})` : ""}
          </DialogTitle>

          {/* Abas com badges */}
          <DialogDescription className="mt-3 flex flex-wrap gap-2 text-xs">
            {distCount > 0 && (
              <button
                onClick={() =>
                  setTab(tab === "distributors" ? "all" : "distributors")
                }
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  tab === "distributors"
                    ? "bg-accent text-accent-fg shadow-md shadow-accent/20"
                    : "border border-accent/30 text-accent hover:bg-accent/10"
                }`}
              >
                <Building2 size={12} />
                {distCount} distribuidor(es)
              </button>
            )}
            {consCount > 0 && (
              <button
                onClick={() =>
                  setTab(tab === "consultants" ? "all" : "consultants")
                }
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  tab === "consultants"
                    ? "bg-accent text-accent-fg shadow-md shadow-accent/20"
                    : "border border-accent/30 text-accent hover:bg-accent/10"
                }`}
              >
                <Users size={12} />
                {consCount} consultor(es)
              </button>
            )}
            {entities.length === 0 && (
              <span className="flex items-center gap-1.5 rounded-lg border border-accent/30 px-3 py-1.5 text-xs text-accent">
                <MapPin size={12} />
                Sem registros
              </span>
            )}
          </DialogDescription>

          {/* Campo de busca */}
          {entities.length > 0 && (
            <div className="relative mt-3">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, código ou cidade..."
                className="w-full rounded-xl border border-surface bg-surface/50 py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-accent/50 focus:bg-surface/70 focus:outline-none focus:ring-1 focus:ring-accent/30"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-5 py-3 pt-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search size={28} className="mb-3 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Nenhum resultado encontrado."
                  : "Sem presença neste estado."}
              </p>
            </div>
          ) : (
            <ul className="w-full space-y-2">
              {filtered.map((e) => {
                const badgeText =
                  e.kind === "distributor"
                    ? e.item.code?.trim()
                    : e.item.registration?.trim();
                const pinColor = e.item.pin_color ?? "var(--accent)";
                return (
                  <li
                    key={`${e.kind}-${e.item.id}`}
                    className="w-full flex items-start gap-3 rounded-xl border border-surface bg-surface/50 p-3.5 transition-all hover:border-surface-hover hover:bg-surface/70 border-l-2"
                    style={{ borderLeftColor: pinColor }}
                  >
                    <div
                      className="mt-0.5 size-2.5 shrink-0 rounded-full shadow-sm"
                      style={{
                        backgroundColor: pinColor,
                        boxShadow: `0 0 6px ${pinColor}40`,
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase"
                          style={{
                            backgroundColor: `${e.kind === "distributor" ? "#22c55e" : "#3b82f6"}15`,
                            color:
                              e.kind === "distributor" ? "#22c55e" : "#3b82f6",
                          }}
                        >
                          {e.kind === "distributor" ? "Dist" : "Cons"}
                        </span>
                        <p className="truncate text-sm font-semibold text-foreground">
                          {e.item.name}
                        </p>
                        {badgeText && (
                          <span className="shrink-0 rounded-md bg-surface px-1.5 py-0.5 text-[10px] text-muted-foreground border border-surface">
                            {badgeText}
                          </span>
                        )}
                      </div>
                      {e.kind === "distributor" ? (
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {e.item.city ?? "—"} ·{" "}
                          {e.item.category === "EXCLUSIVE"
                            ? "Exclusivo"
                            : "Não-exclusivo"}
                        </p>
                      ) : (
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {e.item.region ?? "—"}
                          {e.item.supervisor ? ` · ${e.item.supervisor}` : ""}
                        </p>
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
