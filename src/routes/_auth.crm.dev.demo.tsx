import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "~/core/supabase";
import { Switch } from "~/components/ui/switch";
import toast from "react-hot-toast";
import { DEMO_ACCOUNTS, type DemoRole } from "~/features/crm/lib/demo";
import { Loader2 } from "lucide-react";

export const crmDevDemoRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/crm/dev/demo",
  component: DevDemoCards,
});

function DevDemoCards() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["demo-flags-admin"],
    queryFn: async () => {
      const { data } = await supabase
        .from("app_config")
        .select("key,value")
        .in("key", Object.values(DEMO_ACCOUNTS).map((d) => d.flagKey));
      const map: Record<string, boolean> = {};
      (data ?? []).forEach((r: any) => (map[r.key] = r.value === true || r.value === "true"));
      return map;
    },
  });

  async function toggle(key: string, next: boolean) {
    const { error } = await supabase
      .from("app_config")
      .upsert({ key, value: next, atualizado_em: new Date().toISOString() });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(next ? "Cartão habilitado" : "Cartão ocultado");
    qc.invalidateQueries({ queryKey: ["demo-flags-admin"] });
    qc.invalidateQueries({ queryKey: ["demo-flags-public"] });
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Cartões de demonstração</h1>
        <p className="text-sm text-muted-foreground">
          Controle quais ambientes ficam visíveis na tela de login para demonstração ao cliente.
        </p>
      </header>

      {isLoading && <Loader2 className="h-4 w-4 animate-spin text-gold" />}

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(DEMO_ACCOUNTS) as DemoRole[]).map((role) => {
          const acc = DEMO_ACCOUNTS[role];
          const enabled = data?.[acc.flagKey] !== false;
          return (
            <div key={role} className="glass rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gold">{acc.title}</h2>
                  <p className="text-xs text-muted-foreground">{acc.subtitle}</p>
                </div>
                <Switch checked={enabled} onCheckedChange={(v) => toggle(acc.flagKey, v)} />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{acc.description}</p>
              <div className="rounded-lg border border-border bg-secondary/40 p-2 text-xs font-mono">
                <p>{acc.email}</p>
                <p className="text-muted-foreground">senha: {acc.password}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
