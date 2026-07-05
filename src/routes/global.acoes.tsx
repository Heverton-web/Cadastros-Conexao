import { createRoute, useNavigate } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useState, useEffect } from "react";
import { useAuth } from "~/lib/auth";
import { supabase } from "~/lib/supabase";
import {
  getAppConfig,
  updateAppConfig,
  type AppConfig,
} from "~/features/admin";
import {
  listarCredenciais,
  criarCredencial,
  atualizarCredencial,
  toggleCredencial,
  deletarCredencial,
  type Credencial,
  type CredencialInput,
} from "~/features/credenciais";
import { dispararWebhooks } from "~/lib/webhooks";
import {
  Loader2,
  Save,
  Plus,
  X,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Settings,
  Database,
  Shield,
  Webhook as WebhookIcon,
  RefreshCw,
  UserRound as UserIcon,
  ShieldCheck,
  ShieldX,
  FlaskConical,
  Bell,
  FormInput,
  Lightbulb,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  listarPermissoesUsuarios,
  setPermissoes,
  getPermissoes,
  getPermissoesPadrao,
  PERMISSOES_GROUPS,
  PERMISSOES_LABEL,
  PERMISSOES_DESC,
  type Permissoes,
} from "~/core/permissions";
import { listarDemoCredentials, type DemoCredential } from "~/features/demos";
import { DemosTab } from "~/components/admin/DemosTab";
import { CentralAcoesTab } from "~/components/admin/CentralAcoesTab";
import { FormBuilderTab } from "~/components/admin/FormBuilderTab";
import {
  listarIntegracoes,
  salvarIntegracao,
  testarConexaoEvolution,
  type IntegracaoConfig,
} from "~/features/integracoes";
import { PasswordInput } from "~/components/ui/password-input";

type Tab =
  | "supabase"
  | "credenciais"
  | "central_acoes"
  | "demos"
  | "integracoes"
  | "formulario";

export const adminConfigRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/global/acoes",
  component: AdminConfigPage,
});

function AdminConfigPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  if (!profile?.is_super_admin) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-8 pt-20">
        <Shield size={40} className="text-text-muted" />
        <p className="text-sm text-text-muted">
          Acesso restrito a Super Administradores
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-28">
      <div className="flex items-center gap-2">
        <WebhookIcon size={20} className="text-accent" />
        <h1 className="text-lg font-bold text-text-main">Central de Ações</h1>
      </div>

      <CentralAcoesTab />
    </div>
  );
}

function SupabaseTab() {
  const [configs, setConfigs] = useState<AppConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setLoading(true);
    try {
      const data = await getAppConfig();
      setConfigs(data);
      const vals: Record<string, string> = {};
      data.forEach((c) => {
        vals[c.key] = c.value;
      });
      setEditValues(vals);
    } catch {
      toast.error("Erro ao carregar config");
    } finally {
      setLoading(false);
    }
  }

  async function salvar(key: string) {
    setSaving(key);
    try {
      await updateAppConfig(key, editValues[key]);
      toast.success(`${key} atualizado!`);
    } catch {
      toast.error("Erro ao salvar");
    } finally {
      setSaving(null);
    }
  }

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-text-muted">
        Gerencie as configurações de conexão com o Supabase. Estas configs
        substituem o arquivo .env.
      </p>
      {configs.map((cfg) => (
        <div key={cfg.id} className="rounded-xl bg-card p-4 shadow-lg">
          <label className="text-xs font-medium text-text-muted mb-1 block">
            {cfg.key}
          </label>
          {cfg.description && (
            <p className="text-xs text-text-muted mb-2">{cfg.description}</p>
          )}
          <div className="flex gap-2">
            {cfg.key.includes("PASSWORD") || cfg.key.includes("KEY") ? (
              <PasswordInput
                value={editValues[cfg.key] || ""}
                onChange={(e) =>
                  setEditValues((prev) => ({
                    ...prev,
                    [cfg.key]: e.target.value,
                  }))
                }
                className="flex-1 rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px] font-mono"
              />
            ) : (
              <input
                value={editValues[cfg.key] || ""}
                onChange={(e) =>
                  setEditValues((prev) => ({
                    ...prev,
                    [cfg.key]: e.target.value,
                  }))
                }
                className="flex-1 rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px] font-mono"
              />
            )}
            <button
              onClick={() => salvar(cfg.key)}
              disabled={saving === cfg.key}
              className="flex items-center gap-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg disabled:opacity-50 min-h-[44px]"
            >
              {saving === cfg.key ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}{" "}
              Salvar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Tipo unificado: credencial real + profile vinculado + flag se é mock
type CredencialItem = {
  id: string;
  nome_completo: string;
  email_corporativo: string;
  whatsapp_corporativo?: string | null;
  departamento?: string | null;
  ativo: boolean;
  isMock: boolean;
  mockRole?: string; // role_escolhida da demo_credential
  userId?: string; // user_id da demo_credential (para permissões)
  profile?: any;
  rawCredencial?: Credencial; // referência original para edição
};

function CredenciaisTab() {
  const [credenciais, setCredenciais] = useState<CredencialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<
    Omit<CredencialInput, "id"> & {
      whatsapp_corporativo: string;
      departamento: string;
    }
  >({
    nome_completo: "",
    email_corporativo: "",
    whatsapp_corporativo: "",
    departamento: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Filtros de Setor/Role (inclui "mock")
  const [filtroSetor, setFiltroSetor] = useState<
    "todos" | "cadastro" | "consultor" | "ti" | "super_admin" | "mock"
  >("todos");

  // Estado para Gerenciamento de Permissões integrado
  const [permCredencial, setPermCredencial] = useState<CredencialItem | null>(
    null,
  );
  const [editPerms, setEditPerms] = useState<Permissoes | null>(null);
  const [loadingPerms, setLoadingPerms] = useState(false);
  const [savingPerms, setSavingPerms] = useState(false);

  // Ordenação e Seleção de Credencial específica
  const [ordenacao, setOrdenacao] = useState<"asc" | "desc">("asc");
  const [selectedCredId, setSelectedCredId] = useState<string>("todas");

  // Resetar credencial selecionada ao alterar o filtro de setor
  useEffect(() => {
    setSelectedCredId("todas");
  }, [filtroSetor]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setLoading(true);
    try {
      const [list, demos, { data: profs, error: profsErr }] = await Promise.all(
        [
          listarCredenciais(),
          listarDemoCredentials(),
          supabase.from("profiles").select("*"),
        ],
      );
      if (profsErr) throw profsErr;

      // Credenciais reais
      const mapped: CredencialItem[] = list.map((c: Credencial) => {
        const found = profs?.find(
          (p: any) =>
            p.email?.toLowerCase() === c.email_corporativo?.toLowerCase(),
        );
        return {
          id: c.id,
          nome_completo: c.nome_completo,
          email_corporativo: c.email_corporativo,
          whatsapp_corporativo: c.whatsapp_corporativo,
          departamento: c.departamento,
          ativo: c.ativo,
          isMock: false,
          profile: found,
          rawCredencial: c,
        };
      });

      // Credenciais Mock (demo_credentials)
      const mockMapped: CredencialItem[] = demos.map((d: DemoCredential) => {
        const found = profs?.find((p: any) => p.id === d.user_id);
        const roleLabel =
          d.role_escolhida === "consultor"
            ? "Consultor"
            : d.role_escolhida === "cadastro"
              ? "Cadastro"
              : d.role_escolhida === "ti"
                ? "TI"
                : d.role_escolhida;
        return {
          id: d.id,
          nome_completo: found?.nome || d.email_demo.split("@")[0],
          email_corporativo: d.email_demo,
          whatsapp_corporativo: null,
          departamento: roleLabel,
          ativo: true,
          isMock: true,
          mockRole: d.role_escolhida,
          userId: d.user_id,
          profile: found,
        };
      });

      setCredenciais([...mapped, ...mockMapped]);
    } catch {
      toast.error("Erro ao carregar credenciais");
    } finally {
      setLoading(false);
    }
  }

  function abrirNova() {
    setEditId(null);
    setForm({
      nome_completo: "",
      email_corporativo: "",
      whatsapp_corporativo: "",
      departamento: "",
    });
    setShowForm(true);
  }

  function abrirEditar(c: Credencial) {
    setEditId(c.id);
    setForm({
      nome_completo: c.nome_completo,
      email_corporativo: c.email_corporativo,
      whatsapp_corporativo: c.whatsapp_corporativo || "",
      departamento: c.departamento || "",
    });
    setShowForm(true);
  }

  async function handleSubmit() {
    if (!form.nome_completo || !form.email_corporativo) return;
    setSubmitting(true);
    try {
      if (editId) {
        await atualizarCredencial(editId, {
          nome_completo: form.nome_completo,
          email_corporativo: form.email_corporativo,
          whatsapp_corporativo: form.whatsapp_corporativo || undefined,
          departamento: form.departamento || undefined,
        });
        toast.success("Credencial atualizada!");
      } else {
        await criarCredencial(form);
        try {
          await dispararWebhooks(
            "criacao_credencial",
            {
              nome: form.nome_completo,
              email: form.email_corporativo,
              whatsapp: form.whatsapp_corporativo || "",
              departamento: form.departamento || "",
            },
            profile?.empresa_id,
          );
        } catch (err) {
          console.error("Erro ao disparar webhook de credencial:", err);
        }
        toast.success("Credencial criada!");
      }
      setShowForm(false);
      carregar();
    } catch {
      toast.error("Erro ao salvar");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(c: Credencial) {
    try {
      await toggleCredencial(c.id, !c.ativo);
      carregar();
    } catch {
      toast.error("Erro ao alternar status");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletarCredencial(id);
      toast.success("Credencial removida");
      carregar();
    } catch {
      toast.error("Erro ao excluir");
    }
  }

  // Permissões
  async function abrirPermissoes(c: CredencialItem) {
    setPermCredencial(c);
    if (c.profile) {
      setLoadingPerms(true);
      try {
        const perms = await getPermissoes(
          c.profile.id,
          c.profile.is_super_admin,
        );
        setEditPerms(perms || getPermissoesPadrao(c.profile.ambiente));
      } catch {
        toast.error("Erro ao carregar permissões");
      } finally {
        setLoadingPerms(false);
      }
    } else {
      setEditPerms(null);
    }
  }

  function togglePerm(key: keyof Permissoes) {
    if (!editPerms) return;
    setEditPerms((prev) => (prev ? { ...prev, [key]: !prev[key] } : prev));
  }

  async function salvarPermissoes() {
    if (!permCredencial?.profile || !editPerms) return;
    setSavingPerms(true);
    try {
      await setPermissoes(permCredencial.profile.id, editPerms);
      toast.success("Permissões atualizadas!");
      setPermCredencial(null);
      setEditPerms(null);
      carregar();
    } catch {
      toast.error("Erro ao salvar permissões");
    } finally {
      setSavingPerms(false);
    }
  }

  function restaurarPermissoesPadrao() {
    if (!permCredencial?.profile) return;
    setEditPerms(getPermissoesPadrao(permCredencial.profile.ambiente));
  }

  // Filtragem local por setor
  const deparados = credenciais.filter((c) => {
    if (filtroSetor === "todos") return true;
    if (filtroSetor === "mock") return c.isMock;
    // Nos demais filtros, só mostrar as credenciais reais
    if (c.isMock) return false;
    const ambiente = c.profile?.ambiente?.toLowerCase() || "";
    const isSuper = c.profile?.is_super_admin || false;
    const depto = c.departamento?.toLowerCase() || "";

    if (filtroSetor === "super_admin") return isSuper;
    if (filtroSetor === "consultor")
      return ambiente === "consultor" || depto === "vendas";
    if (filtroSetor === "cadastro")
      return (
        ambiente === "cadastro" ||
        depto === "administrativo" ||
        depto === "financeiro"
      );
    if (filtroSetor === "ti")
      return (
        ambiente === "tecnologia" || ambiente === "suporte" || depto === "ti"
      );
    return true;
  });

  // Ordenação alfabética por nome_completo
  deparados.sort((a, b) => {
    const nomeA = a.nome_completo.toLowerCase();
    const nomeB = b.nome_completo.toLowerCase();
    if (ordenacao === "asc") {
      return nomeA.localeCompare(nomeB);
    } else {
      return nomeB.localeCompare(nomeA);
    }
  });

  // Filtragem final para exibição (todas ou apenas a selecionada)
  const credenciaisFiltradas =
    selectedCredId === "todas"
      ? deparados
      : deparados.filter((c) => c.id === selectedCredId);

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">
          Gerencie as credenciais reais de acesso ao sistema.
        </p>
        <button
          onClick={abrirNova}
          className="flex items-center gap-1 rounded-lg bg-accent px-3 py-2 text-xs font-medium text-accent-fg"
        >
          <Plus size={14} /> Nova
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { key: "todos", label: "Todos", color: null },
          { key: "consultor", label: "Consultores", color: null },
          { key: "cadastro", label: "Cadastro", color: null },
          { key: "ti", label: "TI / Tecnologia", color: null },
          { key: "super_admin", label: "Super Admin", color: null },
          { key: "mock", label: "Mock / Demo", color: "purple" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFiltroSetor(item.key as any)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition whitespace-nowrap ${
              filtroSetor === item.key
                ? item.key === "mock"
                  ? "bg-purple-500/15 text-purple-400 border border-purple-500/35"
                  : "bg-accent/15 text-accent border border-accent/35"
                : item.key === "mock"
                  ? "bg-input-bg text-purple-400/60 hover:text-purple-400 border border-transparent"
                  : "bg-input-bg text-text-muted hover:text-text-main border border-transparent"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Controles de Ordenação e Seleção de Credencial */}
      <div className="flex flex-col sm:flex-row gap-2 mt-1 mb-2">
        <div className="flex-1">
          <select
            value={selectedCredId}
            onChange={(e) => setSelectedCredId(e.target.value)}
            className="w-full rounded-lg border border-input-border bg-input-bg px-3 py-2.5 text-xs text-text-main outline-none focus:border-accent min-h-[38px] transition cursor-pointer"
          >
            <option value="todas">Exibir todas as credenciais</option>
            {deparados.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome_completo} ({c.email_corporativo})
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-44">
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value as any)}
            className="w-full rounded-lg border border-input-border bg-input-bg px-3 py-2.5 text-xs text-text-main outline-none focus:border-accent min-h-[38px] transition cursor-pointer"
          >
            <option value="asc">Ordem: Nome de A a Z</option>
            <option value="desc">Ordem: Nome de Z a A</option>
          </select>
        </div>
      </div>

      {credenciaisFiltradas.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-muted">
          Nenhuma credencial encontrada neste setor
        </p>
      ) : (
        credenciaisFiltradas.map((c) => {
          const isRegistered = !!c.profile;
          const isSuper = c.profile?.is_super_admin || false;
          return (
            <div
              key={c.id}
              className={`flex items-center gap-3 rounded-xl p-4 shadow-lg ${
                c.isMock
                  ? "bg-purple-500/5 border border-purple-500/15"
                  : "bg-card"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text-main truncate">
                    {c.nome_completo}
                  </p>
                  {c.isMock && (
                    <span className="rounded-full bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-[8px] font-bold text-purple-400">
                      Mock
                    </span>
                  )}
                  {!c.isMock && !isRegistered && (
                    <span className="rounded-full bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 text-[8px] font-semibold text-yellow-400">
                      Pendente
                    </span>
                  )}
                  {isSuper && (
                    <span className="rounded-full bg-yellow-500/15 border border-yellow-500/35 px-2 py-0.5 text-[8px] font-bold text-yellow-400">
                      Super Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted truncate">
                  {c.email_corporativo}
                </p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {c.departamento && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        c.isMock
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {c.departamento}
                    </span>
                  )}
                  {!c.isMock &&
                    c.profile?.ambiente &&
                    c.profile.ambiente.toLowerCase() !==
                      c.departamento?.toLowerCase() && (
                      <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-400">
                        {c.profile.ambiente}
                      </span>
                    )}
                  {c.whatsapp_corporativo && (
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
                      {c.whatsapp_corporativo}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => abrirPermissoes(c)}
                title="Permissões"
                className="rounded-lg p-2 text-text-muted hover:text-accent transition-colors"
              >
                <Shield size={16} />
              </button>
              {!c.isMock && (
                <button
                  onClick={() => abrirEditar(c.rawCredencial!)}
                  className="rounded-lg p-2 text-text-muted hover:text-text-main"
                >
                  <Settings size={16} />
                </button>
              )}
              {!c.isMock && (
                <button
                  onClick={() => handleToggle(c.rawCredencial!)}
                  className={c.ativo ? "text-green-400" : "text-text-muted"}
                >
                  {c.ativo ? (
                    <ToggleRight size={24} />
                  ) : (
                    <ToggleLeft size={24} />
                  )}
                </button>
              )}
              {!c.isMock && (
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-text-muted hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          );
        })
      )}

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-card border border-border/50 p-0 shadow-2xl shadow-black/40 max-h-[90dvh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-br from-accent/20 via-accent/10 to-transparent px-6 pt-6 pb-4 border-b border-border/50 relative">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  {editId ? <Pencil size={22} /> : <Plus size={22} />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-main tracking-tight">
                    {editId ? "Editar Credencial" : "Nova Credencial"}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="absolute right-4 top-5 rounded-lg p-1.5 text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-6 flex-1 space-y-4">
            <input
              value={form.nome_completo}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, nome_completo: e.target.value }))
              }
              placeholder="Nome Completo"
              className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]"
            />
            <input
              value={form.email_corporativo}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  email_corporativo: e.target.value,
                }))
              }
              placeholder="Email Corporativo"
              type="email"
              className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]"
            />
            <input
              value={form.whatsapp_corporativo}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  whatsapp_corporativo: e.target.value,
                }))
              }
              placeholder="WhatsApp Corporativo (opcional)"
              className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]"
            />
            <select
              value={form.departamento}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, departamento: e.target.value }))
              }
              className="mb-4 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]"
            >
              <option value="">Selecione o Departamento</option>
              {["Vendas", "Administrativo", "Financeiro", "TI"].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end px-6 pb-6 pt-4 border-t border-border/50">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 sm:flex-none rounded-xl border border-border px-6 py-2.5 text-sm text-text-muted font-semibold hover:text-text-main hover:bg-surface-hover transition-all duration-200 min-h-[44px]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  !form.nome_completo || !form.email_corporativo || submitting
                }
                className="flex-1 sm:flex-none rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-accent-fg shadow-md shadow-accent/20 hover:bg-accent-hover disabled:opacity-50 transition-all duration-200 min-h-[44px]"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin mx-auto" />
                ) : (
                  "Salvar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Integrado de Permissões */}
      {permCredencial && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-card border border-border/50 p-0 shadow-2xl shadow-black/40 max-h-[90dvh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-br from-accent/20 via-accent/10 to-transparent px-6 pt-6 pb-4 border-b border-border/50 relative">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-main tracking-tight truncate">
                    {permCredencial.nome_completo}
                  </h2>
                  <p className="text-sm text-text-muted mt-0.5">
                    {permCredencial.email_corporativo}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPermCredencial(null);
                  setEditPerms(null);
                }}
                className="absolute right-4 top-5 rounded-lg p-1.5 text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-6 flex-1 space-y-4">
            {loadingPerms ? (
              <div className="flex justify-center py-12">
                <Loader2 size={24} className="animate-spin text-accent" />
              </div>
            ) : !permCredencial.profile ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ShieldX size={36} className="text-yellow-400 mb-2" />
                <p className="text-sm font-semibold text-text-main">
                  Usuário não registrado
                </p>
                <p className="text-xs text-text-muted mt-1 max-w-[280px]">
                  O e-mail <strong>{permCredencial.email_corporativo}</strong>{" "}
                  ainda não realizou o primeiro acesso no sistema. Não é
                  possível personalizar permissões até que a conta seja criada
                  no Supabase Auth.
                </p>
                <div className="mt-4 w-full rounded-xl bg-input-bg p-3 text-left">
                  <p className="text-xs font-bold text-text-main mb-1 flex items-center gap-1">
                    <Lightbulb size={10} className="text-yellow-400" /> Dica de
                    Departamento:
                  </p>
                  <p className="text-xs text-text-muted">
                    Ao registrar-se, o usuário receberá automaticamente as
                    permissões padrão para o ambiente/departamento:{" "}
                    <strong>
                      {permCredencial.departamento || "Sem departamento"}
                    </strong>
                    .
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1 mb-4">
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                    {permCredencial.profile.ambiente}
                  </span>
                  {permCredencial.profile.is_super_admin && (
                    <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-400">
                      Super Admin
                    </span>
                  )}
                  <button
                    onClick={restaurarPermissoesPadrao}
                    className="ml-auto text-xs text-accent underline"
                  >
                    Restaurar padrões
                  </button>
                </div>

                <div className="flex flex-col gap-3 max-h-[55vh] overflow-y-auto pr-1">
                  {PERMISSOES_GROUPS.map((group) => (
                    <div
                      key={group.label}
                      className="rounded-xl bg-input-bg p-3"
                    >
                      <p className="text-xs font-bold text-text-main mb-2">
                        {group.label}
                      </p>
                      <div className="flex flex-col gap-2">
                        {group.keys.map((key) => {
                          const isChecked = editPerms ? editPerms[key] : false;
                          return (
                            <label
                              key={key}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <button
                                onClick={() => togglePerm(key)}
                                className={`shrink-0 rounded-lg p-1.5 transition ${isChecked ? "bg-accent text-accent-fg" : "bg-bg-dark text-text-muted group-hover:text-text-main"}`}
                              >
                                {isChecked ? (
                                  <ShieldCheck size={16} />
                                ) : (
                                  <ShieldX size={16} />
                                )}
                              </button>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-xs font-medium ${isChecked ? "text-text-main" : "text-text-muted"}`}
                                >
                                  {PERMISSOES_LABEL[key]}
                                </p>
                                <p className="text-xs text-text-muted">
                                  {PERMISSOES_DESC[key]}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end px-6 pb-6 pt-4 border-t border-border/50">
              <button
                onClick={() => {
                  setPermCredencial(null);
                  setEditPerms(null);
                }}
                className="flex-1 sm:flex-none rounded-xl border border-border px-6 py-2.5 text-sm text-text-muted font-semibold hover:text-text-main hover:bg-surface-hover transition-all duration-200 min-h-[44px]"
              >
                Cancelar
              </button>
              <button
                onClick={salvarPermissoes}
                disabled={savingPerms}
                className="flex items-center justify-center gap-1 flex-1 sm:flex-none rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-accent-fg shadow-md shadow-accent/20 hover:bg-accent-hover disabled:opacity-50 transition-all duration-200 min-h-[44px]"
              >
                {savingPerms ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}{" "}
                Salvar
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

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setLoading(true);
    try {
      const data = await listarIntegracoes();
      setIntegracoes(data);
      const initialConfigs: Record<string, any> = {};
      data.forEach((item) => {
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
      const result = await testarConexaoEvolution(
        cfg.base_url,
        cfg.api_key,
        cfg.instancia,
      );
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
    setConfigsLocais((prev) => ({
      ...prev,
      [chave]: {
        ...prev[chave],
        [campo]: valor,
      },
    }));
  };

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl bg-card p-5 shadow-lg border border-input-border/20">
        <h2 className="text-sm font-bold text-text-main flex items-center gap-2 mb-2">
          <Settings size={16} className="text-accent" /> Painel de Integrações
          Nativas
        </h2>
        <p className="text-xs text-text-muted mb-6">
          Ative e configure conexões diretas com plataformas externas. Apenas
          Super Administradores podem visualizar ou modificar essas credenciais
          de segurança.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {integracoes.map((item) => {
            const configLocal = configsLocais[item.chave] || {};
            const isSaving = salvando === item.chave;
            const isTesting = testando === item.chave;

            return (
              <div
                key={item.id}
                className="flex flex-col rounded-xl border border-input-border bg-bg-dark p-5 transition-all hover:border-input-border/60"
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xs font-bold text-text-main flex items-center gap-1.5">
                      {item.nome}
                    </h3>
                    <span className="text-xs text-text-muted font-mono">
                      {item.chave}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleAtivo(item)}
                    className="focus:outline-none transition-transform active:scale-95"
                    title={
                      item.ativo ? "Desativar Integração" : "Ativar Integração"
                    }
                  >
                    {item.ativo ? (
                      <ToggleRight
                        size={38}
                        className="text-green-500 hover:text-green-400"
                      />
                    ) : (
                      <ToggleLeft
                        size={38}
                        className="text-text-muted hover:text-text-muted/80"
                      />
                    )}
                  </button>
                </div>

                {/* Formulário de Configuração Dinâmica */}
                <div className="flex-1 flex flex-col gap-3 pt-2 border-t border-input-border/30">
                  {item.chave === "evolution_api" && (
                    <>
                      <div>
                        <label className="text-xs text-text-muted ml-1 mb-1 block">
                          URL Base da API
                        </label>
                        <input
                          value={configLocal.base_url || ""}
                          onChange={(e) =>
                            handleFieldChange(
                              item.chave,
                              "base_url",
                              e.target.value,
                            )
                          }
                          placeholder="https://sua-api.evolution.com.br"
                          className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-text-muted ml-1 mb-1 block">
                            API Key
                          </label>
                          <PasswordInput
                            value={configLocal.api_key || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                item.chave,
                                "api_key",
                                e.target.value,
                              )
                            }
                            placeholder="Chave de Autenticação"
                            className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-text-muted ml-1 mb-1 block">
                            Nome da Instância
                          </label>
                          <input
                            value={configLocal.instancia || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                item.chave,
                                "instancia",
                                e.target.value,
                              )
                            }
                            placeholder="Ex: conexao_zap"
                            className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {item.chave === "cep_api" && (
                    <div>
                      <label className="text-xs text-text-muted ml-1 mb-1 block">
                        Provedor Principal
                      </label>
                      <select
                        value={configLocal.provider || "brasilapi"}
                        onChange={(e) =>
                          handleFieldChange(
                            item.chave,
                            "provider",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                      >
                        <option
                          value="brasilapi"
                          className="text-black bg-white"
                        >
                          BrasilAPI (Recomendado - CDN Rápido)
                        </option>
                        <option value="viacep" className="text-black bg-white">
                          ViaCEP (Tradicional)
                        </option>
                      </select>
                      <p className="text-xs text-text-muted mt-2 flex items-start gap-1">
                        <Lightbulb
                          size={9}
                          className="text-yellow-400 mt-0.5 shrink-0"
                        />{" "}
                        A plataforma tentará o provedor selecionado primeiro. Se
                        houver falha de conexão, fará fallback automático e
                        transparente para o outro.
                      </p>
                    </div>
                  )}

                  {item.chave === "google_sheets" && (
                    <>
                      <div>
                        <label className="text-xs text-text-muted ml-1 mb-1 block">
                          ID da Planilha (Spreadsheet ID)
                        </label>
                        <input
                          value={configLocal.spreadsheet_id || ""}
                          onChange={(e) =>
                            handleFieldChange(
                              item.chave,
                              "spreadsheet_id",
                              e.target.value,
                            )
                          }
                          placeholder="Ex: 1a2B3c4D..."
                          className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-text-muted ml-1 mb-1 block">
                            E-mail da Conta de Serviço
                          </label>
                          <input
                            value={configLocal.client_email || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                item.chave,
                                "client_email",
                                e.target.value,
                              )
                            }
                            placeholder="sheets-sync@projeto.iam.gserviceaccount.com"
                            className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-text-muted ml-1 mb-1 block">
                            Private Key
                          </label>
                          <PasswordInput
                            value={configLocal.private_key || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                item.chave,
                                "private_key",
                                e.target.value,
                              )
                            }
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
                        <label className="text-xs text-text-muted ml-1 mb-1 block">
                          ID da Pasta Destino (Folder ID)
                        </label>
                        <input
                          value={configLocal.folder_id || ""}
                          onChange={(e) =>
                            handleFieldChange(
                              item.chave,
                              "folder_id",
                              e.target.value,
                            )
                          }
                          placeholder="Ex: 1xYz2A-bCd..."
                          className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-text-muted ml-1 mb-1 block">
                            E-mail da Conta de Serviço
                          </label>
                          <input
                            value={configLocal.client_email || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                item.chave,
                                "client_email",
                                e.target.value,
                              )
                            }
                            placeholder="drive-upload@projeto.iam.gserviceaccount.com"
                            className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-text-muted ml-1 mb-1 block">
                            Private Key
                          </label>
                          <PasswordInput
                            value={configLocal.private_key || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                item.chave,
                                "private_key",
                                e.target.value,
                              )
                            }
                            placeholder="-----BEGIN PRIVATE KEY-----"
                            className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {item.chave === "google_maps" && (
                    <div>
                      <label className="text-xs text-text-muted ml-1 mb-1 block">
                        Google Maps API Key
                      </label>
                      <PasswordInput
                        value={configLocal.api_key || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            item.chave,
                            "api_key",
                            e.target.value,
                          )
                        }
                        placeholder="AIzaSyA1..."
                        className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                      />
                    </div>
                  )}

                  {item.chave === "gmail_smtp" && (
                    <>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <label className="text-xs text-text-muted ml-1 mb-1 block">
                            Host SMTP
                          </label>
                          <input
                            value={configLocal.host || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                item.chave,
                                "host",
                                e.target.value,
                              )
                            }
                            placeholder="smtp.gmail.com"
                            className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-text-muted ml-1 mb-1 block">
                            Porta
                          </label>
                          <input
                            type="number"
                            value={configLocal.port || 587}
                            onChange={(e) =>
                              handleFieldChange(
                                item.chave,
                                "port",
                                Number(e.target.value),
                              )
                            }
                            className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-text-muted ml-1 mb-1 block">
                            Usuário / E-mail
                          </label>
                          <input
                            value={configLocal.user || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                item.chave,
                                "user",
                                e.target.value,
                              )
                            }
                            placeholder="exemplo@gmail.com"
                            className="w-full rounded-xl border border-input-border bg-card px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-text-muted ml-1 mb-1 block">
                            Senha
                          </label>
                          <PasswordInput
                            value={configLocal.pass || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                item.chave,
                                "pass",
                                e.target.value,
                              )
                            }
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
                      className="flex items-center justify-center gap-1 rounded-xl bg-bg-dark border border-input-border hover:bg-input-bg text-text-main px-3 py-1.5 text-xs font-semibold disabled:opacity-50 transition-colors"
                    >
                      {isTesting ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <RefreshCw size={13} />
                      )}{" "}
                      Testar Instância
                    </button>
                  )}
                  <button
                    onClick={() => handleSalvar(item)}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-1 rounded-xl bg-accent hover:bg-accent/80 text-accent-fg px-4 py-1.5 text-xs font-semibold disabled:opacity-50 transition-all shadow-md"
                  >
                    {isSaving ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Save size={13} />
                    )}{" "}
                    Salvar Credenciais
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
