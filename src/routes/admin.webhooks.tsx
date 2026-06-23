import { createRoute, useSearch } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useAuth } from "~/lib/auth";
import { getModule, getAllModules } from "~/registry";
import { useState, useEffect, useMemo } from "react";
import {
  listarWebhooks, criarWebhook, atualizarWebhook, toggleWebhook, deletarWebhook,
  type Webhook, type WebhookInput,
} from "~/lib/webhooks";
import { Plus, Pencil, Trash2, Power, PowerOff, Bell, Globe, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import toast from "react-hot-toast";

export const adminWebhooksRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/admin/webhooks",
  component: AdminWebhooksPage,
});

function AdminWebhooksPage() {
  const { profile } = useAuth();
  const search = useSearch({ from: adminWebhooksRoute.id }) as { modulo?: string };

  const isSuper = profile?.is_super_admin === true;
  const isCompanyAdmin = profile?.role === "admin";

  if (!isSuper && !isCompanyAdmin) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-8 pt-20">
        <Bell size={40} className="text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Acesso restrito a Super Administradores e Administradores da empresa.</p>
      </div>
    );
  }

  return <WebhooksContent isSuper={isSuper} empresaId={profile?.empresa_id} defaultModulo={search.modulo} />;
}

function WebhooksContent({ isSuper, empresaId, defaultModulo }: { isSuper: boolean; empresaId?: string | null; defaultModulo?: string }) {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduloKey, setModuloKey] = useState(defaultModulo || "");
  const [editing, setEditing] = useState<Webhook | null>(null);
  const [creating, setCreating] = useState<{ evento: string; evento_key: string } | null>(null);

  const modulos = useMemo(() => getAllModules().filter((m) => m.events.length > 0), []);

  const mod = useMemo(() => getModule(moduloKey), [moduloKey]);

  useEffect(() => {
    if (!moduloKey) { setWebhooks([]); setLoading(false); return; }
    setLoading(true);
    listarWebhooks(empresaId)
      .then((data) => {
        setWebhooks(data.filter((w) => w.modulo_key === moduloKey));
      })
      .catch(() => toast.error("Erro ao carregar webhooks"))
      .finally(() => setLoading(false));
  }, [moduloKey, empresaId]);

  const webhooksByEvent = useMemo(() => {
    const map = new Map<string, Webhook[]>();
    for (const wh of webhooks) {
      const ek = wh.evento_key || wh.evento;
      if (!map.has(ek)) map.set(ek, []);
      map.get(ek)!.push(wh);
    }
    return map;
  }, [webhooks]);

  async function handleSave(input: WebhookInput, id?: string) {
    try {
      if (id) {
        await atualizarWebhook(id, input);
        toast.success("Webhook atualizado");
      } else {
        await criarWebhook({ ...input, empresa_id: empresaId });
        toast.success("Webhook criado");
      }
      setEditing(null);
      setCreating(null);
      const data = await listarWebhooks(empresaId);
      setWebhooks(data.filter((w) => w.modulo_key === moduloKey));
    } catch {
      toast.error("Erro ao salvar webhook");
    }
  }

  async function handleToggle(wh: Webhook) {
    try {
      await toggleWebhook(wh.id, !wh.ativo);
      setWebhooks((prev) => prev.map((w) => w.id === wh.id ? { ...w, ativo: !w.ativo } : w));
      toast.success(wh.ativo ? "Webhook desativado" : "Webhook ativado");
    } catch {
      toast.error("Erro ao alternar webhook");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletarWebhook(id);
      setWebhooks((prev) => prev.filter((w) => w.id !== id));
      toast.success("Webhook removido");
    } catch {
      toast.error("Erro ao remover webhook");
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Webhooks</h1>
        <p className="text-sm text-muted-foreground">Configure webhooks disparados por eventos dos módulos.</p>
      </header>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium shrink-0">Módulo:</label>
        <Select value={moduloKey} onValueChange={setModuloKey}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Selecione um módulo" />
          </SelectTrigger>
          <SelectContent>
            {modulos.map((m) => (
              <SelectItem key={m.key} value={m.key}>{m.nome} ({m.key})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!moduloKey && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-surface py-16 text-sm text-muted-foreground">
          <Globe className="h-8 w-8" />
          <p>Selecione um módulo para gerenciar seus webhooks.</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        </div>
      )}

      {mod && !loading && (
        <div className="space-y-6">
          {mod.events.length === 0 ? (
            <p className="text-sm text-muted-foreground">Este módulo não possui eventos cadastrados.</p>
          ) : (
            mod.events.map((evt) => {
              const hooks = webhooksByEvent.get(evt.key) || [];
              return (
                <section key={evt.key} className="rounded-xl border border-surface bg-card">
                  <div className="flex items-start justify-between gap-4 border-b border-surface px-5 py-4">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-accent shrink-0" />
                        <span className="font-semibold text-sm">{evt.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{evt.key}</p>
                      <p className="text-xs text-muted-foreground">{evt.descricao}</p>
                    </div>
                    <Button size="sm" onClick={() => setCreating({ evento: evt.label, evento_key: evt.key })} className="shrink-0 gap-1">
                      <Plus className="h-3.5 w-3.5" /> Webhook
                    </Button>
                  </div>

                  {hooks.length === 0 ? (
                    <p className="px-5 py-4 text-xs text-muted-foreground">Nenhum webhook configurado para este evento.</p>
                  ) : (
                    <ul className="divide-y divide-surface">
                      {hooks.map((wh) => (
                        <li key={wh.id} className="flex items-center justify-between gap-4 px-5 py-3">
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className={`inline-block size-2 rounded-full ${wh.ativo ? "bg-green-500" : "bg-muted-foreground/40"}`} />
                              <span className="font-medium text-sm truncate">{wh.nome}</span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate font-mono">{wh.url}</p>
                            <p className="text-[10px] text-muted-foreground">{wh.metodo || "POST"}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button size="sm" variant="ghost" onClick={() => handleToggle(wh)} title={wh.ativo ? "Desativar" : "Ativar"}>
                              {wh.ativo ? <PowerOff className="h-3.5 w-3.5 text-muted-foreground" /> : <Power className="h-3.5 w-3.5 text-green-500" />}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditing(wh)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(wh.id)}>
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })
          )}
        </div>
      )}

      <WebhookDialog
        open={!!editing || !!creating}
        webhook={editing}
        moduloKey={moduloKey}
        eventoLabel={creating?.evento || editing?.evento || ""}
        eventoKey={creating?.evento_key || editing?.evento_key || ""}
        events={mod?.events || []}
        onClose={() => { setEditing(null); setCreating(null); }}
        onSave={(input, id) => handleSave(input, id)}
      />
    </div>
  );
}

function WebhookDialog({
  open, webhook, moduloKey, eventoLabel, eventoKey, events, onClose, onSave,
}: {
  open: boolean;
  webhook: Webhook | null;
  moduloKey: string;
  eventoLabel: string;
  eventoKey: string;
  events: { key: string; label: string }[];
  onClose: () => void;
  onSave: (input: WebhookInput, id?: string) => void;
}) {
  const [nome, setNome] = useState("");
  const [url, setUrl] = useState("");
  const [metodo, setMetodo] = useState("POST");
  const [evtKey, setEvtKey] = useState("");

  useEffect(() => {
    if (webhook) {
      setNome(webhook.nome);
      setUrl(webhook.url);
      setMetodo(webhook.metodo || "POST");
      setEvtKey(webhook.evento_key || webhook.evento);
    } else if (eventoKey) {
      setNome("");
      setUrl("");
      setMetodo("POST");
      setEvtKey(eventoKey);
    }
  }, [webhook, eventoKey, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !url.trim() || !evtKey) return;
    onSave({
      nome: nome.trim(),
      evento: evtKey,
      tipo_evento: "button_action",
      url: url.trim(),
      metodo,
      modulo_key: moduloKey,
      evento_key: evtKey,
      ativo: true,
    }, webhook?.id);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{webhook ? "Editar webhook" : "Novo webhook"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset>
            <label className="text-sm font-medium">Nome *</label>
            <Input required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Meu webhook" />
          </fieldset>
          <fieldset>
            <label className="text-sm font-medium">Evento *</label>
            <Select value={evtKey} onValueChange={setEvtKey} disabled={!!webhook}>
              <SelectTrigger><SelectValue placeholder="Selecione o evento" /></SelectTrigger>
              <SelectContent>
                {events.map((e) => (
                  <SelectItem key={e.key} value={e.key}>{e.label} ({e.key})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </fieldset>
          <fieldset>
            <label className="text-sm font-medium">URL *</label>
            <Input required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://hook.example.com/callback" />
          </fieldset>
          <fieldset>
            <label className="text-sm font-medium">Método</label>
            <Select value={metodo} onValueChange={setMetodo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["POST", "PUT", "PATCH", "GET", "DELETE"].map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </fieldset>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit">{webhook ? "Salvar" : "Criar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
