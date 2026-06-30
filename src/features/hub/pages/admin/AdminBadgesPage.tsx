import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import {
  Plus,
  Edit,
  Trash2,
  Star,
  BookOpen,
  GraduationCap,
  Rocket,
  Trophy,
  Diamond,
  Crown,
  Flame,
  Shield,
  Sparkles,
} from "lucide-react";
import {
  fetchHubBadges,
  createHubBadge,
  deleteHubBadge,
} from "../../services/gamification";
import { BadgeFormModal } from "../../components/gamification/BadgeFormModal";
import type { HubBadge } from "../../types";

function colorMix(c1: string, w: number, c2: string) {
  return `color-mix(in srgb, ${c1} ${w}%, ${c2})`;
}
const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  star: Star,
  book: BookOpen,
  graduation: GraduationCap,
  rocket: Rocket,
  trophy: Trophy,
  diamond: Diamond,
  crown: Crown,
  flame: Flame,
  shield: Shield,
  stars: Sparkles,
};

export function AdminBadgesPage() {
  const { empresa } = useAuth();
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; edit?: HubBadge }>({
    open: false,
  });

  const { data: badges = [], isLoading } = useQuery({
    queryKey: ["hub-badges", empresa?.id],
    queryFn: () => fetchHubBadges(empresa!.id),
    enabled: !!empresa?.id,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteHubBadge(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["hub-badges"] }),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: "var(--color-text-main)" }}
          >
            Badges
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {badges.length} badges configurados
          </p>
        </div>
        <Button onClick={() => setModal({ open: true })} className="gap-2">
          <Plus size={16} /> Novo Badge
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl animate-pulse"
              style={{
                backgroundColor: colorMix(
                  "var(--color-surface)",
                  40,
                  "rgba(30,41,59,0.4)",
                ),
              }}
            />
          ))}
        </div>
      ) : badges.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 rounded-[2rem] border border-white/5"
          style={{
            backgroundColor: colorMix(
              "var(--color-surface)",
              20,
              "rgba(30,41,59,0.2)",
            ),
          }}
        >
          <Trophy
            size={48}
            className="mb-4 opacity-30"
            style={{ color: "var(--color-text-muted)" }}
          />
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Nenhum badge configurado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((b) => {
            const Icon = iconMap[b.icon_name] || Star;
            return (
              <div
                key={b.id}
                className="flex flex-col items-center gap-3 rounded-2xl border p-5 transition-all"
                style={{
                  backgroundColor: colorMix(
                    "var(--color-surface)",
                    40,
                    "rgba(30,41,59,0.4)",
                  ),
                  borderColor: "var(--color-border)",
                }}
              >
                <div
                  className="icon-box-lg"
                  style={{
                    backgroundColor: b.color + "20",
                    color: b.color,
                    borderColor: b.color + "30",
                  }}
                >
                  <Icon size={24} />
                </div>
                <p
                  className="text-center text-sm font-bold"
                  style={{ color: "var(--color-text-main)" }}
                >
                  {b.name}
                </p>
                <p
                  className="text-center text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {b.description}
                </p>
                <p
                  className="text-xs font-bold"
                  style={{ color: "var(--color-accent)" }}
                >
                  +{b.points_reward} XP
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm("Excluir badge?")) remove.mutate(b.id);
                  }}
                >
                  <Trash2 size={12} className="mr-1" /> Excluir
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <BadgeFormModal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        onSave={(b) =>
          createHubBadge({ ...b, empresa_id: empresa!.id }).then(() => {
            queryClient.invalidateQueries({ queryKey: ["hub-badges"] });
            setModal({ open: false });
          })
        }
        badge={modal.edit}
      />
    </div>
  );
}
