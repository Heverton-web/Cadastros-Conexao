# Tracking: Correções Single-Tenant

**Data início:** 2026-07-19
**Branch:** fix/catalogo-single-tenant

---

## Status Geral

| Fase | Status | Notas |
|------|--------|-------|
| Correção Rotas Catálogo | Em progresso | Subagent trabalhando |
| Limpeza do Banco | Concluído | Migration criada |
| Dados Mock | Conclusído | Migration criada |
| Build | Pendente | Aguardando correção rotas |
| Deploy | Pendente | v18 |

---

## Detalhes

### 1. Correção Rotas Catálogo (single-tenant)

**Problema:** A rota `https://erp.vpsconexao.org/catalogo?empresa=null` ainda usa multi-tenant.

**Arquivos afetados:**
- `src/routes/catalogo.index.tsx` - Remover company selector, usar EMPRESA_ID direto
- `src/routes/catalogo.componentes.tsx` - Remover search.empresa
- `src/routes/catalogo.implantes.tsx` - Remover search.empresa
- `src/routes/catalogo.kits.tsx` - Remover search.empresa
- `src/routes/catalogo.promocionais.tsx` - Remover search.empresa
- `src/routes/catalogo.produto.$tipo.$sku.tsx` - Remover search.empresa
- `src/routes/catalogo.empresa.$slug.tsx` - Remover search.empresa
- `src/features/catalogo/components/StoreLayout.tsx` - Usar EMPRESA_ID como fallback

**Solução:** Importar `EMPRESA_ID` de `~/config/empresa` e usar direto, sem query param.

### 2. Limpeza do Banco

**Tabelas mantidas:**
- profiles
- credenciais
- usuarios
- empresas
- empresas_config

**Tabelas limpas (TRUNCATE):**
- Todas as tabelas catalogo_* (50+ tabelas)
- Todas as tabelas de módulos auxiliares
- webhooks, webhook_logs
- Todas as outras tabelas não essenciais

**Migration:** `20260719100000_single_tenant_cleanup_and_mock.sql`

### 3. Dados Mock - CONEXÃO IMPLANTES

**Empresa:** CONEXÃO IMPLANTES
**ID:** `1a00d0fe-0d10-48b2-aff7-68e941967f0f`

**Dados criados (3 registros por tabela):**

| Tabela | Registros | Descrição |
|--------|-----------|-----------|
| catalogo_ips_conexoes | 3 | Hexagonal, Octogonal, Retangular |
| catalogo_ips_familias | 3 | Standard, Premium, Compact |
| catalogo_ips_linhas | 3 | 3.5mm, 4.0mm, 4.5mm Premium |
| catalogo_implantes | 3 | IMP-3510, IMP-4012, IMP-4514 |
| catalogo_abutments | 3 | ABT-35H, ABT-40A, ABT-45H |
| catalogo_componentes | 3 | Parafusos + Chave torque |
| catalogo_tipos_kits | 3 | Cirúrgico, Prótese, Completo |
| catalogo_kits | 3 | Kits com preços |
| catalogo_promocionais | 3 | Promoções com desconto |
| catalogo_categorias | 3 | Implantes, Componentes, Kits |
| catalogo_grupos_clientes | 3 | Clínicas, Distribuidores, Autônomos |
| catalogo_clientes | 3 | Dr. João, Dra. Maria, Dental Store |
| catalogo_design_config | 1 | Tema dark premium |
| catalogo_configuracoes | 3 | Moeda, idioma, frete |

---

## Commits

| Hash | Descrição |
|------|-----------|
| pendente | fix(catalogo): remove empresa query param (single-tenant) |
| pendente | chore(db): limpeza banco + dados mock single-tenant |

---

## Deploy

| Item | Status |
|------|--------|
| Versão | v18 (pendente) |
| Branch | fix/catalogo-single-tenant |
| Migrations | 1 nova (cleanup + mock) |
| Build | Pendente |
