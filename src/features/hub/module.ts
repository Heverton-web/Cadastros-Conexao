import { BookOpen, LayoutDashboard, GraduationCap, Trophy, Settings, Users, BarChart3, Bot, FileText, Medal, Star } from "lucide-react";
import { registerModule, registerNavItem, registerPermission } from "~/registry";
import type { ModuleDefinition } from "~/registry";
import { HUB_PERMISSIONS } from "./permissions";

export const hubModule: ModuleDefinition = {
  key: "hub-conexao",
  nome: "Hub",
  descricao: "Plataforma de treinamento e gamificação",
  icon: BookOpen,
  routes: [
    "/global/hub",
    "/empresa/hub/tema",
    "/hub/admin/dashboard",
    "/hub/admin/materiais",
    "/hub/admin/trilhas",
    "/hub/admin/analytics",
    "/hub/admin/badges",
    "/hub/admin/chatbot",
    "/hub/gestor/dashboard",
    "/hub/gestor/analytics",
    "/hub/gestor/ranking",
    "/hub/gestor/conquistas",
    "/hub/consultor/dashboard",
    "/hub/consultor/ranking",
    "/hub/consultor/conquistas",
    "/hub/distribuidor/dashboard",
    "/hub/distribuidor/conquistas",
    "/hub/cliente/dashboard/$empresaId",
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

    const isAdmin = (perms: any) => perms?.hub_gerenciar_config === true;
    const isGestor = (perms: any) => perms?.hub_ver_analytics === true && perms?.hub_gerenciar_config !== true;
    const isConsultor = (perms: any) => perms?.hub_ver_materiais === true && perms?.hub_gerenciar_config !== true && perms?.hub_ver_analytics !== true;
    const isDistribuidor = (perms: any) => perms?.hub_ver_materiais === true && perms?.hub_gerenciar_config !== true && perms?.hub_ver_analytics !== true;

    registerNavItem({
      id: "hub-admin-dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/hub/admin/dashboard",
      permissionCheck: isAdmin,
      order: 25,
      moduloKey: "hub-conexao",
    });

    registerNavItem({
      id: "hub-admin-materiais",
      label: "Materiais",
      icon: FileText,
      to: "/hub/admin/materiais",
      permissionCheck: isAdmin,
      order: 26,
      moduloKey: "hub-conexao",
    });

    registerNavItem({
      id: "hub-admin-trilhas",
      label: "Trilhas",
      icon: GraduationCap,
      to: "/hub/admin/trilhas",
      permissionCheck: isAdmin,
      order: 27,
      moduloKey: "hub-conexao",
    });

    registerNavItem({
      id: "hub-admin-badges",
      label: "Badges",
      icon: Trophy,
      to: "/hub/admin/badges",
      permissionCheck: isAdmin,
      order: 28,
      moduloKey: "hub-conexao",
    });

    registerNavItem({
      id: "hub-admin-analytics",
      label: "Analytics",
      icon: BarChart3,
      to: "/hub/admin/analytics",
      permissionCheck: isAdmin,
      order: 29,
      moduloKey: "hub-conexao",
    });

    registerNavItem({
      id: "hub-admin-chatbot",
      label: "Chatbot",
      icon: Bot,
      to: "/hub/admin/chatbot",
      permissionCheck: isAdmin,
      order: 30,
      moduloKey: "hub-conexao",
    });

    registerNavItem({
      id: "hub-gestor-dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/hub/gestor/dashboard",
      permissionCheck: isGestor,
      order: 35,
      moduloKey: "hub-conexao",
    });

    registerNavItem({
      id: "hub-gestor-analytics",
      label: "Analytics",
      icon: BarChart3,
      to: "/hub/gestor/analytics",
      permissionCheck: isGestor,
      order: 36,
      moduloKey: "hub-conexao",
    });

    registerNavItem({
      id: "hub-gestor-ranking",
      label: "Ranking",
      icon: Medal,
      to: "/hub/gestor/ranking",
      permissionCheck: isGestor,
      order: 37,
      moduloKey: "hub-conexao",
    });

    registerNavItem({
      id: "hub-gestor-conquistas",
      label: "Conquistas",
      icon: Star,
      to: "/hub/gestor/conquistas",
      permissionCheck: isGestor,
      order: 38,
      moduloKey: "hub-conexao",
    });

    registerNavItem({
      id: "hub-consultor-dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/hub/consultor/dashboard",
      permissionCheck: isConsultor,
      order: 45,
      moduloKey: "hub-conexao",
    });

    registerNavItem({
      id: "hub-consultor-ranking",
      label: "Ranking",
      icon: Medal,
      to: "/hub/consultor/ranking",
      permissionCheck: isConsultor,
      order: 46,
      moduloKey: "hub-conexao",
    });

    registerNavItem({
      id: "hub-consultor-conquistas",
      label: "Conquistas",
      icon: Star,
      to: "/hub/consultor/conquistas",
      permissionCheck: isConsultor,
      order: 47,
      moduloKey: "hub-conexao",
    });

    registerNavItem({
      id: "hub-distribuidor-dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/hub/distribuidor/dashboard",
      permissionCheck: isDistribuidor,
      order: 55,
      moduloKey: "hub-conexao",
    });

    registerNavItem({
      id: "hub-distribuidor-conquistas",
      label: "Conquistas",
      icon: Star,
      to: "/hub/distribuidor/conquistas",
      permissionCheck: isDistribuidor,
      order: 56,
      moduloKey: "hub-conexao",
    });
  },
};
