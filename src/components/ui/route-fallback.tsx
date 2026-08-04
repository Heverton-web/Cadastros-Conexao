import { Loader2 } from "lucide-react";

export function RouteFallback() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute h-14 w-14 rounded-full bg-accent/10 animate-glow" />
        <span className="absolute h-14 w-14 rounded-full bg-accent/20 animate-ping" />
        <Loader2 className="h-7 w-7 animate-spin text-accent" />
      </div>
      <p className="animate-fade-in text-sm text-text-muted">Carregando...</p>
    </div>
  );
}
