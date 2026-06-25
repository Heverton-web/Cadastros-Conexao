import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { HUB_USER_STATUS_LABELS } from "../../constants";
import type { HubUserProfile, HubUserStatus } from "../../types";

interface UserEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (updates: Partial<HubUserProfile>) => void;
  user: HubUserProfile;
}

export function UserEditModal({ open, onClose, onSave, user }: UserEditModalProps) {
  const [name, setName] = useState(user.name);
  const [whatsapp, setWhatsapp] = useState(user.whatsapp || "");
  const [cro, setCro] = useState(user.cro || "");
  const [status, setStatus] = useState<HubUserStatus>(user.status);

  const handleSave = () => {
    onSave({ id: user.id, name, whatsapp, cro: cro || undefined, status });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Nome</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">WhatsApp</label>
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(11) 99999-9999" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">CRO</label>
            <Input value={cro} onChange={(e) => setCro(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <Select value={status} onValueChange={(v) => setStatus(v as HubUserStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(HUB_USER_STATUS_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
