# Form Builder — Personalização do Formulário do Lead pelo SuperAdmin

**Branch:** `feature/form-builder-superadmin`
**Data:** 2026-06-20

---

## Objetivo

O SuperAdmin poderá personalizar **completamente** o formulário que o lead preenche durante o pré-cadastro:

- **Visibilidade e obrigatoriedade** de cada campo (dados e documentos) por tipo de pessoa (PF / PJ)
- **Ocultação** de campos e documentos padrão do sistema
- **Criação de novos campos customizados** em qualquer etapa (texto, área, select, múltipla escolha, checkbox, data, tel, email)
- **Criação de novos documentos** além dos padrões existentes
- Toda configuração é armazenada no banco e consumida dinamicamente pelo formulário do lead

---

## Arquitetura — Tabela `form_schema`

```sql
CREATE TABLE public.form_schema (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_pessoa  TEXT NOT NULL CHECK (tipo_pessoa IN ('PF','PJ','ambos')),
  etapa        TEXT NOT NULL CHECK (etapa IN ('dados','endereco','documentos')),
  campo_key    TEXT NOT NULL,
  label        TEXT NOT NULL,
  tipo_input   TEXT NOT NULL DEFAULT 'text',
  opcoes       JSONB DEFAULT '[]'::jsonb,
  obrigatorio  BOOL NOT NULL DEFAULT true,
  visivel      BOOL NOT NULL DEFAULT true,
  ordem        INT  NOT NULL DEFAULT 0,
  is_custom    BOOL NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tipo_pessoa, campo_key)
);
```

**RLS:** leitura pública (lead precisa ler schema), escrita restrita a `is_super_admin = true`.

---

## Arquivos Criados / Modificados

### [NEW] `supabase/migrations/00018_form_schema.sql`

- Cria tabela `form_schema`
- Aplica RLS (read all, write superadmin)
- Seed completo com todos os campos padrão PF, PJ, endereço e documentos

### [NEW] `src/lib/form-schema.ts`

- `carregarSchema(tipo_pessoa, etapa)` — busca campos filtrados (visíveis)
- `listarTodosCampos()` — todos os campos (para o admin)
- `salvarCampo(campo)` — upsert via Supabase
- `excluirCampo(id)` — só campos `is_custom = true`
- `reordenarCampos(atualizacoes)` — bulk update de `ordem`

### [NEW] `src/components/admin/FormBuilderTab.tsx`

- Interface de gerenciamento com sub-navegação por seção (Dados PF / Dados PJ / Endereço / Docs PF / Docs PJ)
- Toggle visual de visibilidade (ícone olho)
- Toggle visual de obrigatoriedade (asterisco)
- Botões ↑↓ para reordenação
- Edição inline de label
- Exclusão de campos custom
- Modal "+ Novo Campo" com seletor de tipo, opções dinâmicas para select/checkbox

### [MODIFY] `src/routes/admin.config.tsx`

- Novo tab `"formulario"` com ícone `FormInput`
- Importa e renderiza `<FormBuilderTab />`

### [MODIFY] `src/routes/pre-cadastro.$token.tsx`

- Substitui JSX hardcoded de campos por renderização dinâmica
- Consome `carregarSchema()` ao entrar em cada etapa
- Renderiza o componente correto por `tipo_input`
- Campos extras custom salvos em `dados_extras JSONB` (nova coluna em `cadastros`)

### [NEW] `supabase/migrations/00019_dados_extras.sql`

- Adiciona coluna `dados_extras JSONB` na tabela `cadastros`

---

## Decisões de Design

| Questão                | Decisão                                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| Reordenação            | Botões ↑↓ (sem dependência extra de DnD)                                                                   |
| Campos custom no banco | Salvos em `dados_extras JSONB` da tabela `cadastros`                                                       |
| Retroatividade         | Campos ocultados apenas param de aparecer para novos acessos; dados já preenchidos são preservados         |
| Campos padrão          | Podem ter visibilidade/obrigatoriedade alteradas, mas não podem ser excluídos (apenas `is_custom = false`) |

---

## Verificação

```bash
npx tsc --noEmit   # zero erros TypeScript
```

- Admin: `/admin/config` → aba "Formulário" — configurar campos e ver reflexo no lead
- Lead: acessar link → formulário renderizado conforme config do banco
