import { useState } from "react";
import { Download } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";

export function QrCodeGenerator() {
  const [url, setUrl] = useState("");
  const [tamanho, setTamanho] = useState(256);

  function handleDownload() {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("QR Code baixado!");
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-text-main">URL para o QR Code *</label>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://exemplo.com"
        />
      </div>

      {url && (
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-xl bg-white p-4 border border-border inline-block">
            <QRCodeCanvas value={url} size={tamanho} level="M" />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-text-muted">Tamanho:</label>
            <select
              value={tamanho}
              onChange={(e) => setTamanho(Number(e.target.value))}
              className="rounded-lg bg-surface border border-border px-3 py-1.5 text-sm text-text-main"
            >
              <option value={128}>128px</option>
              <option value={256}>256px</option>
              <option value={384}>384px</option>
              <option value={512}>512px</option>
            </select>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4" /> Download PNG
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
