import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useAtualizarColuna, useDeletarColuna } from "../hooks/useFunisData";
import type { FunilColuna } from "../types";

type ColumnHeaderProps = {
  coluna: FunilColuna;
  funilId: string;
};

export function ColumnHeader({ coluna, funilId }: ColumnHeaderProps) {
  const atualizarColuna = useAtualizarColuna();
  const deletarColuna = useDeletarColuna();
  const [editing, setEditing] = useState(false);
  const [titulo, setTitulo] = useState(coluna.titulo);
  const [showMenu, setShowMenu] = useState(false);

  const handleSave = async () => {
    if (!titulo.trim() || titulo === coluna.titulo) {
      setEditing(false);
      return;
    }
    await atualizarColuna.mutateAsync({ id: coluna.id, titulo: titulo.trim() });
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm("Excluir esta coluna e todas as tarefas?")) return;
    await deletarColuna.mutateAsync(coluna.id);
    setShowMenu(false);
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle">
      {editing ? (
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setTitulo(coluna.titulo);
              setEditing(false);
            }
          }}
          className="flex-1 px-2 py-1 text-sm font-medium text-text-main bg-surface border border-border-subtle rounded focus:outline-none focus:ring-1 focus:ring-brand"
          autoFocus
        />
      ) : (
        <h3 className="text-sm font-semibold text-text-main truncate">{coluna.titulo}</h3>
      )}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-text-muted hover:text-text-main p-1"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-8 z-20 bg-card border border-border-subtle rounded-lg shadow-lg py-1 min-w-[140px]">
              <button
                onClick={() => {
                  setEditing(true);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-main hover:bg-surface"
              >
                <Pencil className="w-4 h-4" />
                Renomear
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-error hover:bg-surface"
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
