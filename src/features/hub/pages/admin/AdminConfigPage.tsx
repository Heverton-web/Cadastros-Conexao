import { useQuery } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import { Settings, Shield } from "lucide-react";
import { fetchHubConfig } from "../../services/config";

function colorMix(c1: string, w: number, c2: string) { return `color-mix(in srgb, ${c1} ${w}%, ${c2})`; }

export function AdminConfigPage() {
  const { empresa } = useAuth();
  const { data: config } = useQuery({ queryKey: ["hub-config", empresa?.id], queryFn: () => fetchHubConfig(empresa!.id), enabled: !!empresa?.id });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2" style={{ color: "var(--color-text-main)" }}>
          <Settings size={24} /> Configurações
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Configurações gerais do Hub (exclusivo Super Admin)</p>
      </div>

      <div className="rounded-2xl p-6 border" style={{ borderColor: "var(--color-border)", backgroundColor: colorMix("var(--color-surface)", 40, "rgba(30,41,59,0.4)") }}>
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} style={{ color: "var(--color-accent)" }} />
          <h3 className="font-bold" style={{ color: "var(--color-text-main)" }}>Identidade do Hub</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ backgroundColor: "var(--color-bg)" }}>
            <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>Nome do App</span>
            <span className="text-sm font-bold" style={{ color: "var(--color-text-main)" }}>{config?.app_name || "Conexão Hub"}</span>
          </div>
          <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ backgroundColor: "var(--color-bg)" }}>
            <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>Logo URL</span>
            <span className="text-sm font-bold" style={{ color: "var(--color-text-main)" }}>{config?.logo_url || "Não configurado"}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-6 border" style={{ borderColor: "var(--color-border)", backgroundColor: colorMix("var(--color-surface)", 40, "rgba(30,41,59,0.4)") }}>
        <h3 className="font-bold mb-4" style={{ color: "var(--color-text-main)" }}>Status do Sistema</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: "var(--color-bg)" }}>
            <p className="text-2xl font-bold" style={{ color: "var(--color-success)" }}>●</p>
            <p className="text-xs font-bold mt-1" style={{ color: "var(--color-text-muted)" }}>Banco de Dados</p>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: "var(--color-bg)" }}>
            <p className="text-2xl font-bold" style={{ color: "var(--color-success)" }}>●</p>
            <p className="text-xs font-bold mt-1" style={{ color: "var(--color-text-muted)" }}>Auth</p>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: "var(--color-bg)" }}>
            <p className="text-2xl font-bold" style={{ color: "var(--color-success)" }}>●</p>
            <p className="text-xs font-bold mt-1" style={{ color: "var(--color-text-muted)" }}>Storage</p>
          </div>
        </div>
      </div>
    </div>
  );
}
