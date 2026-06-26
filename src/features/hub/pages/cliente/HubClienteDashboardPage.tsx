import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Search, Grid, FileText, Image as ImageIcon, Video, BookOpen, Headphones, Globe } from "lucide-react";
import { fetchHubMaterials } from "../../services/materials";
import { MaterialCard } from "../../components/materials/MaterialCard";
import type { HubMaterialType } from "../../types";

function colorMix(c1: string, w: number, c2: string) { return `color-mix(in srgb, ${c1} ${w}%, ${c2})`; }

export function HubClienteDashboardPage() {
  const { empresaId } = useParams({ strict: false }) as { empresaId: string };
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<HubMaterialType | "all">("all");

  const { data: materials = [] } = useQuery({ queryKey: ["hub-materials-public", empresaId], queryFn: () => fetchHubMaterials(empresaId), enabled: !!empresaId });

  const filtered = useMemo(() => materials.filter((m) => {
    if (!m.active) return false;
    if (!m.allowed_roles?.includes("client")) return false;
    const t = m.title?.["pt-br"] || "";
    return t.toLowerCase().includes(searchTerm.toLowerCase()) && (filterType === "all" || m.type === filterType);
  }), [materials, searchTerm, filterType]);

  const counts = useMemo(() => {
    const base = materials.filter((m) => m.active && m.allowed_roles?.includes("client"));
    return { all: base.length, pdf: base.filter((m) => m.type === "pdf").length, video: base.filter((m) => m.type === "video").length, image: base.filter((m) => m.type === "image").length, audio: base.filter((m) => m.type === "audio").length, html: base.filter((m) => m.type === "html").length };
  }, [materials]);

  const MenuCategory = ({ type, icon: Icon, label, count, active }: { type: HubMaterialType | "all"; icon: React.ComponentType<{ size?: number }>; label: string; count: number; active: boolean }) => (
    <button onClick={() => setFilterType(type)}
      className={`group relative w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all duration-500 ${active ? "liquid-glass-gold" : "bg-transparent hover:opacity-80"}`}
      style={!active ? { color: "var(--color-text-muted)" } : {}}>
      <div className="flex items-center gap-3 relative z-10">
        <div className={`icon-box-sm transition-all duration-300 ${active ? "!bg-white/10 !border-transparent" : ""}`}><Icon size={14} /></div>
        <span className={`text-xs tracking-wide whitespace-nowrap ${active ? "font-bold" : "font-medium"}`} style={active ? { color: "var(--color-text-main)" } : {}}>{label}</span>
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all ${active ? "bg-white/10 backdrop-blur-sm" : "border"}`}
        style={active ? { color: "var(--color-accent)" } : { backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>{count}</span>
    </button>
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 rounded-full mix-blend-multiply filter animate-blob" style={{ width: "var(--env-blob-size, 18rem)", height: "var(--env-blob-size, 18rem)", backgroundColor: "var(--env-blob1-color, #c9a655)", opacity: "var(--env-blob-opacity, 0.20)", filter: "blur(var(--env-blob-blur, 64px))" }} />
        <div className="absolute top-0 -right-4 rounded-full mix-blend-multiply filter animate-blob animation-delay-2000" style={{ width: "var(--env-blob-size, 18rem)", height: "var(--env-blob-size, 18rem)", backgroundColor: "var(--env-blob2-color, #e8d48b)", opacity: "var(--env-blob-opacity, 0.20)", filter: "blur(var(--env-blob-blur, 64px))" }} />
        <div className="absolute -bottom-8 left-20 rounded-full mix-blend-multiply filter animate-blob animation-delay-4000" style={{ width: "var(--env-blob-size, 18rem)", height: "var(--env-blob-size, 18rem)", backgroundColor: "var(--env-blob3-color, #a8873a)", opacity: "var(--env-blob-opacity, 0.20)", filter: "blur(var(--env-blob-blur, 64px))" }} />
      </div>

      <header className="sticky top-0 z-40 w-full px-2 sm:px-4 pt-2 sm:pt-4 pointer-events-none">
        <div className="container mx-auto">
          <div className="rounded-2xl p-3 pl-5 flex justify-between items-center pointer-events-auto" style={{ background: `linear-gradient(135deg, ${colorMix("var(--color-glass-tint)", 25, "rgba(30,41,59,0.25)")} 0%, ${colorMix("var(--color-header-bg)", 80, "rgba(15,23,42,0.8)")} 50%, ${colorMix("var(--color-glass-tint)", 15, "rgba(30,41,59,0.15)")} 100%)`, backdropFilter: "blur(var(--env-glass-blur, 20px)) saturate(180%)", border: `1px solid ${colorMix("var(--color-glass-tint)", 20, "rgba(255,255,255,0.1)")}` }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: "linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-end))" }}>CH</div>
              <h1 className="text-lg font-bold hidden sm:block" style={{ color: "var(--color-text-main)" }}>Conexão Hub</h1>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: colorMix("var(--color-accent)", 15, "rgba(201,166,85,0.15)"), color: "var(--color-accent)" }}>Área do Cliente</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-3 sm:p-4 md:p-6 mt-4 animate-fade-in relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 shrink-0 z-30">
            <div className="sticky top-28 space-y-4">
              <div className="backdrop-blur-xl border border-white/10 p-2 rounded-2xl space-y-1" style={{ backgroundColor: colorMix("var(--color-surface)", 30, "rgba(30,41,59,0.3)") }}>
                <div className="flex items-center gap-2 px-3 py-2">
                  <Grid size={12} style={{ color: "var(--color-accent)" }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Filtrar</span>
                </div>
                <MenuCategory type="all" icon={Grid} label="Todos" count={counts.all} active={filterType === "all"} />
                <MenuCategory type="pdf" icon={FileText} label="PDF" count={counts.pdf} active={filterType === "pdf"} />
                <MenuCategory type="video" icon={Video} label="Vídeo" count={counts.video} active={filterType === "video"} />
                <MenuCategory type="image" icon={ImageIcon} label="Imagem" count={counts.image} active={filterType === "image"} />
                <MenuCategory type="audio" icon={Headphones} label="Áudio" count={counts.audio} active={filterType === "audio"} />
                <MenuCategory type="html" icon={Globe} label="HTML" count={counts.html} active={filterType === "html"} />
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="mb-6 sm:mb-10 relative group rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden animate-fade-in">
              <div className="absolute inset-0 opacity-40" style={{ background: `linear-gradient(to right, ${colorMix("var(--color-accent)", 10, "rgba(201,166,85,0.1)")}, ${colorMix("var(--color-gradient-mid)", 10, "rgba(232,212,139,0.1)")}, transparent)` }} />
              <div className="relative z-10 p-5 sm:p-8 md:p-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div>
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: "var(--color-text-main)" }}>Materiais Disponíveis</h2>
                  <p className="text-sm sm:text-base max-w-lg font-medium" style={{ color: "var(--color-text-muted)" }}>Conteúdos exclusivos para clientes.</p>
                </div>
                <div className="relative w-full xl:w-80">
                  <div className="relative backdrop-blur-xl border border-white/10 rounded-2xl flex items-center shadow-inner" style={{ backgroundColor: colorMix("var(--color-surface)", 60, "rgba(30,41,59,0.6)") }}>
                    <div className="pl-4" style={{ color: "var(--color-text-muted)" }}><Search size={18} /></div>
                    <input type="text" placeholder="Buscar..." className="w-full bg-transparent border-none py-3 px-3 focus:ring-0 text-sm font-medium outline-none" style={{ color: "var(--color-text-main)" }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 rounded-[2rem] border border-white/5" style={{ backgroundColor: colorMix("var(--color-surface)", 20, "rgba(30,41,59,0.2)") }}>
                <BookOpen size={48} className="mb-4 opacity-30" style={{ color: "var(--color-text-muted)" }} />
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-text-main)" }}>Nenhum material disponível</h3>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Materiais para clientes serão exibidos aqui.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
                {filtered.map((mat, i) => <div key={mat.id} className="animate-slide-up" style={{ animationDelay: `${i * 70}ms` }}><MaterialCard material={mat} /></div>)}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
