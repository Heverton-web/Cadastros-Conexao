import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { MapPin, User, Building2, Hash, Award, Navigation } from "lucide-react";
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

  const handleOpenRoute = () => {
    let url = "";
    if (item.lat != null && item.lng != null && item.lat !== 0 && item.lng !== 0) {
      url = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`;
    } else {
      const query = encodeURIComponent(`${item.name} ${isDist ? item.city ?? "" : item.region ?? ""} ${item.state}`);
      url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    }
    window.open(url, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-surface bg-card p-6 rounded-2xl">
        <DialogHeader className="pb-3 border-b border-surface/50">
          <div className="flex items-center gap-4">
            <div 
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface/80 border border-surface shadow-inner" 
              style={{ color: pinColor, borderColor: `${pinColor}40` }}
            >
              {isDist ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
            </div>
            <div className="min-w-0 space-y-1">
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-accent/15 text-accent">
                {isDist ? "Distribuidor" : "Consultor"}
              </span>
              <DialogTitle className="text-base font-bold leading-tight text-foreground truncate">{item.name}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {/* Coluna 1: ID / Registro */}
          {isDist ? (
            item.code && (
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Código</span>
                <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                  <Hash className="h-4 w-4 text-accent shrink-0" />
                  <span>{item.code}</span>
                </div>
              </div>
            )
          ) : (
            item.registration && (
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Matrícula</span>
                <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                  <Hash className="h-4 w-4 text-accent shrink-0" />
                  <span>{item.registration}</span>
                </div>
              </div>
            )
          )}

          {/* Coluna 2: Categoria (apenas Distribuidores) */}
          {isDist && (
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Categoria</span>
              <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                <Award className="h-4 w-4 text-accent shrink-0" />
                <span className="truncate">{item.category === "EXCLUSIVE" ? "Exclusivo" : "Não-exclusivo"}</span>
              </div>
            </div>
          )}

          {/* Localização */}
          <div className="col-span-2 space-y-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Localização</span>
            <div className="flex items-start gap-2 text-sm text-foreground font-medium">
              <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <span>
                {isDist ? item.city : item.region} — {item.state}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-col mt-2">
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full flex items-center justify-center gap-1.5 text-xs h-10 border-surface bg-surface/30 hover:bg-surface-hover text-foreground rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              <MapPin className="h-3.5 w-3.5 text-accent" />
              Ver no Mapa
            </Button>
            <Button 
              type="button" 
              className="w-full flex items-center justify-center gap-1.5 text-xs h-10 bg-accent hover:bg-accent-hover text-accent-fg font-semibold rounded-xl"
              onClick={handleOpenRoute}
            >
              <Navigation className="h-3.5 w-3.5" />
              Abrir Rota
            </Button>
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            className="w-full text-xs text-muted-foreground hover:text-foreground h-9 rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
