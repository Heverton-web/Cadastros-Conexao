import type { Permissoes, Ambiente } from "~/core/permissions/types";

export const ALL_PERMISSIONS: { key: keyof Permissoes; label: string; description: string; group: string }[] = [
  { key: "ver_todos_cadastros", label: "Ver todos os cadastros da empresa (se inativo, vê apenas os que criou)", description: "Permite visualizar todos os cadastros do sistema", group: "Escopo de Dados" },
  { key: "ver_relatorios", label: "Ver relatórios", description: "Permite acessar a página de relatórios", group: "Visualização" },
  { key: "visualizar_documento", label: "Visualizar arquivos dos documentos", description: "Permite abrir e visualizar arquivos dos documentos", group: "Visualização" },
  { key: "aprovar_cadastro", label: "Aprovar cadastro", description: "Permite aprovar um cadastro (definir código do cliente)", group: "Aprovação de Cadastro" },
  { key: "reprovar_cadastro", label: "Reprovar cadastro", description: "Permite reprovar um cadastro", group: "Aprovação de Cadastro" },
  { key: "solicitar_correcao_cadastro", label: "Solicitar correção de cadastro", description: "Permite solicitar correção de um cadastro", group: "Aprovação de Cadastro" },
  { key: "aprovar_documento", label: "Aprovar documento", description: "Permite aprovar documentos anexados", group: "Aprovação de Documentos" },
  { key: "reprovar_documento", label: "Reprovar documento", description: "Permite reprovar documentos", group: "Aprovação de Documentos" },
  { key: "solicitar_correcao_documento", label: "Solicitar correção de documento", description: "Permite solicitar correção de documentos", group: "Aprovação de Documentos" },
  { key: "aprovar_campo", label: "Aprovar campo", description: "Permite aprovar campos individuais do formulário", group: "Aprovação de Campos" },
  { key: "reprovar_campo", label: "Reprovar campo", description: "Permite reprovar campos individuais", group: "Aprovação de Campos" },
  { key: "solicitar_correcao_campo", label: "Solicitar correção de campo", description: "Permite solicitar correção de campos", group: "Aprovação de Campos" },
  { key: "gerenciar_credenciais", label: "Gerenciar credenciais (ver + ativar/inativar)", description: "Acessar página de credenciais e ativar/inativar usuários", group: "Credenciais" },
  { key: "gerenciar_credenciais_admin", label: "Gerenciar credenciais (criar/editar/deletar)", description: "Criar, editar e deletar credenciais de acesso", group: "Credenciais" },
  { key: "excluir_cadastro", label: "Excluir cadastro", description: "Permite excluir cadastros permanentemente", group: "Administração" },
  { key: "gerenciar_config", label: "Gerenciar configurações do sistema", description: "Acessar configurações do sistema (variáveis, webhooks)", group: "Administração" },
  { key: "gerar_links", label: "Gerar links de cadastro", description: "Permite gerar links de cadastro para leads", group: "Geração de Links" },
];

export type PermGroup = { label: string; keys: (keyof Permissoes)[] };

export const PERMISSOES_GROUPS: PermGroup[] = [
  { label: "Escopo de Dados", keys: ["ver_todos_cadastros"] },
  { label: "Visualização", keys: ["ver_relatorios", "visualizar_documento"] },
  { label: "Aprovação de Cadastro", keys: ["aprovar_cadastro", "reprovar_cadastro", "solicitar_correcao_cadastro"] },
  { label: "Aprovação de Documentos", keys: ["aprovar_documento", "reprovar_documento", "solicitar_correcao_documento"] },
  { label: "Aprovação de Campos", keys: ["aprovar_campo", "reprovar_campo", "solicitar_correcao_campo"] },
  { label: "Credenciais", keys: ["gerenciar_credenciais", "gerenciar_credenciais_admin"] },
  { label: "Administração", keys: ["excluir_cadastro", "gerenciar_config"] },
  { label: "Geração de Links", keys: ["gerar_links"] },
];

export const PERMISSOES_LABEL: Record<keyof Permissoes, string> = {} as any;
export const PERMISSOES_DESC: Record<keyof Permissoes, string> = {} as any;

for (const p of ALL_PERMISSIONS) {
  PERMISSOES_LABEL[p.key] = p.label;
  PERMISSOES_DESC[p.key] = p.description;
}

export function getPermissoesPadrao(ambiente: Ambiente): Permissoes {
  switch (ambiente) {
    case "consultor":
      return { ver_todos_cadastros: false, aprovar_cadastro: false, reprovar_cadastro: false, solicitar_correcao_cadastro: false, aprovar_documento: false, reprovar_documento: false, solicitar_correcao_documento: false, aprovar_campo: false, reprovar_campo: false, solicitar_correcao_campo: false, visualizar_documento: false, excluir_cadastro: false, gerenciar_credenciais: false, gerenciar_credenciais_admin: false, gerenciar_config: false, gerar_links: true, ver_relatorios: true, nps_ver_dashboard: false, nps_ver_respostas: false, nps_gerenciar_perguntas: false, nps_gerenciar_webhooks: false, nps_excluir_respostas: false, nps_ver_relatorios: false, nps_exportar_dados: false };
    case "cadastro":
      return { ver_todos_cadastros: true, aprovar_cadastro: true, reprovar_cadastro: true, solicitar_correcao_cadastro: true, aprovar_documento: true, reprovar_documento: true, solicitar_correcao_documento: true, aprovar_campo: true, reprovar_campo: true, solicitar_correcao_campo: true, visualizar_documento: true, excluir_cadastro: false, gerenciar_credenciais: false, gerenciar_credenciais_admin: false, gerenciar_config: false, gerar_links: false, ver_relatorios: true, nps_ver_dashboard: true, nps_ver_respostas: true, nps_gerenciar_perguntas: true, nps_gerenciar_webhooks: false, nps_excluir_respostas: false, nps_ver_relatorios: true, nps_exportar_dados: true };
    case "tecnologia":
      return { ver_todos_cadastros: false, aprovar_cadastro: false, reprovar_cadastro: false, solicitar_correcao_cadastro: false, aprovar_documento: false, reprovar_documento: false, solicitar_correcao_documento: false, aprovar_campo: false, reprovar_campo: false, solicitar_correcao_campo: false, visualizar_documento: false, excluir_cadastro: false, gerenciar_credenciais: true, gerenciar_credenciais_admin: true, gerenciar_config: false, gerar_links: false, ver_relatorios: false, nps_ver_dashboard: true, nps_ver_respostas: true, nps_gerenciar_perguntas: true, nps_gerenciar_webhooks: true, nps_excluir_respostas: true, nps_ver_relatorios: true, nps_exportar_dados: true };
    case "suporte":
      return { ver_todos_cadastros: false, aprovar_cadastro: false, reprovar_cadastro: false, solicitar_correcao_cadastro: false, aprovar_documento: false, reprovar_documento: false, solicitar_correcao_documento: false, aprovar_campo: false, reprovar_campo: false, solicitar_correcao_campo: false, visualizar_documento: false, excluir_cadastro: false, gerenciar_credenciais: true, gerenciar_credenciais_admin: false, gerenciar_config: false, gerar_links: false, ver_relatorios: false, nps_ver_dashboard: false, nps_ver_respostas: false, nps_gerenciar_perguntas: false, nps_gerenciar_webhooks: false, nps_excluir_respostas: false, nps_ver_relatorios: false, nps_exportar_dados: false };
    default:
      return { ver_todos_cadastros: true, aprovar_cadastro: true, reprovar_cadastro: true, solicitar_correcao_cadastro: true, aprovar_documento: true, reprovar_documento: true, solicitar_correcao_documento: true, aprovar_campo: true, reprovar_campo: true, solicitar_correcao_campo: true, visualizar_documento: true, excluir_cadastro: false, gerenciar_credenciais: true, gerenciar_credenciais_admin: true, gerenciar_config: false, gerar_links: true, ver_relatorios: true, nps_ver_dashboard: true, nps_ver_respostas: true, nps_gerenciar_perguntas: true, nps_gerenciar_webhooks: true, nps_excluir_respostas: true, nps_ver_relatorios: true, nps_exportar_dados: true };
  }
}
