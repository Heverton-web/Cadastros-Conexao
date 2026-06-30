import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, Check, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import type { EmpresaLinktreeSection } from "../types-empresa";
import { useCriarSecao, useAtualizarSecao, useDeletarSecao } from "../hooks/useEmpresaLinktree";

interface Props {
  sections: EmpresaLinktreeSection[];
  empresaId?: string | null;
}

export function SectionManager({ sections, empresaId }: Props) {
  const [newTitulo, setNewTitulo] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const criar = useCriarSecao(empresaId);
  const atualizar = useAtualizarSecao();
  const deletar = useDeletarSecao();

  function handleCreate() {
    if (!newTitulo.trim()) return;
    criar.mutate({ titulo: newTitulo.trim(), ordem: sections.length }, {
      onSuccess: () => setNewTitulo(""),
    });
  }

  function handleUpdate(id: string) {
    if (!editTitulo.trim()) return;
    atualizar.mutate({ id, input: { titulo: editTitulo.trim() } }, {
      onSuccess: () => setEditingId(null),
    });
  }

  function handleDelete() {
    if (!deletingId) return;
    deletar.mutate(deletingId, {
      onSuccess: () => setDeletingId(null),
    });
  }

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Secoes</Label>

      {sections.map((sec) => (
        <div key={sec.id} className="flex items-center gap-2 rounded-lg border border-border bg-surface p-3">
          <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground" />

          {editingId === sec.id ? (
            <div className="flex flex-1 items-center gap-2">
              <Input
                value={editTitulo}
                onChange={(e) => setEditTitulo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUpdate(sec.id)}
                className="h-8"
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={() => handleUpdate(sec.id)}>
                <Check className="size-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                <X className="size-4" />
              </Button>
            </div>
          ) : (
            <>
              <span className="flex-1 text-sm font-medium">{sec.titulo}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setEditingId(sec.id); setEditTitulo(sec.titulo); }}
              >
                <Pencil className="size-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setDeletingId(sec.id)}>
                <Trash2 className="size-4 text-error" />
              </Button>
            </>
          )}
        </div>
      ))}

      <div className="flex items-center gap-2">
        <Input
          placeholder="Nova secao..."
          value={newTitulo}
          onChange={(e) => setNewTitulo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          className="h-9"
        />
        <Button size="sm" onClick={handleCreate} disabled={!newTitulo.trim() || criar.isPending}>
          <Plus className="size-4" />
        </Button>
      </div>

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir secao?</AlertDialogTitle>
            <AlertDialogDescription>Todos os links desta secao serao excluidos.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
