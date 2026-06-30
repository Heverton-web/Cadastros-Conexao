import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { BrazilMap, type PresenceByState } from "./BrazilMap";
import { StateDetailSheet } from "./StateDetailSheet";
import { EntityDetailDialog } from "./EntityDetailDialog";
import {
  useMapasDistributors,
  useMapasConsultants,
} from "../hooks/useMapasData";
import {
  ALL_UFS,
  UF_NAMES,
  UF_REGION,
  type UF,
} from "../constants/brazil-states";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/components/ui/accordion";
import { Building2, Users, MapPin, BarChart3 } from "lucide-react";
import type { Entity } from "../types";

type Variant = "distribuidores" | "consultores";
type Region = "N" | "NE" | "CO" | "SE" | "S";

const REGIONS: Region[] = ["N", "NE", "CO", "SE", "S"];
const REGION_NAMES: Record<Region, string> = {
  N: "Norte",
  NE: "Nordeste",
  CO: "Centro-Oeste",
  SE: "Sudeste",
  S: "Sul",
};

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
      acc[uf] = {
        distributors: (acc[uf]?.distributors ?? 0) + 1,
        consultants: acc[uf]?.consultants ?? 0,
      };
    }
    for (const c of consultants) {
      const uf = c.state as UF;
      acc[uf] = {
        distributors: acc[uf]?.distributors ?? 0,
        consultants: (acc[uf]?.consultants ?? 0) + 1,
      };
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
      return distributors
        .filter((d) => d.state === selUF)
        .map((item) => ({ kind: "distributor" as const, item }));
    }
    return consultants
      .filter((c) => c.state === selUF)
      .map((item) => ({ kind: "consultant" as const, item }));
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

  const total =
    variant === "distribuidores" ? distributors.length : consultants.length;
  const coveredStates = ALL_UFS.filter((uf) => {
    const p = presence[uf];
    return variant === "distribuidores"
      ? (p?.distributors ?? 0) > 0
      : (p?.consultants ?? 0) > 0;
  });

  const regionStats = useMemo(() => {
    const acc = {} as Record<string, { total: number; covered: number }>;
    for (const region of REGIONS) {
      const ufs = ALL_UFS.filter((uf) => UF_REGION[uf] === region);
      const covered = ufs.filter((uf) => {
        const p = presence[uf];
        return variant === "distribuidores"
          ? (p?.distributors ?? 0) > 0
          : (p?.consultants ?? 0) > 0;
      });
      acc[region] = { total: ufs.length, covered: covered.length };
    }
    return acc;
  }, [presence, variant]);

  const filteredCoveredStates = useMemo(() => {
    if (!filterRegion) return coveredStates;
    return coveredStates.filter((uf) => UF_REGION[uf] === filterRegion);
  }, [coveredStates, filterRegion]);

  const mode =
    variant === "distribuidores"
      ? "presence-distributors"
      : "presence-consultants";
  const title = variant === "distribuidores" ? "Distribuidores" : "Consultores";
  const Icon = variant === "distribuidores" ? Building2 : Users;
  const maxDensity =
    coveredStates.length > 0
      ? Math.max(
          ...coveredStates.map((uf) =>
            variant === "distribuidores"
              ? (presence[uf]?.distributors ?? 0)
              : (presence[uf]?.consultants ?? 0),
          ),
        )
      : 1;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-surface bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <button
            onClick={() => navigate({ to: "/" })}
            className="flex min-w-0 items-center gap-2"
          >
            <span className="bg-gradient-to-r from-accent via-accent-hover to-accent bg-clip-text text-lg font-bold text-transparent">
              Conexão
            </span>
          </button>

          <nav className="flex items-center gap-1 rounded-xl border border-surface bg-surface/50 p-1">
            <button
              onClick={() => navigate({ to: "/mapas/distribuidores" })}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
                variant === "distribuidores"
                  ? "bg-accent text-accent-fg shadow-md shadow-accent/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              <Building2 size={14} />
              Distribuidores
            </button>
            <button
              onClick={() => navigate({ to: "/mapas/consultores" })}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
                variant === "consultores"
                  ? "bg-accent text-accent-fg shadow-md shadow-accent/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              <Users size={14} />
              Consultores
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pt-10">
        {/* Título + Stats */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Icon size={18} className="text-accent" />
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Mapa de Presença
              </p>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Toque em um estado para ver os detalhes.
            </p>
          </div>

          {/* Cards de stats */}
          <div className="flex flex-wrap gap-2 text-xs sm:flex-nowrap sm:text-sm">
            <div className="rounded-xl border border-surface bg-surface/40 px-3.5 py-2.5 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <BarChart3 size={12} />
                <span>Total</span>
              </div>
              <p className="mt-0.5 text-lg font-bold text-accent">{total}</p>
            </div>
            <div className="rounded-xl border border-surface bg-surface/40 px-3.5 py-2.5 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin size={12} />
                <span>Estados</span>
              </div>
              <p className="mt-0.5 text-lg font-bold text-accent">
                {coveredStates.length}
                <span className="text-sm font-normal text-muted-foreground">
                  /{ALL_UFS.length}
                </span>
              </p>
            </div>
            {/* Stats por região - desktop */}
            <div className="hidden rounded-xl border border-surface bg-surface/40 px-3.5 py-2.5 backdrop-blur-sm sm:block">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <BarChart3 size={12} />
                <span>Regiões</span>
              </div>
              <div className="mt-1 flex items-center gap-2.5">
                {REGIONS.map((r) => {
                  const s = regionStats[r];
                  const pct = Math.round((s.covered / s.total) * 100);
                  return (
                    <div
                      key={r}
                      className="flex flex-col items-center gap-0.5"
                      title={`${REGION_NAMES[r]}: ${s.covered}/${s.total} (${pct}%)`}
                    >
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: getRegionColor(r) }}
                      >
                        {r}
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        {s.covered}/{s.total}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-surface bg-surface/30 p-2 shadow-xl shadow-black/20 sm:p-4">
          <BrazilMap
            presenceByState={presence}
            mode={mode}
            selectedUF={selUF}
            pins={pins}
            filterRegion={filterRegion}
            onStateClick={(uf) => {
              setSelUF(uf);
              setSheetOpen(true);
            }}
            onPinClick={(pin) => {
              const dist = distributors.find((d) => d.id === pin.id);
              if (dist) {
                setSelectedEntity({ kind: "distributor", item: dist });
                setSelUF(pin.state as UF);
                return;
              }
              const cons = consultants.find((c) => c.id === pin.id);
              if (cons) {
                setSelectedEntity({ kind: "consultant", item: cons });
                setSelUF(pin.state as UF);
              }
            }}
          />
        </div>

        {/* Legenda contextual */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span
              className="size-3 rounded-sm shadow-sm"
              style={{
                background:
                  "linear-gradient(135deg, var(--grad-exclusive-1), var(--grad-exclusive-2))",
              }}
            />
            Com presença
          </span>
          {(mode as string) === "presence-both" && (
            <span className="flex items-center gap-2">
              <span
                className="size-3 rounded-sm shadow-sm"
                style={{
                  background:
                    "linear-gradient(135deg, var(--grad-partial-1), var(--grad-partial-2))",
                }}
              />
              Parcial
            </span>
          )}
          <span className="flex items-center gap-2">
            <span
              className="size-3 rounded-sm border border-surface"
              style={{ background: "var(--state-empty)" }}
            />
            Sem presença
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={12} className="text-accent" />
            Pin no mapa
          </span>
        </div>

        {/* Estados cobertos */}
        <section className="mt-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Estados cobertos</h2>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setFilterRegion(null)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  !filterRegion
                    ? "bg-accent text-accent-fg shadow-md shadow-accent/20"
                    : "bg-surface/50 text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                }`}
              >
                Todas
              </button>
              {REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRegion(filterRegion === r ? null : r)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    filterRegion === r
                      ? "text-accent-fg shadow-md"
                      : "bg-surface/50 text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                  }`}
                  style={
                    filterRegion === r
                      ? {
                          backgroundColor: getRegionColor(r),
                          boxShadow: `0 4px 12px ${getRegionColor(r)}40`,
                        }
                      : {}
                  }
                >
                  {REGION_NAMES[r]}
                </button>
              ))}
            </div>
          </div>

          {coveredStates.length === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface bg-surface/20 py-12 text-center">
              <MapPin size={32} className="mb-3 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Ainda não há{" "}
                {variant === "distribuidores"
                  ? "distribuidores"
                  : "consultores"}{" "}
                cadastrados.
              </p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-2">
              {filteredCoveredStates.map((uf) => {
                const p = presence[uf]!;
                const n =
                  variant === "distribuidores" ? p.distributors : p.consultants;
                const items = (
                  variant === "distribuidores" ? distributors : consultants
                ).filter((item) => item.state === uf);
                const region = UF_REGION[uf];
                const regionColor = getRegionColor(region);
                const density = n / maxDensity;

                return (
                  <AccordionItem
                    key={uf}
                    value={uf}
                    className="group overflow-hidden rounded-xl border border-surface bg-surface/20 transition-all hover:border-surface-hover hover:bg-surface/30"
                  >
                    <AccordionTrigger className="hover:no-underline py-3.5 px-4">
                      <div className="flex w-full items-center justify-between pr-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className="w-1 shrink-0 self-stretch rounded-full transition-all group-hover:w-1.5"
                            style={{ backgroundColor: regionColor }}
                          />
                          <span className="min-w-0 truncate text-sm">
                            <span className="font-bold text-foreground">
                              {uf}
                            </span>
                            <span className="ml-1 text-muted-foreground">
                              · {UF_NAMES[uf]}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-surface sm:block">
                            <span
                              className="block h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${density * 100}%`,
                                backgroundColor: regionColor,
                              }}
                            />
                          </span>
                          <span
                            className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors"
                            style={{
                              backgroundColor: `${regionColor}15`,
                              color: regionColor,
                            }}
                          >
                            {n}{" "}
                            {variant === "distribuidores"
                              ? "distribuidor(es)"
                              : "consultor(es)"}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 border-t border-surface/55 px-4">
                      <ul className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
                        {items.map((item) => {
                          const isDist = variant === "distribuidores";
                          const pinColor = item.pin_color ?? "#4169e1";
                          const badgeText = isDist
                            ? (item as any).code?.trim()
                            : (item as any).registration?.trim();
                          return (
                            <li
                              key={item.id}
                              className="flex items-start gap-3 rounded-xl border border-surface bg-surface/40 p-4 transition-all hover:border-accent/20 hover:bg-surface/60"
                            >
                              <div
                                className="mt-0.5 size-3 shrink-0 rounded-full shadow-sm"
                                style={{
                                  backgroundColor: pinColor,
                                  boxShadow: `0 0 8px ${pinColor}40`,
                                }}
                              />
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="truncate text-sm font-semibold text-foreground">
                                    {item.name}
                                  </p>
                                  {badgeText && (
                                    <span className="rounded-md bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-surface">
                                      {badgeText}
                                    </span>
                                  )}
                                </div>
                                {isDist ? (
                                  <div className="space-y-0.5 text-xs text-muted-foreground">
                                    <p>
                                      <span className="font-medium text-foreground">
                                        Localização:
                                      </span>{" "}
                                      {(item as any).city}
                                    </p>
                                    <p>
                                      <span className="font-medium text-foreground">
                                        Categoria:
                                      </span>{" "}
                                      {(item as any).category === "EXCLUSIVE"
                                        ? "Exclusivo"
                                        : "Não-exclusivo"}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="space-y-0.5 text-xs text-muted-foreground">
                                    <p>
                                      <span className="font-medium text-foreground">
                                        Região:
                                      </span>{" "}
                                      {(item as any).region}
                                    </p>
                                    {(item as any).supervisor && (
                                      <p>
                                        <span className="font-medium text-foreground">
                                          Supervisor:
                                        </span>{" "}
                                        {(item as any).supervisor}
                                      </p>
                                    )}
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

      <StateDetailSheet
        uf={selUF}
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setSelUF(null);
        }}
        entities={entitiesForSel}
      />
      <EntityDetailDialog
        entity={selectedEntity}
        open={!!selectedEntity}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedEntity(null);
            if (!sheetOpen) setSelUF(null);
          }
        }}
      />
    </div>
  );
}
