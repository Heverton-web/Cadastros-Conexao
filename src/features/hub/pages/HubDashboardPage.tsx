import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "~/lib/auth";
import { Search, Grid, FileText, Image as ImageIcon, Video, Filter, Layers, Sparkles, BookOpen, Tag, Star, Headphones, Globe, Trophy } from "lucide-react";
import { fetchHubMaterials } from "../services/materials";
import { fetchHubCollections } from "../services/collections";
import { fetchHubUserProgress } from "../services/progress";
import { MaterialCard } from "../components/materials/MaterialCard";
import { CollectionCard } from "../components/collections/CollectionCard";
import { getHubUserLevel, getHubNextLevelThreshold } from "../types";
import type { HubMaterialType } from "../types";

function colorMix(c1: string, w: number, c2: string) { return `color-mix(in srgb, ${c1} ${w}%, ${c2})`; }

export function HubDashboardPage() {
  const { user, empresa } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<HubMaterialType | "all">("all");
  const [filterTag, setFilterTag] = useState("");
  const [activeView, setActiveView] = useState<"materials" | "collections">("materials");

  const userPoints = (user as any)?.hub_points || 0;
  const userLevel = getHubUserLevel(userPoints);
  const nextThreshold = getHubNextLevelThreshold(userPoints);
  const levelProgress = nextThreshold > 0 ? Math.min(100, Math.round((userPoints / nextThreshold) * 100)) : 100;

  const { data: materials = [], isLoading } = useQuery({ queryKey: ["hub-materials", empresa?.id], queryFn: () => fetchHubMaterials(empresa!.id), enabled: !!empresa?.id });
  const { data: collections = [] } = useQuery({ queryKey: ["hub-collections", empresa?.id], queryFn: () => fetchHubCollections(empresa!.id), enabled: !!empresa?.id });
  const { data: progress = [] } = useQuery({ queryKey: ["hub-progress", user?.id, empresa?.id], queryFn: () => fetchHubUserProgress(user!.id, empresa!.id), enabled: !!user?.id && !!empresa?.id });

  const filteredMaterials = useMemo(() => materials.filter((m) => {
    const t = m.title?.["pt-br"] || "";
    return t.toLowerCase().includes(searchTerm.toLowerCase()) && (filterType === "all" || m.type === filterType) && (!filterTag || m.tags.includes(filterTag));
  }), [materials, searchTerm, filterType, filterTag]);

  const allTags = useMemo(() => { const s = new Set<string>(); materials.forEach((m) => m.tags.forEach((t) => s.add(t))); return Array.from(s).sort(); }, [materials]);
  const counts = useMemo(() => ({ all: materials.length, pdf: materials.filter((m) => m.type === "pdf").length, image: materials.filter((m) => m.type === "image").length, video: materials.filter((m) => m.type === "video").length, audio: materials.filter((m) => m.type === "audio").length, html: materials.filter((m) => m.type === "html").length }), [materials]);

  const MenuCategory = ({ type, icon: Icon, label, count, active }: { type: HubMaterialType | "all"; icon: React.ComponentType<{ size?: number }>; label: string; count: number; active: boolean }) => (
    <button onClick={() => setFilterType(type)}
      className={`group relative w-full text-left px-2.5 py-2.5 md:px-4 md:py-3.5 rounded-xl md:rounded-2xl flex items-center justify-between transition-all duration-500 ease-out overflow-hidden ${active ? "liquid-glass-gold md:translate-x-2" : "bg-transparent hover:opacity-80"}`}
      style={!active ? { color: "var(--color-text-muted)" } : {}}>
      <div className="flex items-center gap-2 md:gap-4 relative z-10">
        <div className={`icon-box transition-all duration-300 ${active ? "!bg-white/10 !border-transparent" : ""}`}><Icon size={16} /></div>
        <span className={`text-xs md:text-sm tracking-wide whitespace-nowrap ${active ? "font-bold" : "font-medium"}`} style={active ? { color: "var(--color-text-main)" } : {}}>{label}</span>
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg transition-all duration-300 ${active ? "bg-white/10 backdrop-blur-sm" : "border"}`}
        style={active ? { color: "var(--color-accent)" } : { backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>{count}</span>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row gap-8 relative">
      <aside className="w-full md:w-72 shrink-0 z-30">
        <div className="sticky top-28 space-y-4 animate-slide-up">
          {user && (
            <div className="rounded-2xl p-4 border border-white/10" style={{ backgroundColor: colorMix("var(--color-surface)", 40, "rgba(30,41,59,0.4)") }}>
              <div className="flex items-center gap-2 mb-3">
                <Star size={14} style={{ fill: "var(--color-warning)", color: "var(--color-warning)" }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Nível {userLevel}</span>
                <span className="ml-auto text-xs font-bold" style={{ color: "var(--color-accent)" }}>{userPoints} XP</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: "var(--color-surface)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${levelProgress}%`, backgroundColor: "var(--color-accent)" }} />
              </div>
              <p className="text-[10px] mt-1.5 text-right" style={{ color: "var(--color-text-muted)" }}>Próximo: {nextThreshold} XP</p>
            </div>
          )}
          {user && (
            <div className="rounded-2xl p-4 border border-white/10" style={{ backgroundColor: colorMix("var(--color-surface)", 40, "rgba(30,41,59,0.4)") }}>
              <div className="flex items-center gap-2 mb-3"><Trophy size={14} style={{ color: "var(--color-accent)" }} /><span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Conquistas</span></div>
              <button onClick={() => navigate({ to: "/hub/conquistas" })} className="text-xs font-bold transition-all hover:opacity-80" style={{ color: "var(--color-accent)" }}>Ver conquistas →</button>
            </div>
          )}
          <div className="flex rounded-xl overflow-hidden border border-white/10" style={{ backgroundColor: colorMix("var(--color-surface)", 40, "rgba(30,41,59,0.4)") }}>
            <button onClick={() => setActiveView("materials")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold transition-all rounded-lg ${activeView === "materials" ? "liquid-glass-gold" : ""}`} style={activeView === "materials" ? { color: "var(--color-accent)" } : { color: "var(--color-text-muted)" }}><Grid size={14} /> Materiais</button>
            <button onClick={() => setActiveView("collections")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold transition-all rounded-lg ${activeView === "collections" ? "liquid-glass-gold" : ""}`} style={activeView === "collections" ? { color: "var(--color-accent)" } : { color: "var(--color-text-muted)" }}><BookOpen size={14} /> Trilhas</button>
          </div>
          {activeView === "materials" && (
            <div className="backdrop-blur-xl border border-white/10 p-2 sm:p-3 rounded-3xl flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1.5 sm:gap-2 no-scrollbar shadow-xl shadow-black/5" style={{ backgroundColor: colorMix("var(--color-surface)", 30, "rgba(30,41,59,0.3)") }}>
              <div className="hidden md:flex items-center justify-between px-4 py-3 mb-2">
                <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: "var(--color-text-muted)" }}><Layers size={14} style={{ color: "var(--color-accent)" }} /> Biblioteca</h3>
              </div>
              <div className="shrink-0 md:shrink md:min-w-0 md:flex-1"><MenuCategory type="all" icon={Grid} label="Todos" count={counts.all} active={filterType === "all"} /></div>
              <div className="shrink-0 md:shrink md:min-w-0 md:flex-1"><MenuCategory type="pdf" icon={FileText} label="PDF" count={counts.pdf} active={filterType === "pdf"} /></div>
              <div className="shrink-0 md:shrink md:min-w-0 md:flex-1"><MenuCategory type="image" icon={ImageIcon} label="Imagem" count={counts.image} active={filterType === "image"} /></div>
              <div className="shrink-0 md:shrink md:min-w-0 md:flex-1"><MenuCategory type="video" icon={Video} label="Vídeo" count={counts.video} active={filterType === "video"} /></div>
              <div className="shrink-0 md:shrink md:min-w-0 md:flex-1"><MenuCategory type="audio" icon={Headphones} label="Áudio" count={counts.audio} active={filterType === "audio"} /></div>
              <div className="shrink-0 md:shrink md:min-w-0 md:flex-1"><MenuCategory type="html" icon={Globe} label="HTML" count={counts.html} active={filterType === "html"} /></div>
              {allTags.length > 0 && (
                <div className="hidden md:block mt-2 pt-4 px-2 border-t border-white/5">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}><Tag size={10} /> Tags</p>
                  <div className="flex flex-wrap gap-1.5">{allTags.map((tag) => <button key={tag} onClick={() => setFilterTag(filterTag === tag ? "" : tag)} className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all ${filterTag === tag ? "liquid-glass-gold" : ""}`} style={filterTag === tag ? { color: "var(--color-accent)" } : { backgroundColor: colorMix("var(--color-accent)", 10, "rgba(201,166,85,0.1)"), color: "var(--color-accent)" }}>{tag}</button>)}</div>
                </div>
              )}
              <div className="hidden md:block mt-4 pt-4 px-2 border-t border-white/5">
                <div className="relative overflow-hidden rounded-2xl p-5 group transition-all duration-300 hover:shadow-lg" style={{ background: `linear-gradient(to br, ${colorMix("var(--color-warning)", 10, "rgba(234,179,8,0.1)")}, ${colorMix("var(--color-warning)", 5, "rgba(234,179,8,0.05)")})`, border: `1px solid ${colorMix("var(--color-warning)", 20, "rgba(234,179,8,0.2)")}` }}>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2" style={{ color: "var(--color-warning)" }}><Sparkles size={16} className="animate-pulse" /><span className="text-xs font-bold uppercase tracking-wide">Dica Pro</span></div>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>Use <span className="font-mono bg-white/10 px-1 rounded text-[10px]" style={{ color: "var(--color-text-main)" }}>Ctrl+F</span> para focar na busca.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
      <div className="flex-1 min-w-0 z-0">
        {activeView === "materials" && (<>
          <div className="mb-6 sm:mb-10 relative group rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden animate-fade-in">
            <div className="absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-80" style={{ background: `linear-gradient(to right, ${colorMix("var(--color-accent)", 10, "rgba(201,166,85,0.1)")}, ${colorMix("var(--color-gradient-mid)", 10, "rgba(232,212,139,0.1)")}, transparent)` }} />
            <div className="absolute -right-20 -bottom-40 w-96 h-96 rounded-full blur-[100px] animate-pulse" style={{ backgroundColor: colorMix("var(--color-accent)", 20, "rgba(201,166,85,0.2)") }} />
            <div className="relative z-10 p-5 sm:p-8 md:p-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 sm:gap-8 backdrop-blur-sm">
              <div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 drop-shadow-sm" style={{ color: "var(--color-text-main)" }}>Materiais</h2>
                <p className="text-sm sm:text-base max-w-lg leading-relaxed font-medium" style={{ color: "var(--color-text-muted)" }}>Explore, visualize e baixe todos os materiais disponíveis para o seu perfil.</p>
              </div>
              <div className="relative w-full xl:w-96">
                <div className="relative backdrop-blur-xl border border-white/10 rounded-2xl flex items-center shadow-inner transition-all duration-300" style={{ backgroundColor: colorMix("var(--color-surface)", 60, "rgba(30,41,59,0.6)") }}>
                  <div className="pl-4 sm:pl-5" style={{ color: "var(--color-text-muted)" }}><Search size={20} /></div>
                  <input type="text" placeholder="Buscar materiais..." className="w-full bg-transparent border-none py-3 sm:py-4 px-3 sm:px-4 focus:ring-0 text-sm font-medium outline-none" style={{ color: "var(--color-text-main)" }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <div key={i} className="rounded-2xl animate-pulse" style={{ backgroundColor: colorMix("var(--color-surface)", 40, "rgba(30,41,59,0.4)"), minHeight: "320px" }} />)}</div>
          ) : filteredMaterials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 backdrop-blur-sm border border-white/5 rounded-[2rem] animate-fade-in text-center px-4" style={{ backgroundColor: colorMix("var(--color-surface)", 20, "rgba(30,41,59,0.2)") }}>
              <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg" style={{ backgroundColor: "var(--color-surface)", color: "var(--color-text-muted)" }}><Filter size={32} className="opacity-50" /></div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-text-main)" }}>Nenhum resultado encontrado</h3>
              <p className="text-sm max-w-xs" style={{ color: "var(--color-text-muted)" }}>Tente ajustar os filtros de busca.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
              {filteredMaterials.map((mat, index) => <div key={mat.id} className="animate-slide-up" style={{ animationDelay: `${index * 70}ms` }}><MaterialCard material={mat} progress={progress.find((p) => p.material_id === mat.id)} /></div>)}
            </div>
          )}
        </>)}
        {activeView === "collections" && (<>
          <div className="mb-6 sm:mb-10 relative group rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden animate-fade-in">
            <div className="absolute inset-0 opacity-60" style={{ background: `linear-gradient(to right, ${colorMix("var(--color-accent)", 10, "rgba(201,166,85,0.1)")}, ${colorMix("var(--color-gradient-mid)", 10, "rgba(232,212,139,0.1)")}, transparent)` }} />
            <div className="relative z-10 p-5 sm:p-8 md:p-10">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: "var(--color-text-main)" }}>Trilhas de Aprendizagem</h2>
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
              {collections.map((col, i) => <div key={col.id} className="animate-slide-up" style={{ animationDelay: `${i * 70}ms` }}><CollectionCard collection={col} onClick={() => navigate({ to: "/hub/trilhas/$trilhaId", params: { trilhaId: col.id } })} /></div>)}
            </div>
          )}
        </>)}
      </div>
    </div>
  );
}
