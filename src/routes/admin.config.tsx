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
import { Loader2, Save, Plus, X, ToggleLeft, ToggleRight, Trash2, Settings, Database, Shield, Webhook as WebhookIcon, RefreshCw, History, UserRound as UserIcon, ShieldCheck, ShieldX, FlaskConical, Link2, Bell, FormInput } from "lucide-react";
import { listarTemplates, atualizarTemplate, type NotificacaoTemplate } from "~/lib/notificacoes";
import toast from "react-hot-toast";

import { listarPermissoesUsuarios, setPermissoes, getPermissoesPadrao, PERMISSOES_GROUPS, PERMISSOES_LABEL, PERMISSOES_DESC, type Permissoes } from "~/lib/permissoes";
import { listarLinksTestes, criarLinkTeste, excluirLinkTeste, listarDemoCredentials, criarDemoCredential, excluirDemoCredential, type LinkTeste, type DemoCredential } from "~/lib/demos";
import { DemosTab } from "~/components/admin/DemosTab";
import { ApiTesterTab } from "~/components/admin/ApiTesterTab";
import { FormBuilderTab } from "~/components/admin/FormBuilderTab";
import { listarIntegracoes, salvarIntegracao, testarConexaoEvolution, type IntegracaoConfig } from "~/lib/integracoes";

type Tab = "supabase" | "credenciais" | "api_connectors" | "webhooks" | "permissoes" | "demos" | "notificacoes" | "integracoes" | "formulario";

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

      <div className="flex justify-center gap-1 rounded-xl bg-card p-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {[
          { key: "supabase" as Tab, label: "Supabase", icon: Database },
          { key: "credenciais" as Tab, label: "Credenciais", icon: Shield },
          { key: "api_connectors" as Tab, label: "Teste de APIs", icon: Link2 },
          { key: "webhooks" as Tab, label: "Webhooks Gatilhos", icon: WebhookIcon },
          { key: "permissoes" as Tab, label: "Permissões", icon: UserIcon },
          { key: "demos" as Tab, label: "Laboratório", icon: FlaskConical },
          { key: "notificacoes" as Tab, label: "Notificações", icon: Bell },
          { key: "integracoes" as Tab, label: "Integrações Nativas", icon: RefreshCw },
          { key: "formulario" as Tab, label: "Formulário do Lead", icon: FormInput },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)} title={label}
            className={`flex items-center justify-center p-2.5 rounded-lg transition ${tab === key ? "bg-accent text-white" : "text-text-muted hover:text-text-main hover:bg-bg-dark"}`}>
            <Icon size={20} />
          </button>
        ))}
      </div>

      {tab === "supabase" && <SupabaseTab />}
      {tab === "credenciais" && <CredenciaisTab />}
      {tab === "api_connectors" && <ApiTesterTab />}
      {tab === "webhooks" && <WebhooksTab />}
      {tab === "permissoes" && <PermissoesTab />}
      {tab === "demos" && <DemosTab />}
      {tab === "notificacoes" && <NotificacoesTab />}
      {tab === "integracoes" && <IntegracoesTab />}
      {tab === "formulario" && <FormBuilderTab />}
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
  const [bodyInput, setBodyInput] = useState("");
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
    setBodyInput(Object.keys(w.body_template || {}).length > 0 ? JSON.stringify(w.body_template, null, 2) : "{\n  \n}");
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
      let body_template = {};
      try {
        if (bodyInput.trim()) body_template = JSON.parse(bodyInput);
      } catch (e) {
        toast.error("JSON do Body Template inválido");
        setSubmitting(false);
        return;
      }
      const payload = { ...form, headers, body_template };
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
            
            <p className="mb-1 text-xs font-medium text-text-muted mt-2">Headers (formato: Chave: Valor, um por linha)</p>
            <textarea value={headerInput} onChange={(e) => setHeaderInput(e.target.value)} placeholder="Authorization: Bearer xxx&#10;X-Custom-Header: valor" rows={3} className="mb-3 w-full resize-none rounded-lg border border-input-border bg-input-bg px-4 py-3 text-xs text-text-main outline-none focus:border-accent font-mono" />
            
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs font-medium text-text-muted">Body Template (Formato JSON)</p>
              <span className="text-[10px] text-accent">Variáveis injetáveis automaticamente via código</span>
            </div>
            <textarea value={bodyInput} onChange={(e) => setBodyInput(e.target.value)} placeholder={'{\n  "meu_campo": "valor"\n}'} rows={6} className="mb-6 w-full resize-none rounded-lg border border-input-border bg-[#1e1e1e] text-green-400 px-4 py-3 text-xs outline-none focus:border-accent font-mono" />

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

function PermissoesTab() {
  const [usuarios, setUsuarios] = useState<{ usuario_id: string; permissoes: Permissoes; profiles: { id: string; email: string; nome: string; ambiente: string; is_super_admin: boolean } }[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<typeof usuarios[number] | null>(null);
  const [editPerms, setEditPerms] = useState<Permissoes | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setLoading(true);
    try { setUsuarios(await listarPermissoesUsuarios()); } catch { toast.error("Erro ao carregar"); }
    finally { setLoading(false); }
  }

  function abrir(u: typeof usuarios[number]) {
    setEditUser(u);
    setEditPerms({ ...u.permissoes });
  }

  function toggle(key: keyof Permissoes) {
    if (!editPerms) return;
    setEditPerms(prev => prev ? { ...prev, [key]: !prev[key] } : prev);
  }

  async function salvar() {
    if (!editUser || !editPerms) return;
    setSaving(true);
    try {
      await setPermissoes(editUser.usuario_id, editPerms);
      toast.success("Permissões atualizadas!");
      setEditUser(null);
      setEditPerms(null);
      carregar();
    } catch { toast.error("Erro ao salvar"); }
    finally { setSaving(false); }
  }

  function restaurarPadrao() {
    if (!editUser) return;
    setEditPerms(getPermissoesPadrao(editUser.profiles.ambiente as any));
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-accent" /></div>;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-text-muted">Gerencie as permissões individuais de cada usuário.</p>
      {usuarios.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-muted">Nenhum usuário encontrado</p>
      ) : (
        usuarios.map((u) => {
          const isSuper = u.profiles.is_super_admin;
          const total = Object.values(u.permissoes).filter(Boolean).length;
          return (
            <button key={u.usuario_id} onClick={() => abrir(u)}
              className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-lg transition active:scale-[0.98] w-full text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                {isSuper ? <ShieldCheck size={18} className="text-accent" /> : <UserIcon size={18} className="text-text-muted" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-main truncate">{u.profiles.nome || "Sem nome"}</p>
                <p className="text-[11px] text-text-muted truncate">{u.profiles.email}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-medium text-accent">{u.profiles.ambiente}</span>
                  {isSuper && <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-[9px] font-medium text-yellow-400">Super Admin</span>}
                  <span className="text-[9px] text-text-muted">{total}/17 permissões</span>
                </div>
              </div>
              <Settings size={16} className="text-text-muted shrink-0" />
            </button>
          );
        })
      )}

      {editUser && editPerms && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-8">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl mt-8 mb-8">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-text-main truncate">{editUser.profiles.nome}</h2>
              <button onClick={() => { setEditUser(null); setEditPerms(null); }} className="text-text-muted hover:text-text-main shrink-0 ml-2"><X size={20} /></button>
            </div>
            <p className="text-xs text-text-muted mb-1">{editUser.profiles.email}</p>
            <div className="flex items-center gap-1 mb-4">
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-medium text-accent">{editUser.profiles.ambiente}</span>
              {editUser.profiles.is_super_admin && <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-[9px] font-medium text-yellow-400">Super Admin</span>}
              <button onClick={restaurarPadrao} className="ml-auto text-[10px] text-accent underline">Restaurar padrões</button>
            </div>
            <div className="flex flex-col gap-3 max-h-[55vh] overflow-y-auto pr-1">
              {PERMISSOES_GROUPS.map((group) => (
                <div key={group.label} className="rounded-xl bg-input-bg p-3">
                  <p className="text-xs font-bold text-text-main mb-2">{group.label}</p>
                  <div className="flex flex-col gap-2">
                    {group.keys.map((key) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer group">
                        <button onClick={() => toggle(key)}
                          className={`shrink-0 rounded-lg p-1.5 transition ${editPerms[key] ? 'bg-accent text-white' : 'bg-bg-dark text-text-muted group-hover:text-text-main'}`}
                        >
                          {editPerms[key] ? <ShieldCheck size={16} /> : <ShieldX size={16} />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium ${editPerms[key] ? 'text-text-main' : 'text-text-muted'}`}>{PERMISSOES_LABEL[key]}</p>
                          <p className="text-[9px] text-text-muted">{PERMISSOES_DESC[key]}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => { setEditUser(null); setEditPerms(null); }} className="flex-1 rounded-xl border border-input-border py-3 text-sm font-medium text-text-muted">Cancelar</button>
              <button onClick={salvar} disabled={saving} className="flex items-center justify-center gap-1 flex-1 rounded-xl bg-accent py-3 text-sm font-medium text-white disabled:opacity-50">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NotificacoesTab() {
  const [templates, setTemplates] = useState<NotificacaoTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTemplate, setEditTemplate] = useState<NotificacaoTemplate | null>(null);
  const [form, setForm] = useState({ titulo: "", corpo: "", ativo: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setLoading(true);
    try {
      const data = await listarTemplates();
      setTemplates(data);
    } catch {
      toast.error("Erro ao carregar templates de notificações");
    } finally {
      setLoading(false);
    }
  }

  function iniciarEdicao(t: NotificacaoTemplate) {
    setEditTemplate(t);
    setForm({ titulo: t.titulo, corpo: t.corpo_template, ativo: t.ativo });
  }

  async function handleSalvar() {
    if (!editTemplate) return;
    setSaving(true);
    try {
      await atualizarTemplate(editTemplate.evento, form.titulo, form.corpo, form.ativo);
      toast.success("Template atualizado com sucesso!");
      setEditTemplate(null);
      carregar();
    } catch {
      toast.error("Erro ao salvar template");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-accent" /></div>;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-text-muted">Personalize e gerencie os templates de notificações enviados aos usuários em cada evento do sistema.</p>
      
      <div className="flex flex-col gap-3">
        {templates.map(t => (
          <div key={t.id} className="rounded-xl bg-card p-4 shadow-lg flex flex-col gap-2 border border-border-subtle/30">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-text-main">{t.titulo}</span>
                <span className="text-[10px] text-accent font-mono uppercase tracking-wider mt-0.5">{t.evento}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${t.ativo ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                  {t.ativo ? "Ativo" : "Inativo"}
                </span>
                <button onClick={() => iniciarEdicao(t)} className="text-xs text-accent font-medium hover:underline">
                  Editar
                </button>
              </div>
            </div>
            <p className="text-xs text-text-muted italic bg-bg-dark/50 p-2.5 rounded-lg border border-border-subtle/20 mt-1 whitespace-pre-wrap">{t.corpo_template}</p>
          </div>
        ))}
      </div>

      {editTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl border border-border-subtle" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <h2 className="text-base font-bold text-text-main">Editar Template</h2>
                <span className="text-[10px] text-accent font-mono uppercase mt-0.5">{editTemplate.evento}</span>
              </div>
              <button onClick={() => setEditTemplate(null)} className="text-text-muted hover:text-text-main"><X size={20} /></button>
            </div>
            
            <div className="flex flex-col gap-3.5 mb-5">
              <div>
                <label className="text-xs font-semibold text-text-muted mb-1 block">Título</label>
                <input value={form.titulo} onChange={e => setForm(prev => ({ ...prev, titulo: e.target.value }))} className="w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted mb-1 block">Corpo do Template (Placeholders: {"{{lead_nome}}"}, {"{{motivo}}"}, {"{{codigo_cliente}}"}, {"{{nome}}"}, {"{{email}}"}, {"{{departamento}}"})</label>
                <textarea value={form.corpo} onChange={e => setForm(prev => ({ ...prev, corpo: e.target.value }))} rows={4} className="w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent resize-none min-h-[100px]" />
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-bg-dark/50 border border-border-subtle/20">
                <span className="text-xs font-semibold text-text-muted">Template Ativo</span>
                <button onClick={() => setForm(prev => ({ ...prev, ativo: !prev.ativo }))} className={form.ativo ? "text-green-400" : "text-text-muted"}>
                  {form.ativo ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setEditTemplate(null)} className="flex-1 rounded-xl border border-input-border py-3 text-sm font-semibold text-text-muted">Cancelar</button>
              <button onClick={handleSalvar} disabled={saving || !form.titulo || !form.corpo} className="flex-1 rounded-xl bg-accent py-3 text-sm font-semibold text-white flex items-center justify-center gap-1.5">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IntegracoesTab() {
  const [integracoes, setIntegracoes] = useState<IntegracaoConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState<string | null>(null);
  const [testando, setTestando] = useState<string | null>(null);
  const [configsLocais, setConfigsLocais] = useState<Record<string, any>>({});

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setLoading(true);
    try {
      const data = await listarIntegracoes();
      setIntegracoes(data);
      const initialConfigs: Record<string, any> = {};
      data.forEach(item => {
        initialConfigs[item.chave] = item.config || {};
      });
      setConfigsLocais(initialConfigs);
    } catch {
      toast.error("Erro ao carregar configurações de integrações");
    } finally {
      setLoading(false);
    }
  }

  async function handleSalvar(item: IntegracaoConfig) {
    setSalvando(item.chave);
    try {
      await salvarIntegracao(item.chave, item.ativo, configsLocais[item.chave]);
      toast.success(`${item.nome} atualizada com sucesso!`);
      carregar();
    } catch {
      toast.error("Erro ao salvar integração");
    } finally {
      setSalvando(null);
    }
  }

  async function handleToggleAtivo(item: IntegracaoConfig) {
    try {
      const novoStatus = !item.ativo;
      await salvarIntegracao(item.chave, novoStatus, configsLocais[item.chave]);
      toast.success(`${item.nome} ${novoStatus ? "ativada" : "desativada"}`);
      carregar();
    } catch {
      toast.error("Erro ao alterar status");
    }
  }

  async function handleTestarConexao(item: IntegracaoConfig) {
    if (item.chave !== "evolution_api") return;
    setTestando(item.chave);
    const cfg = configsLocais[item.chave] || {};
    try {
      const result = await testarConexaoEvolution(cfg.base_url, cfg.api_key, cfg.instancia);
      if (result.conectado) {
        toast.success(result.mensagem, { duration: 5000 });
      } else {
        toast.error(result.mensagem, { duration: 5000 });
      }
    } catch (e: any) {
      toast.error("Falha ao testar conexão: " + e.message);
    } finally {
      setTestando(null);
    }
  }

  const handleFieldChange = (chave: string, campo: string, valor: any) => {
    setConfigsLocais(prev => ({
      ...prev,
      [chave]: {
        ...prev[chave],
        [campo]: valor
      }
    }));
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-accent" /></div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl bg-card p-5 shadow-lg border border-input-border/20">
        <h2 className="text-sm font-bold text-text-main flex items-center gap-2 mb-2">
          <Settings size={16} className="text-accent" /> Painel de Integrações Nativas
        </h2>
        <p className="text-xs text-text-muted mb-6">
          Ative e configure conexões diretas com plataformas externas. Apenas Super Administradores podem visualizar ou modificar essas credenciais de segurança.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {integracoes.map(item => {
            const configLocal = configsLocais[item.chave] || {};
            const isSaving = salvando === item.chave;
            const isTesting = testando === item.chave;

            return (
              <div key={item.id} className="flex flex-col rounded-xl border border-input-border bg-bg-dark p-5 transition-all hover:border-input-border/60">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xs font-bold text-text-main flex items-center gap-1.5">
                      {item.nome}
                    </h3>
                    <span className="text-[10px] text-text-muted font-mono">{item.chave}</span>
                  </div>

                  <button 
                    onClick={() => handleToggleAtivo(item)}
                    className="focus:outline-none transition-transform active:scale-95"
                    title={item.ativo ? "Desativar Integração" : "Ativar Integração"}
                  >
                    {item.ativo ? (
                      <ToggleRight size={38} className="text-green-500 hover:text-green-400" />
                    ) : (
                      <ToggleLeft size={38} className="text-text-muted hover:text-text-muted/80" />
                    )}
                  </button>
                </div>

                {/* Formulário de Configuração Dinâmica */}
                <div className="flex-1 flex flex-col gap-3 pt-2 border-t border-input-border/30">
                  {item.chave === "evolution_api" && (
                    <>
                      <div>
                        <label className="text-[10px] text-text-muted ml-1 mb-1 block">URL Base da API</label>
                        <input 
                          value={configLocal.base_url || ""} 
                          onChange={e => handleFieldChange(item.chave, "base_url", e.target.value)} 
                          placeholder="https://sua-api.evolution.com.br" 
                          className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-text-muted ml-1 mb-1 block">API Key</label>
                          <input 
                            type="password"
                            value={configLocal.api_key || ""} 
                            onChange={e => handleFieldChange(item.chave, "api_key", e.target.value)} 
                            placeholder="Chave de Autenticação" 
                            className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-text-muted ml-1 mb-1 block">Nome da Instância</label>
                          <input 
                            value={configLocal.instancia || ""} 
                            onChange={e => handleFieldChange(item.chave, "instancia", e.target.value)} 
                            placeholder="Ex: conexao_zap" 
                            className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {item.chave === "cep_api" && (
                    <div>
                      <label className="text-[10px] text-text-muted ml-1 mb-1 block">Provedor Principal</label>
                      <select 
                        value={configLocal.provider || "brasilapi"} 
                        onChange={e => handleFieldChange(item.chave, "provider", e.target.value)} 
                        className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                      >
                        <option value="brasilapi" className="text-black bg-white">BrasilAPI (Recomendado - CDN Rápido)</option>
                        <option value="viacep" className="text-black bg-white">ViaCEP (Tradicional)</option>
                      </select>
                      <p className="text-[9px] text-text-muted mt-2">
                        💡 A plataforma tentará o provedor selecionado primeiro. Se houver falha de conexão, fará fallback automático e transparente para o outro.
                      </p>
                    </div>
                  )}

                  {item.chave === "google_sheets" && (
                    <>
                      <div>
                        <label className="text-[10px] text-text-muted ml-1 mb-1 block">ID da Planilha (Spreadsheet ID)</label>
                        <input 
                          value={configLocal.spreadsheet_id || ""} 
                          onChange={e => handleFieldChange(item.chave, "spreadsheet_id", e.target.value)} 
                          placeholder="Ex: 1a2B3c4D..." 
                          className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-text-muted ml-1 mb-1 block">E-mail da Conta de Serviço</label>
                          <input 
                            value={configLocal.client_email || ""} 
                            onChange={e => handleFieldChange(item.chave, "client_email", e.target.value)} 
                            placeholder="sheets-sync@projeto.iam.gserviceaccount.com" 
                            className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-text-muted ml-1 mb-1 block">Private Key</label>
                          <input 
                            type="password"
                            value={configLocal.private_key || ""} 
                            onChange={e => handleFieldChange(item.chave, "private_key", e.target.value)} 
                            placeholder="-----BEGIN PRIVATE KEY-----" 
                            className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {item.chave === "google_drive" && (
                    <>
                      <div>
                        <label className="text-[10px] text-text-muted ml-1 mb-1 block">ID da Pasta Destino (Folder ID)</label>
                        <input 
                          value={configLocal.folder_id || ""} 
                          onChange={e => handleFieldChange(item.chave, "folder_id", e.target.value)} 
                          placeholder="Ex: 1xYz2A-bCd..." 
                          className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-text-muted ml-1 mb-1 block">E-mail da Conta de Serviço</label>
                          <input 
                            value={configLocal.client_email || ""} 
                            onChange={e => handleFieldChange(item.chave, "client_email", e.target.value)} 
                            placeholder="drive-upload@projeto.iam.gserviceaccount.com" 
                            className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-text-muted ml-1 mb-1 block">Private Key</label>
                          <input 
                            type="password"
                            value={configLocal.private_key || ""} 
                            onChange={e => handleFieldChange(item.chave, "private_key", e.target.value)} 
                            placeholder="-----BEGIN PRIVATE KEY-----" 
                            className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {item.chave === "google_maps" && (
                    <div>
                      <label className="text-[10px] text-text-muted ml-1 mb-1 block">Google Maps API Key</label>
                      <input 
                        type="password"
                        value={configLocal.api_key || ""} 
                        onChange={e => handleFieldChange(item.chave, "api_key", e.target.value)} 
                        placeholder="AIzaSyA1..." 
                        className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                      />
                    </div>
                  )}

                  {item.chave === "gmail_smtp" && (
                    <>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <label className="text-[10px] text-text-muted ml-1 mb-1 block">Host SMTP</label>
                          <input 
                            value={configLocal.host || ""} 
                            onChange={e => handleFieldChange(item.chave, "host", e.target.value)} 
                            placeholder="smtp.gmail.com" 
                            className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-text-muted ml-1 mb-1 block">Porta</label>
                          <input 
                            type="number"
                            value={configLocal.port || 587} 
                            onChange={e => handleFieldChange(item.chave, "port", Number(e.target.value))} 
                            className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-text-muted ml-1 mb-1 block">Usuário / E-mail</label>
                          <input 
                            value={configLocal.user || ""} 
                            onChange={e => handleFieldChange(item.chave, "user", e.target.value)} 
                            placeholder="exemplo@gmail.com" 
                            className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-text-muted ml-1 mb-1 block">Senha</label>
                          <input 
                            type="password"
                            value={configLocal.pass || ""} 
                            onChange={e => handleFieldChange(item.chave, "pass", e.target.value)} 
                            placeholder="Senha do e-mail" 
                            className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2 justify-end mt-5 pt-3 border-t border-input-border/30">
                  {item.chave === "evolution_api" && (
                    <button 
                      onClick={() => handleTestarConexao(item)} 
                      disabled={isTesting}
                      className="flex items-center justify-center gap-1 rounded-xl bg-bg-dark border border-input-border hover:bg-input-bg text-text-main px-3 py-1.5 text-[11px] font-semibold disabled:opacity-50 transition-colors"
                    >
                      {isTesting ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Testar Instância
                    </button>
                  )}
                  <button 
                    onClick={() => handleSalvar(item)} 
                    disabled={isSaving}
                    className="flex items-center justify-center gap-1 rounded-xl bg-accent hover:bg-accent/80 text-white px-4 py-1.5 text-[11px] font-semibold disabled:opacity-50 transition-all shadow-md"
                  >
                    {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Salvar Credenciais
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
