import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { MapPin, User, Building2, Hash, Award } from "lucide-react";
import type { Entity } from "../types";

interface Props {
  entity: Entity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EntityDetailDialog({ entity, open, onOpenChange }: Props) {
  if (!entity) return null;

  const { kind, item } = entity;
  const isDist = kind === "distributor";
  const pinColor = item.pin_color ?? "#4169e1";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface/80 border border-surface" style={{ color: pinColor }}>
              {isDist ? <Building2 className="h-6 w-6" /> : <User className="h-6 w-6" />}
            </div>
            <div className="min-w-0 space-y-1">
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-accent/10 text-accent">
                {isDist ? "Distribuidor" : "Consultor"}
              </span>
              <DialogTitle className="text-base font-semibold leading-tight text-foreground truncate">{item.name}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3.5">
            {isDist ? (
              item.code && (
                <div className="flex items-center gap-3 text-sm">
                  <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Código:</span>
                  <span className="font-semibold text-foreground">{item.code}</span>
                </div>
              )
            ) : (
              item.registration && (
                <div className="flex items-center gap-3 text-sm">
                  <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Matrícula:</span>
                  <span className="font-semibold text-foreground">{item.registration}</span>
                </div>
              )
            )}

            {isDist && (
              <div className="flex items-center gap-3 text-sm">
                <Award className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Categoria:</span>
                <Badge variant="outline" className="border-surface bg-surface/30">
                  {item.category === "EXCLUSIVE" ? "Exclusivo" : "Não-exclusivo"}
                </Badge>
              </div>
            )}

            <div className="flex items-start gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-muted-foreground">Localização:</span>
                <p className="font-medium text-foreground">
                  {isDist ? item.city : item.region} — {item.state}
                </p>
              </div>
            </div>
          </div>

        <DialogFooter>
          <Button type="button" className="w-full" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
