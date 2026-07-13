import type { CatalogoDesignFooter } from "../../services/design.service"

interface FooterSectionProps {
  footer: CatalogoDesignFooter
  onChange: (footer: CatalogoDesignFooter) => void
}

const SOCIAL_FIELDS: { key: keyof CatalogoDesignFooter["socialLinks"]; label: string; placeholder: string }[] = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/seu perfil" },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/sua pagina" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/sua empresa" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "5511999999999" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@seu canal" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@seu perfil" },
]

export function FooterSection({ footer, onChange }: FooterSectionProps) {
  function updateSocial(key: keyof CatalogoDesignFooter["socialLinks"], value: string) {
    onChange({ ...footer, socialLinks: { ...footer.socialLinks, [key]: value } })
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-text-main mb-1">Footer</h3>
        <p className="text-xs text-text-muted">Personalize o rodapé da loja</p>
      </div>

      {/* Texto */}
      <div className="p-4 rounded-xl bg-card border border-border-subtle space-y-3">
        <div>
          <label className="text-[10px] text-text-muted block mb-1">Texto do footer</label>
          <input
            type="text"
            value={footer.text}
            onChange={(e) => onChange({ ...footer, text: e.target.value })}
            className="w-full px-2 py-1.5 rounded-lg bg-input-bg border border-input-border text-text-main text-xs"
            placeholder="Sua empresa"
          />
        </div>

        {/* Cores */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-text-muted block mb-1">Fundo</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={footer.bgColor}
                onChange={(e) => onChange({ ...footer, bgColor: e.target.value })}
                className="w-8 h-8 rounded border border-input-border cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={footer.bgColor}
                onChange={(e) => onChange({ ...footer, bgColor: e.target.value })}
                className="flex-1 px-2 py-1 rounded-lg bg-input-bg border border-input-border text-text-main text-xs font-mono"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-text-muted block mb-1">Texto</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={footer.textColor}
                onChange={(e) => onChange({ ...footer, textColor: e.target.value })}
                className="w-8 h-8 rounded border border-input-border cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={footer.textColor}
                onChange={(e) => onChange({ ...footer, textColor: e.target.value })}
                className="flex-1 px-2 py-1 rounded-lg bg-input-bg border border-input-border text-text-main text-xs font-mono"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-text-muted block mb-1">Borda</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={footer.borderColor}
                onChange={(e) => onChange({ ...footer, borderColor: e.target.value })}
                className="w-8 h-8 rounded border border-input-border cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={footer.borderColor}
                onChange={(e) => onChange({ ...footer, borderColor: e.target.value })}
                className="flex-1 px-2 py-1 rounded-lg bg-input-bg border border-input-border text-text-main text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Redes sociais */}
      <div className="p-4 rounded-xl bg-card border border-border-subtle space-y-3">
        <p className="text-xs font-medium text-text-main">Redes Sociais</p>
        <p className="text-[10px] text-text-muted">Deixe vazio para ocultar o ícone</p>
        <div className="space-y-2">
          {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-[10px] text-text-muted block mb-1">{label}</label>
              <input
                type="text"
                value={footer.socialLinks[key]}
                onChange={(e) => updateSocial(key, e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg bg-input-bg border border-input-border text-text-main text-xs"
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
