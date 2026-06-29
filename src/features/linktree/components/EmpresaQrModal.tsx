import { QRCodeCanvas } from "qrcode.react";
import { Download, Link2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { buildEmpresaLinktreeUrl } from "../services/empresa";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
}

export function EmpresaQrModal({ open, onOpenChange, slug }: Props) {
  const url = buildEmpresaLinktreeUrl(slug);

  function handleDownload() {
    const canvas = document.querySelector<HTMLCanvasElement>("#empresa-qr-canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `qrcode-${slug}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>QR Code do Linktree</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <div className="rounded-xl bg-white p-4">
            <QRCodeCanvas id="empresa-qr-canvas" value={url} size={200} marginSize={2} />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link2 className="size-4" />
            <span className="font-mono">{url}</span>
          </div>

          <Button onClick={handleDownload} className="w-full">
            <Download className="size-4" />
            Baixar PNG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
