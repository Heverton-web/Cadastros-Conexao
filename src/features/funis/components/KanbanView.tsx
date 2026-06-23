import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useCriarTarefa } from "../hooks/useFunisData";
import type { Funil, FunilTarefa } from "../types";
import { ColumnHeader } from "./ColumnHeader";
import { TaskCard } from "./TaskCard";
import { TaskModal } from "./TaskModal";

type KanbanViewProps = {
  funil: Funil;
};

export function KanbanView({ funil }: KanbanViewProps) {
  const criarTarefa = useCriarTarefa();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedColunaId, setSelectedColunaId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<FunilTarefa | null>(null);

  const colunas = funil.colunas ?? [];
  const tarefas = funil.tarefas ?? [];

  const handleAddTask = (colunaId: string) => {
    setSelectedColunaId(colunaId);
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (tarefa: FunilTarefa) => {
    setEditingTask(tarefa);
    setSelectedColunaId(tarefa.coluna_id);
    setShowTaskModal(true);
  };

  const handleCreateTask = async (data: { titulo: string; descricao?: string; prioridade?: string }) => {
    if (!selectedColunaId) return;
    await criarTarefa.mutateAsync({
      funil_id: funil.id,
      coluna_id: selectedColunaId,
      titulo: data.titulo,
      descricao: data.descricao,
      prioridade: data.prioridade as any,
    });
    setShowTaskModal(false);
  };

  return (
    <div className="flex gap-4 p-4 overflow-x-auto h-full">
      {colunas.map((coluna) => {
        const colunaTarefas = tarefas
          .filter((t) => t.coluna_id === coluna.id)
          .sort((a, b) => a.posicao - b.posicao);

        return (
          <div key={coluna.id} className="flex-shrink-0 w-72 flex flex-col bg-surface rounded-xl border border-border-subtle">
            <ColumnHeader coluna={coluna} funilId={funil.id} />
            <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px]">
              {colunaTarefas.map((tarefa) => (
                <TaskCard key={tarefa.id} tarefa={tarefa} onClick={() => handleEditTask(tarefa)} />
              ))}
            </div>
            <div className="p-2 border-t border-border-subtle">
              <Button
                onClick={() => handleAddTask(coluna.id)}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-text-muted"
              >
                <Plus className="w-4 h-4" />
                Adicionar tarefa
              </Button>
            </div>
          </div>
        );
      })}

      {showTaskModal && (
        <TaskModal
          funilId={funil.id}
          colunaId={selectedColunaId!}
          task={editingTask}
          onClose={() => setShowTaskModal(false)}
          onCreate={handleCreateTask}
        />
      )}
    </div>
  );
}
