import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "~/lib/auth";
import { BookOpen } from "lucide-react";
import { fetchHubCollections } from "../services/collections";
import { CollectionCard } from "../components/collections/CollectionCard";

function colorMix(c1: string, w: number, c2: string) { return `color-mix(in srgb, ${c1} ${w}%, ${c2})`; }

export function HubTrilhasPage() {
  const { empresa } = useAuth();
  const navigate = useNavigate();
  const { data: collections = [] } = useQuery({ queryKey: ["hub-collections", empresa?.id], queryFn: () => fetchHubCollections(empresa!.id), enabled: !!empresa?.id });

  return (
    <div className="space-y-6">
      <div className="relative group rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden animate-fade-in">
        <div className="absolute inset-0 opacity-60" style={{ background: `linear-gradient(to right, ${colorMix("var(--color-accent)", 10, "rgba(201,166,85,0.1)")}, ${colorMix("var(--color-gradient-mid)", 10, "rgba(232,212,139,0.1)")}, transparent)` }} />
        <div className="relative z-10 p-5 sm:p-8 md:p-10">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: "var(--color-text-main)" }}>Trilhas de Aprendizado</h1>
          <p className="text-sm sm:text-base max-w-lg font-medium" style={{ color: "var(--color-text-muted)" }}>Complete trilhas, acumule XP e avance de nível.</p>
        </div>
      </div>
      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-[2rem] text-center px-4 border border-white/5" style={{ backgroundColor: colorMix("var(--color-surface)", 20, "rgba(30,41,59,0.2)") }}>
          <BookOpen size={48} className="mb-4 opacity-30" style={{ color: "var(--color-text-muted)" }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-text-main)" }}>Nenhuma trilha disponível</h3>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>As trilhas de aprendizagem serão exibidas aqui.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
          {collections.map((col, i) => (
            <div key={col.id} className="animate-slide-up" style={{ animationDelay: `${i * 70}ms` }}>
              <CollectionCard collection={col} itemCount={col.hub_collection_items?.[0]?.count || 0} onClick={() => navigate({ to: "/hub/trilhas/$trilhaId", params: { trilhaId: col.id } })} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
