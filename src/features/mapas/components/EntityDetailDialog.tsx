import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
  MapPin,
  User,
  Building2,
  Hash,
  Award,
  Navigation,
  ExternalLink,
} from "lucide-react";
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
    if (
      item.lat != null &&
      item.lng != null &&
      item.lat !== 0 &&
      item.lng !== 0
    ) {
      url = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`;
    } else {
      const query = encodeURIComponent(
        `${item.name} ${isDist ? (item.city ?? "") : (item.region ?? "")} ${item.state}`,
      );
      url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    }
    window.open(url, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-surface bg-card p-6 rounded-2xl">
        <DialogHeader className="pb-4 border-b border-surface/50">
          <div className="flex items-center gap-4">
            {/* Avatar circular com glow da cor do pin */}
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 shadow-lg transition-shadow"
              style={{
                backgroundColor: `${pinColor}15`,
                borderColor: `${pinColor}50`,
                color: pinColor,
                boxShadow: `0 0 20px ${pinColor}25, 0 4px 12px rgba(0,0,0,0.3)`,
              }}
            >
              {isDist ? (
                <Building2 className="h-6 w-6" />
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            <div className="min-w-0 space-y-1.5">
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: `${pinColor}15`, color: pinColor }}
              >
                {isDist ? "Distribuidor" : "Consultor"}
              </span>
              <DialogTitle className="text-base font-bold leading-tight text-foreground truncate">
                {item.name}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* Grid de informações - 2 colunas */}
        <div className="grid grid-cols-2 gap-4 py-4">
          {/* ID / Registro */}
          {isDist
            ? item.code && (
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Código
                  </span>
                  <div className="flex items-center gap-2 text-sm text-foreground font-semibold">
                    <Hash size={14} className="text-accent shrink-0" />
                    <span>{item.code}</span>
                  </div>
                </div>
              )
            : item.registration && (
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Matrícula
                  </span>
                  <div className="flex items-center gap-2 text-sm text-foreground font-semibold">
                    <Hash size={14} className="text-accent shrink-0" />
                    <span>{item.registration}</span>
                  </div>
                </div>
              )}

          {/* Categoria (apenas Distribuidores) */}
          {isDist && (
            <div className="space-y-1.5">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Categoria
              </span>
              <div className="flex items-center gap-2 text-sm text-foreground font-semibold">
                <Award size={14} className="text-accent shrink-0" />
                <span className="truncate">
                  {item.category === "EXCLUSIVE"
                    ? "Exclusivo"
                    : "Não-exclusivo"}
                </span>
              </div>
            </div>
          )}

          {/* Supervisor (apenas Consultores) */}
          {!isDist && (item as any).supervisor && (
            <div className="space-y-1.5">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Supervisor
              </span>
              <div className="flex items-center gap-2 text-sm text-foreground font-semibold">
                <User size={14} className="text-accent shrink-0" />
                <span className="truncate">{(item as any).supervisor}</span>
              </div>
            </div>
          )}

          {/* Localização - span 2 colunas */}
          <div className="col-span-2 space-y-1.5">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Localização
            </span>
            <div className="flex items-start gap-2 text-sm text-foreground font-semibold">
              <MapPin size={14} className="text-accent shrink-0 mt-0.5" />
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
              className="w-full flex items-center justify-center gap-1.5 text-xs h-11 border-surface bg-surface/30 hover:bg-surface-hover text-foreground rounded-xl transition-all hover:border-accent/30"
              onClick={() => onOpenChange(false)}
            >
              <MapPin size={13} className="text-accent" />
              Ver no Mapa
            </Button>
            <Button
              type="button"
              className="w-full flex items-center justify-center gap-1.5 text-xs h-11 bg-accent hover:bg-accent-hover text-accent-fg font-semibold rounded-xl shadow-md shadow-accent/20 transition-all hover:shadow-lg hover:shadow-accent/30"
              onClick={handleOpenRoute}
            >
              <Navigation size={13} />
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
