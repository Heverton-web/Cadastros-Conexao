import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useAuth } from "~/lib/auth";
import { ArrowLeft, Star, Play } from "lucide-react";
import { fetchHubMaterialById, fetchHubMaterialAssets, logHubAccess } from "../services/materials";
import { completeHubMaterial } from "../services/progress";
import { addHubPoints } from "../services/gamification";
import { MaterialViewerModal } from "../components/materials/MaterialViewerModal";

function colorMix(c1: string, w: number, c2: string) { return `color-mix(in srgb, ${c1} ${w}%, ${c2})`; }

export function HubMaterialDetailPage() {
  const { materialId } = useParams({ strict: false }) as { materialId: string };
  const { user, empresa } = useAuth();
  const navigate = useNavigate();
  const [viewerOpen, setViewerOpen] = useState(false);

  const { data: material } = useQuery({ queryKey: ["hub-material", materialId], queryFn: () => fetchHubMaterialById(materialId), enabled: !!materialId });
  const { data: assets = [] } = useQuery({ queryKey: ["hub-material-assets", materialId], queryFn: () => fetchHubMaterialAssets(materialId), enabled: !!materialId });

  const handleComplete = async () => {
    if (!user || !material) return;
    await logHubAccess({ material_id: material.id, material_title: material.title?.["pt-br"], user_id: user.id, user_role: "client", language: "pt-br", empresa_id: empresa?.id });
    await completeHubMaterial(user.id, material.id, empresa!.id);
    await addHubPoints(user.id, material.points);
  };

  if (!material) return <div className="p-6" style={{ color: "var(--color-text-muted)" }}>Carregando...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={() => navigate({ to: -1 as any })} className="mb-2 flex items-center gap-2 text-sm font-semibold transition-all hover:opacity-70" style={{ color: "var(--color-text-muted)" }}>
        <ArrowLeft size={16} /> Voltar
      </button>

      <div className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colorMix("var(--color-accent)", 15, "rgba(201,166,85,0.15)")}, ${colorMix("var(--color-accent)", 5, "rgba(201,166,85,0.05)")})` }} />
        <div className="relative z-10 p-5 sm:p-8 md:p-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--color-text-main)" }}>{material.title?.["pt-br"] || "Material"}</h1>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-bold uppercase" style={{ color: "var(--color-text-muted)" }}>{material.type}</span>
            {material.points > 0 && (
              <span className="flex items-center gap-1 text-sm font-bold" style={{ color: "var(--color-accent)" }}>
                <Star size={14} style={{ fill: "var(--color-warning)", color: "var(--color-warning)" }} /> {material.points} XP
              </span>
            )}
          </div>
        </div>
      </div>

      <button onClick={() => setViewerOpen(true)}
        className="w-full liquid-glass-gold flex items-center justify-center gap-3 py-6 rounded-2xl font-bold text-lg transition-all hover:opacity-80 active:scale-[0.98]"
        style={{ color: "var(--color-accent)" }}>
        <Play size={24} /> Abrir Material
      </button>

      <MaterialViewerModal open={viewerOpen} onClose={() => setViewerOpen(false)} material={material} assets={assets} onComplete={handleComplete} />
    </div>
  );
}
