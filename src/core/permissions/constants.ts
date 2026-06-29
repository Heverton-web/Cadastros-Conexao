import { registerPermission, getAllPermissionDefs } from "~/registry";
import type { PermissionDefinition } from "~/registry";
import type { Ambiente } from "./types";

export type PermGroup = { label: string; keys: string[] };

export function registerCorePermissions(): void {
  for (const p of getAllPermissionDefs()) {
    registerPermission({ key: p.key, label: p.label, description: p.description, group: p.group });
  }
}

export function getAllPermissions(): PermissionDefinition[] {
  return getAllPermissionDefs();
}

export function getPermGroups(): PermGroup[] {
  const defs = getAllPermissionDefs();
  const groupMap = new Map<string, string[]>();
  for (const p of defs) {
    const existing = groupMap.get(p.group) || [];
    existing.push(p.key);
    groupMap.set(p.group, existing);
  }
  return Array.from(groupMap.entries()).map(([label, keys]) => ({ label, keys }));
}

export function getPermLabel(key: string): string {
  const defs = getAllPermissionDefs();
  return defs.find((d) => d.key === key)?.label || key;
}

export function getPermDesc(key: string): string {
  const defs = getAllPermissionDefs();
  return defs.find((d) => d.key === d.key)?.description || "";
}

const LT_DEFAULTS = {
  lt_ver_dashboard: false, lt_criar_colaborador: false, lt_editar_colaborador: false,
  lt_excluir_colaborador: false, lt_toggle_status: false, lt_ver_link: false,
  lt_ver_qr: false, lt_baixar_qr: false, lt_gerenciar_tema: false,
};

export function getPermissoesPadrao(ambiente: Ambiente): Record<string, boolean> {
  switch (ambiente) {
    case "consultor":
      return { ver_todos_cadastros: false, aprovar_cadastro: false, reprovar_cadastro: false, solicitar_correcao_cadastro: false, aprovar_documento: false, reprovar_documento: false, solicitar_correcao_documento: false, aprovar_campo: false, reprovar_campo: false, solicitar_correcao_campo: false, visualizar_documento: false, excluir_cadastro: false, gerenciar_credenciais: false, gerenciar_credenciais_admin: false, gerenciar_config: false, gerar_links: true, ver_relatorios: true, nps_ver_dashboard: false, nps_ver_respostas: false, nps_gerenciar_perguntas: false, nps_gerenciar_webhooks: false, nps_excluir_respostas: false, nps_ver_relatorios: false, nps_exportar_dados: false, funis_ver_dashboard: true, funis_criar_funil: false, funis_editar_funil: false, funis_excluir_funil: false, funis_gerir_colunas: false, funis_gerir_tarefas: true, funis_compartilhar: false, funis_ver_relatorios: false, ...LT_DEFAULTS, lt_ver_dashboard: true, lt_ver_link: true, lt_ver_qr: true, lt_baixar_qr: true };
    case "cadastro":
      return { ver_todos_cadastros: true, aprovar_cadastro: true, reprovar_cadastro: true, solicitar_correcao_cadastro: true, aprovar_documento: true, reprovar_documento: true, solicitar_correcao_documento: true, aprovar_campo: true, reprovar_campo: true, solicitar_correcao_campo: true, visualizar_documento: true, excluir_cadastro: false, gerenciar_credenciais: false, gerenciar_credenciais_admin: false, gerenciar_config: false, gerar_links: false, ver_relatorios: true, nps_ver_dashboard: true, nps_ver_respostas: true, nps_gerenciar_perguntas: true, nps_gerenciar_webhooks: false, nps_excluir_respostas: false, nps_ver_relatorios: true, nps_exportar_dados: true, funis_ver_dashboard: true, funis_criar_funil: true, funis_editar_funil: true, funis_excluir_funil: false, funis_gerir_colunas: true, funis_gerir_tarefas: true, funis_compartilhar: true, funis_ver_relatorios: true, lt_ver_dashboard: true, lt_criar_colaborador: true, lt_editar_colaborador: true, lt_excluir_colaborador: true, lt_toggle_status: true, lt_ver_link: true, lt_ver_qr: true, lt_baixar_qr: true, lt_gerenciar_tema: true };
    case "tecnologia":
      return { ver_todos_cadastros: false, aprovar_cadastro: false, reprovar_cadastro: false, solicitar_correcao_cadastro: false, aprovar_documento: false, reprovar_documento: false, solicitar_correcao_documento: false, aprovar_campo: false, reprovar_campo: false, solicitar_correcao_campo: false, visualizar_documento: false, excluir_cadastro: false, gerenciar_credenciais: true, gerenciar_credenciais_admin: true, gerenciar_config: false, gerar_links: false, ver_relatorios: false, nps_ver_dashboard: true, nps_ver_respostas: true, nps_gerenciar_perguntas: true, nps_gerenciar_webhooks: true, nps_excluir_respostas: true, nps_ver_relatorios: true, nps_exportar_dados: true, funis_ver_dashboard: true, funis_criar_funil: true, funis_editar_funil: true, funis_excluir_funil: true, funis_gerir_colunas: true, funis_gerir_tarefas: true, funis_compartilhar: true, funis_ver_relatorios: true, lt_ver_dashboard: true, lt_criar_colaborador: true, lt_editar_colaborador: true, lt_excluir_colaborador: true, lt_toggle_status: true, lt_ver_link: true, lt_ver_qr: true, lt_baixar_qr: true, lt_gerenciar_tema: true };
    case "suporte":
      return { ver_todos_cadastros: false, aprovar_cadastro: false, reprovar_cadastro: false, solicitar_correcao_cadastro: false, aprovar_documento: false, reprovar_documento: false, solicitar_correcao_documento: false, aprovar_campo: false, reprovar_campo: false, solicitar_correcao_campo: false, visualizar_documento: false, excluir_cadastro: false, gerenciar_credenciais: true, gerenciar_credenciais_admin: false, gerenciar_config: false, gerar_links: false, ver_relatorios: false, nps_ver_dashboard: false, nps_ver_respostas: false, nps_gerenciar_perguntas: false, nps_gerenciar_webhooks: false, nps_excluir_respostas: false, nps_ver_relatorios: false, nps_exportar_dados: false, funis_ver_dashboard: false, funis_criar_funil: false, funis_editar_funil: false, funis_excluir_funil: false, funis_gerir_colunas: false, funis_gerir_tarefas: false, funis_compartilhar: false, funis_ver_relatorios: false, ...LT_DEFAULTS };
    default:
      return { ver_todos_cadastros: true, aprovar_cadastro: true, reprovar_cadastro: true, solicitar_correcao_cadastro: true, aprovar_documento: true, reprovar_documento: true, solicitar_correcao_documento: true, aprovar_campo: true, reprovar_campo: true, solicitar_correcao_campo: true, visualizar_documento: true, excluir_cadastro: false, gerenciar_credenciais: true, gerenciar_credenciais_admin: true, gerenciar_config: false, gerar_links: true, ver_relatorios: true, nps_ver_dashboard: true, nps_ver_respostas: true, nps_gerenciar_perguntas: true, nps_gerenciar_webhooks: true, nps_excluir_respostas: true, nps_ver_relatorios: true, nps_exportar_dados: true, funis_ver_dashboard: true, funis_criar_funil: true, funis_editar_funil: true, funis_excluir_funil: true, funis_gerir_colunas: true, funis_gerir_tarefas: true, funis_compartilhar: true, funis_ver_relatorios: true, lt_ver_dashboard: true, lt_criar_colaborador: true, lt_editar_colaborador: true, lt_excluir_colaborador: true, lt_toggle_status: true, lt_ver_link: true, lt_ver_qr: true, lt_baixar_qr: true, lt_gerenciar_tema: true };
  }
}
