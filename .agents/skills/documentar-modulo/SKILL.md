---
name: documentar-modulo
description: >
  Gera documentação completa de um módulo do ERP Conexão a partir do código-fonte.
  Trigger: /doc <nome_modulo>
---

# Skill: Documentar Módulo

**Trigger:** `/doc <nome_modulo>`

Gera documentação completa de um módulo em `docs-projeto/doc-modulos/<modulo>.md`.

## Argumento

O usuário fornece o nome do módulo (key), ex: `/doc despesas`, `/doc crm`, `/doc rotas`.

## Workflow

### Passo 1: Validar módulo

1. Verificar se `src/features/<modulo>/` existe
2. Se NÃO existe → listar diretórios em `src/features/` e sugerir. PARAR.
3. Ler `src/features/<modulo>/module.ts` — extrair `ModuleDefinition`
4. Ler `src/features/<modulo>/permissions.ts` — extrair array de permissões

### Passo 2: Mapear estrutura do diretório

Listar recursivamente `src/features/<modulo>/` e gerar árvore:

```
src/features/<modulo>/
├── module.ts
├── permissions.ts
├── index.ts
├── types.ts
├── components/
│   ├── ComponenteA.tsx
│   └── SubPasta/
│       └── ComponenteB.tsx
├── hooks/
│   └── useExemplo.ts
├── services/
│   └── exemploService.ts
└── ...
```

Contar arquivos por diretório para estatísticas.

### Passo 3: Analisar rotas

Para cada rota em `module.ts → routes`:

1. Buscar arquivo em `src/routes/` que mapeia essa rota:
   - Convenção: `/modulo/sub` → `src/routes/modulo.sub.tsx` (ou `_auth.modulo.sub.tsx`)
2. Ler o arquivo de rota → extrair componente importado
3. Determinar quem acessa via nav items (permissionCheck) ou inferir da rota

### Passo 4: Extrair nav items

Ler chamadas `registerNavItem()` em `module.ts`. Para cada uma extrair:
- `id`, `label`, `icon`, `to` (rota), `permissionCheck` (permissão), `order`

### Passo 5: Extrair permission defaults

Ler `registerPermissionDefaults()` em `module.ts`. Montar mapa:
- Permissão → cadastro (true/false), consultor, tecnologia, suporte

### Passo 6: Analisar dependências

1. Ler imports em `services/` — identificar tabelas Supabase usadas
2. Ler imports de outros módulos (se `~/features/outro-modulo/` aparece)

### Passo 7: Extrair schema das tabelas exclusivas

1. Identificar tabelas Supabase exclusivas do módulo (definidas em `supabase/migrations/`)
2. Buscar a criação original da tabela com `grep -l "create table.*<tabela>" supabase/migrations/*.sql`
3. Ler a migration de criação e todas as migrations posteriores que adicionam colunas (`ALTER TABLE ... ADD COLUMN`)
4. Montar o schema SQL consolidado com todas as colunas, tipos, constraints e defaults
5. Excluir tabelas que não são exclusivas do módulo (ex: `profiles`, `empresas`)

### Passo 8: Gerar documento

Montar Markdown com as seções abaixo e salvar em `docs-projeto/doc-modulos/<modulo>.md`.

Se o diretório `docs-projeto/doc-modulos/` não existir, criá-lo.

### Passo 9: Retornar resumo

Exibir ao usuário:
- Caminho do arquivo gerado
- Estatísticas: nº de rotas, permissões, componentes, hooks, services

---

## Template de Saída

O documento gerado deve seguir EXATAMENTE esta estrutura:

```markdown
# <Nome do Módulo>

> <Descrição do módulo (de module.ts → descricao)>

**Key:** `<key>` | **Ícone:** `<Icon>` | **Ambientes:** `<ambientes join=", ">`

---

## 1. Core do Módulo

<Parágrafo descrevendo O QUE o usuário realiza ao utilizar este módulo.
Inferir das rotas, permissões, componentes e descrição.
Exemplo: "O consultor planeja rotas de visita no mapa, executa as visitas
em campo registrando fotos e observações, e lança despesas para reembolso.
O gestor aprova despesas e acompanha relatórios de desempenho.">

---

## 2. Estrutura do Módulo

\```
<árvore completa do diretório>
\```

| Diretório | Arquivos | Descrição |
|-----------|----------|-----------|
| `components/` | N | Componentes React (páginas, modais, cards) |
| `hooks/` | N | Hooks React (React Query wrappers) |
| `services/` | N | Camada de acesso ao Supabase |
| `lib/` | N | Utilitários e helpers |
| `types/` | N | Definições TypeScript |

---

## 3. Rotas

| Rota | Componente | Descrição | Acesso |
|------|-----------|-----------|--------|
| `/<modulo>/` | `<Componente>` | <descrição inferida> | <permissão ou "Todos autenticados"> |
| `/<modulo>/sub` | `<Componente>` | <descrição inferida> | `<permissão>` |

---

## 4. Permissões

| Chave | Label | Descrição | Grupo |
|-------|-------|-----------|-------|
| `<key>` | <label> | <description> | <group> |

---

## 5. Defaults por Papel

| Permissão | Cadastro | Consultor | Tecnologia | Suporte |
|-----------|----------|-----------|------------|---------|
| `<key>` | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |

---

## 6. Navegação (Sidebar)

| Label | Rota | Ícone | Permissão | Ordem |
|-------|------|-------|-----------|-------|
| <label> | <to> | <icon> | `<permissão>` | N |

---

## 7. Eventos / Webhooks

| Chave | Label | Descrição | Tipo |
|-------|-------|-----------|------|
| `<key>` | <label> | <description> | `status_change` / `button_action` |

---

## 8. Funcionalidades

| Flag | Ativo | Detalhe |
|------|-------|---------|
| Design Config | ✅/❌ | `<designRoute>` |
| Credenciais | ✅/❌ | |
| Laboratório | ✅/❌ | |
| Formulário | ✅/❌ | |
| Ações Customizadas | ✅/❌ | |
| API Connectors | ✅/❌ | |

---

## 9. Dependências

### Tabelas Supabase

| Tabela | Uso |
|--------|-----|
| `<tabela>` | <descrição do uso no service> |

### Módulos Relacionados

| Módulo | Tipo de Relação |
|--------|-----------------|
| `<modulo>` | <descrição> |

---

## 10. Schema das Tabelas

> Schema SQL consolidado das tabelas exclusivas do módulo. Colunas adicionadas via migrations estão incluídas.

### `<tabela>`

\```sql
create table public.<tabela> (
  id          uuid primary key default gen_random_uuid(),
  <coluna>    <tipo> <constraints>,
  ...
  empresa_id  uuid references public.empresas(id) on delete cascade,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
\```

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identificador único |
| `<coluna>` | `<tipo>` | `<constraints>` | <descrição> |

---

## 11. Notas

- <Qualquer observação relevante sobre o módulo>
- <Padrões específicos usados>
- <Pontos de atenção>
```

---

## Regras

1. **NUNCA inventar informações** — tudo vem do código-fonte
2. Se um arquivo não existe (ex: não tem `types.ts`), não listing na árvore
3. Se `permissions.ts` não existe, marcar "Sem permissões granulares"
4. Se `registerPermissionDefaults` não existe na module.ts, marcar "Sem defaults configurados"
5. Para rotas sem componente identificável, usar "—"
6. A descrição do Core deve ser um parágrafo coeso, não uma lista
7. Usar ✅ para true e ❌ para false nas tabelas de defaults
8. Se o módulo tem sub-módulos (ex: marketing), listar na árvore mas documentar apenas o escopo principal

---

## Módulos Disponíveis

```
admin, api-connectors, cadastros, clientes, consultor, credenciais,
crm, dashboard, demos, despesas, documentos, empresas, form-schema,
funis, hub, integracoes, linktree, mapas, marketing, nps, paytrack,
precadastro, relatorios, revisoes, rotas
```
