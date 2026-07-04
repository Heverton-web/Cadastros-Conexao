# Análise do Banco de Dados — Módulo LinkTree

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Submódulo Colaboradores](#2-submódulo-colaboradores)
3. [Submódulo Empresa (Bio Instagram)](#3-submódulo-empresa-bio-instagram)
4. [Tema e Personalização](#4-tema-e-personalização)
5. [RLS Policies](#5-rls-policies)
6. [Permissões do Módulo](#6-permissões-do-módulo)
7. [Rotas do Frontend](#7-rotas-do-frontend)
8. [Migrações Relacionadas](#8-migrações-relacionadas)
9. [Diagrama de Relacionamentos](#9-diagrama-de-relacionamentos)

---

## 1. Visão Geral

O módulo **LinkTree** oferece **cartões digitais** e **páginas de links** (estilo Linktree/Bio Instagram) no ERP Conexão. O módulo é dividido em **dois submódulos**:

1. **LinkTree de Colaboradores** — cartão digital individual para cada colaborador/credencial, com foto, cargo, contatos e links para redes sociais. Geração de QR Code.
2. **LinkTree Empresa** — página de links estilo "Bio do Instagram" para a empresa, com seções, links personalizáveis, agendamento e analytics de cliques.

**Características da Arquitetura:**

- **6 tabelas** no total, divididas em 2 submódulos independentes
- **Acesso público**: SELECT liberado para anônimos nas tabelas de exibição pública
- **Multi-tenant**: todas as tabelas possuem `empresa_id`
- **Vínculo com credenciais**: colaboradores podem ser vinculados a credenciais existentes (`credencial_id`)
- **Tema customizável**: temas salvos como JSONB com configuração de cores, fontes, background e blobs decorativos
- **Agendamento de links**: links podem ser programados para aparecer em data específica
- **Analytics**: rastreamento de cliques com IP hash e user agent
- **QR Code**: geração de QR Code para cada cartão e página

---

## 2. Submódulo Colaboradores

### 2.1 `linktree_colaboradores` — Colaboradores

Cartão digital individual de cada colaborador, com informações de contato e vínculo com credenciais do sistema.

| Coluna | Tipo | Descrição | Origem |
|---|---|---|---|
| `id` | `uuid PK` | Identificador único | `00039` |
| `nome` | `text NOT NULL` | Nome do colaborador | `00039` |
| `cargo` | `text NOT NULL` | Cargo/função | `00039` |
| `email` | `text NOT NULL` | Email de contato | `00039` |
| `whatsapp` | `text NOT NULL` | WhatsApp | `00039` |
| `telefone_fixo` | `text` | Telefone fixo | `00039` |
| `foto_url` | `text` | URL da foto | `00039` |
| `status` | `text NOT NULL DEFAULT 'ativo'` | Status: `'ativo'` ou `'inativo'` | `00039` |
| `created_by` | `uuid FK → auth.users.id` | Quem criou (nullable após `00040`) | `00039` |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa proprietária | `00039` |
| `credencial_id` | `uuid FK → credenciais.id ON DELETE SET NULL` | Vínculo com credencial | `00040` |
| `created_at` | `timestamptz` | Data de criação | `00039` |
| `updated_at` | `timestamptz` | Data da última atualização | `00039` |

**Índices:**
- `linktree_colaboradores_empresa_idx` ON `linktree_colaboradores(empresa_id)`
- `linktree_colaboradores_created_by_idx` ON `linktree_colaboradores(created_by)`
- `linktree_colaboradores_status_idx` ON `linktree_colaboradores(status)`
- `linktree_colaboradores_credencial_idx` ON `linktree_colaboradores(credencial_id)` — (`00040`)
- `linktree_colaboradores_credencial_unique` ON `linktree_colaboradores(credencial_id)` WHERE `credencial_id IS NOT NULL` — (`00040`)

**Trigger:** `linktree_colaboradores_set_updated_at` — atualiza `updated_at` automaticamente

---

## 3. Submódulo Empresa (Bio Instagram)

Introduzido na migração `00053`. Fornece uma página de links estilo "Bio do Instagram" para cada empresa, com seções, links, agendamento e analytics.

### 3.1 `linktree_empresa_config` — Configuração da Página

Singleton por empresa — uma página de links por empresa.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE UNIQUE` | Empresa (um por empresa) |
| `slug` | `text UNIQUE NOT NULL` | Slug único para URL pública |
| `bio` | `text` | Biografia/texto de apresentação |
| `banner_url` | `text` | URL do banner/imagem de topo |
| `theme` | `jsonb NOT NULL` | Configuração de tema (cores, botões, fontes) |
| `updated_at` | `timestamptz` | Data da atualização |
| `updated_by` | `uuid FK → auth.users.id ON DELETE SET NULL` | Quem atualizou |

**Índices:** `slug`, `empresa_id`

---

### 3.2 `linktree_empresa_sections` — Seções

Agrupam os links em categorias.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `titulo` | `text NOT NULL` | Título da seção |
| `ordem` | `int NOT NULL` | Ordem de exibição |
| `created_at` | `timestamptz` | Data de criação |

**Índice:** `empresa_id`

---

### 3.3 `linktree_empresa_links` — Links

Links individuais dentro das seções.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `section_id` | `uuid FK → linktree_empresa_sections.id ON DELETE CASCADE` | Seção |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `titulo` | `text NOT NULL` | Título do link |
| `url` | `text NOT NULL` | URL de destino |
| `icone` | `text` | Ícone (Lucide) |
| `destaque` | `boolean NOT NULL` | Se é destaque |
| `ativo` | `boolean NOT NULL DEFAULT true` | Se está ativo |
| `agendado_inicio` | `timestamptz` | Data de início do agendamento |
| `agendado_fim` | `timestamptz` | Data de fim do agendamento |
| `ordem` | `int NOT NULL` | Ordem dentro da seção |
| `created_at` | `timestamptz` | Data de criação |

**Índices:** `empresa_id`, `section_id`, `(empresa_id, ativo)`

---

### 3.4 `linktree_empresa_clicks` — Analytics de Cliques

Registro de cliques nos links para analytics.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `link_id` | `uuid FK → linktree_empresa_links.id ON DELETE CASCADE` | Link clicado |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `clicked_at` | `timestamptz NOT NULL` | Data/hora do clique |
| `ip_hash` | `text` | Hash do IP (anonimizado) |
| `user_agent` | `text` | User agent do navegador |

**Índices:** `link_id`, `empresa_id`, `(empresa_id, clicked_at)`

---

### 3.5 `linktree_tema_config` — Tema do LinkTree (Colaboradores)

Configuração de tema visual para os cartões dos colaboradores (separada do tema da empresa).

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `text PK` | Chave textual identificadora |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `config` | `jsonb NOT NULL` | Configuração completa do tema |
| `updated_at` | `timestamptz` | Data da atualização |
| `updated_by` | `uuid FK → auth.users.id ON DELETE SET NULL` | Quem atualizou |

**Índice:** `empresa_id`

**Estrutura do Tema (JSONB):**
```json
{
  "background": {
    "mode": "solid|gradient2|gradient3",
    "solid": "#0f172a",
    "gradientFrom": "#0f172a",
    "gradientTo": "#1e293b",
    "gradientAngle": 160,
    "blobsEnabled": false,
    "blobs": [{ "enabled": true, "color": "#c9a655", "position": "tr", "size": 320, "opacity": 0.35 }]
  },
  "icons": { "pack": "lucide|filled|outline", "pathColor": "#0f172a", "bgColor": "#c9a655" },
  "typography": {
    "nome": { "font": "Outfit", "color": "#f8fafc" },
    "cargo": { "font": "Outfit", "color": "#c9a655" },
    "contato": { "font": "Outfit", "color": "#f8fafc" },
    "institucional": { "font": "Outfit", "color": "#94a3b8" }
  },
  "institucional": {
    "nomeEmpresa": "Conexão Implantes",
    "endereco": "Av. Principal, 1000 - São Paulo, SP",
    "site": "https://www.conexao.com.br",
    "logoUrl": "",
    "instagram": "https://instagram.com/...",
    "youtube": "https://youtube.com/...",
    "socialColors": { "instagram": "#E1306C", "linkedin": "#0A66C2", ... }
  }
}
```

---

## 4. Tema e Personalização

### Temas dos Colaboradores

O tema visual dos cartões digitais é armazenado em `linktree_tema_config` como JSONB com a estrutura `LinktreeThemeConfig`. Suporta:

- **Background**: sólido, gradiente 2 cores, gradiente 3 cores, com blobs decorativos (até 9 posições)
- **Ícones**: pacotes Lucide, filled ou outline, com cor de fundo e caminho
- **Tipografia**: fontes separadas para nome, cargo, contato e institucional (cores individuais)
- **Institucional**: nome da empresa, endereço, logo, redes sociais (Instagram, LinkedIn, Facebook, YouTube) com cores individuais

### Temas da Empresa

O tema da página de links da empresa (submódulo 00053) segue a estrutura `EmpresaLinktreeTheme`:

- **Background**: sólido ou gradiente
- **Botões**: estilo (rounded/square/pill), cor de fundo, cor do texto, border radius, sombra
- **Tipografia**: fonte, cor do título, cor da bio

---

## 5. RLS Policies

### 5.1 `linktree_colaboradores`

| Operação | Policy | Descrição |
|---|---|---|
| `SELECT` (anon) | `linktree_colaboradores_select_anon` | Anônimos veem apenas colaboradores com `status = 'ativo'` |
| `SELECT` (auth) | `linktree_colaboradores_select_auth` | Super admin ou mesma empresa |
| `INSERT` | `linktree_colaboradores_insert_auth` | Super admin ou `created_by = auth.uid()` |
| `UPDATE` | `linktree_colaboradores_update_auth` | Super admin ou `created_by = auth.uid()` |
| `DELETE` | `linktree_colaboradores_delete_auth` | Super admin ou `created_by = auth.uid()` |

### 5.2 `linktree_tema_config`

| Operação | Policy |
|---|---|
| `SELECT` | **Público** (`USING (true)`) |
| `INSERT` | Autenticados |
| `UPDATE` | Autenticados |

### 5.3 `linktree_empresa_config`, `linktree_empresa_sections`, `linktree_empresa_links`

| Operação | Policy |
|---|---|
| `SELECT` | **Público** (`USING (true)`) |
| `INSERT` | Super admin ou `empresa_id = get_current_empresa_id()` |
| `UPDATE` | Super admin ou `empresa_id = get_current_empresa_id()` |
| `DELETE` | Super admin ou `empresa_id = get_current_empresa_id()` |

### 5.4 `linktree_empresa_clicks`

| Operação | Policy |
|---|---|
| `SELECT` | Autenticados: super admin ou mesma empresa |
| `INSERT` | **Público** (qualquer um pode registrar clique) |

### Resumo de Acessos por Role

| Tabela | anon | authenticated | service_role |
|---|---|---|---|
| `linktree_colaboradores` | SELECT (status=ativo) | ALL | ALL |
| `linktree_tema_config` | SELECT | SELECT, INSERT, UPDATE | ALL |
| `linktree_empresa_config` | SELECT | ALL (filtro empresa) | ALL |
| `linktree_empresa_sections` | SELECT | ALL (filtro empresa) | ALL |
| `linktree_empresa_links` | SELECT | ALL (filtro empresa) | ALL |
| `linktree_empresa_clicks` | INSERT | SELECT (filtro empresa), INSERT | ALL |

---

## 6. Permissões do Módulo

Definidas em `src/features/linktree/permissions.ts`.

### Lista de Permissões

| Chave | Label | Grupo |
|---|---|---|
| `lt_ver_dashboard` | Ver dashboard LinkTree | LinkTree |
| `lt_criar_colaborador` | Criar colaborador | LinkTree |
| `lt_editar_colaborador` | Editar colaborador | LinkTree |
| `lt_excluir_colaborador` | Excluir colaborador | LinkTree |
| `lt_toggle_status` | Ativar/inativar colaborador | LinkTree |
| `lt_ver_link` | Visualizar link público | LinkTree |
| `lt_ver_qr` | Visualizar QR Code | LinkTree |
| `lt_baixar_qr` | Baixar QR Code | LinkTree |
| `lt_gerenciar_tema` | Gerenciar tema | LinkTree |
| `lt_empresa_ver` | Ver linktree da empresa | LinkTree Empresa |
| `lt_empresa_editar` | Editar linktree da empresa | LinkTree Empresa |
| `lt_empresa_ver_analytics` | Ver analytics do linktree | LinkTree Empresa |
| `lt_empresa_gerar_qr` | Gerar QR Code do linktree | LinkTree Empresa |

### Defaults por Ambiente

| Ambiente | Dashboard | CRUD Colab. | Ver/Baixar QR | Ger. Tema | Empresa Ver | Empresa Editar | Analytics |
|---|---|---|---|---|---|---|---|
| `cadastro` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `consultor` | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| `tecnologia` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `suporte` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 7. Rotas do Frontend

### Páginas do Módulo (12 rotas)

| Rota | Arquivo | Descrição |
|---|---|---|
| `/linktree/dashboard` | `src/routes/linktree.dashboard.tsx` | Dashboard de colaboradores |
| `/linktree/empresa` | `src/routes/linktree.empresa.tsx` | Painel do linktree da empresa |
| `/linktree/empresa/editor` | `src/routes/linktree.empresa.editor.tsx` | Editor do linktree da empresa |
| `/linktree/$id` | `src/routes/linktree.$id.tsx` | Página pública do colaborador |
| `/linktree/tema` | `src/routes/linktree.tema.tsx` | Edição de tema (colaboradores) |
| `/linktree/design` | `src/routes/linktree.design.tsx` | Configuração de design |
| `/empresa/linktree-tema` | `src/routes/empresa.linktree-tema.tsx` | Tema por empresa |
| `/empresa/linktree-design` | `src/routes/empresa.linktree-design.tsx` | Design por empresa |
| `/marketing/linktree` | `src/routes/marketing.linktree.tsx` | Marketing - LinkTree |
| `/marketing/linktree/editor` | `src/routes/marketing.linktree.editor.tsx` | Editor marketing |
| `/marketing/linktree/tema` | `src/routes/marketing.linktree.tema.tsx` | Tema marketing |
| `/marketing/linktree/design` | `src/routes/marketing.linktree.design.tsx` | Design marketing |

### Estrutura de Componentes (29 arquivos)

```
src/features/linktree/
├── components/
│   ├── AnalyticsPanel.tsx
│   ├── DynamicIcon.tsx
│   ├── EmpresaLinktreeCard.tsx
│   ├── EmpresaLinktreeDashboard.tsx
│   ├── EmpresaLinktreeEditor.tsx
│   ├── EmpresaLinktreePreview.tsx
│   ├── EmpresaQrModal.tsx
│   ├── EmpresaSelector.tsx
│   ├── IconPicker.tsx
│   ├── LinkForm.tsx
│   ├── LinksList.tsx
│   ├── LinkTreeCard.tsx
│   ├── LinktreeColaboradorModal.tsx
│   ├── LinktreeDashboardPage.tsx
│   ├── LinktreeQrModal.tsx
│   ├── LinktreeTemaPage.tsx
│   ├── LinktreeThemeEditor.tsx
│   ├── PublicEmpresaLinktree.tsx
│   ├── PublicLinkTreePage.tsx
│   ├── SectionManager.tsx
│   └── ThemePanel.tsx
├── hooks/
│   └── useEmpresaLinktree.ts
├── lib/
│   └── image-utils.ts
├── services/
│   └── empresa.ts
├── module.ts
├── permissions.ts
├── types.ts
├── types-empresa.ts
└── index.ts
```

---

## 8. Migrações Relacionadas

| Migration | Descrição |
|---|---|
| `00039_linktree_module.sql` | **CORE (Colaboradores)**: `linktree_colaboradores`, `linktree_tema_config` + RLS + índices |
| `00040_linktree_credencial_id.sql` | Adiciona `credencial_id` FK + índice único, torna `created_by` nullable |
| `00053_empresa_linktree.sql` | **CORE (Empresa)**: `linktree_empresa_config`, `linktree_empresa_sections`, `linktree_empresa_links`, `linktree_empresa_clicks` + RLS + índices |

---

## 9. Diagrama de Relacionamentos

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              empresas                                         │
└──┬───────────────────────────────────────────────────────────────────────────┘
   │ 1:N
┌──▼──────────────────────────────────────────────────────────────────────────┐
│ ┌──────────────── SUBMÓDULO COLABORADORES ──────────────────────────────┐   │
│ │                                                                        │   │
│ │  linktree_colaboradores                        linktree_tema_config    │   │
│ │  id (PK) │ nome │ cargo │ email               id (TEXT PK)            │   │
│ │  whatsapp │ telefone_fixo │ foto_url          empresa_id               │   │
│ │  status (ativo/inativo) │ empresa_id          config (JSONB) ← tema   │   │
│ │  credencial_id? → credenciais (00040)         updated_by → auth.users  │   │
│ │  created_by → auth.users (nullable 00040)                              │   │
│ └────────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│ ┌──────────────── SUBMÓDULO EMPRESA ───────────────────────────────────┐   │
│ │                                                                        │   │
│ │  linktree_empresa_config (singleton/empresa)                          │   │
│ │  id (PK) │ empresa_id (UNIQUE) │ slug (UNIQUE)                        │   │
│ │  bio │ banner_url │ theme (JSONB)                                      │   │
│ │                                                                        │   │
│ │  ┌──────────────────────────────────────────────────────────┐         │   │
│ │  │  linktree_empresa_sections                               │         │   │
│ │  │  id (PK) │ empresa_id │ titulo │ ordem                   │         │   │
│ │  └────────────────┬─────────────────────────────────────────┘         │   │
│ │                   │ 1:N                                               │   │
│ │  ┌────────────────▼─────────────────────────────────────────┐         │   │
│ │  │  linktree_empresa_links                                  │         │   │
│ │  │  id (PK) │ section_id │ empresa_id │ titulo │ url        │         │   │
│ │  │  icone │ destaque │ ativo │ ordem                        │         │   │
│ │  │  agendado_inicio │ agendado_fim                          │         │   │
│ │  └────────────────┬─────────────────────────────────────────┘         │   │
│ │                   │ 1:N                                               │   │
│ │  ┌────────────────▼─────────────────────────────────────────┐         │   │
│ │  │  linktree_empresa_clicks  [LOG IMUTÁVEL]                  │         │   │
│ │  │  id (PK) │ link_id │ empresa_id │ clicked_at              │         │   │
│ │  │  ip_hash (anonimizado) │ user_agent                       │         │   │
│ │  └──────────────────────────────────────────────────────────┘         │   │
│ └────────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         credenciais                                          │
│  (vinculado via credencial_id - opcional)                                    │
│  id │ nome_completo │ email_corporativo │ departamento                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Notas Finais

1. **Dois Submódulos Independentes**: O módulo LinkTree na verdade são dois produtos diferentes na mesma feature:
   - **Colaboradores** (00039): cartão digital individual com tema visual rico — foco em representantes/consultores
   - **Empresa** (00053): página estilo Bio Instagram — foco na empresa como um todo

2. **Vínculo com Credenciais**: A migração `00040` adicionou `credencial_id` para vincular colaboradores a credenciais existentes. O `UNIQUE INDEX` com `WHERE credencial_id IS NOT NULL` garante que uma credencial só pode ter um linktree.

3. **SELECT Público Estratégico**: As tabelas públicas (`linktree_colaboradores` com filtro `ativo`, `linktree_empresa_config`, `linktree_empresa_sections`, `linktree_empresa_links`) têm SELECT liberado para anônimos — essencial para as páginas públicas compartilháveis.

4. **Cliques sem Autenticação**: `linktree_empresa_clicks` aceita INSERT de qualquer um (inclusive anônimos) para rastrear cliques. Dados como `ip_hash` são anonimizados para privacidade.

5. **Agendamento de Links**: As colunas `agendado_inicio` e `agendado_fim` permitem programar links promocionais para aparecerem apenas em períodos específicos.

6. **Tema Rico**: O tema dos colaboradores é um dos mais complexos do sistema, com 60+ propriedades de customização visual (blobs decorativos, gradientes, fontes individuais por elemento, redes sociais com cores separadas).

7. **Nav Items no Módulo Marketing**: Apesar do módulo ser `linktree`, alguns nav items estão registrados com `moduloKey: "marketing"`, indicando compartilhamento de navegação entre módulos.
