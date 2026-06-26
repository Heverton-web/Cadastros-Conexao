import { useNavigate } from "@tanstack/react-router";
import { BookOpen, GraduationCap, BarChart3, Trophy, Bot } from "lucide-react";

function colorMix(c1: string, w: number, c2: string) { return `color-mix(in srgb, ${c1} ${w}%, ${c2})`; }

interface AdminItem { label: string; icon: React.ComponentType<{ size?: number }>; to: string; description: string }

const adminItems: AdminItem[] = [
  { label: "Materiais", icon: BookOpen, to: "/hub/admin/materiais", description: "Gerenciar materiais de treinamento" },
  { label: "Trilhas", icon: GraduationCap, to: "/hub/admin/trilhas", description: "Gerenciar trilhas de aprendizado" },
  { label: "Analytics", icon: BarChart3, to: "/hub/admin/analytics", description: "Métricas e relatórios" },
  { label: "Badges", icon: Trophy, to: "/hub/admin/badges", description: "Gerenciar badges e conquistas" },
  { label: "Chatbot", icon: Bot, to: "/hub/admin/chatbot", description: "Configurar chatbot IA" },
];

export function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden">
        <div className="absolute inset-0 opacity-60" style={{ background: `linear-gradient(to right, ${colorMix("var(--color-accent)", 10, "rgba(201,166,85,0.1)")}, ${colorMix("var(--color-gradient-mid)", 10, "rgba(232,212,139,0.1)")}, transparent)` }} />
        <div className="relative z-10 p-5 sm:p-8 md:p-10">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: "var(--color-text-main)" }}>Administração Hub</h1>
          <p className="text-sm sm:text-base max-w-lg font-medium" style={{ color: "var(--color-text-muted)" }}>Gerencie materiais, trilhas e configurações do Hub.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminItems.map((item) => {
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
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
