# Análise de Backend — ERP Conexão

> **Documento gerado em:** 04/07/2026 | **Stack:** Supabase (BaaS) + PostgreSQL + pg_net + MCP Server

---

## 1. Resumo Executivo

O ERP Conexão utiliza uma arquitetura **Backend-as-a-Service (BaaS)** com Supabase como espinha dorsal. Não há servidor Node.js/Express tradicional — a lógica backend reside em **três camadas**: PostgreSQL (funções, triggers, RLS), **Serviços Frontend** (chamadas Supabase via cliente), e **MCP Server** (gerenciamento de banco via IA). Pontuação: **~78/100**.

---

## 2. Arquitetura Backend

### 2.1 Diagrama de Camadas

```
┌─────────────────────────────────────────────────┐
│                  CLIENTE (Browser)                │
│  ┌─────────────────────────────────────────────┐  │
│  │  Core Services (webhooks, notificações,     │  │
│  │  atividades, integrações)                   │  │
│  ├─────────────────────────────────────────────┤  │
│  │  Supabase Client (REST + Realtime)           │  │
│  └──────────────────────────────────┬──────────┘  │
└─────────────────────────────────────┼────────────┘
                                      │
┌─────────────────────────────────────┼────────────┐
│              SUPABASE (BaaS)        │            │
│  ┌──────────────────────────────────▼─────────┐  │
│  │           PostgreSQL Database                │  │
│  │  ┌──────────┐ ┌─────────┐ ┌──────────────┐  │  │
│  │  │ Migrations│ │ RPCs    │ │ Functions     │  │  │
│  │  │ (73 .sql) │ │ (50+)   │ │ (PL/pgSQL)   │  │  │
│  │  ├──────────┤ ├─────────┤ ├──────────────┤  │  │
│  │  │ 55-60     │ │ enviar_ │ │ is_super_    │  │  │
│  │  │ aplicadas  │ │ whatsapp│ │ admin()      │  │  │
│  │  └──────────┘ └─────────┘ └──────────────┘  │  │
│  │                                               │  │
│  │  ┌──────────────┐  ┌────────────────────┐    │  │
│  │  │ Auth (JWT)   │  │ RLS Policies (70+) │    │  │
│  │  └──────────────┘  └────────────────────┘    │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                                      │
┌─────────────────────────────────────┼────────────┐
│          MCP Server (Dev tool)       │            │
│  ┌──────────────────────────────────▼─────────┐  │
│  │ supabase-mcp-server/                        │  │
│  │  ├─ supabase_execute_sql                    │  │
│  │  ├─ supabase_list_tables                    │  │
│  │  ├─ supabase_describe_table                 │  │
│  │  └─ supabase_apply_migration                │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                                      │
┌─────────────────────────────────────┼────────────┐
│         APIs Externas               │            │
│  ┌──────────┐ ┌──────────┐ ┌───────▼─────────┐  │
│  │ Evolution │ │ ViaCEP /  │ │ Google Maps     │  │
│  │ API       │ │ BrasilAPI │ │ Google Sheets   │  │
│  │ (WhatsApp)│ │ (CEP)     │ │ Gmail SMTP      │  │
│  └──────────┘ └──────────┘ └─────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 2.2 Padrão BaaS (Backend-as-a-Service)

Diferente de uma aplicação tradicional com servidor Express/Fastify, o ERP Conexão terceiriza toda a camada de servidor para o Supabase:

| Aspecto | Tradicional (Express/Node) | ERP Conexão (Supabase) |
|---|---|---|
| Autenticação | JWT manual, bcrypt, sessions | Supabase Auth (GoTrue) |
| Autorização | Middleware RBAC | RLS Policies + `is_super_admin_session()` |
| API REST | Rotas Express | Supabase REST (auto) + RPCs |
| WebSockets | Socket.io | Supabase Realtime |
| File Storage | Multer/S3 | Supabase Storage |
| Server Logic | Controladores | PL/pgSQL Functions |
| Background Jobs | Bull/Redis | pg_net (assíncrono) |

### 2.3 ❌ Ausência de Camada Server-Side Tradicional

A falta de um servidor Node.js traz **limitações importantes**:

| Funcionalidade | Como é feita | Limitação |
|---|---|---|
| Validação server-side | Apenas RLS + constraints | Sem validação de negócio complexa |
| Webhooks síncronos | `fetch()` do frontend | Sem retry automático, sem fila |
| Jobs agendados | Não existe | Nada como cron scheduler |
| Rate limiting | Não implementado | Vulnerável a abuso |
| Cache | Apenas React Query (client) | Sem cache server-side |
| Server Components | TanStack Start (SSR parcial) | Não implementado |

> **Nota:** O projeto está configurado com TanStack Start, que permite SSR. Porém, atualmente as funções server-side não são utilizadas.

---

## 3. Supabase como Backend

### 3.1 Cliente Supabase

```typescript
// src/core/supabase/client.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- **Config**: URL + Anon Key do `app_config` (tabela gerenciável)
- **Autenticação**: Supabase Auth com JWT
- **Realtime**: Disponível para notificações em tempo real
- **Storage**: Disponível para upload de documentos/comprovantes

### 3.2 Funções Auxiliares (PL/pgSQL)

**Funções Core** (Migration 00023):

```sql
is_super_admin_session()     → BOOLEAN  -- Usuário é super admin?
is_admin_or_super()          → BOOLEAN  -- Admin de empresa ou super?
get_current_empresa_id()     → UUID     -- Empresa do usuário logado
pode_acessar_empresa(id)     → BOOLEAN  -- Pode acessar empresa específica?
```

**Funções de Integração** (Migration 00016):

```sql
enviar_whatsapp_evolution(contato TEXT, mensagem TEXT) → void
-- Dispara WhatsApp via Evolution API usando pg_net (assíncrono)
```

**Funções Admin** (Migrations 00046-00052):

```sql
admin_atualizar_senha(usuario_id UUID, nova_senha TEXT)
admin_criar_usuario(email TEXT, senha TEXT, nome TEXT, role TEXT, empresa_id UUID)
admin_deletar_usuario(usuario_id UUID)
```

### 3.3 RLS Policies

**70+ políticas RLS** seguem 3 padrões:

```sql
-- Padrão 1: Super Admin vê tudo, Admin vê sua empresa
USING (is_super_admin_session() OR empresa_id = get_current_empresa_id())

-- Padrão 2: Apenas Super Admin
USING (is_super_admin_session())

-- Padrão 3: Próprio usuário + empresa
USING (is_super_admin_session() OR usuario_id = auth.uid())
```

### 3.4 Migrações — 73 Arquivos SQL

| Faixa | Quantidade | Conteúdo |
|---|---|---|
| `00001-00025` | 25 | Core: profiles, cadastros, admin, multiempresas, RLS |
| `00026-00052` | 27 | Features: módulos, webhooks, mapas, NPS, funis, linktree, hub |
| `20260xxxxx-2` | 10 | Features recentes: NPS, funis, despesas, rotas, marketing |
| `00053` | 1 | Empresa linktree |
| **Total** | **~73** | **55-60 aplicadas, ~10-15 pendentes** |

---

## 4. MCP Server (supabase-mcp-server/)

### 4.1 Propósito

Servidor MCP (Model Context Protocol) para gerenciar o banco Supabase via ferramentas de IA.

### 4.2 Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | ≥18 | Runtime |
| `@modelcontextprotocol/sdk` | ^1.6.1 | Protocolo MCP |
| `pg` | ^8.13.1 | PostgreSQL client |
| `zod` | ^3.23.8 | Validação de schemas |
| `tsx` | ^4.19.2 | TypeScript exec |

### 4.3 Ferramentas Disponíveis

| Ferramenta | Descrição | Segurança |
|---|---|---|
| `supabase_execute_sql` | SQL arbitrário (SELECT, DDL, DML) | ⚠️ Destrutivo |
| `supabase_list_tables` | Lista tabelas de um schema | ✅ Read-only |
| `supabase_describe_table` | Descreve colunas, constraints, RLS | ✅ Read-only |
| `supabase_apply_migration` | Aplica `.sql` de `supabase/migrations/` | ⚠️ Destrutivo |

### 4.4 Análise

✅ **Pontos fortes:**
- Permite gerenciar banco via chat/IA
- Leitura de migrations do diretório local
- Truncamento de resultados (50k chars)

❌ **Fragilidades:**
- Conexão direta ao banco via `SUPABASE_DB_URL` — risco de segurança
- `supabase_execute_sql` não diferencia SELECT de DELETE/DROP
- Sem limites de rate ou validação de comandos perigosos
- Sem logging de operações realizadas
- Apenas 4 tools — sem gerenciamento de auth, storage, ou edge functions

---

## 5. Core Services (Frontend-side)

### 5.1 Webhooks Engine (`src/core/services/webhooks.ts`)

**Motor de automação completo que executa no frontend** (client-side).

#### Fluxo de Execução

```
1. dispararWebhooks(evento, payload, empresaId)
   ↓
2. Busca dados do usuário realizador (profiles)
   ↓
3. Busca dados do cadastro (tabela cadastros)
   ↓
4. Consulta 3 fontes em paralelo:
   ├── notificacoes_templates → templates ativos para o evento
   ├── webhooks               → webhooks configurados para o evento
   └── api_connectors         → conectores de API ativos para o evento
   ↓
5. Resolve placeholders {{tabela.coluna}} buscando dados dinâmicos
   ↓
6. Ordena tasks por ordem prioridade
   ↓
7. Executa cada task sequencialmente:
   ├── notification → dispararNotificacaoIndividual()
   ├── webhook      → fetch() para URL externa
   └── api_connector → getActionExecutor("api_connector")()
   ↓
8. Registra logs em webhook_logs (sucesso/erro)
```

#### Duas Formas de Disparo

| Função | Gatilho | Filtro |
|---|---|---|
| `dispararWebhooks()` | Evento legado (status_change/button_action) | `webhooks.evento = param` |
| `dispararEventoModulo()` | Evento de módulo (funil_criado, etc.) | `webhooks.modulo_key + webhooks.evento_key` |

#### Templates de Notificação

```typescript
// Placeholders dinâmicos baseados em {{tabela.coluna}}
// Exemplo no corpo_template:
"O cadastro de {{colaborador}} foi {{status}}"
// Resolve buscando dados reais das tabelas com base nos placeholders
```

#### Tipos de Destinatário

| Tipo | Quem recebe |
|---|---|
| `consultor` | `cadastros.created_by` |
| `superadmin` | Profiles com `is_super_admin = true` ou `role = admin` |
| `cadastro` | Profiles com `ambiente = 'cadastro'` (fallback: admins) |
| `ti` | Profiles com `ambiente = 'tecnologia'` (fallback: admins) |

### 5.2 Notificações (`src/core/services/notificacoes.ts`)

- **Polling**: 5s de intervalo no AppLayout
- **Badge**: Contador de não lidas no header
- **Marcar lida**: Individual ou todas
- **In-app**: Tabela `notificacoes` (usuario_id, titulo, mensagem, dados)

### 5.3 Atividades (Audit Log) (`src/core/services/atividades.ts`)

- **Entidade**: `cadastros` (único tipo atualmente)
- **Ações**: Link gerado, dados enviados, aprovado, reprovado, corrigir
- **Registro**: `logAtividade(entidade_tipo, entidade_id, acao, descricao)`

### 5.4 Issues Técnicas nos Core Services

| Problema | Impacto |
|---|---|
| `dispararWebhooks()` executa no **client-side** com `Promise.resolve().then(...)` — sem isolamento | Fechar o browser interrompe a execução |
| Sem confirmação de entrega (fire-and-forget) | Webhooks podem falhar silenciosamente |
| `console.error` como único log de erro | Sem monitoramento estruturado (Sentry só no frontend) |
| Busca de dados dinâmicos resolve tabelas uma a uma (N+1) | Lento em cenários com muitos placeholders |
| Sem rate limiting | Sistema pode sobrecarregar APIs externas |

---

## 6. Integrações Externas

### 6.1 Tabela de Integrações

| Integração | Chave | Tipo | Config |
|---|---|---|---|
| Evolution API | `evolution_api` | WhatsApp | base_url, api_key, instancia |
| CEP Resiliente | `cep_api` | CEP | provider (brasilapi/viacep) |
| Google Sheets | `google_sheets` | Planilhas | spreadsheet_id, client_email, private_key |
| Google Drive | `google_drive` | Storage | folder_id, client_email, private_key |
| Google Maps | `google_maps` | Mapas | api_key |
| Gmail SMTP | `gmail_smtp` | Email | host, port, user, pass, secure |

### 6.2 CEP — Busca Resiliente

```
buscarCepResiliente(cep)
  ├── 1. BrasilAPI (brasilapi.com.br/api/cep/v1/ — 3.5s timeout)
  ├── 2. ViaCEP (viacep.com.br/ws/ — fallback se BrasilAPI falhar)
  └── 3. null (retorna null se ambos falharem)
```

### 6.3 Evolution API (WhatsApp)

- **Trigger**: Função PL/pgSQL `enviar_whatsapp_evolution()`
- **Transporte**: `pg_net` (extensão PostgreSQL para HTTP requests assíncronos)
- **Endpoint**: `{base_url}/message/sendText/{instancia}`
- **Payload**: `{ number, options, textMessage }`
- **Formatação**: Adiciona DDI 55 automaticamente para números brasileiros

### 6.4 Google Maps

- **Uso**: Módulo Mapas + Módulo Rotas
- **Serviços**: Geolocalização, distâncias, rotas
- **API Key**: Configurada via integrações_config

### 6.5 Utilities (Client-side)

| Utility | Arquivo | Propósito |
|---|---|---|
| OCR | `src/lib/ocr.ts` | Leitura de comprovantes via Tesseract.js |
| Sentiment | `src/lib/sentiment.ts` | Análise de sentimento NPS (léxico PT-BR) |
| Seller Metrics | `src/lib/sellerMetrics.ts` | Métricas de vendedor por NPS |
| Image Compress | `src/lib/image-compress.ts` | Compressão de imagens antes do upload (1920px max, 80% quality) |

---

## 7. Registry/Executors — Extensibilidade

### 7.1 Action Executor Pattern

```typescript
// src/registry/executors.ts
type ActionExecutor = (id: string, payload: Record<string, any>) => Promise<any>;
const executors = new Map<string, ActionExecutor>();

registerActionExecutor("api_connector", meuExecutor);
getActionExecutor("api_connector"); // Retorna o executor registrado
```

Usado atualmente apenas para `api_connector` — permite que qualquer módulo registre executores personalizados para webhooks.

### 7.2 Module Event Pattern

```typescript
// src/registry/modules.ts
type ModuleEvent = {
  key: string;
  label: string;
  descricao: string;
  type?: "status_change" | "button_action";
};
```

Eventos registrados no `module.ts` são **apenas documentais** — a execução real é feita pelos core services (webhooks.ts).

---

## 8. Análise de Segurança Backend

### 8.1 ✅ Pontos Fortes

| Aspecto | Status |
|---|---|
| RLS em 100% das tabelas | ✅ |
| `SECURITY DEFINER` em funções críticas | ✅ |
| `set search_path = ''` em funções | ✅ (previne SQL injection) |
| `is_super_admin_session()` como gate | ✅ |
| Multi-tenant por empresa_id | ✅ |
| Conexão SSL com banco | ✅ |

### 8.2 ❌ Vulnerabilidades

| Vulnerabilidade | Local | Risco |
|---|---|---|
| `supabase_execute_sql` sem restrição | MCP Server | **CRÍTICO**: DROP DATABASE possível |
| Anon Key exposta no frontend | `client.ts` | Médio (RLS mitiga) |
| Sem validação server-side de payload | Webhooks | Baixo (RLS filtra) |
| Sem rate limiting | Todas as APIs | Médio (abuso possível) |
| Auth trigger não valida empresa_id | `handle_new_user()` | Baixo (apenas cria perfil) |
| Funções sem `COST` definido | Várias RPCs | Performance |

---

## 9. Dependências Backend

### 9.1 PostgreSQL Extensions

| Extensão | Migration | Uso |
|---|---|---|
| `pg_net` | 00016 | HTTP requests assíncronos da Evolution API |
| `pgcrypto` | (built-in) | UUID generation |

### 9.2 NPM Dependencies (MCP Server)

| Pacote | Versão |
|---|---|
| `@modelcontextprotocol/sdk` | ^1.6.1 |
| `pg` | ^8.13.1 |
| `zod` | ^3.23.8 |
| `typescript` | ^5.7.2 |
| `tsx` | ^4.19.2 |

---

## 10. Roadmap de Melhorias Backend

### 🔴 Críticas (deve ser implementado)

1. **Adicionar camada server-side (Edge Functions ou API Route)** — Para operações sensíveis (envio de webhooks, jobs agendados)
2. **Rate limiting via RPC** — Função PL/pgSQL que limita chamadas por IP/usuario/minuto
3. **Webhook retry com backoff exponencial** — Atualmente fire-and-forget sem retry
4. **Proteger MCP Server** — Adicionar validação de comandos destrutivos, logging, autorização

### 🟡 Melhorias de Curto Prazo

5. **Criar índices para queries frequentes** — `idx_funis_tarefas_empresa_status`, `idx_hub_access_logs_data`
6. **Adicionar `deleted_at` (soft delete)** — Em todas as tabelas
7. **Registrar erros no Sentry** — Substituir `console.error` por `captureException`
8. **Criar views RLS-aware** — Views que já aplicam filtro de empresa_id

### 🟢 Melhorias de Médio Prazo

9. **Cache server-side (Redis via Supabase)** — Para dashboards pesados
10. **Background jobs com pg_cron** — Agendar tarefas recorrentes
11. **Audit log completo** — Trigger que registra toda alteração em tabelas core
12. **API Gateway** — Camada de proxy para gerenciar rate limiting e auth centralizada
13. **Edge Functions** — Substituir execução client-side de webhooks por funções serverless

---

## 11. Resumo de Indicadores

| Indicador | Valor |
|---|---|
| Migrações SQL | 73 |
| Funções PL/pgSQL | 8+ |
| RLS Policies | 70+ |
| Tabelas | 45+ |
| Integrações externas | 6 |
| Serviços Core | 3 (webhooks, notificações, atividades) |
| Índices explícitos | ~15 |
| MCP Tools | 4 |
| Action Executors | 1 (api_connector) |
| Eventos configuráveis | 54 |
