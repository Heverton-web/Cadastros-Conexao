import { Copy, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { HubInviteToken } from "../../types";

interface InviteShareModalProps {
  open: boolean;
  onClose: () => void;
  invite: HubInviteToken;
}

export function InviteShareModal({ open, onClose, invite }: InviteShareModalProps) {
  const inviteUrl = `${window.location.origin}/pre-cadastro/${invite.token}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Você foi convidado para o Conexão Hub! Acesse: ${inviteUrl}`)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteUrl);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar Convite</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Link do Convite</label>
            <div className="flex gap-2">
              <Input value={inviteUrl} readOnly />
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Share2 className="mr-2 h-4 w-4" /> WhatsApp
              </a>
            </Button>
          </div>
          <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            <p><strong>Role:</strong> {invite.role}</p>
            {invite.expires_at && <p><strong>Expira em:</strong> {new Date(invite.expires_at).toLocaleDateString()}</p>}
            <p><strong>Status:</strong> {invite.status === "pending" ? "Pendente" : invite.status === "used" ? "Utilizado" : "Expirado"}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
