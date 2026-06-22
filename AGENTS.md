# AGENTS.md - ERP Conexão

## Arquitetura Modular (6 Etapas Concluídas)

### Etapa 1: ModuleDefinition expandido
- `src/registry/modules.ts`: `ModuleDefinition` agora com `ambientes`, `abas` (`ModuleAba[]`), `events` (`ModuleEvent[]`), feature flags (`hasCredentialScopes`, `hasLaboratorio`, `hasFormulario`, `hasCustomActions`, `hasApiConnectors`)
- Exportados tipos `ModuleAba`, `ModuleEvent`

### Etapa 2: Cadastros refatorado como módulo de referência
- `src/features/cadastros/permissions.ts`: `ALL_PERMISSIONS`, `PermGroup`, `PERMISSOES_GROUPS`, `PERMISSOES_LABEL`, `PERMISSOES_DESC`, `getPermissoesPadrao`
- `src/features/cadastros/module.ts`: declara `ambientes`, `abas`, `events`, feature flags
- `src/core/permissions/constants.ts`: re-exporta de `~/features/cadastros/permissions` (backward compat)

### Etapa 3: Página de listagem de módulos
- `src/routes/admin.super.modulos.tsx`: lista módulos registrados, navega para configurador

### Etapa 4: Configurador de módulo com abas dinâmicas
- `src/routes/admin.super.modulos.$key.tsx`: abas Geral, Permissões, Credenciais, Eventos; feature tabs (Lab, Ações, Formulários, APIs) só aparecem se habilitadas no ModuleDefinition
- Rotas registradas em `routeTree.gen.ts`, nav item em `useNavItems.ts`

### Etapa 5: Escopo de credenciais
- Migration `00026_credential_scopes.sql`: coluna `escopos jsonb` + policy RLS
- `src/features/credenciais/index.ts`: `EscopoCredencial` type, `escopos` em `Credencial`/`CredencialInput`

### Etapa 6: Eventos + Webhooks por módulo
- Migration `00027_module_webhooks.sql`: colunas `modulo_key`, `evento_key`, `evento_custom`
- `src/core/services/webhooks.ts`: `Webhook`/`WebhookInput` com novos campos; função `dispararEventoModulo()`
- Re-exportado via `core/services/index.ts` e `lib/webhooks.ts`

## Próximos Passos Sugeridos
- Implementar tabs de Laboratório, Ações Customizadas, Formulários, APIs (placeholders atuais)
- Adicionar UI de configuração de credenciais com escopo nas páginas admin.config.tsx e credenciais.tsx
- Adicionar UI de bind eventos→webhooks no configurador de módulo
- Criar módulo `visitas` como segundo módulo completo

## Important
- Pasta: `C:\Users\trcnologia\Desktop\bubble_reverse_engineering\erp-conexao`
- Build: `npm run build` (compila sem erros)
- DB URL: `postgresql://postgres:%40%23Khen741963%40%23@db.cluuqzhizeqvkgvfdisx.supabase.co:5432/postgres`
- MCP Supabase: `supabase-mcp-server/dist/index.js`
- Super admin global (`empresa_id = null`)
- ALL_PERMISSIONS movido para `features/cadastros/permissions.ts`
