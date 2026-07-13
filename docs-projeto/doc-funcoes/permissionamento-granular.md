# Análise do Permissionamento Granular

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Quem Realiza o Permissionamento?](#2-quem-realiza-o-permissionamento)
3. [Quando Permissiona?](#3-quando-permissiona)
4. [Como Permissiona?](#4-como-permissiona)
5. [O Que É Permissionado?](#5-o-que-é-permissionado)
6. [Como São Registradas as Definições?](#6-como-são-registradas-as-definições)
7. [Dados e Formato das Definições](#7-dados-e-formato-das-definições)
8. [Onde São Registradas (Banco de Dados)?](#8-onde-são-registradas-banco-de-dados)

---

## 1. Visão Geral

O ERP Conexão possui um sistema de **permissionamento granular** em **3 camadas**, combinando controle em nível de banco (RLS), frontend (registry + nav-items) e interface do usuário (páginas de permissão).

### Arquitetura em Camadas

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CAMADA 1 — BANCO (RLS)                       │
│                                                                     │
│  is_super_admin_session()    → Super Admin vê/edita tudo            │
│  get_current_empresa_id()    → Multi-tenancy por empresa            │
│  is_admin_or_super()         → Admin da empresa + Super Admin       │
│  permissoes JSONB            → Permissões granulares por usuário    │
└─────────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────────┐
│                     CAMADA 2 — REGISTRY (Código)                    │
│                                                                     │
│  registerPermission()       → Define permissão (key, label, desc)   │
│  registerPermissionDefaults() → Defaults por ambiente               │
│  registerNavItem()          → Vincula permissão a item de navegação │
│  permissionCheck()          → Função que valida permissão no front  │
└─────────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────────┐
│                    CAMADA 3 — UI (Administração)                    │
│                                                                     │
│  /empresa/permissoes        → Admin de empresa gerencia permissões  │
│  /global/permissoes         → Super Admin gerencia globalmente      │
│  Toggle switches            → Ativa/desativa módulos, páginas, ações│
│  Salva no Supabase          → Persiste em permissoes (JSONB)        │
└─────────────────────────────────────────────────────────────────────┘
```

### Hierarquia de Acesso

```
Super Admin (is_super_admin = true)
  ├── Acesso TOTAL a todos os módulos e dados (bypassa RLS e permissões)
  ├── Gerencia permissões de qualquer empresa
  └── Gerencia permissões via /global/permissoes

Admin de Empresa (role = admin, empresa_id vinculado)
  ├── Gerencia permissões dos usuários da própria empresa
  ├── Só vê usuários da sua empresa (não vê super admins)
  └── Gerencia permissões via /empresa/permissoes

Usuário Comum (role = editor/viewer)
  ├── Tem permissões definidas por ambiente + overrides
  ├── Acesso validado via permissoes JSONB + modulos_acesso
  └── Só enxerga o que suas permissões permitem
```

---

## 2. Quem Realiza o Permissionamento?

### 2.1 Super Admin (Nível Global)

**Quem é**: Usuário com `profiles.is_super_admin = true`

**O que pode fazer**:
- Acessa `/global/permissoes` — visão de todas as empresas
- Define permissões para qualquer usuário de qualquer empresa
- Cria/edita/exclui credenciais de qualquer empresa
- Altera preset global do design system
- Altera limites de módulos por empresa
- **Super Admin tem TODAS as permissões automaticamente** — não precisa de registro na tabela `permissoes`

**Código** (`services.ts`):
```typescript
if (isSuperAdmin) {
  return {
    ver_todos_cadastros: true,
    aprovar_cadastro: true,
    // ... todas as permissões true
  };
}
```

### 2.2 Admin de Empresa

**Quem é**: Usuário com `profile.empresa_id` preenchido e sem `is_super_admin`

**O que pode fazer**:
- Acessa `/empresa/permissoes`
- Gerencia permissões apenas dos usuários **da sua empresa**
- Filtra usuários por `empresa_id`
- Não vê nem pode alterar Super Admins
- Só gerencia permissões no escopo da sua empresa

### 2.3 Sistema (Automático)

**Quem é**: Triggers e funções do banco de dados

**O que faz**:
- Trigger `on_profile_created_permissoes` — ao criar profile, insere permissões padrão
- Função `get_permissoes_padrao(amb)` — retorna defaults com base no `ambiente`
- Trigger de RLS — aplica políticas automaticamente em cada query ao banco

---

## 3. Quando Permissiona?

### 3.1 No Momento da Criação do Usuário

```sql
-- Trigger automático ao criar perfil
CREATE OR REPLACE TRIGGER on_profile_created_permissoes
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_profile_permissoes();
```

- Imediatamente após criar um `profile`, o trigger insere na tabela `permissoes`
- Usa `get_permissoes_padrao()` baseado no `ambiente` do perfil
- Cobertura retroativa via seed na migration 00010

### 3.2 Manualmente pelo Admin

**Página `/empresa/permissoes`**:

1. Admin acessa a página de permissões
2. Seleciona um usuário da lista
3. Expande o painel do usuário
4. Ativa/desativa módulos, páginas e ações via toggle switches
5. Clica em **Salvar** → persiste no Supabase

**Página `/global/permissoes`** (Super Admin):

- Mesmo fluxo, mas com filtro por empresa
- Pode gerenciar permissões de qualquer empresa

### 3.3 No Login / Recarregamento

No `AuthProvider`, ao fazer login ou recarregar a página:

```typescript
// Se for Super Admin — todas as permissões true
if (p.is_super_admin) {
  const allPerms = {};
  for (const key of getAllPermissionKeys()) {
    allPerms[key] = true;
  }
  setPermissoes(allPerms);
}
// Se não — carrega do banco
else {
  const { data } = await supabase
    .from("permissoes")
    .select("permissoes, modulos_acesso")
    .eq("usuario_id", userId)
    .maybeSingle();
}
```

### 3.4 Em Cada Requisição ao Banco (RLS)

Toda query SQL passa por RLS policies que verificam:
- `is_super_admin_session()` — se é super admin, libera tudo
- `get_current_empresa_id()` — se a empresa do registro bate com a do usuário

---

## 4. Como Permissiona?

### 4.1 Fluxo Completo

```
Admin entra em /empresa/permissoes
    ↓
Carrega profiles (filtrados por empresa_id)
    ↓
Carrega permissoes + modulos_acesso da tabela
    ↓
Exibe árvore: Módulo > Páginas > Ações
    ↓
Admin alterna toggles
    ↓
Estado "dirty" marcado (botão Salvar aparece)
    ↓
Admin clica Salvar
    ↓
setPermissoes(userId, permissoes)    → upsert na tabela permissoes
setModulosAcesso(userId, modulos)    → upsert na tabela permissoes
    ↓
AuthProvider.refreshPermissoes()     → recarrega no frontend
```

### 4.2 Estrutura de Toggles

**Toggle de Módulo** (nível 1):
- Ativa/desativa o módulo inteiro
- Quando ativa, libera **todas** as páginas + ações por padrão
- Quando desativa, limpa páginas e ações

**Toggle de Página** (nível 2):
- Visível apenas se módulo estiver ativo
- Cada nav-item do módulo vira uma página
- Ativa/desativa páginas individualmente

**Toggle de Ação** (nível 3):
- Visível apenas se módulo estiver ativo
- Cada permissão registrada vira uma ação
- Ativa/desativa ações individualmente
- Agrupado por `group` da permissão

### 4.3 Verificação no Frontend

```typescript
// NavItem tem uma função permissionCheck
registerNavItem({
  id: "nps-dashboard",
  label: "Dashboard NPS",
  to: "/nps/dashboard",
  permissionCheck: (perms) => perms?.nps_ver_dashboard === true,
  // ...
});

// Filtragem na navegação
getNavItems(perms)  // Filtra itens baseado nas permissões do usuário
```

### 4.4 Mecanismo de Resolução de Conflitos

No `AuthProvider`, as permissões são **mescladas**:

```typescript
// 1. Carrega permissoes flat da tabela
const flatPerms = { ...((data?.permissoes) || {}) };

// 2. Se há modulos_acesso, mescla ações no flat
if (modulosAcc) {
  for (const [, modulo] of Object.entries(modulosAcc)) {
    if (modulo?.acessar && Array.isArray(modulo.acoes)) {
      for (const acao of modulo.acoes) {
        flatPerms[acao] = true;   // ← sobreescreve
      }
    }
  }
}
```

---

## 5. O Que É Permissionado?

### 5.1 Nível Módulo

Cada módulo do sistema pode ser ativado/desativado individualmente:

| Módulo | Key | Ambientes |
|---|---|---|
| Cadastros | `cadastros` | cadastro, consultor, tecnologia, suporte |
| NPS | `nps` | cadastro, consultor, tecnologia, suporte |
| Mapas | `mapas-interativos` | cadastro, consultor |
| LinkTree | `linktree` | cadastro, consultor, tecnologia, suporte |
| Gerador Links | `gerador-links` | cadastro, tecnologia |
| Rotas | `rotas` | cadastro, consultor, tecnologia |
| Despesas | `despesas` | cadastro, consultor, tecnologia, suporte |
| CRM | `crm` | cadastro, consultor, tecnologia |
| Funis | `funis` | cadastro, consultor, tecnologia |
| Hub | `hub` | cadastro, consultor, tecnologia |
| Marketing (dashboard) | `mktg-dashboard` | cadastro, tecnologia |
| Marketing (submódulos) | `mktg-*` | cadastro, tecnologia |
| Empresa | `empresas` | (sem restrição) |

### 5.2 Nível Página

Cada nav-item (item de menu lateral) vira uma página permissionável:

```typescript
// Exemplo: módulo NPS
/empresa/nps/design          → Página "Design NPS"
/nps/dashboard               → Página "Dashboard NPS"
/nps/pesquisas               → Página "Gerenciar Perguntas"
/nps/relatorios              → Página "Relatórios Envio"
/nps/preview                 → Página "Preview da Pesquisa"
```

### 5.3 Nível Ação (Permissões Granulares)

**~100 permissões** registradas em todo o sistema. Agrupadas por módulo:

#### Cadastros (17 permissões)
| Key | Grupo | Descrição |
|---|---|---|
| `ver_todos_cadastros` | Escopo de Dados | Ver todos os cadastros da empresa |
| `ver_relatorios` | Visualização | Acessar relatórios |
| `visualizar_documento` | Visualização | Abrir arquivos de documentos |
| `aprovar_cadastro` | Aprovação | Aprovar cadastros |
| `reprovar_cadastro` | Aprovação | Reprovar cadastros |
| `solicitar_correcao_cadastro` | Aprovação | Solicitar correção |
| `aprovar_documento` | Documentos | Aprovar documentos |
| `reprovar_documento` | Documentos | Reprovar documentos |
| `solicitar_correcao_documento` | Documentos | Solicitar correção |
| `aprovar_campo` | Campos | Aprovar campos individuais |
| `reprovar_campo` | Campos | Reprovar campos |
| `solicitar_correcao_campo` | Campos | Solicitar correção |
| `gerenciar_credenciais` | Credenciais | Ver e ativar/inativar |
| `gerenciar_credenciais_admin` | Credenciais | Criar/editar/deletar |
| `excluir_cadastro` | Administração | Excluir cadastros |
| `gerenciar_config` | Administração | Configurações do sistema |
| `gerar_links` | Links | Gerar links de cadastro |

#### NPS (7 permissões)
`nps_ver_dashboard`, `nps_ver_respostas`, `nps_gerenciar_perguntas`, `nps_gerenciar_webhooks`, `nps_excluir_respostas`, `nps_ver_relatorios`, `nps_exportar_dados`

#### CRM (10 permissões)
`crm_dashboard`, `crm_carteira`, `crm_pipeline`, `crm_tarefas`, `crm_cliente_detalhe`, `crm_equipe`, `crm_metricas`, `crm_bi`, `crm_transferencia`, `crm_diretoria`

#### Funis (18 permissões — maior conjunto)
`funis_ver_dashboard`, `funis_criar_funil`, `funis_editar_funil`, `funis_excluir_funil`, `funis_gerir_colunas`, `funis_gerir_tarefas`, `funis_compartilhar`, `funis_ver_relatorios`, `funis_ver_comentarios`, `funis_adicionar_comentario`, `funis_ver_anexos`, `funis_adicionar_anexo`, `funis_gerir_labels`, `funis_ver_atividade`, `funis_criar_template`, `funis_gerir_automacoes`, `funis_exportar_dados`, `funis_acoes_massa`

#### Hub (28 permissões — maior em quantidade)
`hub_ver_materiais`, `hub_criar_material`, `hub_editar_material`, `hub_excluir_material`, `hub_gerenciar_assets`, `hub_publicar_material`, `hub_ver_acessos_material`, `hub_exportar_materiais`, `hub_ver_trilhas`, `hub_criar_trilha`, `hub_editar_trilha`, `hub_excluir_trilha`, `hub_gerenciar_itens_trilha`, `hub_compartilhar_trilha`, `hub_ver_ranking`, `hub_gerenciar_badges`, `hub_gerenciar_niveis`, `hub_ver_conquistas`, `hub_ver_usuarios`, `hub_editar_usuario`, `hub_aprovar_usuario`, `hub_gerenciar_convites`, `hub_ver_analytics`, `hub_gerenciar_config`, `hub_gerenciar_integracoes`, `hub_gerenciar_chatbot`, `hub_gerenciar_webhooks_hub`

#### Demais módulos
| Módulo | Permissões |
|---|---|
| Mapas | 5 |
| LinkTree | 13 |
| Gerador Links | 6 |
| Rotas | 6 |
| Despesas | 8 |
| Marketing (submódulos) | ~9 (1 por submódulo) |

---

## 6. Como São Registradas as Definições?

### 6.1 Registro em Código (Registry)

Cada módulo define suas permissões em `src/features/<modulo>/permissions.ts`:

```typescript
// Exemplo: src/features/nps/permissions.ts
export const NPS_PERMISSIONS = [
  {
    key: "nps_ver_dashboard" as const,
    label: "Ver dashboard NPS",
    description: "Visualizar painel analítico de NPS",
    group: "NPS",
  },
  // ...
];
```

Depois, no `module.ts`, as permissões são registradas:

```typescript
// src/features/nps/module.ts
setup: () => {
  // 1. Registra cada permissão no registry global
  for (const p of NPS_PERMISSIONS) {
    registerPermission({
      key: p.key,
      label: p.label,
      description: p.description,
      group: p.group,
    });
  }
  
  // 2. Registra defaults por ambiente
  registerPermissionDefaults("nps", {
    cadastro: {
      nps_ver_dashboard: true,
      nps_ver_respostas: true,
      // ...
    },
    consultor: {
      nps_ver_dashboard: false,
      // ...
    },
  });
  
  // 3. Registra nav-items com permissionCheck
  registerNavItem({
    id: "nps-dashboard",
    label: "Dashboard NPS",
    to: "/nps/dashboard",
    permissionCheck: (perms) => perms?.nps_ver_dashboard === true,
    // ...
  });
}
```

### 6.2 Registry Central

Em `src/registry/`, 3 registries mantêm as definições em memória:

#### Permissions Registry (`permissions-registry.ts`)
```typescript
const permissionsRegistry = new Map<string, PermissionDefinition>();

function registerPermission(def: PermissionDefinition): void {
  if (permissionsRegistry.has(def.key)) return;  // Ignora duplicatas
  permissionsRegistry.set(def.key, def);
}
```

#### Defaults Registry (`defaults.ts`)
```typescript
const defaultsRegistry = new Map<string, PermissionDefaults>();
// PermissionDefaults = Record<string, Record<string, boolean>>
//   móduloKey → ambiente → { permissão: true/false }

function registerPermissionDefaults(moduleKey, defaults) { ... }
function getMergedDefaults(ambiente): Record<string, boolean> {
  // Mescla defaults de todos os módulos para um ambiente
}
```

#### Nav Items Registry (`nav-items.ts`)
```typescript
const items = new Map<string, NavItemRegistration>();

type NavItemRegistration = {
  id: string;
  label: string;
  icon: LucideIcon;
  to: string;
  permissionCheck: (perms: Record<string, boolean> | null) => boolean;
  order: number;
  moduloKey?: string;
};
```

### 6.3 Registro no Banco (Trigger)

Na migration `00010_permissoes.sql`:

```sql
-- Trigger que insere permissões padrão ao criar profile
CREATE OR REPLACE FUNCTION public.handle_new_profile_permissoes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.permissoes (usuario_id, permissoes, updated_by)
  VALUES (
    NEW.id,
    public.get_permissoes_padrao(COALESCE(NEW.ambiente, 'ambos')),
    NEW.id
  )
  ON CONFLICT (usuario_id) DO NOTHING;
  RETURN NEW;
END;
$$;
```

---

## 7. Dados e Formato das Definições

### 7.1 Formato TypeScript

#### PermissionDefinition (Registry)
```typescript
type PermissionDefinition = {
  key: string;           // Identificador único (ex: "nps_ver_dashboard")
  label: string;         // Rótulo visível na UI (ex: "Ver dashboard NPS")
  description: string;   // Descrição explicativa
  group: string;         // Grupo de agrupamento (ex: "NPS", "Aprovação de Cadastro")
};
```

#### PermissionDefaults (Defaults por Ambiente)
```typescript
type PermissionDefaults = Record<string, Record<string, boolean>>;
// {
//   "cadastro":    { "nps_ver_dashboard": true, "nps_ver_respostas": true, ... },
//   "consultor":   { "nps_ver_dashboard": false, ... },
//   "tecnologia":  { ... },
//   "suporte":     { ... }
// }
```

#### NavItemRegistration
```typescript
type NavItemRegistration = {
  id: string;                                                   // Identificador do item
  label: string;                                                // Label no menu
  icon: LucideIcon;                                             // Ícone
  to: string;                                                   // Rota
  permissionCheck: (perms: Record<string, boolean> | null) => boolean;  // Função de validação
  order: number;                                                // Ordem no menu
  moduloKey?: string;                                           // Módulo dono
  matchPaths?: string[];                                        // Rotas que ativam este item
  noChildMatch?: boolean;                                       // Se desabilita match de filhos
};
```

#### ModulosAcesso (Persistência no Banco)
```typescript
type ModuloAcesso = {
  acessar: boolean;       // Se o módulo está liberado
  paginas: string[];      // IDs dos nav-items liberados
  acoes: string[];        // Keys das permissões liberadas
};

type ModulosAcesso = Record<string, ModuloAcesso>;
// {
//   "nps": { acessar: true, paginas: ["nps-dashboard"], acoes: ["nps_ver_dashboard"] },
//   "funis": { acessar: false, paginas: [], acoes: [] }
// }
```

### 7.2 Formato no Banco (JSONB)

```json
{
  "permissoes": {
    "ver_todos_cadastros": false,
    "nps_ver_dashboard": true,
    "nps_ver_respostas": true,
    "funis_ver_dashboard": false,
    ...
  },
  "modulos_acesso": {
    "nps": {
      "acessar": true,
      "paginas": ["nps-dashboard", "nps-pesquisas"],
      "acoes": ["nps_ver_dashboard", "nps_gerenciar_perguntas"]
    },
    "cadastros": {
      "acessar": true,
      "paginas": ["cadastros", "consultores"],
      "acoes": ["ver_todos_cadastros", "aprovar_cadastro"]
    }
  }
}
```

---

## 8. Onde São Registradas (Banco de Dados)?

### 8.1 Tabela: `public.permissoes`

```sql
CREATE TABLE IF NOT EXISTS public.permissoes (
  usuario_id  UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  permissoes  JSONB NOT NULL DEFAULT '{}'::jsonb,       -- Flat permissões
  modulos_acesso JSONB,                                   -- Acesso hierárquico por módulo
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  updated_by  UUID REFERENCES auth.users(id)
);
```

**RLS Policies**:
```sql
-- Super Admin: acesso total
CREATE POLICY "Super admin pode tudo permissoes"
  ON public.permissoes FOR ALL TO authenticated
  USING (is_super_admin_session())
  WITH CHECK (is_super_admin_session());

-- Usuário comum: vê apenas a própria
CREATE POLICY "Usuário vê própria permissão"
  ON public.permissoes FOR SELECT TO authenticated
  USING (auth.uid() = usuario_id);
```

### 8.2 Tabela: `public.profiles`

Colunas relevantes para permissão:

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID PK | Identificador do usuário |
| `email` | TEXT | Email de login |
| `nome` | TEXT | Nome completo |
| `ambiente` | TEXT | `cadastro`, `consultor`, `tecnologia`, `suporte`, `ambos` |
| `is_super_admin` | BOOLEAN | Se é super admin (bypassa RLS) |
| `empresa_id` | UUID | FK para `empresas.id` (multi-tenancy) |
| `role` | TEXT | `admin`, `editor`, `viewer` |
| `ativo` | BOOLEAN | Se a credencial está ativa |

### 8.3 Funções do Banco

#### `get_permissoes_padrao(amb TEXT) RETURNS JSONB`

Retorna o objeto de permissões padrão baseado no ambiente:
- **consultor**: Só `gerar_links` e `ver_relatorios` = true
- **cadastro**: Maioria true, exceto ações destrutivas
- **tecnologia**: Foco em `gerenciar_credenciais` e `gerenciar_credenciais_admin`
- **suporte**: Só `gerenciar_credenciais` = true
- **ambos/outros**: Full access (exceto exclusão)

#### `handle_new_profile_permissoes() RETURNS TRIGGER`

Trigger `AFTER INSERT ON profiles` que insere permissões padrão.

#### `is_super_admin_session() RETURNS BOOLEAN`

Usado em RLS policies para liberar acesso total a super admins.

#### `get_current_empresa_id() RETURNS UUID`

Retorna a empresa do usuário logado, usada em RLS para multi-tenancy.

#### `admin_criar_usuario(p_email, p_senha, p_nome, p_empresa_id, p_is_super_admin)`

RPC que cria usuário + profile + permissões padrão em transação única.

#### `admin_atualizar_senha(p_user_id, p_nova_senha)`

RPC para alterar senha de outro usuário (admin).

#### `admin_deletar_usuario(p_user_id)`

RPC para excluir usuário completo (auth + profile + permissoes).

### 8.4 Registries em Memória (Runtime)

| Registry | Tipo | Escopo | Persistência |
|---|---|---|---|
| `permissionsRegistry` | `Map<string, PermissionDefinition>` | Frontend | Volátil (recarregado no setup) |
| `defaultsRegistry` | `Map<string, PermissionDefaults>` | Frontend | Volátil (recarregado no setup) |
| `navItemsRegistry` | `Map<string, NavItemRegistration>` | Frontend | Volátil (recarregado no setup) |

### 8.5 Tabelas de Suporte

| Tabela | Propósito |
|---|---|
| `empresas` | Donas dos usuários (multi-tenancy) |
| `modulos_empresa` | Módulos ativos por empresa |
| `empresa_modulo_limits` | Limites de usuários por módulo por empresa |

---

## Diagrama de Fluxo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                    CRIAÇÃO DE USUÁRIO                            │
│                                                                  │
│  1. Admin cria credencial via RPC admin_criar_usuario()         │
│     ↓                                                            │
│  2. Supabase Auth cria usuário                                   │
│     ↓                                                            │
│  3. Trigger on_profile_created_permissoes                        │
│     → Insere permissoes padrão baseado no ambiente               │
│     ↓                                                            │
│  4. Admin ajusta permissões via /empresa/permissoes              │
│     → setPermissoes() + setModulosAcesso()                      │
│     ↓                                                            │
│  5. Usuário faz login                                            │
│     → AuthProvider carrega profile + permissoes                  │
│     → Filtra nav-items via permissionCheck()                     │
│     → RLS do banco filtra dados por empresa_id                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    VERIFICAÇÃO EM TEMPO REAL                     │
│                                                                  │
│  Frontend:                                                       │
│  useAuth().permissoes → Record<string, boolean>                  │
│  permissionCheck(perms) → true/false                             │
│  getNavItems(perms) → NavItemRegistration[] filtrados            │
│                                                                  │
│  Banco (RLS):                                                    │
│  is_super_admin_session() → bypass total                         │
│  empresa_id = get_current_empresa_id() → multi-tenancy           │
│  auth.uid() = usuario_id → próprio registro                      │
└─────────────────────────────────────────────────────────────────┘
```
