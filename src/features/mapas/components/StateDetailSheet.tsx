import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-md overflow-hidden border-surface bg-card p-0 gap-0 sm:rounded-2xl">
        <DialogHeader className="border-b border-surface px-5 py-4 pb-3 text-left">
          <DialogTitle className="text-lg">{uf ? `${ufName} (${uf})` : ""}</DialogTitle>
          <DialogDescription className="mt-1.5 flex flex-wrap gap-2 text-xs">
            {distCount > 0 && <Badge variant="outline" className="border-accent/40 text-accent">{distCount} distribuidor(es)</Badge>}
            {consCount > 0 && <Badge variant="outline" className="border-accent/40 text-accent">{consCount} consultor(es)</Badge>}
            {entities.length === 0 && <Badge variant="outline" className="border-accent/40 text-accent">Sem registros</Badge>}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] px-5 py-3 pt-2">
          {entities.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Sem presença neste estado.</p>
          ) : (
            <ul className="w-full space-y-2">
              {entities.map((e) => {
                const badgeText = e.kind === "distributor" ? e.item.code?.trim() : e.item.registration?.trim();
                return (
                  <li key={`${e.kind}-${e.item.id}`} className="w-full flex items-start gap-3 rounded-lg border border-surface bg-surface/50 p-3">
                    <div className="mt-1 size-3 shrink-0 rounded-full" style={{ backgroundColor: e.item.pin_color ?? "var(--accent)" }} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-foreground">{e.item.name}</p>
                        {badgeText && <Badge variant="secondary" className="shrink-0 text-[10px]">{badgeText}</Badge>}
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
