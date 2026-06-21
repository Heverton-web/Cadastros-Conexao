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
};

export type Ambiente = "cadastro" | "consultor" | "tecnologia" | "suporte" | "ambos";
