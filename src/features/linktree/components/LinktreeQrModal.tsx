import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { buildCardUrl } from "~/features/linktree/index";
import type { LinktreeColaborador } from "~/features/linktree/types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  collaborator: LinktreeColaborador | null;
}

export function LinktreeQrModal({ open, onOpenChange, collaborator }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas || !collaborator) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `qrcode-${collaborator.nome.toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code — {collaborator?.nome}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          {collaborator && (
            <div className="rounded-lg bg-white p-3">
              <QRCodeCanvas
                ref={canvasRef}
                value={buildCardUrl(collaborator.id)}
                size={256}
                marginSize={2}
                fgColor="#0f172a"
                bgColor="#ffffff"
                level="H"
              />
            </div>
          )}
          {collaborator && (
            <p className="break-all text-center text-xs text-muted-foreground">
              {buildCardUrl(collaborator.id)}
            </p>
          )}
          <Button variant="outline" onClick={handleDownload} disabled={!collaborator}>
            <Download className="size-4" /> Baixar PNG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
