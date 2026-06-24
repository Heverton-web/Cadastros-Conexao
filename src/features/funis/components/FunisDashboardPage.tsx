import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Trash2, Crown, Users, Calendar, CheckCircle2, Clock } from "lucide-react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "~/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog";
import { toast } from "react-hot-toast";
import { Badge } from "~/components/ui/badge";
import { funnelProgress, statusMeta, fmtDate, dateRange } from "~/lib/task-meta";
import { useFunis, useCriarFunil, useDeletarFunil } from "../hooks/useFunisData";

export function FunisDashboardPage() {
  const navigate = useNavigate();
  const { data: funis = [], isLoading } = useFunis();
  const criarFunil = useCriarFunil();
  const deletarFunil = useDeletarFunil();
  
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const result = await criarFunil.mutateAsync({ titulo: title.trim(), descricao: description.trim() || undefined });
      toast.success("Funil criado");
      setOpen(false);
      setTitle("");
      setDescription("");
      navigate({ to: "/funis/funil/$funilId", params: { funilId: result.id } });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="px-5 py-6 sm:px-8 sm:py-10 lg:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col gap-5 mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:mb-10">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-display">Meus funis</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Quadros de gestao de projetos e fluxos de trabalho</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-gold text-[#0f172a] font-semibold w-full sm:w-auto"><Plus className="h-4 w-4 mr-2" />Novo funil</Button>
          </DialogTrigger>
          <DialogContent className="border-none">
            <DialogHeader><DialogTitle className="font-display text-2xl">Criar novo funil</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-5">
              <div className="space-y-2"><Label>Nome</Label><Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Refatoracao do backend" /></div>
              <div className="space-y-2"><Label>Descricao</Label><Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Contexto e objetivo do funil" className="min-h-[96px] resize-y" /></div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={criarFunil.isPending} className="gradient-gold text-[#0f172a] font-semibold">{criarFunil.isPending ? "Criando..." : "Criar funil"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground py-10 text-center">Carregando...</div>
      ) : funis.length === 0 ? (
        <Card className="p-10 sm:p-14 text-center bg-surface/50 border-dashed border-border/60">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="font-display text-xl sm:text-2xl mb-2">Nenhum funil ainda</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">Crie seu primeiro funil para comecar a organizar projetos em Kanban.</p>
          <Button onClick={() => setOpen(true)} className="gradient-gold text-[#0f172a] font-semibold"><Plus className="h-4 w-4 mr-2" />Criar funil</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {funis.map((f: any) => {
            const tasks = f.tarefas ?? [];
            // O task-meta foi copiado e espera um objeto que tenha propriedades iguais. Mapearemos tarefas para tasks temporariamente ou o task-meta lidara.
            // O ideal e passar a task com as propriedades certas para funnelProgress
            const prog = funnelProgress(tasks);
            const range = dateRange(tasks);
            const sm = statusMeta[prog.status];
            return (
              <Card key={f.id} className="group p-6 bg-surface/70 border-border/40 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer relative flex flex-col gap-4" onClick={() => navigate({ to: "/funis/funil/$funilId", params: { funilId: f.id } })}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg leading-tight min-w-0 truncate">{f.titulo}</h3>
                  {f.isOwner !== false ? (
                    <Badge variant="outline" className="border-primary/40 text-primary gap-1 shrink-0"><Crown className="h-3 w-3" />Dono</Badge>
                  ) : (
                    <Badge variant="secondary" className="shrink-0">Convidado</Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.5rem]">{f.descricao || "Sem descricao"}</p>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{prog.done}/{prog.total} tarefas</span>
                    <span className="font-mono font-semibold">{prog.pct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-background/60 overflow-hidden">
                    <div className={`h-full ${sm.bar} transition-all`} style={{ width: prog.pct + "%" }} />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <Badge variant="outline" className={`gap-1 ${sm.chip}`}>
                    {prog.status === "completed" ? <CheckCircle2 className="h-2.5 w-2.5" /> : prog.status === "overdue" ? <Clock className="h-2.5 w-2.5" /> : <Calendar className="h-2.5 w-2.5" />}
                    {sm.label}
                  </Badge>
                  {range.end && (
                    <Badge variant="outline" className="gap-1 border-border/60 text-muted-foreground">
                      <Calendar className="h-2.5 w-2.5" />Entrega {fmtDate(range.end)}
                    </Badge>
                  )}
                  <span className="text-muted-foreground ml-auto">Criado {fmtDate(f.created_at)}</span>
                </div>

                {f.isOwner !== false && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDelete(f.id); }}
                    className="absolute top-4 right-14 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    aria-label="Excluir"
                  ><Trash2 className="h-4 w-4" /></button>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir funil?</AlertDialogTitle>
            <AlertDialogDescription>Esta acao e permanente. Todas as colunas e tarefas serao removidas.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDelete && deletarFunil.mutate(confirmDelete)} className="bg-destructive text-destructive-foreground">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
