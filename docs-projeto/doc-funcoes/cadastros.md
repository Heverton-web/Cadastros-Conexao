# Análise das Funções — Módulo Cadastros

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral do Módulo](#1-visão-geral-do-módulo)
2. [Funções do Módulo](#2-funções-do-módulo)
3. [Referências Técnicas](#3-referências-técnicas)

---

## 1. Visão Geral do Módulo

O módulo **Cadastros** é o módulo central do ERP Conexão. Gerencia o fluxo completo de cadastro de clientes (Pessoa Física e Jurídica), desde a geração de links de cadastro até a aprovação final.

| Aspecto | Detalhe |
|---|---|
| **Key** | `cadastros` |
| **Descrição** | Gestão de cadastro de clientes PF/PJ |
| **Ambientes** | cadastro, consultor, tecnologia, suporte |
| **Permissões** | 17 funções granulares |
| **Eventos** | 6 webhooks |
| **Rotas** | 7 páginas principais |
| **Design Config** | ✅ `/empresa/cadastros/design` |

---

## 2. Funções do Módulo

### 2.1 Função: Dashboard de Cadastros

**ANÁLISE 1 — Visão Geral**: Página principal `/cadastros/dashboard` que exibe KPIs e métricas do módulo de cadastros. Mostra total de cadastros, aprovações, reprovações, e links gerados.

**ANÁLISE 2 — Quem utiliza**: Usuários com permissão `ver_todos_cadastros = true`. Por padrão: ambiente **cadastro** (true), **consultor** (false).

**ANÁLISE 3 — Quando**: Ao acessar a rota `/cadastros/dashboard`. É a primeira página ao entrar no módulo.

**ANÁLISE 4 — Como**: Via nav-item no menu lateral. Ícone `LayoutDashboard`. Ordem 1 no módulo.

**ANÁLISE 5 — O que faz**: 
- Exibe cards com métricas (total, aprovados, pendentes, reprovados)
- Gráficos de tendência
- Alertas de documentos pendentes
- Atalhos para ações rápidas

---

### 2.2 Função: Solicitações de Cadastro

**ANÁLISE 1 — Visão Geral**: Página `/cadastros/solicitacoes` que lista todos os cadastros em andamento para revisão e aprovação.

**ANÁLISE 2 — Quem utiliza**: Usuários com `ver_todos_cadastros = true` ou `gerar_links = true`.

**ANÁLISE 3 — Quando**: Para revisar, aprovar ou reprovar solicitações de cadastro.

**ANÁLISE 4 — Como**: Via nav-item "Solicitações" (ordem 2) no menu lateral. Match de rota também para `/cadastros/solicitacoes/$id`.

**ANÁLISE 5 — O que faz**:
- Lista filtrada de cadastros por status (pendente, aprovado, reprovado)
- Ações: aprovar, reprovar, solicitar correção
- Visualização de documentos anexados
- Aprovação/reprovação de campos individuais

---

### 2.3 Função: Clientes (Tabela)

**ANÁLISE 1 — Visão Geral**: Página `/cadastros/clientes` que lista todos os clientes já aprovados no sistema.

**ANÁLISE 2 — Quem utiliza**: Usuários com `ver_todos_cadastros = true` ou `gerar_links = true`.

**ANÁLISE 3 — Quando**: Para consultar clientes cadastrados, exportar dados ou gerenciar.

**ANÁLISE 4 — Como**: Via nav-item "Clientes" (ordem 3).

**ANÁLISE 5 — O que faz**:
- Tabela com busca e filtros
- Exportação de dados
- Acesso a detalhes do cliente
- Exclusão de cadastros (se `excluir_cadastro = true`)

---

### 2.4 Função: Consultor (Visão do Consultor)

**ANÁLISE 1 — Visão Geral**: Página `/cadastros/consultor` com visão limitada para consultores de campo. Acessível também via `/cadastros/consultor/clientes`.

**ANÁLISE 2 — Quem utiliza**: Usuários com `gerar_links = true`. Por padrão: ambiente **consultor** (true).

**ANÁLISE 3 — Quando**: Consultores acessam para gerar links de cadastro e ver seus clientes.

**ANÁLISE 4 — Como**: Via nav-item "Consultor" (ordem 4).

**ANÁLISE 5 — O que faz**:
- Geração de links de cadastro (WhatsApp, e-mail)
- Visualização dos próprios cadastros
- Acompanhamento de status dos leads

---

### 2.5 Função: Relatórios

**ANÁLISE 1 — Visão Geral**: Página `/cadastros/relatorios` com análises e exportações.

**ANÁLISE 2 — Quem utiliza**: Usuários com `ver_relatorios = true`.

**ANÁLISE 3 — Quando**: Para gerar relatórios de desempenho, exportar dados.

**ANÁLISE 4 — Como**: Via nav-item "Relatórios" (ordem 5).

**ANÁLISE 5 — O que faz**:
- Relatórios de cadastros por período
- Métricas de aprovação/reprovação
- Exportação CSV/Excel

---

### 2.6 Funções Granulares (17 Permissões)

| Key | Grupo | Descrição |
|---|---|---|
| `ver_todos_cadastros` | Escopo de Dados | Ver todos os cadastros da empresa |
| `ver_relatorios` | Visualização | Acessar página de relatórios |
| `visualizar_documento` | Visualização | Abrir arquivos de documentos |
| `aprovar_cadastro` | Aprovação de Cadastro | Aprovar cadastro (definir código) |
| `reprovar_cadastro` | Aprovação de Cadastro | Reprovar cadastro |
| `solicitar_correcao_cadastro` | Aprovação de Cadastro | Solicitar correção |
| `aprovar_documento` | Aprovação de Documentos | Aprovar documentos anexados |
| `reprovar_documento` | Aprovação de Documentos | Reprovar documentos |
| `solicitar_correcao_documento` | Aprovação de Documentos | Solicitar correção de docs |
| `aprovar_campo` | Aprovação de Campos | Aprovar campos individuais |
| `reprovar_campo` | Aprovação de Campos | Reprovar campos |
| `solicitar_correcao_campo` | Aprovação de Campos | Solicitar correção de campos |
| `gerenciar_credenciais` | Credenciais | Ver e ativar/inativar usuários |
| `gerenciar_credenciais_admin` | Credenciais | Criar/editar/deletar credenciais |
| `excluir_cadastro` | Administração | Excluir cadastros permanentemente |
| `gerenciar_config` | Administração | Configurações do sistema |
| `gerar_links` | Geração de Links | Gerar links de cadastro para leads |

**ANÁLISE 6 — Como são registradas**: No arquivo `src/features/cadastros/permissions.ts` como array de objetos, registradas via `registerPermission()` no `module.ts` dentro do `setup()`.

**ANÁLISE 7 — O que é registrado**: `{ key, label, description, group }`. Defaults por ambiente registrados via `registerPermissionDefaults("cadastros", { ... })`.

**ANÁLISE 8 — Onde são registradas**: 
- Em memória: `permissionsRegistry` (Map), `defaultsRegistry` (Map) em `src/registry/`
- No banco: Tabela `public.permissoes` (JSONB), coluna `permissoes` armazena o mapa chave→boolean

---

### 2.7 Função: Eventos/Webhooks (6)

| Evento | Tipo | Dispara quando... |
|---|---|---|
| `cadastro.criado` | status_change | Novo cadastro é criado |
| `cadastro.aprovado` | status_change | Cadastro é aprovado |
| `cadastro.reprovado` | status_change | Cadastro é reprovado |
| `documento.aprovado` | button_action | Documento é aprovado |
| `documento.reprovado` | button_action | Documento é reprovado |
| `link.gerado` | button_action | Link de cadastro é gerado |

---

## 3. Referências Técnicas

| Arquivo | Função |
|---|---|
| `src/features/cadastros/module.ts` | Definição do módulo, rotas, nav-items, defaults |
| `src/features/cadastros/permissions.ts` | 17 permissões granulares |
| `src/routes/cadastros.dashboard.tsx` | Página Dashboard |
| `src/routes/cadastros.clientes.tsx` | Página Clientes |
| `src/routes/cadastros.solicitacoes.tsx` | Página Solicitações |
| `src/routes/cadastros.consultor.tsx` | Página Consultor |
| `src/routes/cadastros.relatorios.tsx` | Página Relatórios |
| `src/registry/permissions-registry.ts` | Registry central de permissões |
| `src/registry/defaults.ts` | Registry de defaults por ambiente |
| `supabase/migrations/00010_permissoes.sql` | Tabela + trigger + RLS |
