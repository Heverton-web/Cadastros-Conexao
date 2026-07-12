import { createRoute } from "@tanstack/react-router"
import { authLayout } from "./_auth"
import { AdminLayout } from "~/features/catalogo/components/AdminLayout"
import { useState, useEffect } from "react"
import { Instagram, Facebook, Twitter, Youtube, Linkedin, MessageCircle, Globe, Mail, Phone, MapPin } from "lucide-react"

export const catalogoAdminSocialRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/catalogo/admin/social",
  component: AdminSocialPage,
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

const STORAGE_KEY = "catalogo_social_config"

function loadConfig(): Record<string, { url: string; ativo: boolean }> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {}
}

function saveConfig(config: Record<string, { url: string; ativo: boolean }>): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

function AdminSocialPage() {
  const [config, setConfig] = useState<Record<string, { url: string; ativo: boolean }>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setConfig(loadConfig())
  }, [])

  function updateNetwork(key: string, field: "url" | "ativo", value: string | boolean) {
    const current = config[key] ?? { url: "", ativo: false }
    const updated = { ...config, [key]: { ...current, [field]: value } }
    setConfig(updated)
  }

  function handleSave() {
    saveConfig(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border-subtle)] shadow-lg">
          <div>
            <h1 className="text-2xl font-black text-white">Redes Sociais & Contato</h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted, #94a3b8)" }}>
              Configure os links das redes sociais e informações de contato exibidas no rodapé da vitrine.
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
            {saved ? "SALVO!" : "SALVAR CONFIGURAÇÕES"}
          </button>
        </div>

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
      </div>
    </AdminLayout>
  )
}
