# Análise de Funções — Módulo Global (Infraestrutura Compartilhada)

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Quem Utiliza](#2-quem-utiliza)
3. [Quando Utiliza](#3-quando-utiliza)
4. [Como Utiliza](#4-como-utiliza)
5. [O Que Faz](#5-o-que-faz)
6. [Como São Registradas as Definições](#6-como-são-registradas-as-definições)
7. [O Que É Registrado (Dados e Formato)](#7-o-que-é-registrado-dados-e-formato)
8. [Onde São Registradas as Definições (Banco de Dados)](#8-onde-são-registradas-as-definições-banco-de-dados)

---

## 1. Visão Geral

O **Módulo Global** não é um módulo de negócio — é a **infraestrutura compartilhada** do ERP Conexão. Engloba todos os serviços, tabelas e funcionalidades que são transversais a todos os módulos e não pertencem a nenhum módulo específico.

**Categoria:** Infraestrutura / Core / Serviços Compartilhados

**Funções principais:**
- **Autenticação e Perfil:** Login, 2FA, gerenciamento de perfil do usuário
- **Permissões:** Sistema de permissões granulares e módulos de acesso
- **Notificações:** Notificações internas da plataforma
- **Webhooks:** Disparo de webhooks para endpoints externos
- **Atividades:** Log de atividades do sistema
- **Auditoria:** Logs de transferência e rastreamento
- **Documentos:** Upload e gerenciamento de documentos
- **Credenciais:** Gestão de credenciais de acesso
- **Form Schema:** Schema dinâmico de formulários (legado)
- **Integrações:** Configurações de integrações nativas
- **API Connectors:** Conectores de API externa
- **App Config:** Configurações globais da aplicação
- **Hub (Admin Global):** Super Admin pode gerenciar conteúdo do Hub globalmente
- **NPS (Admin Global):** Super Admin pode gerenciar pesquisas NPS globalmente
- **Laboratório:** Ambiente de testes/experimentos
- **Demos:** Gerenciamento de demonstrações

**Nota:** O módulo Global não possui um `module.ts` próprio no `src/features/` — sua definição é descentralizada em serviços, providers, e hooks espalhados pela aplicação.

---

## 2. Quem Utiliza

| Perfil | O Que Pode Fazer |
|---|---|
| **Super Admin** | Acesso total às rotas globais (`/global/*`): gerenciar NPS global, Hub global, laboratório, demos |
| **Admin de Empresa** | Gerenciar notificações, webhooks, documentos (da própria empresa) |
| **Consultor/Usuário** | Ver notificações próprias, gerenciar perfil, acessar documentos |
| **Sistema (automático)** | Registrar atividades, disparar notificações, trigger webhooks |

---

## 3. Quando Utiliza

| Momento | Função |
|---|---|
| **Login/Autenticação** | AuthProvider valida sessão, carrega profile |
| **Toda operação CRUD** | RLS policies verificam permissões e empresa_id |
| **Ações importantes** | Sistema registra atividade em `atividades` |
| **Eventos do sistema** | Notificações são disparadas para usuários |
| **Ações externas** | Webhooks são disparados para URLs configuradas |
| **Configuração inicial** | App Config define parâmetros globais |
| **Primeiro acesso** | Cadastro de usuário cria profile e permissões padrão |
| **Auditoria** | Transferências de clientes/consultores são registradas |

---

## 4. Como Utiliza

### 4.1 Autenticação e Perfil (`src/core/auth/`)

**AuthProvider:**
- Gerencia estado de autenticação via `supabase.auth`
- Carrega `profile` do usuário (incluindo `empresa_id`, `is_super_admin`, `role`)
- Expõe `user`, `profile`, `empresa`, `signIn()`, `signOut()` via contexto

**Rotas de autenticação:**
- `/auth/login` — Login
- `/auth/cadastro` — Cadastro inicial

### 4.2 Perfil do Usuário (`profiles`)

- Criado automaticamente por trigger `handle_new_user()` ao criar user no Auth
- Campos: `id`, `email`, `nome`, `empresa_id`, `is_super_admin`, `role`, `ambiente`, `ativo`, `celular`
- RLS: usuário vê apenas seu próprio perfil (ou super admin vê todos)

### 4.3 Permissões (`src/core/permissions/`)

**Registry:**
- `registerPermission(def)` — Registra definição de permissão
- `registerPermissionDefaults(moduleKey, defaults)` — Permissões padrão por ambiente

**Services:**
- `getPermissoes(userId)` — Busca permissões do usuário
- `setPermissoes(userId, permissoes)` — Salva permissões
- `getPermissoesPadrao(ambiente)` — Retorna permissões padrão para um ambiente
- `getModulosAcesso(userId)` — Busca módulos de acesso
- `setModulosAcesso(userId, modulos)` — Salva módulos de acesso

**UI (via rotas):**
- `/global/permissoes` — Super Admin gerencia permissões de todos
- `/empresa/permissoes` — Admin gerencia permissões da empresa

### 4.4 Notificações (`src/core/services/notificacoes.ts`)

- `listarNotificacoes(empresaId)` — Lista notificações da empresa
- `criarNotificacao(input)` — Cria notificação
- `marcarComoLida(id)` — Marca notificação como lida
- Templates em `notificacoes_templates`

### 4.5 Webhooks (`src/core/services/webhooks.ts`)

- `listarWebhooks(empresaId)` — Lista webhooks configurados
- `criarWebhook(input)` — Cria webhook
- `atualizarWebhook(id, input)` — Atualiza webhook
- `toggleWebhook(id, ativo)` — Ativa/desativa
- `deletarWebhook(id)` — Remove webhook
- `executarWebhook(webhookId, payload)` — Dispara webhook
- Logs em `webhook_logs`

### 4.6 Atividades (`src/core/services/atividades.ts`)

- `registrarAtividade(input)` — Registra log de atividade
- `listarAtividades(empresaId, filters)` — Lista com paginação e filtros
- Registra automaticamente ações importantes do sistema

### 4.7 Documentos (`src/features/documentos/`)

- Upload, listagem, visualização de documentos
- Vinculados a cadastros
- Armazenados no storage Supabase

### 4.8 Credenciais (`src/features/credenciais/`)

- CRUD de credenciais vinculadas a empresas
- Controle de ativo/inativo
- `listarCredenciaisPorEmpresa(empresaId)`, `criarCredencial(input)`, `atualizarCredencial(id, input)`, `toggleCredencial(id, ativo)`, `deletarCredencial(id)`

### 4.9 Form Schema (`src/features/form-schema/`) — Legado

- Schema dinâmico para formulários customizáveis por empresa
- `form_schema` tabela com JSONB de definição
- Usado pelo módulo Cadastros (legado)

### 4.10 Integrações (`src/features/integracoes/`)

- `integracoes_config` — Configurações de integrações nativas
- API connectors para integração com serviços externos

### 4.11 App Config (`app_config`)

- Configurações globais da aplicação
- Gerencia parâmetros como: `permitir_cadastro_sem_empresa`, `modulos_padrao`, etc.

### 4.12 API Connectors (`src/features/api-connectors/`)

- Conectores para APIs externas
- Configuração de endpoints, headers, autenticação

### 4.13 Rotas Globais (Super Admin)

| Rota | Componente | Função |
|---|---|---|
| `/global/acoes` | ? | Ações globais |
| `/global/banco` | ? | Banco de dados global |
| `/global/demos` | ? | Gerenciamento de demos |
| `/global/design` | `GlobalDesignPage` | Design System global |
| `/global/empresas` | `AdminSuperEmpresas` | Lista de empresas |
| `/global/empresas/$id` | ? | Editar empresa |
| `/global/hub` | ? | Gestão global do Hub |
| `/global/integracoes` | ? | Integrações globais |
| `/global/laboratorio` | ? | Laboratório/testes |
| `/global/limits` | `GlobalLimitsPage` | Limites por módulo |
| `/global/modulos` | `AdminSuperModulos` | Lista de módulos |
| `/global/modulos/$key` | ? | Detalhes de módulo |
| `/global/nps` | ? | NPS Global |
| `/global/permissoes` | `AdminSuperPermissoes` | Permissões globais |
| `/global/testes` | ? | Testes |

---

## 5. O Que Faz

### Funções de Autenticação

| Função | Descrição |
|---|---|
| **Login** | Autentica usuário via email/senha com Supabase Auth |
| **Logout** | Encerra sessão |
| **Cadastro** | Cria novo usuário com trigger automático para criar profile |
| **2FA** | Autenticação de dois fatores (RPCs em `00015_2fa_rpcs.sql`) |
| **Recuperar Senha** | Fluxo de reset de senha via Supabase Auth |

### Funções de Permissões

| Função | Descrição |
|---|---|
| **Registrar Definição** | `registerPermission()` no registry |
| **Registrar Defaults** | `registerPermissionDefaults()` por ambiente |
| **Carregar Permissões** | Busca do banco via `getPermissoes()` |
| **Salvar Permissões** | Persiste no banco via `setPermissoes()` |
| **Carregar Módulos Acesso** | `getModulosAcesso()` |
| **Salvar Módulos Acesso** | `setModulosAcesso()` |
| **Restaurar Padrões** | `getPermissoesPadrao(ambiente)` |

### Funções de Notificação

| Função | Descrição |
|---|---|
| **Listar** | `listarNotificacoes(empresaId)` com filtros |
| **Criar** | `criarNotificacao({ usuario_id, titulo, mensagem, tipo, ... })` |
| **Marcar Lida** | `marcarComoLida(id)` |
| **Marcar Todas Lidas** | Marca todas notificações do usuário como lidas |
| **Excluir** | Delete de notificação individual |

### Funções de Webhook

| Função | Descrição |
|---|---|
| **Listar** | `listarWebhooks(empresaId)` |
| **Criar** | `criarWebhook({ nome, url, eventos, metodo, headers })` |
| **Atualizar** | `atualizarWebhook(id, input)` |
| **Ativar/Desativar** | `toggleWebhook(id, ativo)` |
| **Deletar** | `deletarWebhook(id)` |
| **Executar** | `executarWebhook(webhookId, payload)` — dispara requisição HTTP |
| **Logs** | Visualizar histórico de execuções em `webhook_logs` |

### Funções de Atividade

| Função | Descrição |
|---|---|
| **Registrar** | `registrarAtividade({ empresa_id, usuario_id, acao, entidade, entidade_id, ... })` |
| **Listar** | `listarAtividades(empresaId, { page, limit, filters })` |

### Funções de Documento

| Função | Descrição |
|---|---|
| **Upload** | Upload de arquivo para storage + registro em `documentos` |
| **Listar** | Lista documentos por empresa/cadastro |
| **Visualizar** | Retorna URL pública do documento |
| **Deletar** | Remove documento e arquivo do storage |

### Funções de Credencial

| Função | Descrição |
|---|---|
| **Listar por Empresa** | `listarCredenciaisPorEmpresa(empresaId)` |
| **Criar** | `criarCredencial({ nome_completo, email_corporativo, whatsapp_corporativo, empresa_id })` |
| **Atualizar** | `atualizarCredencial(id, input)` |
| **Ativar/Desativar** | `toggleCredencial(id, ativo)` |
| **Deletar** | `deletarCredencial(id)` |

### Funções de Form Schema (Legado)

| Função | Descrição |
|---|---|
| **Carregar Schema** | Busca schema JSONB da empresa |
| **Salvar Schema** | Persiste schema customizado |
| **Aplicar Schema** | Renderiza formulário dinâmico baseado no schema |

### Funções de Integração

| Função | Descrição |
|---|---|
| **Configurar** | Salva configuração de integração nativa |
| **Testar Conexão** | Testa conectividade com serviço externo |
| **Sincronizar** | Dispara sincronização de dados |

---

## 6. Como São Registradas as Definições

Diferente dos módulos de negócio, o **Módulo Global não possui um `module.ts`** — suas definições são registradas de forma descentralizada:

### Registry de Permissões

Em `src/core/permissions/constants.ts`:
```typescript
// Permissões são registradas via registerPermission() por cada módulo
// Exemplo no módulo Cadastros:
registerPermission({
  key: "aprovar_cadastro",
  label: "Aprovar Cadastro",
  description: "Permite aprovar cadastros pendentes",
  group: "Ações de Cadastro",
})
```

### Registry de Módulos

Em `src/registry/index.ts`:
```typescript
// Módulos de negócio são registrados via registerModule()
// Infraestrutura global não tem module.ts próprio
```

### Services

Em `src/core/services/`:
```typescript
// Serviços são registrados como módulos ES e importados onde necessário
export async function listarNotificacoes(empresaId: string): Promise<Notificacao[]>
```

### Tabelas

Todas as tabelas de infraestrutura são criadas via migrations SQL independentes:
- `00001_profiles.sql`
- `00002_tables.sql` (atividades)
- `00005_legacy.sql` (documentos, credenciais)
- `00006_admin.sql` (webhooks, mock_credentials, app_config)
- `00008_rls_blindagem.sql`
- `00010_permissoes.sql`
- `00014_notifications_and_expiry.sql` (notificacoes, notificacoes_templates)
- `00016_integracoes_nativas.sql` (integracoes_config)
- `00018_form_schema.sql`

---

## 7. O Que É Registrado (Dados e Formato)

### Profile do Usuário
```typescript
{
  id: string;               // UUID (mesmo do auth.users)
  email: string;
  nome: string;
  empresa_id?: string;       // FK → empresas.id
  is_super_admin: boolean;
  role?: string;             // admin, editor, viewer
  ambiente?: string;         // Vendas, Administrativo, etc.
  ativo?: boolean;
  celular?: string;
}
```

### Permissão (`PermissionDefinition`)
```typescript
{
  key: string;              // "aprovar_cadastro"
  label: string;            // "Aprovar Cadastro"
  description: string;      // "Permite aprovar cadastros pendentes"
  group: string;            // "Ações de Cadastro"
}
```

### Permissões do Usuário (`Permissoes` — JSONB)
```typescript
{
  ver_todos_cadastros: boolean,
  aprovar_cadastro: boolean,
  reprovar_cadastro: boolean,
  solicitar_correcao_cadastro: boolean,
  aprovar_documento: boolean,
  reprovar_documento: boolean,
  // ... +20 permissões
}
```

### Módulos de Acesso (`ModulosAcesso` — JSONB)
```typescript
{
  "cadastros": {
    acessar: boolean,
    paginas: string[],       // IDs dos nav items
    acoes: string[]          // Chaves de permissão
  },
  "nps": { acessar, paginas, acoes },
  // ... por módulo
}
```

### Notificação
```typescript
{
  id: string;
  usuario_id: string;
  empresa_id: string;
  titulo: string;
  mensagem: string;
  tipo: string;              // "info", "warning", "success", "error"
  lida: boolean;
  link?: string;             // URL ao clicar na notificação
  created_at: string;
}
```

### Webhook
```typescript
{
  id: string;
  empresa_id: string;
  nome: string;
  url: string;
  metodo: string;            // "POST", "PUT", "PATCH"
  headers: Record<string, string>;
  eventos: string[];         // "cadastro.criado", "cadastro.aprovado", etc.
  ativo: boolean;
}
```

### Atividade
```typescript
{
  id: string;
  empresa_id: string;
  usuario_id: string;
  acao: string;              // "create", "update", "delete", "approve"
  entidade: string;          // "cadastros", "documentos"
  entidade_id: string;
  descricao: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}
```

### Documento
```typescript
{
  id: string;
  empresa_id: string;
  cadastro_id: string;
  nome: string;
  tipo: string;
  url: string;
  tamanho: number;
  created_at: string;
}
```

### Credencial
```typescript
{
  id: string;
  empresa_id: string;
  nome_completo: string;
  email_corporativo: string;
  whatsapp_corporativo?: string;
  departamento?: string;
  ativo: boolean;
  created_at: string;
}
```

---

## 8. Onde São Registradas as Definições (Banco de Dados)

### Tabelas de Infraestrutura

| Tabela | Migration | Descrição |
|---|---|---|
| `profiles` | `00001` | Perfil do usuário (estende auth.users) |
| `permissoes` | `00010` | Permissões JSONB + modulos_acesso JSONB por usuário |
| `atividades` | `00002` | Log de atividades do sistema |
| `notificacoes` | `00014` | Notificações internas |
| `notificacoes_templates` | `00014` | Templates de notificação |
| `webhooks` | `00006` | Webhooks configurados |
| `webhook_logs` | `00006` | Logs de execução de webhooks |
| `documentos` | `00005` | Documentos vinculados a cadastros |
| `credenciais` | `00005` | Credenciais de acesso |
| `app_config` | `00006`/`2026...` | Configurações globais da aplicação |
| `mock_credentials` | `00006` | Credenciais mock para testes |
| `integracoes_config` | `00016` | Configurações de integrações nativas |
| `form_schema` | `00018` | Schema dinâmico de formulários |

### Tabelas de Auditoria

| Tabela | Migration | Descrição |
|---|---|---|
| `logs_transferencia` | `2026...` | Logs de transferência de clientes |
| `logs_transferencia_consultor` | `2026...` | Logs de transferência de consultores |

### Tabelas Legadas/Removidas

| Tabela | Observação |
|---|---|
| `enderecos` | Migrada para `cadastros_enderecos` |
| `auditoria` | Substituída por `atividades` |

### Funções RPC

| Função | Descrição |
|---|---|
| `get_current_empresa_id()` | Retorna empresa_id do usuário logado |
| `is_super_admin_session()` | Verifica se é super admin |
| `get_user_permissoes(p_user_id)` | Retorna permissões do usuário |
| `set_user_permissoes(p_user_id, p_permissoes)` | Define permissões |
| `admin_criar_usuario(...)` | Cria usuário auth |
| `admin_atualizar_senha(...)` | Altera senha |
| `admin_deletar_usuario(...)` | Remove usuário |

### Views

| View | Descrição |
|---|---|
| `clientes` | View que join `cadastros` com status aprovado + dados PF/PJ |

### Totais

- **14 categorias de tabelas** de infraestrutura
- **17+ RPCs** de suporte
- **4 triggers** (criação de profile, logs automáticos)
- **5 views** de dados agregados
- **20+ migrações** relacionadas
- **15 rotas globais** (`/global/*`)
- **~60 arquivos de código** entre core services, features, e registry
