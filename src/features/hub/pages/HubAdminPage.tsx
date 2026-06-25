import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "~/lib/auth";
import { BookOpen, Users, GraduationCap, BarChart3, Trophy, Settings, Palette, Bot } from "lucide-react";

function colorMix(c1: string, w: number, c2: string) { return `color-mix(in srgb, ${c1} ${w}%, ${c2})`; }

interface AdminItem { label: string; icon: React.ComponentType<{ size?: number }>; to: string; description: string; superOnly?: boolean }

const adminItems: AdminItem[] = [
  { label: "Materiais", icon: BookOpen, to: "/hub/admin/materiais", description: "Gerenciar materiais de treinamento" },
  { label: "Trilhas", icon: GraduationCap, to: "/hub/admin/trilhas", description: "Gerenciar trilhas de aprendizado" },
  { label: "Usuários", icon: Users, to: "/hub/admin/usuarios", description: "Visualizar e gerenciar usuários" },
  { label: "Ranking", icon: Trophy, to: "/hub/ranking", description: "Ver ranking de XP" },
  { label: "Analytics", icon: BarChart3, to: "/hub/admin/analytics", description: "Métricas e relatórios" },
  { label: "Badges", icon: Trophy, to: "/hub/admin/badges", description: "Gerenciar badges e conquistas" },
  { label: "Identidade Visual", icon: Palette, to: "/hub/admin/identity", description: "Aparência do Hub" },
  { label: "Temas", icon: Palette, to: "/hub/admin/themes", description: "Personalizar cores e efeitos", superOnly: true },
  { label: "Configurações", icon: Settings, to: "/hub/admin/config", description: "Configurações gerais do sistema", superOnly: true },
  { label: "Chatbot", icon: Bot, to: "/hub/admin/chatbot", description: "Configurar chatbot IA", superOnly: true },
];

export function HubAdminPage() {
  const navigate = useNavigate();
  const { is_super_admin } = useAuth() as any;

  const visibleItems = adminItems.filter((item) => !item.superOnly || is_super_admin);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden">
        <div className="absolute inset-0 opacity-60" style={{ background: `linear-gradient(to right, ${colorMix("var(--color-accent)", 10, "rgba(201,166,85,0.1)")}, ${colorMix("var(--color-gradient-mid)", 10, "rgba(232,212,139,0.1)")}, transparent)` }} />
        <div className="relative z-10 p-5 sm:p-8 md:p-10">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: "var(--color-text-main)" }}>Administração Hub</h1>
          <p className="text-sm sm:text-base max-w-lg font-medium" style={{ color: "var(--color-text-muted)" }}>Gerencie materiais, trilhas, usuários e configurações do Hub.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button key={item.to} onClick={() => navigate({ to: item.to as any })}
              className="group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 text-left hover:-translate-y-1"
              style={{ borderColor: "var(--color-border)", backgroundColor: colorMix("var(--color-surface)", 40, "rgba(30,41,59,0.4)") }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 30px var(--color-hover-shadow)"; e.currentTarget.style.borderColor = "var(--color-hover-border)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = "var(--color-border)"; }}>
              <div className="icon-box-lg group-hover:scale-110 transition-transform duration-300"><Icon size={24} /></div>
              <div>
                <p className="font-bold" style={{ color: "var(--color-text-main)" }}>{item.label}</p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{item.description}</p>
                {item.superOnly && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block" style={{ backgroundColor: "var(--color-warning-bg)", color: "var(--color-warning)" }}>Super Admin</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function HubAdminMateriaisPage() { return null; }
export function HubAdminUsuariosPage() { return null; }
export function HubAdminTrilhasPage() { return null; }
export function HubAdminAnalyticsPage() { return null; }
export function HubAdminBadgesPage() { return null; }
export function HubAdminConfigPage() { return null; }
