import { useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { HUB_LANGUAGES, HUB_TRANSLATION_STATUS_LABELS } from "../../constants";
import type { HubMaterialAsset, HubLanguage, HubTranslationStatus } from "../../types";

interface AssetManagerModalProps {
  open: boolean;
  onClose: () => void;
  assets: HubMaterialAsset[];
  onSave: (assets: Partial<HubMaterialAsset>[]) => void;
}

export function AssetManagerModal({ open, onClose, assets, onSave }: AssetManagerModalProps) {
  const [localAssets, setLocalAssets] = useState<Partial<HubMaterialAsset>[]>(
    assets.map((a) => ({ ...a }))
  );

  const addAsset = () => {
    setLocalAssets([...localAssets, { language: "pt-br", url: "", status: "draft" }]);
  };

  const updateAsset = (index: number, field: string, value: string) => {
    const updated = [...localAssets];
    updated[index] = { ...updated[index], [field]: value };
    setLocalAssets(updated);
  };

  const removeAsset = (index: number) => {
    setLocalAssets(localAssets.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Arquivos</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {localAssets.map((asset, index) => (
            <div key={index} className="flex items-center gap-2 rounded-lg border p-3">
              <Select value={asset.language} onValueChange={(v) => updateAsset(index, "language", v)}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {HUB_LANGUAGES.map((l) => (
                    <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={asset.url || ""}
                onChange={(e) => updateAsset(index, "url", e.target.value)}
                placeholder="URL do arquivo"
                className="flex-1"
              />
              <Select value={asset.status} onValueChange={(v) => updateAsset(index, "status", v)}>
                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(HUB_TRANSLATION_STATUS_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" onClick={() => removeAsset(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addAsset} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Arquivo
          </Button>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => { onSave(localAssets); onClose(); }}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
