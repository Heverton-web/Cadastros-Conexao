import { RequirePermission } from "~/components/guards"
import { createRoute } from "@tanstack/react-router"
import { authLayout } from "./_auth"
import { AdminLayout } from "~/features/catalogo/components/AdminLayout"
import { useState, useEffect } from "react"
import { Instagram, Facebook, Twitter, Youtube, Linkedin, MessageCircle, Globe, Mail, Phone, MapPin, Building2, Loader2 } from "lucide-react"
import { useAuth } from "~/lib/auth"
import { supabase } from "~/lib/supabase"
import { listarEmpresas, type Empresa } from "~/shared/empresas"
import { useCatalogoEmpresaId } from "~/features/catalogo/hooks/useCatalogoEmpresa"

export const catalogoAdminSocialRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/catalogo/admin/social",
  component: () => (
    <RequirePermission modulo="catalogo" permissions={["catalogo_gerenciar_promocionais"]}>
      <AdminSocialPage />
    </RequirePermission>
  ),
})

interface SocialNetwork {
  key: string
  label: string
  icon: typeof Instagram
  color: string
  placeholder: string
}

const SOCIAL_NETWORKS: SocialNetwork[] = [
  { key: "instagram", label: "Instagram", icon: Instagram, color: "#E4405F", placeholder: "https://instagram.com/sua-pagina" },
  { key: "facebook", label: "Facebook", icon: Facebook, color: "#1877F2", placeholder: "https://facebook.com/sua-pagina" },
  { key: "twitter", label: "Twitter / X", icon: Twitter, color: "#1DA1F2", placeholder: "https://x.com/seu-perfil" },
  { key: "youtube", label: "YouTube", icon: Youtube, color: "#FF0000", placeholder: "https://youtube.com/@seu-canal" },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, color: "#0A66C2", placeholder: "https://linkedin.com/company/sua-empresa" },
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "#25D366", placeholder: "5511999999999" },
  { key: "site", label: "Site", icon: Globe, color: "#c9a655", placeholder: "https://sua-empresa.com.br" },
  { key: "email", label: "E-mail", icon: Mail, color: "#EA4335", placeholder: "contato@sua-empresa.com.br" },
  { key: "telefone", label: "Telefone", icon: Phone, color: "#6366f1", placeholder: "+55 11 9999-9999" },
  { key: "endereco", label: "Endereço", icon: MapPin, color: "#F59E0B", placeholder: "Rua Exemplo, 123 - São Paulo, SP" },
]

type SocialConfig = Record<string, { url: string; ativo: boolean }>

function AdminSocialPage() {
  const { profile } = useAuth()
  const isSuperAdmin = profile?.is_super_admin === true
  const empresaIdAuth = profile?.empresa_id ?? ""

  // Super Admin: seletor de empresa
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string>(empresaIdAuth)

  // Config
  const [config, setConfig] = useState<SocialConfig>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  // Carregar empresas (Super Admin)
  useEffect(() => {
    if (isSuperAdmin) {
      listarEmpresas().then(setEmpresas).catch(() => {})
    } else {
      setSelectedEmpresaId(empresaIdAuth)
    }
  }, [isSuperAdmin, empresaIdAuth])

  // Carregar config quando empresa muda
  useEffect(() => {
    if (!selectedEmpresaId) return
    loadConfig(selectedEmpresaId)
  }, [selectedEmpresaId])

  async function loadConfig(empresaId: string) {
    setLoading(true)
    try {
      const { data } = await supabase
        .from("catalogo_design_config")
        .select("config")
        .eq("empresa_id", empresaId)
        .maybeSingle()

      if (data?.config) {
        const cfg = data.config as any
        // Extrair redes sociais do footer ou criar vazio
        const socialFromDb = cfg.footer?.socialLinks ?? {}
        const socialConfig: SocialConfig = {}

        for (const network of SOCIAL_NETWORKS) {
          socialConfig[network.key] = {
            url: socialFromDb[network.key] ?? "",
            ativo: !!socialFromDb[network.key],
          }
        }

        setConfig(socialConfig)
      } else {
        // Config vazio
        const empty: SocialConfig = {}
        for (const network of SOCIAL_NETWORKS) {
          empty[network.key] = { url: "", ativo: false }
        }
        setConfig(empty)
      }
    } catch {
      const empty: SocialConfig = {}
      for (const network of SOCIAL_NETWORKS) {
        empty[network.key] = { url: "", ativo: false }
      }
      setConfig(empty)
    } finally {
      setLoading(false)
    }
  }

  function updateNetwork(key: string, field: "url" | "ativo", value: string | boolean) {
    setConfig((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }))
  }

  async function handleSave() {
    if (!selectedEmpresaId) return
    setSaving(true)
    try {
      // Montar objeto de redes sociais
      const socialLinks: Record<string, string> = {}
      for (const network of SOCIAL_NETWORKS) {
        if (config[network.key]?.ativo && config[network.key]?.url) {
          socialLinks[network.key] = config[network.key].url
        }
      }

      // Buscar config existente para fazer merge
      const { data: existing } = await supabase
        .from("catalogo_design_config")
        .select("config")
        .eq("empresa_id", selectedEmpresaId)
        .maybeSingle()

      const currentConfig = (existing?.config as any) ?? {}

      // Merge com footer existente
      const updatedConfig = {
        ...currentConfig,
        footer: {
          ...(currentConfig.footer ?? {}),
          socialLinks,
        },
      }

      // Upsert
      const { error } = await supabase
        .from("catalogo_design_config")
        .upsert(
          { empresa_id: selectedEmpresaId, config: updatedConfig, updated_at: new Date().toISOString() },
          { onConflict: "empresa_id" },
        )

      if (error) throw error

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error("Erro ao salvar redes sociais:", err)
    } finally {
      setSaving(false)
    }
  }

  const empresaSelecionada = empresas.find((e) => e.id === selectedEmpresaId)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border-subtle)] shadow-lg">
          <div>
            <h1 className="text-2xl font-black text-white">Redes Sociais & Contato</h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted, #94a3b8)" }}>
              Configure os links das redes sociais e informações de contato exibidas no rodapé da vitrine.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !selectedEmpresaId}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all hover:scale-105 disabled:opacity-50"
            style={{
              background: saved ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #c9a655, #e8d48b)",
              color: saved ? "#ffffff" : "#0f172a",
            }}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {saved ? "SALVO!" : "SALVAR CONFIGURAÇÕES"}
          </button>
        </div>

        {/* Seletor de empresa (Super Admin) */}
        {isSuperAdmin && (
          <div className="flex items-center gap-4 bg-[var(--color-surface)] p-4 rounded-2xl border border-[var(--color-border-subtle)]">
            <Building2 size={18} className="text-[#c9a655] shrink-0" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Empresa:</span>
            <select
              value={selectedEmpresaId}
              onChange={(e) => setSelectedEmpresaId(e.target.value)}
              className="flex-1 bg-[var(--color-surface)] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">Selecione uma empresa...</option>
              {empresas.map((e) => (
                <option key={e.id} value={e.id}>{e.nome}</option>
              ))}
            </select>
          </div>
        )}

        {/* Indicador da empresa selecionada (Admin) */}
        {!isSuperAdmin && empresaSelecionada && (
          <div className="flex items-center gap-4 bg-[var(--color-surface)] p-4 rounded-2xl border border-[var(--color-border-subtle)]">
            <Building2 size={18} className="text-[#c9a655] shrink-0" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Empresa:</span>
            <span className="text-white text-sm font-medium">{empresaSelecionada.nome}</span>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-[#c9a655]" />
          </div>
        ) : !selectedEmpresaId ? (
          <div className="text-center py-12 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border-subtle)]">
            <p className="text-gray-400">Selecione uma empresa para configurar as redes sociais</p>
          </div>
        ) : (
          /* Grid de redes sociais */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SOCIAL_NETWORKS.map((network) => {
              const current = config[network.key] ?? { url: "", ativo: false }
              const Icon = network.icon

              return (
                <div
                  key={network.key}
                  className={`rounded-xl bg-[var(--color-surface)]/50 backdrop-blur-md border p-5 transition-all ${
                    current.ativo
                      ? "border-[#c9a655]/30 shadow-[0_0_15px_rgba(201,166,85,0.1)]"
                      : "border-[var(--color-border-subtle)] opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${network.color}15`, color: network.color }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{network.label}</p>
                        <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--color-text-muted, #94a3b8)" }}>
                          {current.ativo ? "Ativo" : "Inativo"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateNetwork(network.key, "ativo", !current.ativo)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        current.ativo
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}
                    >
                      {current.ativo ? "ON" : "OFF"}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={current.url}
                    onChange={(e) => updateNetwork(network.key, "url", e.target.value)}
                    placeholder={network.placeholder}
                    className="w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white text-sm"
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
