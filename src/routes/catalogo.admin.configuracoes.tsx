
import { RequirePermission } from "~/components/guards";import { createRoute } from "@tanstack/react-router"
import { authLayout } from "./_auth"
import { AdminLayout } from "~/features/catalogo/components/AdminLayout"
import { useState, useEffect } from "react"
import { Settings, Save, Store, FileText, ToggleLeft, ToggleRight } from "lucide-react"

export const catalogoAdminConfiguracoesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/catalogo/admin/configuracoes",
  component: () => (
    <RequirePermission modulo="catalogo" permissions={["catalogo_dashboard"]}>
      <AdminConfiguracoesPage />
    </RequirePermission>
  ),
})

interface ConfigData {
  nome_loja: string
  cnpj: string
  email_contato: string
  telefone: string
  endereco: string
  manutencao: boolean
  msg_manutencao: string
  exibir_precos: boolean
  exibir_estoque: boolean
  checkout_habilitado: boolean
  cupons_habilitado: boolean
}

const STORAGE_KEY = "catalogo_config_geral"

const DEFAULT_CONFIG: ConfigData = {
  nome_loja: "ERP Odonto",
  cnpj: "",
  email_contato: "",
  telefone: "",
  endereco: "",
  manutencao: false,
  msg_manutencao: "Estamos em manutenção. Volte em breve!",
  exibir_precos: true,
  exibir_estoque: false,
  checkout_habilitado: true,
  cupons_habilitado: true,
}

function loadConfig(): ConfigData {
  if (typeof window === "undefined") return DEFAULT_CONFIG
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
  } catch {}
  return DEFAULT_CONFIG
}

function saveConfig(config: ConfigData): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

function AdminConfiguracoesPage() {
  const [config, setConfig] = useState<ConfigData>(DEFAULT_CONFIG)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setConfig(loadConfig())
  }, [])

  function handleSave() {
    saveConfig(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function toggleField(field: keyof ConfigData) {
    setConfig({ ...config, [field]: !config[field] })
  }

  const inputCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white text-sm"
  const labelCls = "text-xs font-bold uppercase tracking-widest text-gray-400"

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border-subtle)] shadow-lg">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <Settings className="h-6 w-6 text-[#c9a655]" />
              Configurações Gerais
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted, #94a3b8)" }}>
              Preferências gerais do catálogo e vitrine pública.
            </p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all hover:scale-105"
            style={{
              background: saved ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #c9a655, #e8d48b)",
              color: saved ? "#ffffff" : "#0f172a",
            }}
          >
            <Save className="h-4 w-4" />
            {saved ? "SALVO!" : "SALVAR"}
          </button>
        </div>

        {/* Dados da Loja */}
        <div className="rounded-2xl bg-[var(--color-surface)]/50 backdrop-blur-md border border-[var(--color-border-subtle)] p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
            <Store className="h-5 w-5 text-[#c9a655]" />
            Dados da Loja
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelCls}>Nome da Loja</label>
              <input
                type="text"
                value={config.nome_loja}
                onChange={(e) => setConfig({ ...config, nome_loja: e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="space-y-2">
              <label className={labelCls}>CNPJ</label>
              <input
                type="text"
                value={config.cnpj}
                onChange={(e) => setConfig({ ...config, cnpj: e.target.value })}
                className={inputCls}
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div className="space-y-2">
              <label className={labelCls}>E-mail de Contato</label>
              <input
                type="email"
                value={config.email_contato}
                onChange={(e) => setConfig({ ...config, email_contato: e.target.value })}
                className={inputCls}
                placeholder="contato@odonto.com.br"
              />
            </div>
            <div className="space-y-2">
              <label className={labelCls}>Telefone</label>
              <input
                type="text"
                value={config.telefone}
                onChange={(e) => setConfig({ ...config, telefone: e.target.value })}
                className={inputCls}
                placeholder="+55 11 9999-9999"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className={labelCls}>Endereço</label>
              <input
                type="text"
                value={config.endereco}
                onChange={(e) => setConfig({ ...config, endereco: e.target.value })}
                className={inputCls}
                placeholder="Rua Exemplo, 123 - São Paulo, SP"
              />
            </div>
          </div>
        </div>

        {/* Modo Manutenção */}
        <div className="rounded-2xl bg-[var(--color-surface)]/50 backdrop-blur-md border border-[var(--color-border-subtle)] p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
            <FileText className="h-5 w-5 text-[#c9a655]" />
            Modo Manutenção
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-surface)] border border-white/5">
              <div>
                <p className="font-bold text-white text-sm">Ativar Modo Manutenção</p>
                <p className="text-xs" style={{ color: "var(--color-text-muted, #94a3b8)" }}>
                  Quando ativo, a vitrine pública exibe uma mensagem de manutenção.
                </p>
              </div>
              <button
                onClick={() => toggleField("manutencao")}
                className="transition-colors"
              >
                {config.manutencao ? (
                  <ToggleRight className="h-8 w-8 text-green-400" />
                ) : (
                  <ToggleLeft className="h-8 w-8 text-gray-500" />
                )}
              </button>
            </div>
            {config.manutencao && (
              <div className="space-y-2">
                <label className={labelCls}>Mensagem de Manutenção</label>
                <textarea
                  value={config.msg_manutencao}
                  onChange={(e) => setConfig({ ...config, msg_manutencao: e.target.value })}
                  className={inputCls + " min-h-[80px]"}
                  placeholder="Mensagem exibida na vitrine..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Preferências de Exibição */}
        <div className="rounded-2xl bg-[var(--color-surface)]/50 backdrop-blur-md border border-[var(--color-border-subtle)] p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
            <Settings className="h-5 w-5 text-[#c9a655]" />
            Preferências de Exibição
          </h2>
          <div className="space-y-3">
            {[
              { key: "exibir_precos" as const, label: "Exibir Preços", desc: "Mostra preços na vitrine pública" },
              { key: "exibir_estoque" as const, label: "Exibir Estoque", desc: "Mostra quantidade em estoque" },
              { key: "checkout_habilitado" as const, label: "Checkout Habilitado", desc: "Permite finalização de compras" },
              { key: "cupons_habilitado" as const, label: "Cupons Habilitado", desc: "Permite aplicação de cupons de desconto" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-surface)] border border-white/5"
              >
                <div>
                  <p className="font-bold text-white text-sm">{item.label}</p>
                  <p className="text-xs" style={{ color: "var(--color-text-muted, #94a3b8)" }}>{item.desc}</p>
                </div>
                <button
                  onClick={() => toggleField(item.key)}
                  className="transition-colors"
                >
                  {config[item.key] ? (
                    <ToggleRight className="h-8 w-8 text-green-400" />
                  ) : (
                    <ToggleLeft className="h-8 w-8 text-gray-500" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
