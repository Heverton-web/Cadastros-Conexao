import { Webhook } from "lucide-react";
import { HUB_WEBHOOK_EVENTS } from "../types";

function colorMix(c1: string, w: number, c2: string) { return `color-mix(in srgb, ${c1} ${w}%, ${c2})`; }

export function HubWebhooksPage() {
  return (
    <div className="space-y-6">
      <div className="relative group rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden animate-fade-in">
        <div className="absolute inset-0 opacity-60" style={{ background: `linear-gradient(to right, ${colorMix("var(--color-accent)", 10, "rgba(201,166,85,0.1)")}, ${colorMix("var(--color-gradient-mid)", 10, "rgba(232,212,139,0.1)")}, transparent)` }} />
        <div className="relative z-10 p-5 sm:p-8 md:p-10">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: "var(--color-text-main)" }}>Webhooks Hub</h1>
          <p className="text-sm sm:text-base max-w-lg font-medium" style={{ color: "var(--color-text-muted)" }}>Gerencie webhooks para eventos do Hub.</p>
        </div>
      </div>
      <div className="space-y-2">
        {HUB_WEBHOOK_EVENTS.map((ev) => (
          <div key={ev.value} className="flex items-center justify-between rounded-xl p-4 border transition-all" style={{ borderColor: "var(--color-border)", backgroundColor: colorMix("var(--color-surface)", 40, "rgba(30,41,59,0.4)") }}>
            <div className="flex items-center gap-3">
              <div className="icon-box-sm"><Webhook size={14} /></div>
              <div>
                <p className="font-bold" style={{ color: "var(--color-text-main)" }}>{ev.label}</p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{ev.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
