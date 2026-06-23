import { ClipboardCheck, Settings, FileText } from "lucide-react";
import { registerModule, registerNavItem, registerPermission } from "~/registry";
import type { ModuleDefinition } from "~/registry";
import { NPS_PERMISSIONS } from "./permissions";

export const npsModule: ModuleDefinition = {
  key: "nps-conexao",
  nome: "NPS Conexão",
  descricao: "Pesquisas de satisfação e Net Promoter Score",
  icon: ClipboardCheck,
  routes: ["/nps", "/nps/survey", "/nps/dashboard", "/nps/pesquisas", "/nps/relatorios"],
  permissions: NPS_PERMISSIONS.map((p) => p.key),
  ambientes: ["cadastro", "consultor", "tecnologia"],
  abas: [
    { key: "geral", label: "Geral", descricao: "Configurações gerais do NPS" },
    { key: "permissoes", label: "Permissões", descricao: "Gerenciar permissões do módulo" },
    { key: "credenciais", label: "Credenciais", descricao: "Credenciais com escopo no NPS" },
    { key: "eventos", label: "Eventos", descricao: "Eventos e webhooks do NPS" },
  ],
  events: [
    { key: "nps.resposta_recebida", label: "Resposta Recebida", descricao: "Dispara quando uma resposta é submetida", type: "status_change" },
    { key: "nps.detrator_detectado", label: "Detrator Detectado", descricao: "Dispara quando nota NPS ≤ 6", type: "status_change" },
    { key: "nps.pesquisa_enviada", label: "Pesquisa Enviada", descricao: "Dispara quando pesquisas são disparadas", type: "button_action" },
  ],
  hasCredentialScopes: true,
  setup: () => {
    for (const p of NPS_PERMISSIONS) {
      registerPermission({ key: p.key, label: p.label, description: p.description, group: p.group });
    }

    registerNavItem({
      id: "nps-dashboard",
      label: "Dashboard NPS",
      icon: ClipboardCheck,
      to: "/nps/dashboard",
      permissionCheck: (perms) => perms?.nps_ver_dashboard === true,
      order: 15,
      moduloKey: "nps-conexao",
    });

    registerNavItem({
      id: "nps-pesquisas",
      label: "Gerenciar Perguntas",
      icon: Settings,
      to: "/nps/pesquisas",
      permissionCheck: (perms) => perms?.nps_gerenciar_perguntas === true,
      order: 16,
      moduloKey: "nps-conexao",
    });

    registerNavItem({
      id: "nps-relatorios",
      label: "Relatórios Envio",
      icon: FileText,
      to: "/nps/relatorios",
      permissionCheck: (perms) => perms?.nps_ver_relatorios === true,
      order: 17,
      moduloKey: "nps-conexao",
    });
  },
};
