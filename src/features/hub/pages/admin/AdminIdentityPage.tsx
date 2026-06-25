import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Palette, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchHubConfig, upsertHubConfig } from "../../services/config";

function colorMix(c1: string, w: number, c2: string) { return `color-mix(in srgb, ${c1} ${w}%, ${c2})`; }

export function AdminIdentityPage() {
  const { empresa } = useAuth();
  const queryClient = useQueryClient();
  const { data: config } = useQuery({ queryKey: ["hub-config", empresa?.id], queryFn: () => fetchHubConfig(empresa!.id), enabled: !!empresa?.id });

  const [appName, setAppName] = useState("Conexão Hub");
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    if (config) { setAppName(config.app_name || "Conexão Hub"); setLogoUrl(config.logo_url || ""); }
  }, [config]);

  const save = useMutation({
    mutationFn: () => upsertHubConfig({ empresa_id: empresa!.id, app_name: appName, logo_url: logoUrl || undefined }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["hub-config"] }),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2" style={{ color: "var(--color-text-main)" }}>
          <Palette size={24} /> Identidade Visual
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Aparência do Hub para os usuários</p>
      </div>

      <div className="rounded-2xl p-6 border space-y-4" style={{ borderColor: "var(--color-border)", backgroundColor: colorMix("var(--color-surface)", 40, "rgba(30,41,59,0.4)") }}>
        <div className="space-y-2">
          <label className="text-sm font-bold" style={{ color: "var(--color-text-main)" }}>Nome do Aplicativo</label>
          <Input value={appName} onChange={(e) => setAppName(e.target.value)} style={{ backgroundColor: "var(--color-input-bg)", borderColor: "var(--color-input-border)", color: "var(--color-text-main)" }} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold" style={{ color: "var(--color-text-main)" }}>URL do Logo</label>
          <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." style={{ backgroundColor: "var(--color-input-bg)", borderColor: "var(--color-input-border)", color: "var(--color-text-main)" }} />
        </div>

        {logoUrl && (
          <div className="p-4 rounded-xl" style={{ backgroundColor: "var(--color-bg)" }}>
            <p className="text-xs font-bold mb-2" style={{ color: "var(--color-text-muted)" }}>Preview:</p>
            <img src={logoUrl} alt="Logo" className="h-12 w-auto object-contain" />
          </div>
        )}

        <Button onClick={() => save.mutate()} disabled={save.isPending} className="gap-2">
          <Save size={14} /> {save.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
}
