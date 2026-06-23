import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus, GitBranch, Trash2, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useFunis, useCriarFunil, useDeletarFunil } from "../hooks/useFunisData";

export function FunisDashboardPage() {
  const navigate = useNavigate();
  const { data: funis, isLoading } = useFunis();
  const criarFunil = useCriarFunil();
  const deletarFunil = useDeletarFunil();
  const [showCreate, setShowCreate] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleCreate = async () => {
    if (!titulo.trim()) return;
    const result = await criarFunil.mutateAsync({ titulo: titulo.trim(), descricao: descricao.trim() || undefined });
    setTitulo("");
    setDescricao("");
    setShowCreate(false);
    navigate({ to: "/funis/funil/$funilId", params: { funilId: result.id } });
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Excluir este funil?")) return;
    deletarFunil.mutate(id);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
            <GitBranch className="w-6 h-6" />
            Funis
          </h1>
          <p className="text-text-muted text-sm mt-1">Gerencie seus fluxos de trabalho Kanban</p>
        </div>
        <Button onClick={() => setShowCreate(true)} size="sm">
          <Plus className="w-4 h-4" />
          Novo Funil
        </Button>
      </div>

      {showCreate && (
        <Card className="mb-6 border border-border-subtle">
          <CardHeader>
            <CardTitle>Criar Novo Funil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Titulo do funil"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border-subtle text-text-main focus:outline-none focus:ring-2 focus:ring-brand"
                autoFocus
              />
              <input
                type="text"
                placeholder="Descricao (opcional)"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border-subtle text-text-main focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <div className="flex gap-2">
                <Button onClick={handleCreate} size="sm" disabled={criarFunil.isPending}>
                  {criarFunil.isPending ? "Criando..." : "Criar"}
                </Button>
                <Button onClick={() => setShowCreate(false)} variant="secondary" size="sm">
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center text-text-muted py-12">Carregando...</div>
      ) : !funis?.length ? (
        <div className="text-center py-12">
          <GitBranch className="w-12 h-12 mx-auto text-text-muted mb-3" />
          <p className="text-text-muted">Nenhum funil encontrado</p>
          <p className="text-text-muted text-sm mt-1">Crie seu primeiro funil para comecar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {funis.map((funil) => (
            <Card
              key={funil.id}
              className="cursor-pointer hover:shadow-xl transition-shadow border border-border-subtle"
              onClick={() => navigate({ to: "/funis/funil/$funilId", params: { funilId: funil.id } })}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{funil.titulo}</CardTitle>
                  <button
                    onClick={(e) => handleDelete(funil.id, e)}
                    className="text-text-muted hover:text-error p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {funil.descricao && (
                  <p className="text-text-muted text-sm mb-3 line-clamp-2">{funil.descricao}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Calendar className="w-3 h-3" />
                  {new Date(funil.created_at).toLocaleDateString("pt-BR")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
