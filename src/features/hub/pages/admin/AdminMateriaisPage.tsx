import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { fetchHubMaterials, createHubMaterial, updateHubMaterial, deleteHubMaterial } from "../../services/materials";
import { MaterialFormModal } from "../../components/materials/MaterialFormModal";
import type { HubMaterial } from "../../types";

function colorMix(c1: string, w: number, c2: string) { return `color-mix(in srgb, ${c1} ${w}%, ${c2})`; }

export function AdminMateriaisPage() {
  const { empresa } = useAuth();
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; edit?: HubMaterial }>({ open: false });

  const { data: materials = [], isLoading } = useQuery({ queryKey: ["hub-materials", empresa?.id], queryFn: () => fetchHubMaterials(empresa!.id), enabled: !!empresa?.id });

  const save = useMutation({
    mutationFn: (m: Partial<HubMaterial>) => m.id ? updateHubMaterial(m.id, m) : createHubMaterial({ ...m, empresa_id: empresa!.id, created_by: "" }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["hub-materials"] }); setModal({ open: false }); },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteHubMaterial(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["hub-materials"] }),
  });

  const toggleActive = useMutation({
    mutationFn: (m: HubMaterial) => updateHubMaterial(m.id, { active: !m.active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["hub-materials"] }),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--color-text-main)" }}>Materiais</h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{materials.length} materiais cadastrados</p>
        </div>
        <Button onClick={() => setModal({ open: true })} className="gap-2"><Plus size={16} /> Novo Material</Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ backgroundColor: colorMix("var(--color-surface)", 40, "rgba(30,41,59,0.4)") }} />)}</div>
      ) : materials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-[2rem] border border-white/5" style={{ backgroundColor: colorMix("var(--color-surface)", 20, "rgba(30,41,59,0.2)") }}>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Nenhum material cadastrado.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {materials.map((m) => (
            <div key={m.id} className="flex items-center gap-4 rounded-xl p-4 border transition-all" style={{ borderColor: "var(--color-border)", backgroundColor: colorMix("var(--color-surface)", 40, "rgba(30,41,59,0.4)") }}>
              <div className="icon-box-sm">{m.active ? <Eye size={14} /> : <EyeOff size={14} />}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate" style={{ color: "var(--color-text-main)" }}>{m.title?.["pt-br"] || "Sem título"}</p>
                <div className="flex items-center gap-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
                  <span className="uppercase font-bold">{m.type}</span>
                  <span className="flex items-center gap-1"><Star size={10} style={{ fill: "var(--color-warning)", color: "var(--color-warning)" }} /> {m.points} XP</span>
                  <span>{m.tags?.slice(0, 3).join(", ")}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => toggleActive.mutate(m)} title={m.active ? "Desativar" : "Ativar"}>
                  {m.active ? <EyeOff size={14} /> : <Eye size={14} />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setModal({ open: true, edit: m })} title="Editar"><Edit size={14} /></Button>
                <Button variant="ghost" size="icon" onClick={() => { if (confirm("Excluir material?")) remove.mutate(m.id); }} title="Excluir"><Trash2 size={14} className="text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <MaterialFormModal open={modal.open} onClose={() => setModal({ open: false })} onSave={(m) => save.mutate(m)} material={modal.edit} />
    </div>
  );
}
