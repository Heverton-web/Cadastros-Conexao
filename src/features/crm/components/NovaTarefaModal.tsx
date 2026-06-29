import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "~/lib/supabase";
import { useAuth } from "~/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Calendar, Loader2, User, FileText } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  clienteId?: string;
  clienteNome?: string;
};

export function NovaTarefaModal({
  open,
  onOpenChange,
  clienteId,
  clienteNome,
}: Props) {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    tipo: "geral",
    prioridade: "media",
    data_vencimento: "",
    responsavel_id: profile?.id ?? "",
  });

  // Buscar consultores da empresa para selecionar responsável
  const { data: consultores } = useQuery({
    queryKey: ["consultores-empresa", profile?.empresa_id],
    enabled: open && !!profile,
    queryFn: async () => {
      const { data } = await supabase
        .from("usuarios")
        .select("id, nome_completo")
        .eq("empresa_id", profile!.empresa_id)
        .in("role", ["consultor", "gestor"])
        .order("nome_completo");
      return data ?? [];
    },
  });

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setBusy(true);
    try {
      const { error } = await supabase.from("tarefas").insert({
        empresa_id: profile.empresa_id,
        cliente_id: clienteId || null,
        responsavel_id: form.responsavel_id,
        criador_id: profile.id,
        titulo: form.titulo,
        descricao: form.descricao || null,
        tipo: form.tipo,
        prioridade: form.prioridade,
        data_vencimento: form.data_vencimento || null,
      });

      if (error) throw error;

      toast.success("Tarefa criada com sucesso!");
      qc.invalidateQueries({ queryKey: ["tarefas"] });
      resetForm();
      onOpenChange(false);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function resetForm() {
    setForm({
      titulo: "",
      descricao: "",
      tipo: "geral",
      prioridade: "media",
      data_vencimento: "",
      responsavel_id: profile?.id ?? "",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-popover border-border max-w-lg p-0 overflow-hidden">
        <DialogHeader className="border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle className="text-xl font-semibold tracking-tight">
                Nova Tarefa
              </DialogTitle>
              {clienteNome && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Para: {clienteNome}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <FileText className="h-3.5 w-3.5" />
              Título *
            </Label>
            <Input
              required
              value={form.titulo}
              onChange={(e) => update("titulo", e.target.value)}
              placeholder="Ex: Enviar proposta comercial"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Descrição
            </Label>
            <Textarea
              value={form.descricao}
              onChange={(e) => update("descricao", e.target.value)}
              placeholder="Detalhes da tarefa..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Tipo
              </Label>
              <Select value={form.tipo} onValueChange={(v) => update("tipo", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">Geral</SelectItem>
                  <SelectItem value="follow_up">Follow-up</SelectItem>
                  <SelectItem value="proposta">Proposta</SelectItem>
                  <SelectItem value="reuniao">Reunião</SelectItem>
                  <SelectItem value="ligação">Ligação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Prioridade
              </Label>
              <Select
                value={form.prioridade}
                onValueChange={(v) => update("prioridade", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <Calendar className="h-3.5 w-3.5" />
                Data de Vencimento
              </Label>
              <Input
                type="date"
                value={form.data_vencimento}
                onChange={(e) => update("data_vencimento", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <User className="h-3.5 w-3.5" />
                Responsável
              </Label>
              <Select
                value={form.responsavel_id}
                onValueChange={(v) => update("responsavel_id", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {consultores?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome_completo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border -mx-6 px-6 pb-0 -mb-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="mt-4"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={busy} className="mt-4 min-w-[140px]">
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Criar Tarefa"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
