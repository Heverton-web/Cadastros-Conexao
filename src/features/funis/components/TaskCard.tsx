import { Calendar, AlertTriangle, Clock } from "lucide-react";
import type { FunilTarefa } from "../types";

type TaskCardProps = {
  tarefa: FunilTarefa;
  onClick: () => void;
};

const priorityColors = {
  low: "bg-blue-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
};

const priorityLabels = {
  low: "Baixa",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente",
};

function getDeadlineStatus(dataFim: string | null): { label: string; color: string } | null {
  if (!dataFim) return null;
  const now = new Date();
  const deadline = new Date(dataFim);
  const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: "Atrasado", color: "text-red-500" };
  if (diffDays === 0) return { label: "Hoje", color: "text-orange-500" };
  if (diffDays <= 3) return { label: `${diffDays}d`, color: "text-yellow-500" };
  return { label: `${diffDays}d`, color: "text-text-muted" };
}

export function TaskCard({ tarefa, onClick }: TaskCardProps) {
  const deadline = getDeadlineStatus(tarefa.data_fim);

  return (
    <div
      onClick={onClick}
      className="bg-card rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow border border-border-subtle"
    >
      <div className={`h-1 rounded-full mb-2 ${priorityColors[tarefa.prioridade]}`} />
      <h4 className="text-sm font-medium text-text-main mb-1">{tarefa.titulo}</h4>
      {tarefa.descricao && (
        <p className="text-xs text-text-muted line-clamp-2 mb-2">{tarefa.descricao}</p>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface text-text-muted">
          {priorityLabels[tarefa.prioridade]}
        </span>
        {deadline && (
          <span className={`text-[10px] flex items-center gap-1 ${deadline.color}`}>
            <Clock className="w-3 h-3" />
            {deadline.label}
          </span>
        )}
        {tarefa.tools.length > 0 && (
          <div className="flex gap-1">
            {tarefa.tools.slice(0, 2).map((tool) => (
              <span key={tool} className="text-[10px] px-1.5 py-0.5 rounded bg-brand/10 text-brand">
                {tool}
              </span>
            ))}
            {tarefa.tools.length > 2 && (
              <span className="text-[10px] text-text-muted">+{tarefa.tools.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
