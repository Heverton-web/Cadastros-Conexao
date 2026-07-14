# Relatório de Varredura — Módulo Catálogo

**Data:** 2026-07-13
**Status:** ✅ TODAS AS CORREÇÕES APLICADAS — Build passa sem erros

---

## Problemas Encontrados e Corrigidos

### ERRO CRÍTICO

| # | Arquivo | Problema | Correção |
|---|---------|----------|----------|
| 1 | `routes/catalogo.admin.configuracoes.tsx:12` | Import `~/lib/supabase` incorreto | Alterado para `~/core/supabase` |

### BUGS DE UI

| # | Arquivo | Problema | Correção |
|---|---------|----------|----------|
| 2 | `routes/catalogo.admin.configuracoes.tsx:319` | handleSave sem toast de erro | Adicionado `toast.error()` com mensagem |
| 3 | `routes/catalogo.admin.configuracoes.tsx:291` | handleSave sem validação de nome vazio | Adicionada validação antes do Supabase |
| 4 | `components/GruposAdmin.tsx:490` | Preço fixo exibido sem formatação BRL | Trocado `R$ ${val}` por `formatBRL(val)` |
| 5 | `components/admin/produtos/forms/KitForm.tsx:62` | Label "Categoria Kit" sem asterisco | Adicionado `<span className="text-red-400">*</span>` |
| 6 | `routes/catalogo.admin.promocionais.tsx` | Dialog sem adição de itens | Reescrito com busca de produtos, seleção, e passagem para service |
| 7 | `components/ClientesAdmin.tsx:151` | Validação de senha ausente | Adicionada checagem `form.senha.length < 6` |
| 8 | `routes/catalogo.admin.cupons.tsx:50` | Sem validação de duplicidade frontend | Adicionada checagem `cupons?.some()` |
| 9 | `routes/catalogo.admin.frete.tsx:50` | Sem validação de formato CEP | Adicionada regex `/^\d{5}-?\d{3}$/` |

### ALERTAS

| # | Arquivo | Problema | Correção |
|---|---------|----------|----------|
| 10 | `components/admin/CadastroFormDialog.tsx:88` | Toast de erro não exibido | Adicionado import toast + `toast.error()` |
| 11 | `ProdutoFormModal.tsx:95` | resetForms() sem preco no kit | Adicionado `preco: 0` no reset |

---

## Arquivos Modificados

1. `src/routes/catalogo.admin.configuracoes.tsx` — import, validação, toast
2. `src/features/catalogo/components/GruposAdmin.tsx` — formatação BRL
3. `src/features/catalogo/components/admin/produtos/forms/KitForm.tsx` — asterisco
4. `src/routes/catalogo.admin.promocionais.tsx` — reescrito com itens
5. `src/features/catalogo/components/ClientesAdmin.tsx` — validação senha
6. `src/features/catalogo/components/admin/CadastroFormDialog.tsx` — toast erro
7. `src/features/catalogo/components/admin/produtos/ProdutoFormModal.tsx` — reset preco
8. `src/routes/catalogo.admin.frete.tsx` — validação CEP
9. `src/routes/catalogo.admin.cupons.tsx` — validação duplicidade
