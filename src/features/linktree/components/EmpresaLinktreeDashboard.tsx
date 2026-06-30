import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Link2,
  QrCode,
  ExternalLink,
  Loader2,
  Settings,
  BarChart3,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/lib/auth";
import {
  useEmpresaConfig,
  useSecoes,
  useLinks,
} from "../hooks/useEmpresaLinktree";
import { LinksList } from "./LinksList";
import { AnalyticsPanel } from "./AnalyticsPanel";
import { EmpresaQrModal } from "./EmpresaQrModal";
import { EmpresaSelector } from "./EmpresaSelector";
import { buildEmpresaLinktreeUrl } from "../services/empresa";

export function EmpresaLinktreeDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isSuper = profile?.is_super_admin === true;

  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string | null>(
    isSuper ? null : (profile?.empresa_id ?? null),
  );

  const { data: config, isLoading: loadingConfig } =
    useEmpresaConfig(selectedEmpresaId);
  const { data: sections = [] } = useSecoes(selectedEmpresaId);
  const { data: links = [] } = useLinks(selectedEmpresaId);
  const [qrOpen, setQrOpen] = useState(false);
  const [tab, setTab] = useState<"links" | "analytics">("links");

  if (isSuper && !selectedEmpresaId) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text-main">
          Linktree da Empresa
        </h1>
        <p className="text-sm text-muted-foreground">
          Selecione uma empresa para gerenciar o linktree.
        </p>
        <div className="max-w-sm">
          <EmpresaSelector
            value={selectedEmpresaId}
            onChange={setSelectedEmpresaId}
          />
        </div>
      </div>
    );
  }

  if (loadingConfig) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text-main">
          Linktree da Empresa
        </h1>
        {isSuper && (
          <div className="max-w-sm">
            <EmpresaSelector
              value={selectedEmpresaId}
              onChange={setSelectedEmpresaId}
            />
          </div>
        )}
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <Link2 className="mb-4 size-12 text-muted-foreground" />
          <p className="mb-4 text-lg font-medium text-text-main">
            Nenhum linktree configurado
          </p>
          <Button onClick={() => navigate({ to: "/linktree/empresa/editor" })}>
            <Settings className="size-4" /> Configurar Linktree
          </Button>
        </div>
      </div>
    );
  }

  const publicUrl = buildEmpresaLinktreeUrl(config.slug);

  return (
    <div className="space-y-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main">
            Linktree da Empresa
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {config.bio || "Gerencie os links do seu linktree."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setQrOpen(true)}>
            <QrCode className="size-4" /> QR Code
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(publicUrl, "_blank")}
          >
            <ExternalLink className="size-4" /> Ver pagina
          </Button>
          <Button onClick={() => navigate({ to: "/linktree/empresa/editor" })}>
            <Settings className="size-4" /> Editor
          </Button>
        </div>
      </header>

      {isSuper && (
        <div className="max-w-sm">
          <EmpresaSelector
            value={selectedEmpresaId}
            onChange={setSelectedEmpresaId}
          />
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted-foreground">Slug</p>
          <p className="font-mono text-lg font-bold">/e/{config.slug}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted-foreground">Total de Links</p>
          <p className="text-lg font-bold">{links.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted-foreground">Secoes</p>
          <p className="text-lg font-bold">{sections.length}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab("links")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${tab === "links" ? "bg-primary text-primary-foreground" : "bg-surface-hover text-muted-foreground"}`}
        >
          Links
        </button>
        <button
          onClick={() => setTab("analytics")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${tab === "analytics" ? "bg-primary text-primary-foreground" : "bg-surface-hover text-muted-foreground"}`}
        >
          <BarChart3 className="size-4" /> Analytics
        </button>
      </div>

      {tab === "links" ? (
        <LinksList
          sections={sections}
          links={links}
          empresaId={selectedEmpresaId}
        />
      ) : (
        <AnalyticsPanel empresaId={selectedEmpresaId} />
      )}

      <EmpresaQrModal
        open={qrOpen}
        onOpenChange={setQrOpen}
        slug={config.slug}
      />
    </div>
  );
}
