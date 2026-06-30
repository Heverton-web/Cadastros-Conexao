import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus, FileText, Trash2, Pencil, ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
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
import { toast } from "react-hot-toast";
import {
  useTemplates,
  useCriarTemplate,
  useDeletarTemplate,
} from "../hooks/useTemplates";

export function TemplateManager() {
  const navigate = useNavigate();
  const { data: templates = [], isLoading } = useTemplates();
  const criarTemplate = useCriarTemplate();
  const deletarTemplate = useDeletarTemplate();

  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [colunas, setColunas] = useState<string[]>([
    "Backlog",
    "Em andamento",
    "Revisão",
    "Concluído",
  ]);
  const [showDelete, setShowDelete] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    try {
      await criarTemplate.mutateAsync({
        nome: nome.trim(),
        descricao: descricao.trim() || undefined,
        colunas: colunas.filter((c) => c.trim()),
      });
      toast.success("Template criado");
      setOpen(false);
      setNome("");
      setDescricao("");
      setColunas(["Backlog", "Em andamento", "Revisão", "Concluído"]);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletarTemplate.mutateAsync(id);
      toast.success("Template excluído");
      setShowDelete(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="px-5 py-6 sm:px-8 sm:py-10 lg:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col gap-5 mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:mb-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/funis/dashboard" })}
            className="btn-hover-neutral p-1.5 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display">Templates</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Modelos reutilizáveis para criar funis rapidamente
            </p>
          </div>
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="gradient-gold text-[#0f172a] font-semibold w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo template
        </Button>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground py-10 text-center">
          Carregando...
        </div>
      ) : templates.length === 0 ? (
        <Card className="p-10 sm:p-14 text-center bg-surface/50 border-dashed border-border/60">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="font-display text-xl sm:text-2xl mb-2">
            Nenhum template ainda
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Crie templates para agilizar a criação de novos funis.
          </p>
          <Button
            onClick={() => setOpen(true)}
            className="gradient-gold text-[#0f172a] font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar template
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((t) => (
            <Card
              key={t.id}
              className="p-6 bg-surface/70 border-border/40 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all relative flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg leading-tight min-w-0 truncate">
                  {t.nome}
                </h3>
                {t.is_public && (
                  <Badge variant="secondary" className="text-[9px]">
                    Público
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {t.descricao || "Sem descrição"}
              </p>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>{t.colunas?.length ?? 0} colunas</span>
                <span>·</span>
                <span>{t.tarefas?.length ?? 0} tarefas</span>
              </div>
              <div className="flex gap-2 mt-auto pt-2">
                <Button
                  variant="ghost-destructive"
                  size="sm"
                  onClick={() => setShowDelete(t.id)}
                  className="ml-auto"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-none">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              Criar template
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-5">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Projeto de desenvolvimento"
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                rows={3}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o propósito do template"
                className="min-h-[96px] resize-y"
              />
            </div>
            <div className="space-y-2.5">
              <Label>Colunas</Label>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {colunas.map((col, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      required
                      value={col}
                      onChange={(e) => {
                        const newCols = [...colunas];
                        newCols[idx] = e.target.value;
                        setColunas(newCols);
                      }}
                      placeholder={`Coluna ${idx + 1}`}
                      className="bg-background/50"
                    />
                    {colunas.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost-destructive"
                        size="icon"
                        onClick={() =>
                          setColunas(colunas.filter((_, i) => i !== idx))
                        }
                        className="shrink-0 h-9 w-9"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setColunas([...colunas, ""])}
                className="w-full border-dashed text-xs gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Adicionar coluna
              </Button>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={criarTemplate.isPending}
                className="gradient-gold text-[#0f172a] font-semibold"
              >
                {criarTemplate.isPending ? "Criando..." : "Criar template"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!showDelete}
        onOpenChange={(o) => !o && setShowDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir template?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => showDelete && handleDelete(showDelete)}
              className="bg-destructive"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
