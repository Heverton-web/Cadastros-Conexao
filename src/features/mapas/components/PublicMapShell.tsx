import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { BrazilMap, type PresenceByState } from "./BrazilMap";
import { StateDetailSheet } from "./StateDetailSheet";
import { EntityDetailDialog } from "./EntityDetailDialog";
import { useMapasDistributors, useMapasConsultants } from "../hooks/useMapasData";
import { ALL_UFS, UF_NAMES, type UF } from "../constants/brazil-states";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";

type Variant = "distribuidores" | "consultores";

export function PublicMapShell({ variant }: { variant: Variant }) {
  const distQ = useMapasDistributors();
  const consQ = useMapasConsultants();
  const navigate = useNavigate();

  const distributors = distQ.data ?? [];
  const consultants = consQ.data ?? [];

  const presence: PresenceByState = useMemo(() => {
    const acc: PresenceByState = {};
    for (const d of distributors) {
      const uf = d.state as UF;
      acc[uf] = { distributors: (acc[uf]?.distributors ?? 0) + 1, consultants: acc[uf]?.consultants ?? 0 };
    }
    for (const c of consultants) {
      const uf = c.state as UF;
      acc[uf] = { distributors: acc[uf]?.distributors ?? 0, consultants: (acc[uf]?.consultants ?? 0) + 1 };
    }
    return acc;
  }, [distributors, consultants]);

  const [selUF, setSelUF] = useState<UF | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  const entitiesForSel = useMemo(() => {
    if (!selUF) return [] as Entity[];
    if (variant === "distribuidores") {
      return distributors.filter((d) => d.state === selUF).map((item) => ({ kind: "distributor" as const, item }));
    }
    return consultants.filter((c) => c.state === selUF).map((item) => ({ kind: "consultant" as const, item }));
  }, [selUF, variant, distributors, consultants]);

  const pins = useMemo(() => {
    const list = variant === "distribuidores" ? distributors : consultants;
    return list.map((item) => ({
      id: item.id,
      lat: item.lat,
      lng: item.lng,
      pin_color: item.pin_color,
      name: item.name,
      state: item.state as UF,
    }));
  }, [variant, distributors, consultants]);

  const total = variant === "distribuidores" ? distributors.length : consultants.length;
  const coveredStates = ALL_UFS.filter((uf) => {
    const p = presence[uf];
    return variant === "distribuidores" ? (p?.distributors ?? 0) > 0 : (p?.consultants ?? 0) > 0;
  });

  const mode = variant === "distribuidores" ? "presence-distributors" : "presence-consultants";
  const title = variant === "distribuidores" ? "Distribuidores" : "Consultores";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-surface bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <button onClick={() => navigate({ to: "/" })} className="flex min-w-0 items-center gap-2">
            <span className="text-lg font-bold text-accent">Conexão</span>
          </button>

          <nav className="flex items-center gap-1 rounded-lg border border-surface bg-surface/50 p-1">
            <button
              onClick={() => navigate({ to: "/mapas/distribuidores" })}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                variant === "distribuidores" ? "bg-accent text-accent-fg" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Distribuidores
            </button>
            <button
              onClick={() => navigate({ to: "/mapas/consultores" })}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                variant === "consultores" ? "bg-accent text-accent-fg" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Consultores
            </button>
          </nav>

          <button
            onClick={() => navigate({ to: "/mapas/admin/insights" })}
            className="shrink-0 rounded-md border border-accent/40 px-3 py-2 text-xs font-medium text-accent hover:bg-accent/10 sm:text-sm"
          >
            Admin
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-accent">Mapa</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Toque em um estado para ver os detalhes.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs sm:flex sm:text-sm">
            <div className="rounded-lg border border-surface bg-surface px-3 py-2">
              <p className="text-muted-foreground">Total</p>
              <p className="text-lg font-bold text-accent">{total}</p>
            </div>
            <div className="rounded-lg border border-surface bg-surface px-3 py-2">
              <p className="text-muted-foreground">Estados cobertos</p>
              <p className="text-lg font-bold text-accent">{coveredStates.length}/{ALL_UFS.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-surface bg-surface/30 p-2 sm:p-4">
          <BrazilMap
            presenceByState={presence}
            mode={mode}
            selectedUF={selUF}
            pins={pins}
            onStateClick={(uf) => { setSelUF(uf); setSheetOpen(true); }}
            onPinClick={(pin) => {
              const dist = distributors.find((d) => d.id === pin.id);
              if (dist) { setSelectedEntity({ kind: "distributor", item: dist }); setSelUF(pin.state as UF); return; }
              const cons = consultants.find((c) => c.id === pin.id);
              if (cons) { setSelectedEntity({ kind: "consultant", item: cons }); setSelUF(pin.state as UF); }
            }}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-sm" style={{ background: "var(--state-exclusive)" }} />
            Com presença
          </span>
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-sm border border-surface state-faded" style={{ background: "var(--state-empty)" }} />
            Sem presença
          </span>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-4">Estados cobertos</h2>
          {coveredStates.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Ainda não há {variant === "distribuidores" ? "distribuidores" : "consultores"} cadastrados.</p>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-2">
              {coveredStates.map((uf) => {
                const p = presence[uf]!;
                const n = variant === "distribuidores" ? p.distributors : p.consultants;
                const items = (variant === "distribuidores" ? distributors : consultants).filter((item) => item.state === uf);

                return (
                  <AccordionItem key={uf} value={uf} className="border border-surface bg-surface/20 rounded-xl overflow-hidden px-4">
                    <AccordionTrigger className="hover:no-underline py-3.5">
                      <div className="flex w-full items-center justify-between pr-4">
                        <span className="min-w-0 truncate text-sm">
                          <span className="font-semibold text-foreground">{uf}</span>
                          <span className="ml-1 text-muted-foreground">· {UF_NAMES[uf]}</span>
                        </span>
                        <span className="ml-2 shrink-0 rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent">
                          {n} {variant === "distribuidores" ? "distribuidor(es)" : "consultor(es)"}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 border-t border-surface/55">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        {items.map((item) => {
                          const isDist = variant === "distribuidores";
                          const pinColor = item.pin_color ?? "#4169e1";
                          const badgeText = isDist
                            ? (item as any).code?.trim()
                            : (item as any).registration?.trim();
                          return (
                            <li key={item.id} className="flex items-start gap-3 rounded-lg border border-surface bg-surface/40 p-4 transition-all hover:bg-surface/60">
                              <div className="mt-1 size-3 shrink-0 rounded-full" style={{ backgroundColor: pinColor }} />
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-semibold text-sm text-foreground truncate">{item.name}</p>
                                  {badgeText && <Badge variant="secondary" className="text-[10px] py-0 px-1.5 shrink-0 bg-surface text-muted-foreground border border-surface">{badgeText}</Badge>}
                                </div>
                                {isDist ? (
                                  <div className="text-xs text-muted-foreground space-y-0.5">
                                    <p><span className="font-medium text-foreground">Localização:</span> {(item as any).city}</p>
                                    <p><span className="font-medium text-foreground">Categoria:</span> {(item as any).category === "EXCLUSIVE" ? "Exclusivo" : "Não-exclusivo"}</p>
                                  </div>
                                ) : (
                                  <div className="text-xs text-muted-foreground space-y-0.5">
                                    <p><span className="font-medium text-foreground">Região:</span> {(item as any).region}</p>
                                    {(item as any).supervisor && <p><span className="font-medium text-foreground">Supervisor:</span> {(item as any).supervisor}</p>}
                                  </div>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </section>
      </main>

      <StateDetailSheet uf={selUF} open={sheetOpen} onOpenChange={(open) => { setSheetOpen(open); if (!open) setSelUF(null); }} entities={entitiesForSel} />
      <EntityDetailDialog entity={selectedEntity} open={!!selectedEntity} onOpenChange={(open) => { if (!open) { setSelectedEntity(null); if (!sheetOpen) setSelUF(null); }}} />
    </div>
  );
}
