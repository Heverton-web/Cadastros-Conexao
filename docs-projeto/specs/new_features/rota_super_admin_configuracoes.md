# Rota SUPER ADMIN de Configurações

## Objetivo

Criar rota protegida `/admin/config` onde o SUPER ADMIN (role=`admin` + flag `is_super_admin=true`) pode:

- Configurar dados de conexão Supabase (.env)
- Gerenciar credenciais mock (credentials.env)
- Configurar webhooks para botões e mudanças de status
- Criar webhooks customizados

---

## 1. Migrations (`supabase/migrations/00006_admin.sql`)

### 1.1 profiles — flag is_super_admin

```sql
alter table public.profiles
  add column if not exists is_super_admin boolean default false;
```

### 1.2 app_config

| Coluna        | Tipo                                  | Descrição               |
| ------------- | ------------------------------------- | ----------------------- |
| `id`          | `uuid pk default gen_random_uuid()`   |                         |
| `key`         | `text not null unique`                | Ex: `VITE_SUPABASE_URL` |
| `value`       | `text not null`                       | Valor da configuração   |
| `description` | `text`                                | Descrição amigável      |
| `type`        | `text not null default 'env'`         | `env` ou `internal`     |
| `updated_at`  | `timestamptz default now()`           |                         |
| `updated_by`  | `uuid references public.profiles(id)` |                         |

### 1.3 mock_credentials

| Coluna       | Tipo                                | Descrição                                      |
| ------------ | ----------------------------------- | ---------------------------------------------- |
| `id`         | `uuid pk default gen_random_uuid()` |                                                |
| `identifier` | `text not null unique`              | Ex: `SUPER_ADMIN`, `CADASTRO`                  |
| `email`      | `text not null`                     |                                                |
| `password`   | `text not null`                     |                                                |
| `role`       | `text not null`                     | `admin`, `editor`, `viewer`                    |
| `ambiente`   | `text`                              | `cadastro`, `consultor`, `tecnologia`, `ambos` |
| `ativo`      | `boolean default true`              |                                                |
| `created_at` | `timestamptz default now()`         |                                                |
| `updated_at` | `timestamptz default now()`         |                                                |

### 1.4 webhooks

| Coluna          | Tipo                                    | Descrição                          |
| --------------- | --------------------------------------- | ---------------------------------- |
| `id`            | `uuid pk default gen_random_uuid()`     |                                    |
| `nome`          | `text not null`                         | Nome amigável                      |
| `evento`        | `text not null`                         | Identificador do evento            |
| `tipo_evento`   | `text not null default 'button_action'` | `status_change` ou `button_action` |
| `url`           | `text not null`                         | URL destino                        |
| `metodo`        | `text not null default 'POST'`          | Método HTTP                        |
| `headers`       | `jsonb default '{}'`                    | Headers customizados               |
| `body_template` | `jsonb default '{}'`                    | Template do body                   |
| `ativo`         | `boolean default true`                  |                                    |
| `created_at`    | `timestamptz default now()`             |                                    |
| `updated_at`    | `timestamptz default now()`             |                                    |

### 1.5 webhook_logs

| Coluna            | Tipo                                  | Descrição           |
| ----------------- | ------------------------------------- | ------------------- |
| `id`              | `uuid pk default gen_random_uuid()`   |                     |
| `webhook_id`      | `uuid references public.webhooks(id)` |                     |
| `evento`          | `text`                                | Evento que disparou |
| `url`             | `text`                                | URL chamada         |
| `status_code`     | `int`                                 | HTTP status code    |
| `resposta`        | `text`                                | Corpo da resposta   |
| `sucesso`         | `boolean`                             | Se foi bem-sucedido |
| `payload_enviado` | `jsonb`                               | Payload enviado     |
| `created_at`      | `timestamptz default now()`           |                     |

### RLS policies

Todas as tabelas: apenas SUPER ADMIN pode CRUD.

---

## 2. Novas Libs

### 2.1 `src/lib/admin.ts`

- `getAppConfig()` → SELECT app_config
- `updateAppConfig(key, value)` → UPSERT app_config
- `listMockCredentials()` → SELECT mock_credentials
- `createMockCredential(data)` → INSERT
- `updateMockCredential(id, data)` → UPDATE
- `toggleMockCredential(id, ativo)` → UPDATE ativo
- `deleteMockCredential(id)` → DELETE

### 2.2 `src/lib/webhooks.ts`

- `listarWebhooks()` → SELECT webhooks
- `criarWebhook(data)` → INSERT
- `atualizarWebhook(id, data)` → UPDATE
- `toggleWebhook(id, ativo)` → UPDATE ativo
- `deletarWebhook(id)` → DELETE
- `listarWebhookLogs(webhook_id?)` → SELECT webhook_logs
- `dispararWebhooks(evento, payload)` → Consulta webhooks ativos, dispara HTTP, registra log

---

## 3. Nova Rota: `/admin/config`

`src/routes/admin.config.tsx`

### Guardas

- Rota sob `authLayout`
- Verifica `profile?.is_super_admin === true`
- Se não for, redireciona ou mostra "Acesso restrito"

### Tabs

| Tab                             | Conteúdo                                                                                      |
| ------------------------------- | --------------------------------------------------------------------------------------------- |
| **Supabase**                    | Formulário com campos: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_DB_PASSWORD        |
| **Credenciais**                 | Lista de mock_credentials com toggle ativo/inativo + botão nova credencial + editar + deletar |
| **Webhooks**                    |                                                                                               |
| &nbsp;&nbsp;↳ Eventos de Status | Tabela com checkbox por status + URL + Salvar                                                 |
| &nbsp;&nbsp;↳ Ações de Botões   | Tabela com checkbox por botão + URL + Salvar                                                  |
| &nbsp;&nbsp;↳ Customizados      | CRUD livre: nome, evento, URL, método, headers, body                                          |
| &nbsp;&nbsp;↳ Logs              | Tabela com histórico de execuções                                                             |

---

## 4. Eventos Mapeados

### Status Changes

| Evento           | Quando                       |
| ---------------- | ---------------------------- |
| `link_gerado`    | Cadastro criado              |
| `dados_enviados` | Cliente submete pré-cadastro |
| `em_analise`     | 2FA enviado                  |
| `em_correcao`    | Admin solicita correção      |
| `aprovado`       | Admin aprova                 |
| `reprovado`      | Admin reprova                |

### Button Actions

| Evento                    | Botão              | Arquivo            |
| ------------------------- | ------------------ | ------------------ |
| `botao_compartilhar_link` | Compartilhar Link  | `consultor.tsx`    |
| `botao_aprovar`           | Aprovar            | `clientes.$id.tsx` |
| `botao_reprovar`          | Reprovar           | `clientes.$id.tsx` |
| `botao_corrigir`          | Solicitar Correção | `clientes.$id.tsx` |

---

## 5. Arquivos a Modificar

| Ação      | Arquivo                               |
| --------- | ------------------------------------- |
| CRIAR     | `supabase/migrations/00006_admin.sql` |
| CRIAR     | `src/lib/admin.ts`                    |
| CRIAR     | `src/lib/webhooks.ts`                 |
| CRIAR     | `src/routes/admin.config.tsx`         |
| MODIFICAR | `src/routeTree.gen.ts`                |
| MODIFICAR | `src/routes/_auth.tsx`                |
| MODIFICAR | `src/components/layout/BottomNav.tsx` |
| MODIFICAR | `src/routes/consultor.tsx`            |
| MODIFICAR | `src/routes/clientes.$id.tsx`         |
| MODIFICAR | `src/routes/pre-cadastro.$token.tsx`  |
| MODIFICAR | `src/lib/clientes.ts`                 |

---

## 6. Ordem de Implementação

1. Migration SQL
2. Lib `admin.ts`
3. Lib `webhooks.ts`
4. Rota `admin.config.tsx`
5. Atualizar `routeTree.gen.ts`
6. Atualizar `_auth.tsx` (guard)
7. Atualizar `BottomNav.tsx`
8. Integrar webhooks nos botões existentes
   - `consultor.tsx` (gerarLink)
   - `clientes.$id.tsx` (aprovar, reprovar, corrigir)
   - `pre-cadastro.$token.tsx` (dados_enviados, em_analise)
   - `clientes.ts` (criarCadastro → link_gerado)
