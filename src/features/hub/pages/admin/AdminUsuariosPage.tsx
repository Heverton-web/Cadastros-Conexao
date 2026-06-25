import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { Users, Star, CheckCircle, XCircle, Edit, Trash2, Trophy } from "lucide-react";
import { fetchHubRanking } from "../../services/gamification";
import { getHubUserLevel } from "../../types";

function colorMix(c1: string, w: number, c2: string) { return `color-mix(in srgb, ${c1} ${w}%, ${c2})`; }

export function AdminUsuariosPage() {
  const { empresa } = useAuth();
  const queryClient = useQueryClient();
  const { data: ranking = [], isLoading } = useQuery({ queryKey: ["hub-ranking", empresa?.id], queryFn: () => fetchHubRanking(empresa!.id), enabled: !!empresa?.id });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--color-text-main)" }}>Usuários</h1>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{ranking.length} usuários no Hub</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ backgroundColor: colorMix("var(--color-surface)", 40, "rgba(30,41,59,0.4)") }} />)}</div>
      ) : ranking.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-[2rem] border border-white/5" style={{ backgroundColor: colorMix("var(--color-surface)", 20, "rgba(30,41,59,0.2)") }}>
          <Users size={48} className="mb-4 opacity-30" style={{ color: "var(--color-text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Nenhum usuário encontrado.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {ranking.map((u: any, idx: number) => {
            const level = getHubUserLevel(u.hub_points || 0);
            return (
              <div key={u.id} className="flex items-center gap-4 rounded-xl p-4 border transition-all" style={{ borderColor: "var(--color-border)", backgroundColor: colorMix("var(--color-surface)", 40, "rgba(30,41,59,0.4)") }}>
                <div className="flex h-10 w-10 items-center justify-center shrink-0 rounded-full font-bold text-sm"
                  style={{ background: "linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-end))", color: "var(--color-accent-fg)" }}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate" style={{ color: "var(--color-text-main)" }}>{u.nome}</p>
                  <div className="flex items-center gap-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    <span className="flex items-center gap-1"><Star size={10} style={{ fill: "var(--color-warning)", color: "var(--color-warning)" }} /> {u.hub_points || 0} XP</span>
                    <span className="font-bold" style={{ color: "var(--color-accent)" }}>{level}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" title="Editar"><Edit size={14} /></Button>
                  <Button variant="ghost" size="icon" title="Excluir"><Trash2 size={14} className="text-destructive" /></Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
