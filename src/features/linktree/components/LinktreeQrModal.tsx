import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { gerarQrCodeDataUrl, downloadQrPng, buildCardUrl } from "~/features/linktree/index";
import type { LinktreeColaborador } from "~/features/linktree/types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  collaborator: LinktreeColaborador | null;
}

export function LinktreeQrModal({ open, onOpenChange, collaborator }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadQr(id: string) {
    setLoading(true);
    try {
      const url = await gerarQrCodeDataUrl(id);
      setDataUrl(url);
    } catch {
      setDataUrl(null);
    }
    setLoading(false);
  }

  function handleOpen(v: boolean) {
    if (v && collaborator) {
      loadQr(collaborator.id);
    } else {
      setDataUrl(null);
    }
    onOpenChange(v);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code — {collaborator?.nome}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          {loading || !dataUrl ? (
            <div className="flex size-64 items-center justify-center rounded-lg bg-surface-hover">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <img src={dataUrl} alt={`QR Code ${collaborator?.nome}`} className="size-64 rounded-lg bg-white p-3" />
          )}
          {collaborator && (
            <p className="break-all text-center text-xs text-muted-foreground">
              {buildCardUrl(collaborator.id)}
            </p>
          )}
          <Button
            variant="outline"
            onClick={() => collaborator && downloadQrPng(collaborator.id, collaborator.nome)}
            disabled={!dataUrl}
          >
            <Download className="size-4" /> Baixar PNG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
