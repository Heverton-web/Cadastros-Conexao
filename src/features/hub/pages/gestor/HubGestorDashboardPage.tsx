import { useQuery } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import { BookOpen, GraduationCap, BarChart3, Trophy, Users } from "lucide-react";
import { fetchHubMaterials } from "../../services/materials";
import { fetchHubCollections } from "../../services/collections";
import { fetchHubRanking } from "../../services/gamification";

function colorMix(c1: string, w: number, c2: string) { return `color-mix(in srgb, ${c1} ${w}%, ${c2})`; }

function StatCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ size?: number }>; label: string; value: number | string; color: string }) {
  return (
    <div className="rounded-2xl p-5 border transition-all" style={{ borderColor: "var(--color-border)", backgroundColor: colorMix("var(--color-surface)", 40, "rgba(30,41,59,0.4)") }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="icon-box-sm" style={{ color, borderColor: color + "30" }}><Icon size={14} /></div>
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>{label}</span>
      </div>
      <p className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>{value}</p>
    </div>
  );
}

export function HubGestorDashboardPage() {
  const { empresa } = useAuth();
  const { data: materials = [] } = useQuery({ queryKey: ["hub-materials", empresa?.id], queryFn: () => fetchHubMaterials(empresa!.id), enabled: !!empresa?.id });
  const { data: collections = [] } = useQuery({ queryKey: ["hub-collections", empresa?.id], queryFn: () => fetchHubCollections(empresa!.id), enabled: !!empresa?.id });
  const { data: ranking = [] } = useQuery({ queryKey: ["hub-ranking", empresa?.id], queryFn: () => fetchHubRanking(empresa!.id), enabled: !!empresa?.id });

  const gestorMaterials = materials.filter((m) => m.active && m.allowed_roles?.includes("manager"));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden">
        <div className="absolute inset-0 opacity-60" style={{ background: `linear-gradient(to right, ${colorMix("var(--color-accent)", 10, "rgba(201,166,85,0.1)")}, ${colorMix("var(--color-gradient-mid)", 10, "rgba(232,212,139,0.1)")}, transparent)` }} />
        <div className="relative z-10 p-5 sm:p-8 md:p-10">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: "var(--color-text-main)" }}>Dashboard Gestor</h1>
          <p className="text-sm sm:text-base max-w-lg font-medium" style={{ color: "var(--color-text-muted)" }}>Visão geral do Hub para gestores da empresa.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Materiais" value={gestorMaterials.length} color="var(--color-accent)" />
        <StatCard icon={GraduationCap} label="Trilhas" value={collections.length} color="var(--color-success)" />
        <StatCard icon={Users} label="Usuários" value={ranking.length} color="#3b82f6" />
        <StatCard icon={Trophy} label="XP Total" value={ranking.reduce((s: number, u: any) => s + (u.hub_points || 0), 0)} color="var(--color-warning)" />
      </div>

      <div className="rounded-2xl p-6 border" style={{ borderColor: "var(--color-border)", backgroundColor: colorMix("var(--color-surface)", 40, "rgba(30,41,59,0.4)") }}>
        <h3 className="font-bold mb-4" style={{ color: "var(--color-text-main)" }}>Materiais Disponíveis</h3>
        {gestorMaterials.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Nenhum material para gestores.</p>
        ) : (
          <div className="space-y-2">
            {gestorMaterials.slice(0, 5).map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-xl p-3 border" style={{ borderColor: "var(--color-border)", backgroundColor: colorMix("var(--color-surface)", 30, "rgba(30,41,59,0.3)") }}>
                <p className="font-bold text-sm truncate" style={{ color: "var(--color-text-main)" }}>{m.title?.["pt-br"]}</p>
                <span className="text-xs font-bold shrink-0" style={{ color: "var(--color-accent)" }}>{m.points} XP</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
