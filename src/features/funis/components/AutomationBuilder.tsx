import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { toast } from "react-hot-toast";
import { useAutomacoes, useCriarAutomacao, useAtualizarAutomacao } from "../hooks/useAutomations";
import type { AutomationInput } from "../types";

type AutomationBuilderProps = {
  funilId: string;
  editingId?: string | null;
  onClose: () => void;
};

const triggers = [
  { value: "tarefa_criada", label: "Tarefa criada" },
  { value: "tarefa_movida", label: "Tarefa movida" },
  { value: "tarefa_concluida", label: "Tarefa concluída" },
  { value: "tarefa_atrasada", label: "Tarefa atrasada" },
  { value: "label_adicionado", label: "Label adicionado" },
  { value: "comentario_adicionado", label: "Comentário adicionado" },
];

const actions = [
  { value: "mover_para_coluna", label: "Mover para coluna" },
  { value: "atribuir_usuario", label: "Atribuir usuário" },
  { value: "alterar_prioridade", label: "Alterar prioridade" },
  { value: "adicionar_label", label: "Adicionar label" },
  { value: "remover_label", label: "Remover label" },
  { value: "enviar_notificacao", label: "Enviar notificação" },
  { value: "criar_tarefa", label: "Criar tarefa" },
];

export function AutomationBuilder({ funilId, editingId, onClose }: AutomationBuilderProps) {
  const { data: automacoes = [] } = useAutomacoes(funilId);
  const criarAutomacao = useCriarAutomacao();
  const atualizarAutomacao = useAtualizarAutomacao();

  const existing = editingId ? automacoes.find((a) => a.id === editingId) : null;

  const [nome, setNome] = useState(existing?.nome ?? "");
  const [triggerType, setTriggerType] = useState(existing?.trigger_type ?? "");
  const [actionType, setActionType] = useState(existing?.action_type ?? "");
  const [actionConfig, setActionConfig] = useState<Record<string, string>>(
    existing ? Object.fromEntries(Object.entries(existing.action_config).map(([k, v]) => [k, String(v)])) : {}
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !triggerType || !actionType) return;

    try {
      const input: AutomationInput = {
        funil_id: funilId,
        nome: nome.trim(),
        trigger_type: triggerType,
        trigger_config: {},
        action_type: actionType,
        action_config: actionConfig,
      };

      if (editingId) {
        await atualizarAutomacao.mutateAsync({ id: editingId, input });
        toast.success("Automação atualizada");
      } else {
        await criarAutomacao.mutateAsync(input);
        toast.success("Automação criada");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingId ? "Editar automação" : "Nova automação"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Notificar quando atrasar"
            />
          </div>

          <div className="space-y-2">
            <Label>Quando acontecer (Trigger)</Label>
            <Select value={triggerType} onValueChange={setTriggerType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o trigger" />
              </SelectTrigger>
              <SelectContent>
                {triggers.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Executar ação (Action)</Label>
            <Select value={actionType} onValueChange={setActionType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a ação" />
              </SelectTrigger>
              <SelectContent>
                {actions.map((a) => (
                  <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {actionType === "enviar_notificacao" && (
            <div className="space-y-2">
              <Label>Mensagem</Label>
              <Input
                value={actionConfig.mensagem ?? ""}
                onChange={(e) => setActionConfig({ ...actionConfig, mensagem: e.target.value })}
                placeholder="Mensagem da notificação"
              />
            </div>
          )}

          {actionType === "criar_tarefa" && (
            <div className="space-y-2">
              <Label>Título da nova tarefa</Label>
              <Input
                value={actionConfig.titulo ?? ""}
                onChange={(e) => setActionConfig({ ...actionConfig, titulo: e.target.value })}
                placeholder="Título automático"
              />
            </div>
          )}

          {actionType === "alterar_prioridade" && (
            <div className="space-y-2">
              <Label>Nova prioridade</Label>
              <Select value={actionConfig.prioridade ?? ""} onValueChange={(v) => setActionConfig({ ...actionConfig, prioridade: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={!nome.trim() || !triggerType || !actionType}>
              {editingId ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
