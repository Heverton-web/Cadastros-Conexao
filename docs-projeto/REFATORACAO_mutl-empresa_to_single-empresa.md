# Plano de Refatoração: Multi-Tenant → Single-Tenant

> **Data:** 2026-07-19  
> **Status:** 🔴 Não iniciado  
> **Objetivo:** Remover toda a lógica multi-empresa da aplicação, eliminando erros de RLS, lógica de backend e exibição no frontend causados pela complexidade multi-tenant.

---

## 📋 Diagnóstico: O que é Multi-Tenant hoje

### Banco de Dados (Supabase/PostgreSQL)

| Camada | Componente | Descrição do problema |
|--------|-----------|----------------------|
| **Tabelas** | `empresas` | Tabela de empresas — se torna config estática |
| **Tabelas** | `empresas_config` | Config por empresa — vira config global |
| **Tabelas** | `empresa_modulos` (renomeado `modulos_empresa`) | Ativação de módulos por empresa — vira global |
| **Coluna FK** | `empresa_id` em ~40+ tabelas | FK para `empresas.id` em TODA a base |
| **RLS** | `get_current_empresa_id()` | Função helper usada em todas as policies |
| **RLS** | `is_super_admin_session()` | Ainda útil — mantém distinção admin/user |
| **RLS** | `pode_acessar_empresa(p_empresa_id)` | Será removida |
| **Policies** | ~60+ policies com `empresa_id = get_current_empresa_id()` | Precisam ser simplificadas para `authenticated` |
| **Triggers** | `handle_new_user()` | Assign de empresa_id via metadata — simplificar |

**Tabelas com `empresa_id` identificadas nas migrations:**
- `profiles`, `cadastros`, `credenciais`, `atividades`, `notificacoes`, `notificacoes_templates`
- `webhooks`, `webhook_logs`, `form_schema`, `api_connectors`, `integracoes_config`
- `permissoes`, `documentos`, `cadastros_pf`, `cadastros_pj`, `cadastros_enderecos`
- `catalogo_implantes`, `catalogo_abutments`, `catalogo_componentes`, + ~50 tabelas do catálogo
- `catalogo_clientes`, `catalogo_pedidos`, `catalogo_orcamentos`, `catalogo_configs_empresa`
- Módulos: `funis_*`, `nps_*`, `crm_*`, `marketing_*`, `rotas_*`, `despesas_*`
- `hub_*`, `linktree_*`, `mapas_*`, `agentes_*`

---

### Frontend (React + TanStack Router)

| Camada | Componente | Problema |
|--------|-----------|----------|
| **Core Auth** | `AuthProvider.tsx` | Carrega empresa, modulos por `empresa_id` do profile |
| **Core Auth** | `types.ts` — `Profile.empresa_id` | Campo multi-tenant no tipo Profile |
| **Core Context** | `EmpresaContext.tsx` | Carrega empresa dinamicamente por `empresa_id` |
| **Hook** | `useCatalogoEmpresaId()` | Resolve empresa_id por slug/URL/auth/fallback |
| **Hook** | `useEmpresa()` | Exposição do contexto de empresa |
| **Features** | Todos os services passam `empresaId` como parâmetro | ~200+ ocorrências de `.eq("empresa_id", empresaId)` |
| **Features** | `profile.empresa_id` usado em 30+ componentes | Acesso direto ao ID da empresa pelo profile |
| **Shared** | `src/shared/empresas/service.ts` | CRUD completo de empresas — virar serviço de config |
| **Rotas** | `/global/empresas/*` | Gestão multi-empresa — virar config única |
| **Módulo** | `src/features/empresas/` | Módulo inteiro de gestão de empresas |

---

### Backend (Serviços/Lógica)

| Camada | Componente | Problema |
|--------|-----------|----------|
| **Core Services** | `webhooks.ts` — `dispararEventoModulo()` | 4º arg `empresaId` passa empresa para webhook |
| **Permissions** | `setModulosAcesso()` | Salva `empresa_id` na tabela permissoes |
| **RPC Supabase** | `admin_criar_usuario` | Recebe `p_empresa_id` como parâmetro |
| **RPC Supabase** | `admin_deletar_usuario` | Filtra por `empresa_id` |
| **Services** | Todos os módulos aceitam `empresaId: string` | Assinatura de todas as funções |

---

## 🏗️ Estratégia de Refatoração

### Premissa: Empresa Fixa (Hardcoded via ENV ou Config)
Em vez de remover as tabelas `empresas`/`empresas_config` (o que quebraria a estrutura de dados existente), a estratégia é:

1. **Manter as tabelas** — mas com 1 registro fixo (a empresa da aplicação)
2. **Remover o filtro dinâmico** de `empresa_id` das RLS — policies abertas para `authenticated`
3. **Remover o parâmetro `empresaId`** dos services — a empresa é sempre a mesma
4. **Simplificar o AuthProvider** — sem carregar empresa dinamicamente
5. **Criar constante `EMPRESA_ID`** — importada de config/env em todo o app

---

## 📦 Módulos Afetados (Inventário Completo)

### Features (`src/features/`)

| Módulo | Impacto | Nível |
|--------|---------|-------|
| `admin` | Remove seleção de empresa em criação de usuários | 🟡 Médio |
| `agentes` | Remove `empresa_id` do service | 🟢 Baixo |
| `api-connectors` | Remove filtro empresa | 🟢 Baixo |
| `cadastros` | Remove `empresa_id` de queries + RLS | 🔴 Alto |
| `catalogo` | 31 services + hook `useCatalogoEmpresaId` | 🔴 Alto |
| `clientes` | Remove filtro empresa | 🟡 Médio |
| `consultor` | Usa `empresa_id` nas queries | 🟡 Médio |
| `credenciais` | Remove filtro empresa | 🟢 Baixo |
| `crm` | Remove `empresa_id` de tarefas/pipeline | 🟡 Médio |
| `dashboard` | Remove stats por empresa | 🟡 Médio |
| `demos` | Remove gestão de demos por empresa | 🟢 Baixo |
| `despesas` | Remove filtro empresa | 🟡 Médio |
| `documentos` | Remove filtro empresa | 🟢 Baixo |
| `empresas` | **DEPRECAR** — vira config estática | 🔴 Alto |
| `form-schema` | Remove `empresa_id` | 🟢 Baixo |
| `funis` | Remove `empresa_id` de funis/cards | 🟡 Médio |
| `gerador-links` | Remove filtro empresa | 🟢 Baixo |
| `hub` | Remove `empresa_id` de gamification | 🟡 Médio |
| `integracoes` | Remove `empresa_id` de configs | 🟢 Baixo |
| `linktree` | Remove resolução de empresa por slug | 🟡 Médio |
| `manutencao` | Remove filtro empresa | 🟢 Baixo |
| `mapas` | Remove filtro empresa | 🟡 Médio |
| `marketing` | Remove `empresa_id` de email/pixel/UTM/LP | 🟡 Médio |
| `nps` | Remove `empresa_id` de pesquisas | 🔴 Alto |
| `paytrack` | Remove filtro empresa | 🟢 Baixo |
| `precadastro` | Remove `setSelectedEmpresaId` | 🟡 Médio |
| `relatorios` | Remove filtro empresa | 🟢 Baixo |
| `revisoes` | Remove filtro empresa | 🟢 Baixo |
| `rotas` | Remove `useEmpresa()` de todos hooks | 🟡 Médio |

---

## 🔄 Fluxo de Execução por Etapa

```
CRIAR TESTES DE FEEDBACK
        ↓
REFATORAR (DB → Backend → Frontend)
        ↓
TESTAR (Lógica, CRUD, Persistência, UI/UX)
        ↓
BUILDAR (npm run build)
        ↓
DEPLOY
        ↓
CHECAR TAREFA NO TRACKING
        ↓
FEEDBACK AO USUÁRIO (concluída + próxima)
        ↓
REINICIAR
```

---

## 📋 ETAPAS DE REFATORAÇÃO

---

### ETAPA 0 — Preparação e Infraestrutura de Testes
**Objetivo:** Setup dos testes de feedback + constante central de empresa_id

**Testes a criar:**
- `tests/single-tenant/check-empresa-id-constant.test.ts` — verifica que `EMPRESA_ID` existe e é válido
- `tests/single-tenant/check-rls-open.test.ts` — verifica que authenticated pode SELECT em tabelas principais

**Tarefas:**
1. Criar `src/config/empresa.ts` com `EMPRESA_ID` e `EMPRESA_SLUG` fixos (lidos do `.env`)
2. Adicionar `VITE_EMPRESA_ID` e `VITE_EMPRESA_SLUG` no `.env`
3. Criar suíte base de testes em `tests/single-tenant/`
4. Rodar `npm run build` → deve passar (sem mudanças ainda)

---

### ETAPA 1 — Banco de Dados: Simplificar RLS
**Objetivo:** Remover policies multi-tenant, substituir por políticas simples de `authenticated`

**Testes a criar:**
- `tests/single-tenant/rls-basico.sql` — SELECT em cada tabela principal como `authenticated` deve retornar rows
- Verificar que `anon` não pode acessar

**Migration a criar:** `20260720000001_single_tenant_rls.sql`
```sql
-- 1. Remover função pode_acessar_empresa
-- 2. Simplificar get_current_empresa_id → retorna ID fixo da empresa
-- 3. Recriar policies de todas as tabelas: apenas is_admin_or_super() ou authenticated
-- 4. Manter distinção admin/consultor para cadastros (sem empresa_id)
-- 5. Remover índices empresa_id que não são mais necessários
```

**Tabelas afetadas:**
- Todas as tabelas do catálogo (~55 tabelas)
- `cadastros`, `credenciais`, `atividades`, `notificacoes`, `permissoes`, `documentos`
- `webhooks`, `webhook_logs`, `form_schema`, `api_connectors`, `integracoes_config`
- Tabelas de módulos: funis, nps, crm, marketing, rotas, despesas, hub, linktree, mapas

---

### ETAPA 2 — Banco de Dados: Trigger e RPCs
**Objetivo:** Simplificar trigger `handle_new_user` e RPCs de admin

**Migration:** `20260720000002_single_tenant_rpcs.sql`
```sql
-- 1. handle_new_user: remover assign de empresa_id por metadata
--    → empresa_id sempre = ID fixo da empresa (ou NULL e resolvido em runtime)
-- 2. admin_criar_usuario: remover p_empresa_id (assign fixo)
-- 3. admin_deletar_usuario: remover filtro empresa_id
-- 4. get_current_empresa_id: retornar ID fixo (sem consultar profiles)
```

---

### ETAPA 3 — Core Frontend: Config e AuthProvider
**Objetivo:** Simplificar o AuthProvider e remover contexto dinâmico de empresa

**Arquivos:**
- `src/config/empresa.ts` — **[NOVO]** constante `EMPRESA_ID`
- `src/core/auth/AuthProvider.tsx` — remover `carregarEmpresa()`, simplificar
- `src/core/auth/types.ts` — tornar `empresa_id` não mais necessário no Profile
- `src/core/empresa/EmpresaContext.tsx` — buscar empresa fixa (sem dep em `profile.empresa_id`)
- `src/core/permissions/services.ts` — remover `empresa_id` do upsert de permissoes

**Testes:**
- `tests/single-tenant/auth-provider.test.ts` — AuthProvider carrega sem empresa_id no profile

---

### ETAPA 4 — Core Frontend: Hook useCatalogoEmpresaId
**Objetivo:** Simplificar para retornar sempre `EMPRESA_ID` fixo

**Arquivo:** `src/features/catalogo/hooks/useCatalogoEmpresaId.ts`
- Remover resolução por slug/URL/search params/auth cascade
- Retornar `EMPRESA_ID` diretamente
- Manter suporte ao `EmpresaCrudContext` (Super Admin pode ainda precisar)

**Testes:**
- `tests/single-tenant/catalogo-empresa-id.test.ts`

---

### ETAPA 5 — Services: Catálogo (31 services)
**Objetivo:** Remover `empresaId: string` como parâmetro e usar constante

**Estratégia:** Busca/replace + refatoração de assinaturas
- Remover `.eq("empresa_id", empresaId)` dos SELECTs → RLS já garante isolamento
- Manter `.set("empresa_id", EMPRESA_ID)` nos INSERTs → coluna ainda existe

**Services afetados:**
`implantes`, `abutments`, `componentes`, `parafusos`, `cicatrizadores`, `chaves`,
`complementares`, `opcionais`, `fresas`, `fresagens`, `kits`, `acessorios`,
`hierarquia`, `grupos`, `clientes`, `orcamentos`, `pedidos`, `favoritos`,
`imagens`, `promocionais`, `cupons`, `frete`, `configuracoes`, `design`,
`workflows`, `sequencia-protetica`, `solicitacoes`, `precos-grupo`,
`parafusos-retensao`, `carrinho`, `ui`, `audio`

**Testes:**
- `tests/single-tenant/catalogo-services.test.ts` — CRUD básico sem empresaId param

---

### ETAPA 6 — Services: Módulos de Negócio
**Objetivo:** Remover `empresa_id` dos módulos de negócio

**Módulos a refatorar (por prioridade de impacto):**

#### 6A — Cadastros (🔴 Alto)
- `src/features/cadastros/` — todos services, queries
- `src/routes/cadastros.*.tsx` — remover `empresaId` de fetches

#### 6B — NPS (🔴 Alto)
- `src/features/nps/` — services, hooks, `GlobalNpsDashboardPage`
- `NpsPreviewPage.tsx` — remover `setSelectedEmpresaId`

#### 6C — Módulos Médios (em paralelo após 6A/6B)
- `crm` — `NovaTarefaModal.tsx` + services
- `funis` — services, dashboard
- `marketing` — whatsapp, pixels, UTMs, landing pages, meta-bm
- `rotas` — hooks `useRotas`, `useClientesBase` que usam `useEmpresa()`
- `hub` — `gamification.ts`
- `despesas` — services
- `mapas` — services
- `linktree` — remover resolução de empresa por slug
- `precadastro` — `PrevisualizacaoPage`
- `gerador-links` — service

#### 6D — Módulos Baixo Impacto
- `agentes`, `api-connectors`, `credenciais`, `documentos`
- `form-schema`, `integracoes`, `manutencao`, `paytrack`
- `relatorios`, `revisoes`, `demos`

---

### ETAPA 7 — Módulo Empresas: Deprecar / Refatorar para Config
**Objetivo:** Transformar gestão de "empresas" em "configurações da empresa"

**Estratégia:**
- `/global/empresas` → Redirecionar para `/empresa` (config única)
- `src/features/empresas/` → Transformar em `src/features/config-empresa/`
- `src/shared/empresas/service.ts` → Manter funções de `buscarEmpresaDesign`, `salvarEmpresaDesign`; remover `listarEmpresas`, `criarEmpresa`, `deletarEmpresa`
- Rotas `global.empresas.*` → Remover ou redirecionar

**Testes:**
- Verificar que rota de empresas redireciona corretamente

---

### ETAPA 8 — Webhooks e Eventos
**Objetivo:** Simplificar `dispararEventoModulo()` — remover parâmetro `empresaId`

**Arquivo:** `src/core/services/webhooks.ts`
- Remover 4º parâmetro `empresaId` da função
- `empresa_id` no payload → usar `EMPRESA_ID` fixo
- Atualizar todos os call sites (grep por `dispararEventoModulo`)

---

### ETAPA 9 — Rotas e Guards
**Objetivo:** Simplificar guards de empresa

**Arquivos:**
- `src/features/catalogo/contexts/EmpresaCrudContext.tsx` — simplificar para contexto de admin
- Guards que verificam `modulosAtivos` — revisar se ainda necessários
- Remover `adminSuperEmpresasRoute`, `adminSuperEmpresaDetailRoute` das rotas

---

### ETAPA 10 — Limpeza Final e Documentação
**Objetivo:** Remover código morto, atualizar docs, validar build

**Tarefas:**
1. Remover imports de `useEmpresa` não usados
2. Remover tipos `EmpresaInfo` não usados do AuthContext
3. Simplificar `src/core/auth/types.ts` — `Profile.empresa_id` pode ser `string` fixo
4. Atualizar `AGENTS.md` — remover referência ao multi-tenant
5. Atualizar `ARCHITECTURE.md`
6. Rodar `npm run build` final
7. Deploy de produção

---

## ⚠️ Riscos e Mitigações

| Risco | Severidade | Mitigação |
|-------|-----------|-----------|
| Perda de dados existentes (empresa_id NULL) | 🔴 Alto | Migration com `UPDATE SET empresa_id = EMPRESA_ID WHERE empresa_id IS NULL` antes de remover constraints |
| Quebra de RLS (tabelas ficam abertas demais) | 🔴 Alto | Manter distinção `is_admin_or_super()` para operações sensíveis |
| Super Admin perde contexto de empresa | 🟡 Médio | Manter `EmpresaCrudContext` para Super Admin (CRUD de config) |
| Catálogo público (loja) quebra sem slug | 🟡 Médio | Hook `useCatalogoEmpresaId` retorna sempre `EMPRESA_ID` fixo |
| Webhooks com payload incorreto | 🟢 Baixo | `EMPRESA_ID` fixo no payload |
| Testes existentes quebram | 🟡 Médio | Atualizar mocks de `empresa_id` nos testes existentes |

---

## 🔧 Constante Central (Padrão a Seguir)

```typescript
// src/config/empresa.ts
export const EMPRESA_ID = import.meta.env.VITE_EMPRESA_ID as string;
export const EMPRESA_SLUG = import.meta.env.VITE_EMPRESA_SLUG as string;

// .env
VITE_EMPRESA_ID=1a00d0fe-0d10-48b2-aff7-68e941967f0f
VITE_EMPRESA_SLUG=conexao
```

---

## 📊 Estimativa de Esforço

| Etapa | Estimativa | Prioridade |
|-------|-----------|-----------|
| Etapa 0 — Preparação | 30min | 🔴 Crítico |
| Etapa 1 — RLS Banco | 2h | 🔴 Crítico |
| Etapa 2 — Triggers/RPCs | 1h | 🔴 Crítico |
| Etapa 3 — Core AuthProvider | 1h | 🔴 Crítico |
| Etapa 4 — Hook Catálogo | 30min | 🟡 Alto |
| Etapa 5 — Services Catálogo | 3h | 🟡 Alto |
| Etapa 6A — Cadastros | 1.5h | 🟡 Alto |
| Etapa 6B — NPS | 1h | 🟡 Alto |
| Etapa 6C — Médios | 3h | 🟢 Médio |
| Etapa 6D — Baixo Impacto | 2h | 🟢 Baixo |
| Etapa 7 — Módulo Empresas | 1h | 🟡 Alto |
| Etapa 8 — Webhooks | 30min | 🟢 Baixo |
| Etapa 9 — Rotas/Guards | 1h | 🟡 Alto |
| Etapa 10 — Limpeza Final | 1h | 🔴 Crítico |
| **TOTAL ESTIMADO** | **~18h** | — |

---

## 📝 Notas Técnicas

### RLS após Single-Tenant

As policies devem seguir o padrão:

```sql
-- Simples: qualquer autenticado pode ler
CREATE POLICY tabela_select ON public.tabela
  FOR SELECT TO authenticated USING (true);

-- Com controle de admin: só admin escreve
CREATE POLICY tabela_write ON public.tabela
  FOR ALL TO authenticated
  USING (is_admin_or_super())
  WITH CHECK (is_admin_or_super());

-- Consultor: vê apenas o que criou
CREATE POLICY tabela_consultor ON public.tabela
  FOR SELECT TO authenticated
  USING (created_by = auth.uid());
```

### Manter `empresa_id` nas tabelas (não remover a coluna)

- **NÃO remover a coluna** `empresa_id` das tabelas — só remover o filtro nas queries
- Isso evita migrations complexas e mantém integridade de dados históricos
- Em INSERTs, continuar inserindo `empresa_id = EMPRESA_ID` para consistência

### Services Single-Tenant

```typescript
// ANTES (multi-tenant):
export async function listarImplantes(empresaId: string) {
  return supabase.from("catalogo_implantes").select("*").eq("empresa_id", empresaId);
}

// DEPOIS (single-tenant):
export async function listarImplantes() {
  return supabase.from("catalogo_implantes").select("*");
  // RLS garante isolamento automaticamente
}
```

---

## ✅ Arquivo de Tracking

> Ver: `TRACKING_REFATORACAO_single-tenant.md` (mesmo diretório)
