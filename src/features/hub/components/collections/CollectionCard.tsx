import { BookOpen, Star, CheckCircle } from "lucide-react";
import type { HubCollection, HubLanguage } from "../../types";

function colorMix(c1: string, w: number, c2: string) { return `color-mix(in srgb, ${c1} ${w}%, ${c2})`; }

interface Props { collection: HubCollection; language?: HubLanguage; itemCount?: number; completedCount?: number; onClick?: () => void; }

export function CollectionCard({ collection, language = "pt-br", itemCount = 0, completedCount = 0, onClick }: Props) {
  const title = collection.title?.[language] || collection.title?.["pt-br"] || "Sem título";
  const description = collection.description?.[language] || collection.description?.["pt-br"] || "";
  const progress = itemCount > 0 ? Math.round((completedCount / itemCount) * 100) : 0;

  return (
    <div onClick={onClick}
      className="group relative backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-pointer h-full flex flex-col"
      style={{ backgroundColor: colorMix("var(--color-surface)", 40, "rgba(30,41,59,0.4)"), border: `1px solid ${colorMix("var(--color-border)", 20, "rgba(255,255,255,0.08)")}` }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 30px var(--color-hover-shadow)"; e.currentTarget.style.borderColor = "var(--color-hover-border)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = colorMix("var(--color-border)", 20, "rgba(255,255,255,0.08)"); }}
    >
      <div className="p-6 relative z-10 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="icon-box-lg group-hover:scale-110 transition-transform duration-500"><BookOpen size={24} /></div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border border-white/5 rounded-lg backdrop-blur-sm" style={{ backgroundColor: colorMix("var(--color-surface)", 50, "rgba(30,41,59,0.5)"), color: "var(--color-text-muted)" }}>Trilha</span>
        </div>
        <h3 className="text-lg font-bold mb-2 line-clamp-2 leading-tight" style={{ color: "var(--color-text-main)" }}>{title}</h3>
        {description && <p className="text-sm mb-4 line-clamp-2" style={{ color: "var(--color-text-muted)" }}>{description}</p>}
        <div className="mt-auto">
          {itemCount > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs font-medium mb-1">
                <span style={{ color: "var(--color-text-muted)" }}>{completedCount} de {itemCount} concluídos</span>
                <span style={{ color: "var(--color-accent)" }}>{progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: "var(--color-surface)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: "var(--color-accent)" }} />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${colorMix("var(--color-border)", 15, "rgba(255,255,255,0.06)")}` }}>
            <div className="flex items-center gap-1 text-xs font-bold" style={{ color: "var(--color-text-muted)" }}><Star size={12} style={{ fill: "var(--color-warning)", color: "var(--color-warning)" }} />{collection.points} XP</div>
            {progress === 100 && itemCount > 0
              ? <span className="flex items-center gap-1 text-xs font-bold" style={{ color: "var(--color-success)" }}><CheckCircle size={12} /> Concluída</span>
              : <span className="text-xs font-bold transition-all group-hover:translate-x-1" style={{ color: "var(--color-accent)" }}>Ver trilha →</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
