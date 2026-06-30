import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { BrazilMap, type PresenceByState } from "./BrazilMap";
import { StateDetailSheet } from "./StateDetailSheet";
import { EntityDetailDialog } from "./EntityDetailDialog";
import { useMapasDistributors, useMapasConsultants } from "../hooks/useMapasData";
import { ALL_UFS, UF_NAMES, UF_REGION, type UF } from "../constants/brazil-states";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "~/components/ui/accordion";

type Variant = "distribuidores" | "consultores";
type Region = "N" | "NE" | "CO" | "SE" | "S";

const REGIONS: Region[] = ["N", "NE", "CO", "SE", "S"];
const REGION_NAMES: Record<Region, string> = { N: "Norte", NE: "Nordeste", CO: "Centro-Oeste", SE: "Sudeste", S: "Sul" };

function getRegionColor(region: Region): string {
  const colors: Record<Region, string> = {
    N: "#22c55e",
    NE: "#f59e0b",
    CO: "#a78bfa",
    SE: "#ef4444",
    S: "#3b82f6",
  };
  return colors[region];
}

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
  const [filterRegion, setFilterRegion] = useState<string | null>(null);

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

  const regionStats = useMemo(() => {
    const acc = {} as Record<string, { total: number; covered: number }>;
    for (const region of REGIONS) {
      const ufs = ALL_UFS.filter((uf) => UF_REGION[uf] === region);
      const covered = ufs.filter((uf) => {
        const p = presence[uf];
        return variant === "distribuidores" ? (p?.distributors ?? 0) > 0 : (p?.consultants ?? 0) > 0;
      });
      acc[region] = { total: ufs.length, covered: covered.length };
    }
    return acc;
  }, [presence, variant]);

  const filteredCoveredStates = useMemo(() => {
    if (!filterRegion) return coveredStates;
    return coveredStates.filter((uf) => UF_REGION[uf] === filterRegion);
  }, [coveredStates, filterRegion]);

  const mode = variant === "distribuidores" ? "presence-distributors" : "presence-consultants";
  const title = variant === "distribuidores" ? "Distribuidores" : "Consultores";
  const maxDensity = coveredStates.length > 0
    ? Math.max(...coveredStates.map((uf) => (variant === "distribuidores" ? presence[uf]?.distributors ?? 0 : presence[uf]?.consultants ?? 0)))
    : 1;

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
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-accent">Mapa de Presença</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Toque em um estado para ver os detalhes.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs sm:flex-nowrap sm:text-sm">
            <div className="rounded-lg border border-surface bg-surface px-3 py-2">
              <p className="text-muted-foreground">Total</p>
              <p className="text-lg font-bold text-accent">{total}</p>
            </div>
            <div className="rounded-lg border border-surface bg-surface px-3 py-2">
              <p className="text-muted-foreground">Estados</p>
              <p className="text-lg font-bold text-accent">{coveredStates.length}/{ALL_UFS.length}</p>
            </div>
            <div className="hidden rounded-lg border border-surface bg-surface/50 px-3 py-2 sm:block">
              <p className="text-muted-foreground">Regiões</p>
              <div className="mt-0.5 flex items-center gap-2">
                {REGIONS.map((r) => {
                  const s = regionStats[r];
                  return (
                    <span key={r} className="flex items-center gap-1" style={{ color: getRegionColor(r) }}>
                      <span className="size-1.5 rounded-full" style={{ backgroundColor: getRegionColor(r) }} />
                      <span className="font-medium text-foreground">{s.covered}/{s.total}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-surface bg-surface/30 p-2 sm:p-4">
          <BrazilMap
            presenceByState={presence}
            mode={mode}
            selectedUF={selUF}
            pins={pins}
            filterRegion={filterRegion}
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
            <span className="size-3 rounded-sm" style={{ background: "var(--grad-exclusive-1)" }} />
            Com presença
          </span>
          {mode === "presence-both" && (
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-sm" style={{ background: "var(--grad-partial-1)" }} />
              Parcial
            </span>
          )}
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-sm border border-surface" style={{ background: "var(--state-empty)" }} />
            Sem presença
          </span>
        </div>

        <section className="mt-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Estados cobertos</h2>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setFilterRegion(null)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  !filterRegion ? "bg-accent text-accent-fg" : "bg-surface/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                Todas
              </button>
              {REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRegion(filterRegion === r ? null : r)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    filterRegion === r ? "bg-accent text-accent-fg" : "bg-surface/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {coveredStates.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Ainda não há {variant === "distribuidores" ? "distribuidores" : "consultores"} cadastrados.</p>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-2">
              {filteredCoveredStates.map((uf) => {
                const p = presence[uf]!;
                const n = variant === "distribuidores" ? p.distributors : p.consultants;
                const items = (variant === "distribuidores" ? distributors : consultants).filter((item) => item.state === uf);
                const region = UF_REGION[uf];
                const regionColor = getRegionColor(region);
                const density = n / maxDensity;

                return (
                  <AccordionItem key={uf} value={uf} className="border border-surface bg-surface/20 rounded-xl overflow-hidden">
                    <AccordionTrigger className="hover:no-underline py-3.5">
                      <div className="flex w-full items-center justify-between pr-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-1 shrink-0 self-stretch rounded-full" style={{ backgroundColor: regionColor }} />
                          <span className="min-w-0 truncate text-sm">
                            <span className="font-semibold text-foreground">{uf}</span>
                            <span className="ml-1 text-muted-foreground">· {UF_NAMES[uf]}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-surface sm:block">
                            <span className="block h-full rounded-full transition-all" style={{ width: `${density * 100}%`, backgroundColor: regionColor }} />
                          </span>
                          <span className="shrink-0 rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent">
                            {n} {variant === "distribuidores" ? "distribuidor(es)" : "consultor(es)"}
                          </span>
                        </div>
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
                            <li key={item.id} className="flex items-start gap-3 rounded-lg border border-surface bg-surface/40 p-4 transition-all hover:bg-surface/60 hover:border-accent/20">
                              <div className="mt-1 size-3 shrink-0 rounded-full" style={{ backgroundColor: pinColor }} />
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-semibold text-sm text-foreground truncate">{item.name}</p>
                                  {badgeText && <span className="rounded-md bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-surface">{badgeText}</span>}
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
