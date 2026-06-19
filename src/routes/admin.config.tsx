import { createRoute, useNavigate } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useState, useEffect } from "react";
import { useAuth } from "~/lib/auth";
import {
  getAppConfig, updateAppConfig, type AppConfig,
  listMockCredentials, createMockCredential, updateMockCredential, toggleMockCredential, deleteMockCredential, type MockCredential, type MockCredentialInput,
} from "~/lib/admin";
import {
  listarWebhooks, criarWebhook, atualizarWebhook, toggleWebhook, deletarWebhook,
  listarWebhookLogs, dispararWebhooks, type Webhook, type WebhookInput, type WebhookLog,
  EVENTOS_STATUS_CHANGE, EVENTOS_BUTTON_ACTION,
} from "~/lib/webhooks";
import { Loader2, Save, Plus, X, ToggleLeft, ToggleRight, Trash2, Settings, Database, Shield, Webhook as WebhookIcon, RefreshCw, History } from "lucide-react";
import toast from "react-hot-toast";

type Tab = "supabase" | "credenciais" | "webhooks";

export const adminConfigRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/admin/config",
  component: AdminConfigPage,
});

function AdminConfigPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("supabase");

  if (!profile?.is_super_admin) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-8 pt-20">
        <Shield size={40} className="text-text-muted" />
        <p className="text-sm text-text-muted">Acesso restrito a Super Administradores</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-28">
      <div className="flex items-center gap-2">
        <Settings size={20} className="text-accent" />
        <h1 className="text-lg font-bold text-text-main">Configurações</h1>
      </div>

      <div className="flex gap-1 rounded-xl bg-card p-1">
        {[
          { key: "supabase" as Tab, label: "Supabase", icon: Database },
          { key: "credenciais" as Tab, label: "Credenciais", icon: Shield },
          { key: "webhooks" as Tab, label: "Webhooks", icon: WebhookIcon },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center justify-center gap-1.5 flex-1 rounded-lg py-2 text-xs font-medium transition ${tab === key ? "bg-accent text-white" : "text-text-muted hover:text-text-main"}`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {tab === "supabase" && <SupabaseTab />}
      {tab === "credenciais" && <CredenciaisTab />}
      {tab === "webhooks" && <WebhooksTab />}
    </div>
  );
}

function SupabaseTab() {
  const [configs, setConfigs] = useState<AppConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setLoading(true);
    try {
      const data = await getAppConfig();
      setConfigs(data);
      const vals: Record<string, string> = {};
      data.forEach(c => { vals[c.key] = c.value; });
      setEditValues(vals);
    } catch { toast.error("Erro ao carregar config"); }
    finally { setLoading(false); }
  }

  async function salvar(key: string) {
    setSaving(key);
    try {
      await updateAppConfig(key, editValues[key]);
      toast.success(`${key} atualizado!`);
    } catch { toast.error("Erro ao salvar"); }
    finally { setSaving(null); }
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-accent" /></div>;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-text-muted">Gerencie as configurações de conexão com o Supabase. Estas configs substituem o arquivo .env.</p>
      {configs.map((cfg) => (
        <div key={cfg.id} className="rounded-xl bg-card p-4 shadow-lg">
          <label className="text-xs font-medium text-text-muted mb-1 block">{cfg.key}</label>
          {cfg.description && <p className="text-[10px] text-text-muted mb-2">{cfg.description}</p>}
          <div className="flex gap-2">
            {cfg.key.includes("PASSWORD") || cfg.key.includes("KEY") ? (
              <input value={editValues[cfg.key] || ""} onChange={(e) => setEditValues(prev => ({ ...prev, [cfg.key]: e.target.value }))}
                type="password" className="flex-1 rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px] font-mono" />
            ) : (
              <input value={editValues[cfg.key] || ""} onChange={(e) => setEditValues(prev => ({ ...prev, [cfg.key]: e.target.value }))}
                className="flex-1 rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px] font-mono" />
            )}
            <button onClick={() => salvar(cfg.key)} disabled={saving === cfg.key} className="flex items-center gap-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50 min-h-[44px]">
              {saving === cfg.key ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Salvar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CredenciaisTab() {
  const [credenciais, setCredenciais] = useState<MockCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<MockCredentialInput & { id?: string }>({ identifier: "", email: "", password: "", role: "viewer", ambiente: "", ativo: true });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setLoading(true);
    try { setCredenciais(await listMockCredentials()); } catch { toast.error("Erro ao carregar"); }
    finally { setLoading(false); }
  }

  function abrirNova() {
    setEditId(null);
    setForm({ identifier: "", email: "", password: "", role: "viewer", ambiente: "", ativo: true });
    setShowForm(true);
  }

  function abrirEditar(c: MockCredential) {
    setEditId(c.id);
    setForm({ id: c.id, identifier: c.identifier, email: c.email, password: c.password, role: c.role, ambiente: c.ambiente || "", ativo: c.ativo });
    setShowForm(true);
  }

  async function handleSubmit() {
    if (!form.identifier || !form.email || !form.password) return;
    setSubmitting(true);
    try {
      if (editId) {
        await updateMockCredential(editId, { identifier: form.identifier, email: form.email, password: form.password, role: form.role, ambiente: form.ambiente || undefined });
        toast.success("Credencial atualizada!");
      } else {
        await createMockCredential(form);
        toast.success("Credencial criada!");
      }
      setShowForm(false);
      carregar();
    } catch { toast.error("Erro ao salvar"); }
    finally { setSubmitting(false); }
  }

  async function handleToggle(c: MockCredential) {
    try {
      await toggleMockCredential(c.id, !c.ativo);
      carregar();
    } catch { toast.error("Erro ao alternar"); }
  }

  async function handleDelete(id: string) {
    try {
      await deleteMockCredential(id);
      toast.success("Credencial removida");
      carregar();
    } catch { toast.error("Erro ao excluir"); }
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-accent" /></div>;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">Gerencie as credenciais mock de acesso ao sistema.</p>
        <button onClick={abrirNova} className="flex items-center gap-1 rounded-lg bg-accent px-3 py-2 text-xs font-medium text-white"><Plus size={14} /> Nova</button>
      </div>
      {credenciais.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-muted">Nenhuma credencial cadastrada</p>
      ) : (
        credenciais.map((c) => (
          <div key={c.id} className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-lg">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-main">{c.identifier}</p>
              <p className="text-[11px] text-text-muted">{c.email}</p>
              <div className="flex gap-1 mt-1">
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-medium text-accent">{c.role}</span>
                {c.ambiente && <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[9px] font-medium text-blue-400">{c.ambiente}</span>}
              </div>
            </div>
            <button onClick={() => abrirEditar(c)} className="rounded-lg p-2 text-text-muted hover:text-text-main"><Settings size={16} /></button>
            <button onClick={() => handleToggle(c)} className={c.ativo ? "text-green-400" : "text-text-muted"}>{c.ativo ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}</button>
            <button onClick={() => handleDelete(c.id)} className="text-text-muted hover:text-red-400"><Trash2 size={16} /></button>
          </div>
        ))
      )}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-text-main">{editId ? "Editar Credencial" : "Nova Credencial"}</h2>
              <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-text-main"><X size={20} /></button>
            </div>
            <input value={form.identifier} onChange={(e) => setForm(prev => ({ ...prev, identifier: e.target.value }))} placeholder="Identificador (ex: SUPER_ADMIN)" className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
            <input value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} placeholder="Email" type="email" className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
            <input value={form.password} onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))} placeholder="Senha" type="text" className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
            <select value={form.role} onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value as any }))} className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]">
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <select value={form.ambiente || ""} onChange={(e) => setForm(prev => ({ ...prev, ambiente: e.target.value }))} className="mb-4 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]">
              <option value="">Sem ambiente</option>
              <option value="cadastro">Cadastro</option>
              <option value="consultor">Consultor</option>
              <option value="tecnologia">Tecnologia</option>
              <option value="ambos">Ambos</option>
            </select>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 rounded-xl border border-input-border py-3 text-sm font-medium text-text-muted">Cancelar</button>
              <button onClick={handleSubmit} disabled={!form.identifier || !form.email || !form.password || submitting} className="flex-1 rounded-xl bg-accent py-3 text-sm font-medium text-white disabled:opacity-50">{submitting ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Salvar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WebhooksTab() {
  const [subtab, setSubtab] = useState<"status" | "botoes" | "custom" | "logs">("status");
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<WebhookInput & { id?: string }>({ nome: "", evento: "", url: "", metodo: "POST", headers: {}, body_template: {}, ativo: true });
  const [headerInput, setHeaderInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { carregar(); carregarLogs(); }, []);

  async function carregar() {
    setLoading(true);
    try { setWebhooks(await listarWebhooks()); } catch { toast.error("Erro ao carregar webhooks"); }
    finally { setLoading(false); }
  }

  async function carregarLogs() {
    try { setLogs(await listarWebhookLogs()); } catch { }
  }

  function abrirNova(eventoPadrao?: string) {
    setEditId(null);
    const isStatus = subtab === "status";
    setForm({
      nome: "",
      evento: eventoPadrao || "",
      tipo_evento: isStatus ? "status_change" : "button_action",
      url: "",
      metodo: "POST",
      headers: {},
      body_template: {},
      ativo: true,
    });
    setHeaderInput("");
    setShowForm(true);
  }

  function abrirEditar(w: Webhook) {
    setEditId(w.id);
    setForm({ id: w.id, nome: w.nome, evento: w.evento, tipo_evento: w.tipo_evento, url: w.url, metodo: w.metodo, headers: w.headers || {}, body_template: w.body_template || {}, ativo: w.ativo });
    setHeaderInput(Object.entries(w.headers || {}).map(([k, v]) => `${k}: ${v}`).join("\n"));
    setShowForm(true);
  }

  async function handleSubmit() {
    if (!form.nome || !form.evento || !form.url) return;
    setSubmitting(true);
    try {
      const headers: Record<string, string> = {};
      headerInput.split("\n").filter(Boolean).forEach((line) => {
        const idx = line.indexOf(":");
        if (idx > 0) headers[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
      });
      const payload = { ...form, headers };
      if (editId) {
        await atualizarWebhook(editId, payload);
        toast.success("Webhook atualizado!");
      } else {
        await criarWebhook(payload);
        toast.success("Webhook criado!");
      }
      setShowForm(false);
      carregar();
    } catch { toast.error("Erro ao salvar"); }
    finally { setSubmitting(false); }
  }

  async function handleToggle(w: Webhook) {
    try { await toggleWebhook(w.id, !w.ativo); carregar(); } catch { toast.error("Erro"); }
  }

  async function handleDelete(id: string) {
    try { await deletarWebhook(id); toast.success("Webhook removido"); carregar(); } catch { toast.error("Erro ao excluir"); }
  }

  const webhooksPorEvento = (evento: string) => webhooks.filter(w => w.evento === evento && w.tipo_evento === (subtab === "status" ? "status_change" : "button_action"));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 rounded-xl bg-card p-1">
        {[
          { key: "status" as const, label: "Status", icon: RefreshCw },
          { key: "botoes" as const, label: "Botões", icon: Settings },
          { key: "custom" as const, label: "Custom", icon: Plus },
          { key: "logs" as const, label: "Logs", icon: History },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setSubtab(key)}
            className={`flex items-center justify-center gap-1 flex-1 rounded-lg py-2 text-xs font-medium transition ${subtab === key ? "bg-accent text-white" : "text-text-muted hover:text-text-main"}`}>
            <Icon size={12} /> {label}
          </button>
        ))}
      </div>

      {subtab === "status" && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-text-muted">Webhooks disparados quando o status de um cadastro muda.</p>
          {EVENTOS_STATUS_CHANGE.map((ev) => {
            const w = webhooksPorEvento(ev.value);
            return (
              <div key={ev.value} className="rounded-xl bg-card p-4 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-main">{ev.label}</span>
                  <button onClick={() => abrirNova(ev.value)} className="flex items-center gap-1 rounded-lg bg-accent/20 px-2.5 py-1 text-[10px] font-medium text-accent"><Plus size={12} /> Webhook</button>
                </div>
                {w.length === 0 ? (
                  <p className="text-[11px] text-text-muted">Nenhum webhook configurado para {ev.label}</p>
                ) : (
                  w.map((wh) => (
                    <div key={wh.id} className="flex items-center gap-2 mb-1 last:mb-0">
                      <span className={`h-2 w-2 rounded-full ${wh.ativo ? "bg-green-400" : "bg-text-muted"}`} />
                      <span className="flex-1 text-[11px] text-text-main truncate">{wh.nome}</span>
                      <span className="text-[9px] text-text-muted truncate max-w-[120px]">{wh.url}</span>
                      <button onClick={() => abrirEditar(wh)} className="text-text-muted hover:text-text-main p-0.5"><Settings size={12} /></button>
                      <button onClick={() => handleToggle(wh)} className={wh.ativo ? "text-green-400" : "text-text-muted"}>{wh.ativo ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}</button>
                      <button onClick={() => handleDelete(wh.id)} className="text-text-muted hover:text-red-400 p-0.5"><Trash2 size={12} /></button>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}

      {subtab === "botoes" && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-text-muted">Webhooks disparados quando um botão é clicado na aplicação.</p>
          {EVENTOS_BUTTON_ACTION.map((ev) => {
            const w = webhooksPorEvento(ev.value);
            return (
              <div key={ev.value} className="rounded-xl bg-card p-4 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-main">{ev.label}</span>
                  <button onClick={() => abrirNova(ev.value)} className="flex items-center gap-1 rounded-lg bg-accent/20 px-2.5 py-1 text-[10px] font-medium text-accent"><Plus size={12} /> Webhook</button>
                </div>
                {w.length === 0 ? (
                  <p className="text-[11px] text-text-muted">Nenhum webhook configurado para {ev.label}</p>
                ) : (
                  w.map((wh) => (
                    <div key={wh.id} className="flex items-center gap-2 mb-1 last:mb-0">
                      <span className={`h-2 w-2 rounded-full ${wh.ativo ? "bg-green-400" : "bg-text-muted"}`} />
                      <span className="flex-1 text-[11px] text-text-main truncate">{wh.nome}</span>
                      <span className="text-[9px] text-text-muted truncate max-w-[120px]">{wh.url}</span>
                      <button onClick={() => abrirEditar(wh)} className="text-text-muted hover:text-text-main p-0.5"><Settings size={12} /></button>
                      <button onClick={() => handleToggle(wh)} className={wh.ativo ? "text-green-400" : "text-text-muted"}>{wh.ativo ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}</button>
                      <button onClick={() => handleDelete(wh.id)} className="text-text-muted hover:text-red-400 p-0.5"><Trash2 size={12} /></button>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}

      {subtab === "custom" && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-text-muted">Webhooks customizados com evento livre.</p>
            <button onClick={() => abrirNova()} className="flex items-center gap-1 rounded-lg bg-accent px-3 py-2 text-xs font-medium text-white"><Plus size={14} /> Novo</button>
          </div>
          {webhooks.filter(w => w.tipo_evento !== "status_change" && w.tipo_evento !== "button_action").length === 0 && webhooks.filter(w => !EVENTOS_STATUS_CHANGE.find(e => e.value === w.evento) && !EVENTOS_BUTTON_ACTION.find(e => e.value === w.evento)).length === 0 ? (
            <p className="py-8 text-center text-sm text-text-muted">Nenhum webhook customizado</p>
          ) : (
            webhooks.filter(w => !EVENTOS_STATUS_CHANGE.find(e => e.value === w.evento) && !EVENTOS_BUTTON_ACTION.find(e => e.value === w.evento)).map((wh) => (
              <div key={wh.id} className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-main">{wh.nome}</p>
                  <p className="text-[11px] text-text-muted">{wh.evento} → {wh.url}</p>
                  <span className="text-[9px] text-accent font-mono">{wh.metodo}</span>
                </div>
                <button onClick={() => abrirEditar(wh)} className="text-text-muted hover:text-text-main p-1"><Settings size={16} /></button>
                <button onClick={() => handleToggle(wh)} className={wh.ativo ? "text-green-400" : "text-text-muted"}>{wh.ativo ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}</button>
                <button onClick={() => handleDelete(wh.id)} className="text-text-muted hover:text-red-400 p-1"><Trash2 size={16} /></button>
              </div>
            ))
          )}
        </div>
      )}

      {subtab === "logs" && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-text-muted">Histórico de execução dos webhooks.</p>
            <button onClick={carregarLogs} className="flex items-center gap-1 rounded-lg bg-card px-3 py-2 text-xs text-text-muted"><RefreshCw size={12} /> Atualizar</button>
          </div>
          {logs.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-muted">Nenhuma execução registrada</p>
          ) : (
            logs.slice(0, 50).map((log) => (
              <div key={log.id} className="rounded-xl bg-card p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${log.sucesso ? "bg-green-400" : "bg-red-400"}`} />
                  <span className="text-xs font-medium text-text-main">{log.evento}</span>
                  <span className={`text-[10px] font-mono ${log.status_code && log.status_code < 300 ? "text-green-400" : "text-red-400"}`}>{log.status_code || "ERR"}</span>
                  <span className="text-[10px] text-text-muted truncate flex-1">{log.url}</span>
                </div>
                <p className="text-[10px] text-text-muted mt-1">{new Date(log.created_at).toLocaleString("pt-BR")}</p>
                {log.resposta && <p className="text-[9px] text-text-muted mt-1 truncate">{log.resposta}</p>}
              </div>
            ))
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-text-main">{editId ? "Editar Webhook" : "Novo Webhook"}</h2>
              <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-text-main"><X size={20} /></button>
            </div>
            <input value={form.nome} onChange={(e) => setForm(prev => ({ ...prev, nome: e.target.value }))} placeholder="Nome do webhook" className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
            <input value={form.evento} onChange={(e) => setForm(prev => ({ ...prev, evento: e.target.value }))} placeholder="Evento (ex: aprovado, botao_compartilhar_link)" className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
            <input value={form.url} onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))} placeholder="URL do webhook" type="url" className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
            <select value={form.metodo} onChange={(e) => setForm(prev => ({ ...prev, metodo: e.target.value }))} className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]">
              {["POST", "PUT", "PATCH", "GET"].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <p className="mb-1 text-xs font-medium text-text-muted">Headers (formato: Chave: Valor, um por linha)</p>
            <textarea value={headerInput} onChange={(e) => setHeaderInput(e.target.value)} placeholder="Authorization: Bearer xxx&#10;X-Custom-Header: valor" rows={3} className="mb-4 w-full resize-none rounded-lg border border-input-border bg-input-bg px-4 py-3 text-xs text-text-main outline-none focus:border-accent font-mono" />
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 rounded-xl border border-input-border py-3 text-sm font-medium text-text-muted">Cancelar</button>
              <button onClick={handleSubmit} disabled={!form.nome || !form.evento || !form.url || submitting} className="flex-1 rounded-xl bg-accent py-3 text-sm font-medium text-white disabled:opacity-50">{submitting ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Salvar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
