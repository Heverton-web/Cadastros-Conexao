export type Permissoes = {
  ver_todos_cadastros: boolean;
  aprovar_cadastro: boolean;
  reprovar_cadastro: boolean;
  solicitar_correcao_cadastro: boolean;
  aprovar_documento: boolean;
  reprovar_documento: boolean;
  solicitar_correcao_documento: boolean;
  aprovar_campo: boolean;
  reprovar_campo: boolean;
  solicitar_correcao_campo: boolean;
  visualizar_documento: boolean;
  excluir_cadastro: boolean;
  gerenciar_credenciais: boolean;
  gerenciar_credenciais_admin: boolean;
  gerenciar_config: boolean;
  gerar_links: boolean;
  ver_relatorios: boolean;
  nps_ver_dashboard: boolean;
  nps_ver_respostas: boolean;
  nps_gerenciar_perguntas: boolean;
  nps_gerenciar_webhooks: boolean;
  nps_excluir_respostas: boolean;
  nps_ver_relatorios: boolean;
  nps_exportar_dados: boolean;
  funis_ver_dashboard: boolean;
  funis_criar_funil: boolean;
  funis_editar_funil: boolean;
  funis_excluir_funil: boolean;
  funis_gerir_colunas: boolean;
  funis_gerir_tarefas: boolean;
  funis_compartilhar: boolean;
  funis_ver_relatorios: boolean;
  lt_ver_dashboard: boolean;
  lt_criar_colaborador: boolean;
  lt_editar_colaborador: boolean;
  lt_excluir_colaborador: boolean;
  lt_toggle_status: boolean;
  lt_ver_link: boolean;
  lt_ver_qr: boolean;
  lt_baixar_qr: boolean;
  lt_gerenciar_tema: boolean;
};

export type ModuloAcesso = {
  acessar: boolean;
  paginas: string[];
  acoes: string[];
};

export type ModulosAcesso = Record<string, ModuloAcesso>;

export type Ambiente = "cadastro" | "consultor" | "tecnologia" | "suporte" | "ambos";
