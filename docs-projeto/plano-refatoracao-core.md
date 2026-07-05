# Plano de Implementação — Refatoração CORE do Banco de Dados

> **Branch:** `refatoracao-core-banco-dados`  
> **Data:** 04/07/2026  
> **Status:** CONCLUIDO

---

## Fase 1 — Schema Prisma

### 1.1 Adicionar `EmpresaRoleLimit` model
- Novo model para controle de limites de credenciais por role/empresa
- Tabela: `empresa_role_limits`
- Unique: `[empresaId, role]`
- **Status:** CONCLUIDO

### 1.2 Adicionar campos `facebook` e `tiktok` em `EmpresaRedesSocial`
- Campos opcionais (String?)
- **Status:** CONCLUIDO

### 1.3 Consolidar `EmpresaConfig` → `EmpresaDesign`
- Adicionar campo `dbConfig Json?` em `EmpresaDesign`
- Remover model `EmpresaConfig` do schema
- Remover relation `config` do model `Empresa`
- **Status:** CONCLUIDO

### 1.4 Remover relações de módulos do model `Empresa` (god object)
- Manter APENAS relações CORE (25 relações)
- Remover ~55 relações de módulos (NPS, Funis, Hub, Mapas, Rotas, Despesas, Linktree, Gerador, CRM, Marketing, Pipeline)
- **Status:** CONCLUIDO

### 1.5 Adicionar `roleLimits` relation no model `Empresa`
- **Status:** CONCLUIDO

---

## Fase 2 — Frontend (Types + Services)

### 2.1 Renomear `EmpresaConfig` → `EmpresaDesign` nos types
- `src/core/empresa/types.ts` — type renomado + alias deprecated
- `src/shared/empresas/types.ts` — type renomado + alias deprecated
- **Status:** CONCLUIDO

### 2.2 Atualizar service functions
- `src/shared/empresas/service.ts`: `empresas_config` → `empresa_design`
- `src/core/empresa/EmpresaContext.tsx`: `empresas_config` → `empresa_design`
- `src/core/auth/AuthProvider.tsx`: `empresas_config` → `empresa_design`
- **Status:** CONCLUIDO

### 2.3 Atualizar imports em todos os arquivos
- 9 arquivos atualizados (rotas, features, testes)
- Funções `buscarEmpresaConfig` → `buscarEmpresaDesign` (alias deprecated mantido)
- Funções `salvarEmpresaConfig` → `salvarEmpresaDesign` (alias deprecated mantido)
- **Status:** CONCLUIDO

---

## Fase 3 — Migration SQL

### 3.1 Migration criada
- Arquivo: `supabase/migrations/20260704000000_refatoracao_core.sql`
- Inclui: CREATE TABLE empresa_role_limits, ADD COLUMN facebook/tiktok, ADD COLUMN db_config, data migration, seed, RLS policies, funções
- **Status:** CONCLUIDO

---

## Fase 4 — Validação

### 4.1 `npm run build` — PASSOU SEM ERROS
### 4.2 `npm run lint` — config ESLint ausente (issue pré-existente)
### 4.3 Zero referências `empresas_config` restantes no código

---

## Critérios de Sucesso

- [x] Branch criada
- [x] Schema atualizado sem erros
- [x] Frontend atualizado sem erros de build
- [x] Migration gerada corretamente
- [x] `npm run build` passa
- [x] Zero referências quebradas

---

## Resumo das Mudanças

| Arquivo | Mudança |
|---------|---------|
| `prisma/schema.prisma` | EmpresaRoleLimit added, EmpresaConfig removed, Empresa redesigned (25 relações vs ~80 antes), facebook/tiktok added, dbConfig added |
| `src/core/empresa/types.ts` | EmpresaDesign type, EmpresaConfig deprecated alias |
| `src/shared/empresas/types.ts` | EmpresaDesign type, EmpresaConfig deprecated alias |
| `src/core/empresa/index.ts` | Export EmpresaDesign |
| `src/shared/empresas/index.ts` | Export EmpresaDesign + new functions |
| `src/shared/empresas/service.ts` | buscarEmpresaDesign, salvarEmpresaDesign, table empresa_design |
| `src/core/empresa/EmpresaContext.tsx` | empresa_design table, EmpresaDesign type |
| `src/core/auth/AuthProvider.tsx` | empresa_design table |
| `src/routes/empresa.branding.tsx` | EmpresaDesign, new function names |
| `src/routes/empresa.banco.tsx` | EmpresaDesign, new function names |
| `src/routes/empresa.tema.tsx` | EmpresaDesign, new function names |
| `src/routes/empresa.tsx` | EmpresaDesign, new function names |
| `src/features/nps/theme.ts` | EmpresaDesign type |
| `src/features/nps/components/dashboard/NpsPreviewPage.tsx` | EmpresaDesign type |
| `src/features/linktree/services/empresa.ts` | empresa_design table |
| `src/features/linktree/hooks/useEmpresaLinktree.ts` | Updated imports |
| `src/__tests__/modules/linktree/services.test.ts` | Updated imports |
| `supabase/migrations/20260704000000_refatoracao_core.sql` | Full migration SQL |
| `docs-projeto/plano-refatoracao-core.md` | This file |
