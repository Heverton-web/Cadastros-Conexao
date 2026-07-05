import { createRoute, useNavigate, Link } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useAuth } from "~/lib/auth";
import {
  buscarEmpresa,
  buscarEmpresaDesign,
  salvarEmpresaDesign,
  listarEmpresas,
  type Empresa,
  type EmpresaDesign,
} from "~/features/empresas";
import { useState, useEffect } from "react";
import {
  Database,
  Save,
  Loader2,
  ArrowLeft,
  Copy,
  Check,
  Globe,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";
import { PasswordInput } from "~/components/ui/password-input";

export const adminEmpresaConfigBancoRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/banco",
  component: AdminEmpresaConfigBanco,
});

function Field({
  label,
  value,
  onChange,
  type,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 block">
        {label}
      </label>
      <input
        type={type || "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-input-bg border border-input-border text-text-main text-sm outline-none focus:border-accent"
      />
    </div>
  );
}

function AdminEmpresaConfigBanco() {
  const { profile: authProfile } = useAuth();
  const isSuper = authProfile?.is_super_admin === true;
  const minhaEmpresaId = authProfile?.empresa_id as string | undefined;
  const navigate = useNavigate();

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaId, setEmpresaId] = useState(minhaEmpresaId || "");
  const [config, setConfig] = useState<EmpresaDesign | null>(null);
  const [loading, setLoading] = useState(true);

  const [dbConfig, setDbConfig] = useState({
    host: "",
    port: "5432",
    database: "",
    user: "",
    password: "",
  });
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isSuper) {
      listarEmpresas().then((emps) => {
        setEmpresas(emps);
        const eid = empresaId || emps[0]?.id || "";
        setEmpresaId(eid);
        if (eid) loadConfig(eid);
        else setLoading(false);
      });
    } else if (minhaEmpresaId) {
      setEmpresaId(minhaEmpresaId);
      loadConfig(minhaEmpresaId);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (empresaId && !loading) loadConfig(empresaId);
  }, [empresaId]);

  async function loadConfig(eid: string) {
    setLoading(true);
    const cfg = await buscarEmpresaDesign(eid);
    setConfig(cfg);
    const c = cfg?.db_config || {};
    setDbConfig({
      host: (c as any).host || "",
      port: (c as any).port || "5432",
      database: (c as any).database || "",
      user: (c as any).user || "",
      password: (c as any).password || "",
    });
    setLoading(false);
  }

  function gerarScript(): string {
    return `-- Script para banco externo: ${dbConfig.database || "não configurado"}
-- Host: ${dbConfig.host || "não configurado"}  Porta: ${dbConfig.port || "5432"}

CREATE TABLE IF NOT EXISTS clientes_externos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text,
  celular text,
  cpf_cnpj text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pedidos_externos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES clientes_externos(id),
  valor numeric(12,2),
  status text DEFAULT 'pendente',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tabela text NOT NULL,
  acao text NOT NULL,
  registro_id uuid,
  dados jsonb,
  created_at timestamptz DEFAULT now()
);`;
  }

  async function handleSave() {
    if (!empresaId) return;
    setSaving(true);
    try {
      await salvarEmpresaDesign(empresaId, { db_config: dbConfig as any });
      toast.success("Config salva!");
    } catch (e: any) {
      toast.error(e.message);
    }
    setSaving(false);
  }

  const script = gerarScript();

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate({ to: "/empresa" })}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-text-main flex items-center gap-2">
          <Database size={18} className="text-accent" /> Banco de Dados
        </h1>
      </div>

      {isSuper && (
        <div className="mb-4 p-3 rounded-lg bg-card border border-border-subtle">
          <div className="flex items-center gap-2">
            <Building2 size={14} className="text-text-muted shrink-0" />
            <select
              value={empresaId}
              onChange={(e) => setEmpresaId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-input-bg border border-input-border text-text-main text-sm"
            >
              <option value="">Selecione empresa</option>
              {empresas.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {!empresaId ? (
        <p className="text-center text-sm text-text-muted py-8">
          Selecione uma empresa.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl bg-card p-4 border border-border-subtle">
            <h2 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
              <Database size={14} /> Conexão
            </h2>
            <p className="text-xs text-text-muted mb-4">
              Configure a conexão com banco externo. Se vazio, usa banco padrão
              da aplicação.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Host"
                value={dbConfig.host}
                onChange={(v) => setDbConfig((p) => ({ ...p, host: v }))}
              />
              <Field
                label="Porta"
                value={dbConfig.port}
                onChange={(v) => setDbConfig((p) => ({ ...p, port: v }))}
              />
              <Field
                label="Database"
                value={dbConfig.database}
                onChange={(v) => setDbConfig((p) => ({ ...p, database: v }))}
              />
              <Field
                label="Usuário"
                value={dbConfig.user}
                onChange={(v) => setDbConfig((p) => ({ ...p, user: v }))}
              />
              <div className="col-span-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 block">
                  Senha
                </label>
                <PasswordInput
                  value={dbConfig.password}
                  onChange={(e) =>
                    setDbConfig((p) => ({ ...p, password: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-input-bg border border-input-border text-text-main text-sm outline-none focus:border-accent"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-accent-fg text-sm font-medium hover:bg-accent-hover disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}{" "}
                Salvar
              </button>
            </div>
          </div>

          {dbConfig.host && dbConfig.database && (
            <div className="rounded-xl bg-card p-4 border border-border-subtle">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-text-main flex items-center gap-2">
                  <Globe size={14} /> Script SQL
                </h2>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(script);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-input-bg border border-input-border text-text-main text-xs font-medium hover:bg-surface-hover transition-colors"
                >
                  {copied ? (
                    <Check size={12} className="text-success" />
                  ) : (
                    <Copy size={12} />
                  )}
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
              <pre className="rounded-lg bg-bg-dark p-4 text-xs text-text-main font-mono overflow-x-auto whitespace-pre border border-border-subtle">
                {script}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
