import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useAuth } from "~/lib/auth";
import { ArrowLeft, BookOpen, Star, Trophy, CheckCircle, PlayCircle, ChevronRight } from "lucide-react";
import { fetchHubCollectionById, fetchHubCollectionItems } from "../services/collections";
import { fetchHubUserProgress } from "../services/progress";

function colorMix(c1: string, w: number, c2: string) { return `color-mix(in srgb, ${c1} ${w}%, ${c2})`; }

export function HubTrilhaDetailPage() {
  const { trilhaId } = useParams({ strict: false }) as { trilhaId: string };
  const { user, empresa } = useAuth();
  const navigate = useNavigate();

  const { data: collection } = useQuery({ queryKey: ["hub-collection", trilhaId], queryFn: () => fetchHubCollectionById(trilhaId), enabled: !!trilhaId });
  const { data: items = [] } = useQuery({ queryKey: ["hub-collection-items", trilhaId], queryFn: () => fetchHubCollectionItems(trilhaId), enabled: !!trilhaId });
  const { data: progress = [] } = useQuery({ queryKey: ["hub-progress", user?.id, empresa?.id], queryFn: () => fetchHubUserProgress(user!.id, empresa!.id), enabled: !!user?.id && !!empresa?.id });

  const completedIds = new Set(progress.filter((p) => p.status === "completed").map((p) => p.material_id));
  const completedCount = items.filter((it) => completedIds.has(it.material_id)).length;
  const progressPct = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  if (!collection) return <div className="p-6" style={{ color: "var(--color-text-muted)" }}>Carregando...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={() => navigate({ to: "/hub/trilhas" })} className="mb-6 flex items-center gap-2 text-sm font-semibold transition-all hover:opacity-70" style={{ color: "var(--color-text-muted)" }}>
        <ArrowLeft size={16} /> Voltar para Trilhas
      </button>

      <div className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden mb-6 sm:mb-10">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colorMix("var(--color-accent)", 20, "rgba(201,166,85,0.2)")}, ${colorMix("var(--color-accent)", 5, "rgba(201,166,85,0.05)")})` }} />
        {collection.cover_image && <img src={collection.cover_image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />}
        <div className="relative z-10 p-5 sm:p-8 md:p-10">
          <div className="flex items-center gap-2 mb-3"><BookOpen size={20} style={{ color: "var(--color-accent)" }} /><span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-accent)" }}>Trilha de Aprendizagem</span></div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--color-text-main)" }}>{collection.title?.["pt-br"] || "Trilha"}</h2>
          {collection.description?.["pt-br"] && <p className="text-base mb-6 max-w-2xl" style={{ color: "var(--color-text-muted)" }}>{collection.description["pt-br"]}</p>}
          <div className="flex flex-wrap items-center gap-6">
            <div className="space-y-2 flex-1 min-w-[200px]">
              <div className="flex justify-between text-sm font-medium">
                <span style={{ color: "var(--color-text-muted)" }}>{completedCount} de {items.length} concluídos</span>
                <span style={{ color: "var(--color-accent)" }}>{progressPct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: "var(--color-surface)" }}><div className="h-full rounded-full transition-all" style={{ width: `${progressPct}%`, backgroundColor: "var(--color-accent)" }} /></div>
            </div>
            {collection.points > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm" style={{ backgroundColor: colorMix("var(--color-accent)", 15, "rgba(201,166,85,0.15)"), color: "var(--color-accent)" }}>
                <Star size={16} style={{ fill: "var(--color-warning)", color: "var(--color-warning)" }} /> {collection.points} XP ao concluir
              </div>
            )}
            {progressPct === 100 && items.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm" style={{ backgroundColor: "var(--color-success-bg)", color: "var(--color-success)" }}><Trophy size={16} /> Trilha concluída!</div>
            )}
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-[2rem] border border-white/5 text-center" style={{ backgroundColor: colorMix("var(--color-surface)", 20, "rgba(30,41,59,0.2)") }}>
          <BookOpen size={40} className="mb-3 opacity-30" style={{ color: "var(--color-text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Esta trilha ainda não tem materiais.</p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3 pb-20">
          {items.map((item, idx) => {
            const isCompleted = completedIds.has(item.material_id);
            const matTitle = item.hub_materials?.title?.["pt-br"] || "Sem título";
            return (
              <div key={item.id} className="flex flex-row items-center gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5 transition-all hover:border-[var(--color-accent)]/30" style={{ backgroundColor: colorMix("var(--color-surface)", 50, "rgba(30,41,59,0.5)") }}>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-xs sm:text-sm"
                  style={isCompleted ? { backgroundColor: "var(--color-success-bg)", color: "var(--color-success)" } : { backgroundColor: colorMix("var(--color-accent)", 10, "rgba(201,166,85,0.1)"), color: "var(--color-accent)" }}>
                  {isCompleted ? <CheckCircle size={18} /> : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-semibold truncate" style={{ color: "var(--color-text-main)" }}>{matTitle}</p>
                  <div className="flex items-center gap-2 sm:gap-3 mt-0.5 flex-wrap">
                    <span className="text-[10px] sm:text-xs uppercase font-bold" style={{ color: "var(--color-text-muted)" }}>{item.hub_materials?.type}</span>
                    {item.hub_materials?.points > 0 && <span className="text-[10px] sm:text-xs font-bold flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}><Star size={10} style={{ fill: "var(--color-warning)", color: "var(--color-warning)" }} />{item.hub_materials.points} XP</span>}
                    {isCompleted && <span className="text-[10px] sm:text-xs font-bold" style={{ color: "var(--color-success)" }}>Concluído</span>}
                  </div>
                </div>
                <button className="liquid-glass-gold flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all hover:opacity-80 active:scale-95 whitespace-nowrap shrink-0" style={{ color: "var(--color-accent)" }}>
                  {isCompleted ? "Revisar" : "Iniciar"} <ChevronRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
