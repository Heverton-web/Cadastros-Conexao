import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { HUB_MATERIAL_TYPES } from "../../constants";
import type { HubMaterial, HubLanguage } from "../../types";

interface MaterialFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (material: Partial<HubMaterial>) => void;
  material?: HubMaterial;
}

export function MaterialFormModal({ open, onClose, onSave, material }: MaterialFormModalProps) {
  const [title, setTitle] = useState<Record<HubLanguage, string>>(material?.title || { "pt-br": "", "en-us": "", "es-es": "" });
  const [type, setType] = useState<string>(material?.type || "pdf");
  const [points, setPoints] = useState(material?.points || 10);
  const [category, setCategory] = useState(material?.category || "");
  const [tags, setTags] = useState(material?.tags?.join(", ") || "");

  const handleSave = () => {
    onSave({
      ...material,
      title,
      type: type as HubMaterial["type"],
      points,
      category: category || undefined,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{material ? "Editar Material" : "Novo Material"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Título (PT-BR) *</label>
            <Input value={title["pt-br"]} onChange={(e) => setTitle({ ...title, "pt-br": e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Título (EN-US)</label>
              <Input value={title["en-us"]} onChange={(e) => setTitle({ ...title, "en-us": e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Título (ES-ES)</label>
              <Input value={title["es-es"]} onChange={(e) => setTitle({ ...title, "es-es": e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Tipo</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {HUB_MATERIAL_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">XP</label>
              <Input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Categoria</label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex: Segurança, Produto, etc." />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Tags (separadas por vírgula)</label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tag1, tag2, tag3" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave}>{material ? "Salvar" : "Criar"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
