# Análise das Funções — Módulo LinkTree

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral do Módulo](#1-visão-geral-do-módulo)
2. [Funções do Módulo](#2-funções-do-módulo)
3. [Referências Técnicas](#3-referências-técnicas)

---

## 1. Visão Geral do Módulo

O módulo **LinkTree** gerencia cartões digitais e QR Codes para colaboradores, além de uma página Bio Instagram para a empresa. Possui 2 submódulos independentes: **Colaboradores** e **Empresa Bio**.

| Aspecto | Detalhe |
|---|---|
| **Key** | `linktree` |
| **Descrição** | Cartões digitais e QR Codes dos colaboradores |
| **Ambientes** | cadastro, consultor, tecnologia |
| **Permissões** | 13 funções granulares |
| **Eventos** | 3 webhooks |
| **Rotas** | 6 páginas |
| **Design Config** | ✅ `/empresa/linktree/design` |

---

## 2. Funções do Módulo

### 2.1 Função: Dashboard LinkTree

**Rota**: `/linktree/dashboard`
**Permissão**: `lt_ver_dashboard`

Painel com lista de colaboradores, status (ativo/inativo), QR Codes. Ações: criar, editar, ativar/inativar, excluir.

---

### 2.2 Função: LinkTree da Empresa (Bio Instagram)

**Rota**: `/linktree/empresa`
**Permissão**: `lt_empresa_ver`

Página institucional da empresa com links personalizados (WhatsApp, Instagram, site, etc.), seções e analytics de cliques.

---

### 2.3 Função: Editor LinkTree Empresa

**Rota**: `/linktree/empresa/editor`
**Permissão**: `lt_empresa_editar`

Editor visual do linktree da empresa: adicionar/remover/reordenar seções e links, personalizar aparência.

---

### 2.4 Função: Tema LinkTree

**Rota**: `/linktree/tema`
**Permissão**: `lt_gerenciar_tema`

Personalização de cores, fontes e layout dos cartões digitais dos colaboradores. 60+ propriedades JSONB.

---

### 2.5 Funções Granulares (13)

| Key | Grupo | Descrição |
|---|---|---|
| `lt_ver_dashboard` | LinkTree | Visualizar painel de colaboradores |
| `lt_criar_colaborador` | LinkTree | Criar novos colaboradores |
| `lt_editar_colaborador` | LinkTree | Editar dados de colaboradores |
| `lt_excluir_colaborador` | LinkTree | Excluir colaboradores |
| `lt_toggle_status` | LinkTree | Ativar/inativar colaborador |
| `lt_ver_link` | LinkTree | Acessar Link Tree público |
| `lt_ver_qr` | LinkTree | Visualizar QR Code |
| `lt_baixar_qr` | LinkTree | Baixar QR Code PNG |
| `lt_gerenciar_tema` | LinkTree | Personalizar cores/fontes |
| `lt_empresa_ver` | LinkTree Empresa | Ver painel linktree empresa |
| `lt_empresa_editar` | LinkTree Empresa | Editar links/config da empresa |
| `lt_empresa_ver_analytics` | LinkTree Empresa | Ver relatório de cliques |
| `lt_empresa_gerar_qr` | LinkTree Empresa | Gerar QR Code do linktree |

---

### 2.6 Eventos (3)

| Evento | Dispara quando |
|---|---|
| `colaborador.criado` | Novo colaborador cadastrado |
| `colaborador.ativado` | Colaborador ativado |
| `colaborador.inativado` | Colaborador inativado |

---

## 3. Referências Técnicas

| Arquivo | Função |
|---|---|
| `src/features/linktree/module.ts` | Definição do módulo, nav-items |
| `src/features/linktree/permissions.ts` | 13 permissões |
| `src/features/linktree/types.ts` | Types do módulo |
| `src/features/linktree/types-empresa.ts` | Types do submódulo empresa |
| `supabase/migrations/00039_linktree_module.sql` | Tabelas `linktree_*` |
| `supabase/migrations/00053_empresa_linktree.sql` | Tabelas `linktree_empresa_*` |
