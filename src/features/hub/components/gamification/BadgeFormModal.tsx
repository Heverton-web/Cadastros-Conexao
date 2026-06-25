import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { HUB_BADGE_ICONS } from "../../constants";
import type { HubBadge, HubBadgeTrigger } from "../../types";

interface BadgeFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (badge: Partial<HubBadge>) => void;
  badge?: HubBadge;
}

const triggerTypes: { value: HubBadgeTrigger; label: string }[] = [
  { value: "material_completed", label: "Material Concluído" },
  { value: "collection_completed", label: "Trilha Concluída" },
  { value: "points_reached", label: "XP Atingido" },
  { value: "streak_days", label: "Sequência de Dias" },
  { value: "ranking_position", label: "Posição no Ranking" },
  { value: "login_count", label: "Número de Logins" },
];

export function BadgeFormModal({ open, onClose, onSave, badge }: BadgeFormModalProps) {
  const [name, setName] = useState(badge?.name || "");
  const [description, setDescription] = useState(badge?.description || "");
  const [iconName, setIconName] = useState(badge?.icon_name || "star");
  const [triggerType, setTriggerType] = useState<HubBadgeTrigger>(badge?.trigger_type || "material_completed");
  const [triggerValue, setTriggerValue] = useState(badge?.trigger_value || 1);
  const [pointsReward, setPointsReward] = useState(badge?.points_reward || 0);
  const [color, setColor] = useState(badge?.color || "#6366f1");

  const handleSave = () => {
    onSave({ ...badge, name, description, icon_name: iconName, trigger_type: triggerType, trigger_value: triggerValue, points_reward: pointsReward, color });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{badge ? "Editar Badge" : "Novo Badge"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Nome *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Descrição</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Ícone</label>
              <Select value={iconName} onValueChange={setIconName}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {HUB_BADGE_ICONS.map((ic) => (
                    <SelectItem key={ic} value={ic}>{ic}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Cor</label>
              <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Gatilho</label>
              <Select value={triggerType} onValueChange={(v) => setTriggerType(v as HubBadgeTrigger)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {triggerTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Valor do Gatilho</label>
              <Input type="number" value={triggerValue} onChange={(e) => setTriggerValue(Number(e.target.value))} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Recompensa XP</label>
            <Input type="number" value={pointsReward} onChange={(e) => setPointsReward(Number(e.target.value))} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave}>{badge ? "Salvar" : "Criar"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
