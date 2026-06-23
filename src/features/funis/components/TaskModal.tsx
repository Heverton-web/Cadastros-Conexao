import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useCriarTarefa, useAtualizarTarefa, useDeletarTarefa } from "../hooks/useFunisData";
import type { FunilTarefa } from "../types";

type TaskModalProps = {
  funilId: string;
  colunaId: string;
  task: FunilTarefa | null;
  onClose: () => void;
  onCreate: (data: { titulo: string; descricao?: string; prioridade?: string }) => void;
};

export function TaskModal({ funilId, colunaId, task, onClose, onCreate }: TaskModalProps) {
  const atualizarTarefa = useAtualizarTarefa();
  const deletarTarefa = useDeletarTarefa();
  const [titulo, setTitulo] = useState(task?.titulo ?? "");
  const [descricao, setDescricao] = useState(task?.descricao ?? "");
  const [prioridade, setPrioridade] = useState(task?.prioridade ?? "medium");

  const handleSave = async () => {
    if (!titulo.trim()) return;
    if (task) {
      await atualizarTarefa.mutateAsync({
        id: task.id,
        updates: { titulo: titulo.trim(), descricao: descricao.trim() || undefined, prioridade: prioridade as any },
      });
    } else {
      await onCreate({ titulo: titulo.trim(), descricao: descricao.trim() || undefined, prioridade });
    }
    onClose();
  };

  const handleDelete = async () => {
    if (!task || !confirm("Excluir esta tarefa?")) return;
    await deletarTarefa.mutateAsync(task.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          <h2 className="text-lg font-semibold text-text-main">
            {task ? "Editar Tarefa" : "Nova Tarefa"}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-main">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm text-text-muted mb-1 block">Titulo *</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface border border-border-subtle text-text-main focus:outline-none focus:ring-2 focus:ring-brand"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm text-text-muted mb-1 block">Descricao</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface border border-border-subtle text-text-main focus:outline-none focus:ring-2 focus:ring-brand min-h-[80px]"
            />
          </div>
          <div>
            <label className="text-sm text-text-muted mb-1 block">Prioridade</label>
            <select
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface border border-border-subtle text-text-main focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="low">Baixa</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 border-t border-border-subtle">
          <div>
            {task && (
              <Button onClick={handleDelete} variant="destructive" size="sm">
                Excluir
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={onClose} variant="secondary" size="sm">
              Cancelar
            </Button>
            <Button onClick={handleSave} size="sm" disabled={!titulo.trim()}>
              {task ? "Salvar" : "Criar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
