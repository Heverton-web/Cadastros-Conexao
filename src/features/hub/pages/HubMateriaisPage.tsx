import { useQuery } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import { FileText } from "lucide-react";
import { fetchHubMaterials } from "../services/materials";
import { MaterialCard } from "../components/materials/MaterialCard";

function colorMix(c1: string, w: number, c2: string) { return `color-mix(in srgb, ${c1} ${w}%, ${c2})`; }

export function HubMateriaisPage() {
  const { empresa } = useAuth();
  const { data: materials = [] } = useQuery({ queryKey: ["hub-materials", empresa?.id], queryFn: () => fetchHubMaterials(empresa!.id), enabled: !!empresa?.id });
  const active = materials.filter((m) => m.active);

  return (
    <div className="space-y-6">
      <div className="relative group rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden animate-fade-in">
        <div className="absolute inset-0 opacity-40" style={{ background: `linear-gradient(to right, ${colorMix("var(--color-accent)", 10, "rgba(201,166,85,0.1)")}, ${colorMix("var(--color-gradient-mid)", 10, "rgba(232,212,139,0.1)")}, transparent)` }} />
        <div className="relative z-10 p-5 sm:p-8 md:p-10">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: "var(--color-text-main)" }}>Materiais</h1>
          <p className="text-sm sm:text-base max-w-lg font-medium" style={{ color: "var(--color-text-muted)" }}>{active.length} materiais disponíveis.</p>
        </div>
      </div>
      {active.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-[2rem] border border-white/5 text-center px-4" style={{ backgroundColor: colorMix("var(--color-surface)", 20, "rgba(30,41,59,0.2)") }}>
          <FileText size={48} className="mb-4 opacity-30" style={{ color: "var(--color-text-muted)" }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-text-main)" }}>Nenhum material disponível</h3>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Os materiais de treinamento serão exibidos aqui.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
          {active.map((m, i) => <div key={m.id} className="animate-slide-up" style={{ animationDelay: `${i * 70}ms` }}><MaterialCard material={m} /></div>)}
        </div>
      )}
    </div>
  );
}
