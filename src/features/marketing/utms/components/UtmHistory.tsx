import { useState, useEffect } from "react";
import { Copy, Check, Trash2, Filter, Link, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "~/lib/auth";
import { PageHeader } from "~/components/ui/page-header";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { EmptyState } from "~/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { listarUtms, deletarUtm } from "../services/utm.service";
import type { Utm, UtmSource } from "../types";

const UTM_SOURCES: { value: UtmSource | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "google", label: "Google" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "email", label: "E-mail" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "direct", label: "Direct" },
  { value: "organic", label: "Orgânico" },
];

export function UtmHistory() {
  const { user } = useAuth();
  const [utms, setUtms] = useState<Utm[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroSource, setFiltroSource] = useState<UtmSource | "all">("all");
  const [busca, setBusca] = useState("");
  const [itemParaDeletar, setItemParaDeletar] = useState<Utm | null>(null);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.empresa_id) return;
    listarUtms(user.empresa_id)
      .then(setUtms)
      .catch(() => toast.error("Erro ao carregar UTMs"))
      .finally(() => setCarregando(false));
  }, [user?.empresa_id]);

  const filtradas = utms.filter((utm) => {
    const matchSource = filtroSource === "all" || utm.utm_source === filtroSource;
    const matchBusca = !busca || utm.nome.toLowerCase().includes(busca.toLowerCase()) || utm.url_base.toLowerCase().includes(busca.toLowerCase());
    return matchSource && matchBusca;
  });

  async function handleCopiar(url: string, id: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiadoId(id);
      toast.success("URL copiada!");
      setTimeout(() => setCopiadoId(null), 2000);
    } catch {
      toast.error("Erro ao copiar");
    }
  }

  async function handleConfirmDelete() {
    if (!itemParaDeletar) return;
    const ok = await deletarUtm(itemParaDeletar.id);
    if (ok) {
      setUtms((prev) => prev.filter((u) => u.id !== itemParaDeletar.id));
      toast.success("UTM excluída");
    } else {
      toast.error("Erro ao excluir UTM");
    }
    setItemParaDeletar(null);
  }

  if (carregando) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full rounded-xl" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (utms.length === 0) {
    return (
      <>
        <PageHeader title="Histórico de UTMs" description="URLs com parâmetros UTM geradas anteriormente" />
        <EmptyState
          icon={<Link className="w-8 h-8 text-text-muted" />}
          title="Nenhuma UTM salva"
          description="As UTMs que você gerar e salvar aparecerão aqui."
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Histórico de UTMs" description="URLs com parâmetros UTM geradas anteriormente" />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Filter className="w-4 h-4 text-text-muted shrink-0" />
          <Select value={filtroSource} onValueChange={(v) => setFiltroSource(v as UtmSource | "all")}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {UTM_SOURCES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="Buscar por nome ou URL..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="space-y-3">
        {filtradas.map((utm) => (
          <Card key={utm.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-semibold text-text-main truncate">{utm.nome}</p>
                  <p className="text-xs text-text-muted truncate">{utm.url_base}</p>
                  <div className="flex items-center gap-3 text-xs mt-1">
                    <span className="inline-flex items-center gap-1 bg-surface border border-border rounded-md px-2 py-0.5">
                      source: {utm.utm_source}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-surface border border-border rounded-md px-2 py-0.5">
                      medium: {utm.utm_medium}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-surface border border-border rounded-md px-2 py-0.5">
                      campaign: {utm.utm_campaign}
                    </span>
                    <span className="text-text-muted">
                      {new Date(utm.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-text-muted truncate mt-1">{utm.url_final}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleCopiar(utm.url_final, utm.id)}
                  >
                    {copiadoId === utm.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                  <button
                    onClick={() => setItemParaDeletar(utm)}
                    className="text-text-muted hover:text-error transition-colors p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtradas.length === 0 && (
        <EmptyState
          title="Nenhum resultado"
          description="Nenhuma UTM encontrada com os filtros atuais."
        />
      )}

      <AlertDialog open={!!itemParaDeletar} onOpenChange={(o) => !o && setItemParaDeletar(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir UTM?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A UTM "{itemParaDeletar?.nome}" será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
