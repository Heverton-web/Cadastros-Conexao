/**
 * Teste manual/SQL: Verifica que RLS está aberto para `authenticated`.
 *
 * Este teste NÃO roda como unit test — é uma suíte de validação SQL
 * que deve ser executada contra o banco de dados via Supabase MCP ou
 * psql diretamente.
 *
 * Uso:
 *   1. Execute os SQLs abaixo como `authenticated` (service_role ou user logado)
 *   2. Verifique que retornam dados
 *   3. Execute como `anon` e verifique que retorna vazio/erro
 */

export const RLS_CHECK_QUERIES = {
  /**
   * Tabelas principais que devem retornar dados para authenticated
   */
  tabelasPrincipais: [
    "profiles",
    "cadastros",
    "empresas",
    "empresas_config",
    "permissoes",
    "notificacoes",
    "atividades",
    "documentos",
    "credenciais",
    "webhooks",
    "form_schema",
    "api_connectors",
    "integracoes_config",
  ],

  /**
   * Tabelas do catálogo
   */
  tabelasCatalogo: [
    "catalogo_implantes",
    "catalogo_abutments",
    "catalogo_componentes",
    "catalogo_clientes",
    "catalogo_pedidos",
    "catalogo_orcamentos",
  ],

  /**
   * Gera SQL de validação para uma tabela
   */
  gerarSelect(tabela: string): string {
    return `SELECT COUNT(*) as total FROM public.${tabela};`;
  },

  /**
   * Gera SQL de teste de acesso negado (anon)
   */
  gerarDenyCheck(tabela: string): string {
    return `-- Verificar que anon NÃO acessa ${tabela}
SELECT CASE
  WHEN COUNT(*) = 0 THEN 'OK: anon bloqueado'
  ELSE 'FALHA: anon acessou!'
END as status
FROM pg_policies
WHERE tablename = '${tabela}' AND qual IS NOT NULL;`;
  },
};
