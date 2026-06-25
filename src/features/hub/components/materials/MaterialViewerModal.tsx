import { X, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import type { HubMaterial, HubMaterialAsset, HubLanguage } from "../../types";

interface MaterialViewerModalProps {
  open: boolean;
  onClose: () => void;
  material: HubMaterial;
  assets: HubMaterialAsset[];
  language?: HubLanguage;
  onComplete?: () => void;
}

export function MaterialViewerModal({ open, onClose, material, assets, language = "pt-br", onComplete }: MaterialViewerModalProps) {
  const title = material.title?.[language] || material.title?.["pt-br"] || "Sem título";
  const asset = assets.find((a) => a.language === language) || assets[0];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="min-h-[400px]">
          {!asset ? (
            <div className="flex h-[400px] items-center justify-center text-muted-foreground">
              Nenhum arquivo disponível para este idioma.
            </div>
          ) : material.type === "video" ? (
            <video
              src={asset.url}
              controls
              className="h-auto max-h-[500px] w-full rounded-lg"
              onEnded={onComplete}
            />
          ) : material.type === "audio" ? (
            <div className="flex h-[200px] items-center justify-center">
              <audio src={asset.url} controls onEnded={onComplete} className="w-full" />
            </div>
          ) : material.type === "image" ? (
            <img src={asset.url} alt={title} className="mx-auto max-h-[500px] rounded-lg object-contain" onLoad={onComplete} />
          ) : material.type === "html" ? (
            <iframe src={asset.url} className="h-[500px] w-full rounded-lg border" onLoad={onComplete} />
          ) : (
            <iframe src={asset.url} className="h-[500px] w-full rounded-lg border" onLoad={onComplete} />
          )}
        </div>
        {asset?.subtitle_url && (
          <a href={asset.subtitle_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
            <ExternalLink className="h-3 w-3" /> Legenda disponível
          </a>
        )}
        <div className="flex justify-end">
          <Button onClick={onComplete}>Marcar como Concluído</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
