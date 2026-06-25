import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import type { HubCollection, HubLanguage } from "../../types";

interface CollectionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (collection: Partial<HubCollection>) => void;
  collection?: HubCollection;
}

export function CollectionFormModal({ open, onClose, onSave, collection }: CollectionFormModalProps) {
  const [title, setTitle] = useState<Record<HubLanguage, string>>(collection?.title || { "pt-br": "", "en-us": "", "es-es": "" });
  const [description, setDescription] = useState<Record<HubLanguage, string>>(collection?.description || { "pt-br": "", "en-us": "", "es-es": "" });
  const [points, setPoints] = useState(collection?.points || 50);
  const [coverImage, setCoverImage] = useState(collection?.cover_image || "");

  const handleSave = () => {
    onSave({ ...collection, title, description, points, cover_image: coverImage || undefined });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{collection ? "Editar Trilha" : "Nova Trilha"}</DialogTitle>
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
          <div>
            <label className="mb-1 block text-sm font-medium">Descrição (PT-BR)</label>
            <Textarea value={description["pt-br"]} onChange={(e) => setDescription({ ...description, "pt-br": e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">XP da Trilha</label>
              <Input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">URL da Capa</label>
              <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave}>{collection ? "Salvar" : "Criar"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
