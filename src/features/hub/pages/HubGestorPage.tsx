import { useQuery } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { BookOpen, GraduationCap, Users, BarChart3 } from "lucide-react";
import { fetchHubMaterials } from "../services/materials";
import { fetchHubCollections } from "../services/collections";
import { fetchHubRanking } from "../services/gamification";

function colorMix(c1: string, w: number, c2: string) { return `color-mix(in srgb, ${c1} ${w}%, ${c2})`; }

export function HubGestorPage() {
  const { empresa } = useAuth();
  const { data: materials = [] } = useQuery({ queryKey: ["hub-materials", empresa?.id], queryFn: () => fetchHubMaterials(empresa!.id), enabled: !!empresa?.id });
  const { data: collections = [] } = useQuery({ queryKey: ["hub-collections", empresa?.id], queryFn: () => fetchHubCollections(empresa!.id), enabled: !!empresa?.id });
  const { data: ranking = [] } = useQuery({ queryKey: ["hub-ranking", empresa?.id], queryFn: () => fetchHubRanking(empresa!.id), enabled: !!empresa?.id });

  return (
    <div className="space-y-6">
      <div className="relative group rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden animate-fade-in">
        <div className="absolute inset-0 opacity-60" style={{ background: `linear-gradient(to right, ${colorMix("var(--color-accent)", 10, "rgba(201,166,85,0.1)")}, ${colorMix("var(--color-gradient-mid)", 10, "rgba(232,212,139,0.1)")}, transparent)` }} />
        <div className="relative z-10 p-5 sm:p-8 md:p-10">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: "var(--color-text-main)" }}>Gestor Hub</h1>
          <p className="text-sm sm:text-base max-w-lg font-medium" style={{ color: "var(--color-text-muted)" }}>Visão geral do módulo Hub.</p>
        </div>
      </div>

      <Tabs defaultValue="materiais">
        <TabsList>
          <TabsTrigger value="materiais"><BookOpen className="mr-1 h-3 w-3" /> Materiais</TabsTrigger>
          <TabsTrigger value="trilhas"><GraduationCap className="mr-1 h-3 w-3" /> Trilhas</TabsTrigger>
          <TabsTrigger value="usuarios"><Users className="mr-1 h-3 w-3" /> Usuários</TabsTrigger>
          <TabsTrigger value="analytics"><BarChart3 className="mr-1 h-3 w-3" /> Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="materiais" className="space-y-2">
          {materials.map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-xl p-4 border transition-all" style={{ borderColor: "var(--color-border)", backgroundColor: colorMix("var(--color-surface)", 40, "rgba(30,41,59,0.4)") }}>
              <div>
                <p className="font-bold" style={{ color: "var(--color-text-main)" }}>{m.title?.["pt-br"]}</p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{m.type} • {m.points} XP • {m.active ? "Ativo" : "Inativo"}</p>
              </div>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="trilhas" className="space-y-2">
          {collections.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-xl p-4 border transition-all" style={{ borderColor: "var(--color-border)", backgroundColor: colorMix("var(--color-surface)", 40, "rgba(30,41,59,0.4)") }}>
              <div>
                <p className="font-bold" style={{ color: "var(--color-text-main)" }}>{c.title?.["pt-br"]}</p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{c.points} XP</p>
              </div>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="usuarios">
          <p style={{ color: "var(--color-text-muted)" }}>Visualização de usuários do Hub.</p>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="rounded-xl p-6 border" style={{ borderColor: "var(--color-border)", backgroundColor: colorMix("var(--color-surface)", 40, "rgba(30,41,59,0.4)") }}>
            <p className="font-bold" style={{ color: "var(--color-text-main)" }}>Ranking: {ranking.length} usuários ativos</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function HubGestorMateriaisPage() { return <HubGestorPage />; }
export function HubGestorUsuariosPage() { return <HubGestorPage />; }
export function HubGestorTrilhasPage() { return <HubGestorPage />; }
export function HubGestorAnalyticsPage() { return <HubGestorPage />; }
