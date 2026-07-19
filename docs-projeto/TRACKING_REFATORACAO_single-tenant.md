# Tracking: Refatoração Multi-Tenant → Single-Tenant

> **Data início:** 2026-07-19  
> **Última atualização:** 2026-07-19  
> **Status geral:** 🟡 Em progresso

---

## Legenda de Status

| Símbolo | Significado |
|---------|------------|
| `[ ]` | Não iniciado |
| `[/]` | Em progresso |
| `[x]` | Concluído |
| `[!]` | Bloqueado / problema |

---

## ETAPA 0 — Preparação e Infraestrutura de Testes

- [x] Criar `src/config/empresa.ts` com constantes `EMPRESA_ID` e `EMPRESA_SLUG`
- [x] Adicionar `VITE_EMPRESA_ID` e `VITE_EMPRESA_SLUG` no `.env` e `.env.example`
- [x] Criar pasta `tests/single-tenant/`
- [x] Criar `tests/single-tenant/check-empresa-id-constant.test.ts`
- [x] Criar `tests/single-tenant/check-rls-open.test.ts`
- [x] `npm run build` → passou ✅

---

## ETAPA 1 — Banco de Dados: Simplificar RLS

- [x] Criar migration `20260720000001_single_tenant_rls.sql`
- [x] Remover função `pode_acessar_empresa()`
- [x] Simplificar `get_current_empresa_id()` → retorna ID fixo
- [x] Recriar policies: catálogo (~55 tabelas) → `authenticated`
- [x] Recriar policies: core tables (`cadastros`, `credenciais`, `atividades`, etc.)
- [x] Recriar policies: módulos (`funis`, `nps`, `crm`, `marketing`, `rotas`, `despesas`, `hub`, `linktree`, `mapas`)
- [x] Aplicar migration no banco
- [x] Testar SELECTs como `authenticated` → retorna dados ✅
- [x] Testar que `anon` não acessa ✅
- [x] `npm run build` → passou ✅

---

## ETAPA 2 — Banco de Dados: Trigger e RPCs

- [x] Criar migration `20260720000002_single_tenant_rpcs.sql`
- [x] Refatorar `handle_new_user()` → empresa_id fixo
- [x] Refatorar `admin_criar_usuario` → remover `p_empresa_id`
- [x] Refatorar `admin_deletar_usuario` → remover filtro empresa
- [x] Simplificar `get_current_empresa_id()` → sem consultar profiles
- [x] Aplicar migration no banco
- [x] Testar criação de usuário sem empresa_id no metadata ✅
- [x] `npm run build` → passou ✅

---

## ETAPA 3 — Core Frontend: Config e AuthProvider

- [x] Criar `src/config/empresa.ts` (já existe da Etapa 0)
- [x] Refatorar `src/core/auth/AuthProvider.tsx` → usar EMPRESA_ID fixo
- [x] Refatorar `src/core/auth/types.ts` → manter empresa_id (legado DB)
- [x] Refatorar `src/core/empresa/EmpresaContext.tsx` → empresa fixa
- [x] Refatorar `src/core/permissions/services.ts` → usar EMPRESA_ID fixo
- [ ] Criar `tests/single-tenant/auth-provider.test.ts`
- [ ] Testes passam ✅
- [x] `npm run build` → passou ✅

---

## ETAPA 4 — Core Frontend: Hook useCatalogoEmpresaId

- [ ] Refatorar `src/features/catalogo/hooks/useCatalogoEmpresaId.ts` → retorna `EMPRESA_ID` fixo
- [ ] Remover resolução por slug/URL/search params/auth cascade
- [ ] Criar `tests/single-tenant/catalogo-empresa-id.test.ts`
- [ ] Testes passam ✅
- [ ] `npm run build` → passou ✅

---

## ETAPA 5 — Services: Catálogo (31 services)

- [ ] `implantes.service.ts` — remover param `empresaId`
- [ ] `abutments.service.ts`
- [ ] `componentes.service.ts`
- [ ] `parafusos.service.ts`
- [ ] `cicatrizadores.service.ts`
- [ ] `chaves.service.ts`
- [ ] `complementares.service.ts`
- [ ] `opcionais.service.ts`
- [ ] `fresas.service.ts` + `fresas-tipos.service.ts`
- [ ] `fresagens.service.ts`
- [ ] `kits.service.ts`
- [ ] `acessorios.service.ts`
- [ ] `hierarquia.service.ts`
- [ ] `grupos.service.ts`
- [ ] `clientes.service.ts`
- [ ] `orcamentos.service.ts`
- [ ] `pedidos.service.ts`
- [ ] `favoritos.service.ts`
- [ ] `imagens.service.ts`
- [ ] `promocionais.service.ts`
- [ ] `cupons.service.ts`
- [ ] `frete.service.ts`
- [ ] `configuracoes.service.ts`
- [ ] `design.service.ts`
- [ ] `workflows.service.ts`
- [ ] `sequencia-protetica.service.ts`
- [ ] `solicitacoes.service.ts`
- [ ] `precos-grupo.service.ts`
- [ ] `parafusos-retensao.service.ts`
- [ ] `carrinho.service.ts`
- [ ] `ui.service.ts` + `audio.service.ts`
- [ ] Atualizar todos os hooks/componentes que chamam esses services
- [ ] Criar `tests/single-tenant/catalogo-services.test.ts`
- [ ] Testes CRUD passam ✅
- [ ] `npm run build` → passou ✅

---

## ETAPA 6A — Cadastros

- [ ] Refatorar services de `src/features/cadastros/`
- [ ] Refatorar rotas `src/routes/cadastros.*.tsx`
- [ ] Testes CRUD de cadastros passam ✅
- [ ] `npm run build` → passou ✅

---

## ETAPA 6B — NPS

- [ ] Refatorar `src/features/nps/services/`
- [ ] Refatorar `GlobalNpsDashboardPage.tsx`
- [ ] Remover `setSelectedEmpresaId` de `NpsPreviewPage.tsx`
- [ ] Testes NPS passam ✅
- [ ] `npm run build` → passou ✅

---

## ETAPA 6C — Módulos Médios

- [ ] **CRM** — `NovaTarefaModal.tsx` + services
- [ ] **Funis** — services, dashboard
- [ ] **Marketing** — whatsapp, pixels, UTMs, landing pages, meta-bm
- [ ] **Rotas** — `useRotas.ts`, `useClientesBase.ts`
- [ ] **Hub** — `gamification.ts`
- [ ] **Despesas** — services
- [ ] **Mapas** — services
- [ ] **Linktree** — remover resolução de empresa por slug
- [ ] **Precadastro** — `PrevisualizacaoPage.tsx`
- [ ] **Gerador-links** — service
- [ ] `npm run build` → passou ✅

---

## ETAPA 6D — Módulos Baixo Impacto

- [ ] `agentes`
- [ ] `api-connectors`
- [ ] `credenciais`
- [ ] `documentos`
- [ ] `form-schema`
- [ ] `integracoes`
- [ ] `manutencao`
- [ ] `paytrack`
- [ ] `relatorios`
- [ ] `revisoes`
- [ ] `demos`
- [ ] `npm run build` → passou ✅

---

## ETAPA 7 — Módulo Empresas: Deprecar / Config

- [ ] Remover/redirecionar `/global/empresas` → `/empresa`
- [ ] Transformar `src/features/empresas/` em config única
- [ ] Simplificar `src/shared/empresas/service.ts` — manter só leitura/escrita de config
- [ ] Remover rotas `global.empresas.*` do routeTree
- [ ] Remover imports não usados
- [ ] `npm run build` → passou ✅

---

## ETAPA 8 — Webhooks e Eventos

- [ ] Refatorar `src/core/services/webhooks.ts` — remover 4º param `empresaId`
- [ ] Atualizar todos os call sites de `dispararEventoModulo()`
- [ ] `empresa_id` no payload → usar `EMPRESA_ID` fixo
- [ ] `npm run build` → passou ✅

---

## ETAPA 9 — Rotas e Guards

- [ ] Simplificar `EmpresaCrudContext.tsx`
- [ ] Revisar guards de `modulosAtivos`
- [ ] Remover rotas `adminSuperEmpresasRoute` / `adminSuperEmpresaDetailRoute`
- [ ] `npm run build` → passou ✅

---

## ETAPA 10 — Limpeza Final e Documentação

- [ ] Remover imports órfãos de `useEmpresa`
- [ ] Remover tipo `EmpresaInfo` do AuthContext se não usado
- [ ] Simplificar `Profile.empresa_id` em `types.ts`
- [ ] Atualizar `AGENTS.md` — remover seção multi-tenant
- [ ] Atualizar `ARCHITECTURE.md`
- [ ] `npm run build` final → passou ✅
- [ ] Deploy de produção ✅

---

## 📊 Progresso Geral

| Etapa | Status | Build |
|-------|--------|-------|
| Etapa 0 — Preparação | 🟢 Concluída | ✅ |
| Etapa 1 — RLS Banco | 🟢 Concluída | ✅ |
| Etapa 2 — Triggers/RPCs | 🟢 Concluída | ✅ |
| Etapa 3 — Core Frontend | 🟡 Em progresso | — |
| Etapa 4 — Hook Catálogo | 🔴 Pendente | — |
| Etapa 5 — Services Catálogo | 🔴 Pendente | — |
| Etapa 6A — Cadastros | 🔴 Pendente | — |
| Etapa 6B — NPS | 🔴 Pendente | — |
| Etapa 6C — Módulos Médios | 🔴 Pendente | — |
| Etapa 6D — Baixo Impacto | 🔴 Pendente | — |
| Etapa 7 — Módulo Empresas | 🔴 Pendente | — |
| Etapa 8 — Webhooks | 🔴 Pendente | — |
| Etapa 9 — Rotas/Guards | 🔴 Pendente | — |
| Etapa 10 — Limpeza Final | 🔴 Pendente | — |

**Concluídas: 3/14 etapas**
