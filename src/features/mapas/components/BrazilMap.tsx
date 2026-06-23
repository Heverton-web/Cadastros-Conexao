import { useEffect, useMemo, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { Feature, FeatureCollection } from "geojson";
import { cn } from "~/lib/utils";
import { GEOJSON_NAME_TO_UF, UF_NAMES, type UF } from "../constants/brazil-states";
import type { StatePresence, MapPinData } from "../types";

export type PresenceByState = Partial<Record<UF, StatePresence>>;

type Mode = "presence-distributors" | "presence-consultants" | "presence-both" | "heatmap";

interface BrazilMapProps {
  presenceByState: PresenceByState;
  pins?: MapPinData[];
  mode?: Mode;
  onStateClick?: (uf: UF) => void;
  onPinClick?: (pin: MapPinData) => void;
  selectedUF?: UF | null;
  className?: string;
  heatmapMax?: number;
}

const WIDTH = 800;
const HEIGHT = 800;

export function BrazilMap({
  presenceByState,
  pins = [],
  mode = "presence-both",
  onStateClick,
  onPinClick,
  selectedUF = null,
  className,
  heatmapMax,
}: BrazilMapProps) {
  const [geo, setGeo] = useState<FeatureCollection | null>(null);
  const [hover, setHover] = useState<UF | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/brazil-states.geojson", { cache: "force-cache" })
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setGeo(d as FeatureCollection); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const { pathGen, projection } = useMemo(() => {
    if (!geo) return { pathGen: null, projection: null };
    const proj = geoMercator().fitSize([WIDTH, HEIGHT], geo);
    return { pathGen: geoPath(proj), projection: proj };
  }, [geo]);

  const centroids = useMemo(() => {
    if (!geo || !pathGen) return {} as Record<UF, [number, number]>;
    const acc = {} as Record<UF, [number, number]>;
    for (const feature of geo.features) {
      const name = (feature.properties as { name?: string } | null)?.name ?? "";
      const uf = GEOJSON_NAME_TO_UF[name];
      if (uf) acc[uf] = pathGen.centroid(feature) as [number, number];
    }
    return acc;
  }, [geo, pathGen]);

  const maxCount = useMemo(() => {
    if (heatmapMax != null) return heatmapMax;
    let m = 1;
    for (const v of Object.values(presenceByState)) {
      const total = (v?.distributors ?? 0) + (v?.consultants ?? 0);
      if (total > m) m = total;
    }
    return m;
  }, [presenceByState, heatmapMax]);

  function fillFor(uf: UF): string {
    const p = presenceByState[uf];
    const d = p?.distributors ?? 0;
    const c = p?.consultants ?? 0;
    if (mode === "presence-distributors") return d > 0 ? "var(--state-exclusive)" : "var(--state-empty)";
    if (mode === "presence-consultants") return c > 0 ? "var(--state-exclusive)" : "var(--state-empty)";
    if (mode === "heatmap") {
      const v = d + c;
      if (v === 0) return "var(--heat-1)";
      const ratio = v / maxCount;
      if (ratio < 0.2) return "var(--heat-2)";
      if (ratio < 0.4) return "var(--heat-3)";
      if (ratio < 0.7) return "var(--heat-4)";
      return "var(--heat-5)";
    }
    if (d > 0 && c > 0) return "var(--state-exclusive)";
    if (d > 0 || c > 0) return "var(--state-nonexclusive)";
    return "var(--state-empty)";
  }

  function isFaded(uf: UF): boolean {
    const p = presenceByState[uf];
    const d = p?.distributors ?? 0;
    const c = p?.consultants ?? 0;
    if (mode === "presence-distributors") return d === 0;
    if (mode === "presence-consultants") return c === 0;
    if (mode === "heatmap") return d + c === 0;
    return d === 0 && c === 0;
  }

  if (!geo || !pathGen) {
    return <div className={cn("aspect-square w-full animate-pulse rounded-xl bg-surface", className)} />;
  }

  const pinsByStateCount: Record<string, number> = {};

  return (
    <div className={cn("w-full", className)}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full select-none" role="img" aria-label="Mapa do Brasil">
        <g>
          {geo.features.map((feature: Feature) => {
            const name = (feature.properties as { name?: string } | null)?.name ?? "";
            const uf = GEOJSON_NAME_TO_UF[name];
            if (!uf) return null;
            const d = pathGen(feature) ?? "";
            const faded = isFaded(uf);
            const isSel = selectedUF === uf;
            const isHover = hover === uf;
            const presence = presenceByState[uf];
            const totalLabel = presence
              ? `${presence.distributors} distribuidor(es), ${presence.consultants} consultor(es)`
              : "Sem presença";

            return (
              <path
                key={uf}
                d={d}
                fill={fillFor(uf)}
                stroke={isSel ? "var(--map-stroke-selected)" : "var(--map-stroke)"}
                strokeWidth={isSel ? 2 : 0.9}
                className={cn(
                  "cursor-pointer transition-[opacity,filter,stroke] duration-150",
                  faded && "state-faded",
                  isHover && !faded && "brightness-110",
                )}
                onMouseEnter={() => setHover(uf)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onStateClick?.(uf)}
              >
                <title>{`${UF_NAMES[uf]} (${uf}) — ${totalLabel}`}</title>
              </path>
            );
          })}
        </g>

        {pins.length > 0 && (
          <g>
            {pins.map((p) => {
              const color = p.pin_color ?? "#4169e1";
              let x = 0, y = 0, hasPos = false;
              if (p.lat != null && p.lng != null && p.lat !== 0 && p.lng !== 0) {
                const coords = projection ? projection([p.lng, p.lat]) : null;
                if (coords) { [x, y] = coords; hasPos = true; }
              }
              if (!hasPos) {
                const centroid = centroids[p.state as UF];
                if (centroid) {
                  const idx = pinsByStateCount[p.state] ?? 0;
                  pinsByStateCount[p.state] = idx + 1;
                  const angle = (idx * 2 * Math.PI) / 8;
                  const radius = 10 + Math.floor(idx / 8) * 6;
                  x = centroid[0] + Math.cos(angle) * radius;
                  y = centroid[1] + Math.sin(angle) * radius;
                  hasPos = true;
                }
              }
              if (!hasPos) return null;

              return (
                <g key={p.id}>
                  <circle cx={x} cy={y} r={7} fill={color} className="animate-pulse opacity-30 pointer-events-none" />
                  <circle
                    cx={x} cy={y} r={4} fill={color} stroke="#ffffff" strokeWidth={1}
                    className="cursor-pointer transition-transform hover:scale-125"
                    onClick={(e) => { e.stopPropagation(); onPinClick?.(p); }}
                  />
                  <title>{p.name}</title>
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
