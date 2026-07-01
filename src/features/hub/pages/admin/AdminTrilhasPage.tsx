import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { Plus, Edit, Trash2, BookOpen, Star } from "lucide-react";
import {
  fetchHubCollections,
  createHubCollection,
  updateHubCollection,
  deleteHubCollection,
} from "../../services/collections";
import { CollectionFormModal } from "../../components/collections/CollectionFormModal";
import type { HubCollection } from "../../types";

function colorMix(c1: string, w: number, c2: string) {
  return `color-mix(in srgb, ${c1} ${w}%, ${c2})`;
}

export function AdminTrilhasPage() {
  const { empresa } = useAuth();
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; edit?: HubCollection }>({
    open: false,
  });

  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["hub-collections", empresa?.id],
    queryFn: () => fetchHubCollections(empresa!.id),
    enabled: !!empresa?.id,
  });

  const save = useMutation({
    mutationFn: (c: Partial<HubCollection>) =>
      c.id
        ? updateHubCollection(c.id, c)
        : createHubCollection({
            ...c,
            empresa_id: empresa!.id,
            created_by: "",
          }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hub-collections"] });
      setModal({ open: false });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteHubCollection(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["hub-collections"] }),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: "var(--color-text-main)" }}
          >
            Trilhas
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {collections.length} trilhas cadastradas
          </p>
        </div>
        <Button onClick={() => setModal({ open: true })} className="gap-2">
          <Plus size={16} /> Nova Trilha
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl animate-pulse"
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
      ) : collections.length === 0 ? (
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
          <BookOpen
            size={48}
            className="mb-4 opacity-30"
            style={{ color: "var(--color-text-muted)" }}
          />
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Nenhuma trilha cadastrada.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {collections.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-4 rounded-xl p-4 border transition-all"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: colorMix(
                  "var(--color-surface)",
                  40,
                  "rgba(30,41,59,0.4)",
                ),
              }}
            >
              <div className="icon-box-sm">
                <BookOpen size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-bold truncate"
                  style={{ color: "var(--color-text-main)" }}
                >
                  {c.title?.["pt-br"] || "Sem título"}
                </p>
                <div
                  className="flex items-center gap-3 text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <span className="flex items-center gap-1">
                    <Star
                      size={10}
                      style={{
                        fill: "var(--color-warning)",
                        color: "var(--color-warning)",
                      }}
                    />{" "}
                    {c.points} XP
                  </span>
                  <span>
                    {c.hub_collection_items?.[0]?.count || 0} materiais
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setModal({ open: true, edit: c })}
                  title="Editar"
                >
                  <Edit size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (confirm("Excluir trilha?")) remove.mutate(c.id);
                  }}
                  title="Excluir"
                >
                  <Trash2 size={14} className="text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CollectionFormModal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        onSave={(c) => save.mutate(c)}
        collection={modal.edit}
      />
    </div>
  );
}
