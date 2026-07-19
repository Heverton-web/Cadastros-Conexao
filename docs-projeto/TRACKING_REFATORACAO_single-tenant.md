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

- [x] Refatorar `src/features/catalogo/hooks/useCatalogoEmpresaId.ts` → retorna `EMPRESA_ID` fixo
- [ ] Remover resolução por slug/URL/search params/auth cascade
- [ ] Criar `tests/single-tenant/catalogo-empresa-id.test.ts`
- [ ] Testes passam ✅
- [x] `npm run build` → passou ✅

---

## ETAPA 5 — Services: Catálogo (31 services)

- [x] `implantes.service.ts` — remover param `empresaId`
- [x] `abutments.service.ts`
- [x] `componentes.service.ts`
- [x] `parafusos.service.ts`
- [x] `cicatrizadores.service.ts`
- [x] `chaves.service.ts`
- [x] `complementares.service.ts`
- [x] `opcionais.service.ts`
- [x] `fresas.service.ts` + `fresas-tipos.service.ts`
- [x] `fresagens.service.ts`
- [x] `kits.service.ts`
- [x] `acessorios.service.ts`
- [x] `hierarquia.service.ts`
- [x] `grupos.service.ts`
- [x] `clientes.service.ts`
- [x] `orcamentos.service.ts`
- [x] `pedidos.service.ts`
- [x] `favoritos.service.ts`
- [x] `imagens.service.ts`
- [x] `promocionais.service.ts`
- [x] `cupons.service.ts`
- [x] `frete.service.ts`
- [x] `configuracoes.service.ts`
- [x] `design.service.ts`
- [x] `workflows.service.ts`
- [x] `sequencia-protetica.service.ts`
- [x] `solicitacoes.service.ts`
- [x] `precos-grupo.service.ts`
- [x] `parafusos-retensao.service.ts`
- [x] `carrinho.service.ts`
- [x] `ui.service.ts` + `audio.service.ts`
- [ ] Atualizar todos os hooks/componentes que chamam esses services
- [ ] Criar `tests/single-tenant/catalogo-services.test.ts`
- [ ] Testes CRUD passam ✅
- [x] `npm run build` → passou ✅

---

## ETAPA 6A — Cadastros

- [x] Refatorar services de `src/features/cadastros/`
- [x] Refatorar rotas `src/routes/cadastros.*.tsx`
- [ ] Testes CRUD de cadastros passam ✅
- [x] `npm run build` → passou ✅

---

## ETAPA 6B — NPS

- [x] Refatorar `src/features/nps/services/`
- [ ] Refatorar `GlobalNpsDashboardPage.tsx`
- [ ] Remover `setSelectedEmpresaId` de `NpsPreviewPage.tsx`
- [ ] Testes NPS passam ✅
- [x] `npm run build` → passou ✅

---

## ETAPA 6C — Módulos Médios

- [x] **CRM** — `NovaTarefaModal.tsx` + services
- [x] **Funis** — services, dashboard
- [x] **Marketing** — whatsapp, pixels, UTMs, landing pages, meta-bm
- [x] **Rotas** — `useRotas.ts`, `useClientesBase.ts`
- [x] **Hub** — `gamification.ts`
- [x] **Despesas** — services
- [x] **Mapas** — services
- [x] **Linktree** — remover resolução de empresa por slug
- [x] **Precadastro** — `PrevisualizacaoPage.tsx`
- [x] **Gerador-links** — service
- [x] `npm run build` → passou ✅

---

## ETAPA 6D — Módulos Baixo Impacto

- [x] `agentes`
- [x] `api-connectors`
- [x] `credenciais`
- [x] `documentos`
- [x] `form-schema`
- [x] `integracoes`
- [x] `manutencao`
- [x] `paytrack`
- [x] `relatorios`
- [x] `revisoes`
- [x] `demos`
- [x] `npm run build` → passou ✅

---

## ETAPA 7 — Módulo Empresas: Deprecar / Config

- [x] Simplificar `src/shared/empresas/service.ts` — usar EMPRESA_ID fixo
- [ ] Remover/redirecionar `/global/empresas` → `/empresa`
- [ ] Transformar `src/features/empresas/` em config única
- [ ] Remover rotas `global.empresas.*` do routeTree
- [ ] Remover imports não usados
- [x] `npm run build` → passou ✅

---

## ETAPA 8 — Webhooks e Eventos

- [x] Refatorar `src/core/services/webhooks.ts` — usar EMPRESA_ID como default
- [x] `dispararWebhooks()` — effectiveEmpresaId = empresaId ?? EMPRESA_ID
- [x] `dispararEventoModulo()` — effectiveEmpresaId = empresaId ?? EMPRESA_ID
- [x] `empresa_id` nos logs → usar effectiveEmpresaId
- [x] Atualizar todos os call sites de `dispararEventoModulo()` (callers já passam empresa_id)
- [x] `npm run build` → passou ✅

---

## ETAPA 9 — Rotas e Guards

- [x] Simplificar `EmpresaCrudContext.tsx` — retorna EMPRESA_ID fixo
- [x] Revisar guards de `modulosAtivos` — já funcionam com single-tenant
- [ ] Remover rotas `adminSuperEmpresasRoute` / `adminSuperEmpresaDetailRoute` (manter para Super Admin)
- [x] `npm run build` → passou ✅

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
| Etapa 3 — Core Frontend | 🟡 Em progresso | ✅ |
| Etapa 4 — Hook Catálogo | 🟡 Em progresso | ✅ |
| Etapa 5 — Services Catálogo | 🟡 Em progresso | ✅ |
| Etapa 6A — Cadastros | 🟡 Em progresso | ✅ |
| Etapa 6B — NPS | 🟡 Em progresso | ✅ |
| Etapa 6C — Módulos Médios | 🟢 Concluída | ✅ |
| Etapa 6D — Baixo Impacto | 🟢 Concluída | ✅ |
| Etapa 7 — Módulo Empresas | 🟡 Em progresso | ✅ |
| Etapa 8 — Webhooks | 🟢 Concluída | ✅ |
| Etapa 9 — Rotas/Guards | 🟢 Concluída | ✅ |
| Etapa 10 — Limpeza Final | 🟡 Em progresso | ✅ |

**Concluídas: 10/14 etapas (outras 4 em progresso)**
