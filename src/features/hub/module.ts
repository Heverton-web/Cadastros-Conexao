import { BookOpen, LayoutDashboard, GraduationCap, Trophy, Settings, Users, BarChart3, Webhook } from "lucide-react";
import { registerModule, registerNavItem, registerPermission } from "~/registry";
import type { ModuleDefinition } from "~/registry";
import { HUB_PERMISSIONS } from "./permissions";

export const hubModule: ModuleDefinition = {
  key: "hub-conexao",
  nome: "Hub",
  descricao: "Plataforma de treinamento e gamificação",
  icon: BookOpen,
  routes: [
    "/hub/dashboard",
    "/hub/trilhas",
    "/hub/trilhas/$trilhaId",
    "/hub/materiais",
    "/hub/materiais/$materialId",
    "/hub/ranking",
    "/hub/conquistas",
    "/hub/admin",
    "/hub/admin/materiais",
    "/hub/admin/usuarios",
    "/hub/admin/trilhas",
    "/hub/admin/analytics",
    "/hub/admin/badges",
    "/hub/admin/config",
    "/hub/gestor",
    "/hub/gestor/materiais",
    "/hub/gestor/usuarios",
    "/hub/gestor/trilhas",
    "/hub/gestor/analytics",
    "/hub/webhooks",
  ],
  permissions: HUB_PERMISSIONS.map((p) => p.key),
  ambientes: ["cadastro", "consultor", "tecnologia"],
  abas: [
    { key: "geral", label: "Geral", descricao: "Configurações gerais do Hub" },
    { key: "permissoes", label: "Permissões", descricao: "Gerenciar permissões do módulo" },
    { key: "credenciais", label: "Credenciais", descricao: "Credenciais com escopo no Hub" },
    { key: "eventos", label: "Eventos", descricao: "Eventos e webhooks do Hub" },
    { key: "integracoes", label: "Integrações", descricao: "Integrações AI do Hub" },
    { key: "chatbot", label: "Chatbot", descricao: "Configuração do chatbot" },
  ],
  events: [
    { key: "material.acessado", label: "Material Acessado", descricao: "Quando um material é visualizado", type: "status_change" },
    { key: "material.concluido", label: "Material Concluído", descricao: "Quando um material é concluído", type: "status_change" },
    { key: "trilha.concluida", label: "Trilha Concluída", descricao: "Quando uma trilha é concluída", type: "status_change" },
    { key: "gamification.level_up", label: "Level Up", descricao: "Quando um usuário sobe de nível", type: "status_change" },
    { key: "badge.conquistado", label: "Badge Conquistado", descricao: "Quando um badge é desbloqueado", type: "status_change" },
    { key: "convite.gerado", label: "Convite Gerado", descricao: "Quando um convite é criado", type: "button_action" },
    { key: "usuario.registrado", label: "Usuário Registrado", descricao: "Quando um usuário se registra via convite", type: "status_change" },
    { key: "usuario.status_alterado", label: "Status Alterado", descricao: "Quando status do usuário muda", type: "status_change" },
  ],
  hasCredentialScopes: true,
  setup: () => {
    for (const p of HUB_PERMISSIONS) {
      registerPermission({ key: p.key, label: p.label, description: p.description, group: p.group });
    }

    registerNavItem({
      id: "hub-dashboard",
      label: "Dashboard Hub",
      icon: LayoutDashboard,
      to: "/hub/dashboard",
      permissionCheck: (perms) => perms?.hub_ver_materiais === true,
      order: 25,
      moduloKey: "hub-conexao",
    });

    registerNavItem({
      id: "hub-trilhas",
      label: "Trilhas",
      icon: GraduationCap,
      to: "/hub/trilhas",
      permissionCheck: (perms) => perms?.hub_ver_trilhas === true,
      order: 26,
      moduloKey: "hub-conexao",
    });

    registerNavItem({
      id: "hub-ranking",
      label: "Ranking",
      icon: Trophy,
      to: "/hub/ranking",
      permissionCheck: (perms) => perms?.hub_ver_ranking === true,
      order: 27,
      moduloKey: "hub-conexao",
    });

    registerNavItem({
      id: "hub-admin",
      label: "Admin Hub",
      icon: Settings,
      to: "/hub/admin",
      permissionCheck: (perms) => perms?.hub_gerenciar_config === true,
      order: 28,
      moduloKey: "hub-conexao",
    });

    registerNavItem({
      id: "hub-gestor",
      label: "Gestor Hub",
      icon: Users,
      to: "/hub/gestor",
      permissionCheck: (perms) => perms?.hub_ver_analytics === true && perms?.hub_gerenciar_config !== true,
      order: 29,
      moduloKey: "hub-conexao",
    });
  },
};
