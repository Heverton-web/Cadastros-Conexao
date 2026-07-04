# Análise do Banco de Dados — Módulo NPS

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Tabelas do Módulo](#2-tabelas-do-módulo)
3. [Integração com Empresas Config](#3-integração-com-empresas-config)
4. [RLS Policies](#4-rls-policies)
5. [Permissões do Módulo](#5-permissões-do-módulo)
6. [Rotas do Frontend](#6-rotas-do-frontend)
7. [Migrações Relacionadas](#7-migrações-relacionadas)
8. [Diagrama de Relacionamentos](#8-diagrama-de-relacionamentos)

---

## 1. Visão Geral

O módulo **NPS** (Net Promoter Score) gerencia **pesquisas de satisfação** no ERP Conexão. Ele permite criar pesquisas NPS e CSAT (Customer Satisfaction), coletar respostas de clientes (inclusive anonimamente via survey público), e analisar os resultados através de um dashboard analítico completo.

**Características da Arquitetura:**

- **4 tabelas principais**: `nps_perguntas`, `nps_respostas`, `nps_webhook_config`, `nps_relatorios_envio`
- **Acesso público**: a survey NPS pode ser respondida sem autenticação (usuário `anon`)
- **Multi-tenant**: todas as tabelas possuem `empresa_id`
- **Pesquisa híbrida NPS + CSAT**: suporta nota NPS (0-10), comentários, perguntas CSAT de matriz, respostas dinâmicas via `dynamic_answers` (JSONB)
- **Sistema de webhooks**: disparo de notificações quando respostas são recebidas
- **Relatórios de envio**: rastreamento de campanhas de pesquisa disparadas
- **Dashboard analítico rico**: 22+ componentes de gráficos (tendência, distribuição, matriz de vendedores, análise de sentimento, etc.)

---

## 2. Tabelas do Módulo

### 2.1 `nps_perguntas` — Perguntas da Pesquisa

Catálogo de perguntas disponíveis para as pesquisas de satisfação por empresa.

| Coluna | Tipo | Descrição | Origem |
|---|---|---|---|
| `id` | `uuid PK` | Identificador único | `00036` |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa proprietária | `00036` |
| `key` | `text NOT NULL` | Chave única da pergunta (ex: `nps_score`, `csat_qualidade`) | `00036` |
| `order_index` | `int NOT NULL` | Ordem de exibição | `00036` |
| `type` | `text NOT NULL` | Tipo: `'nps'`, `'single_choice'`, `'multi_choice'`, `'text'`, `'matrix'` | `00036` |
| `question_text` | `text NOT NULL` | Texto da pergunta | `00036` |
| `options` | `jsonb` | Opções (para choice/matrix) | `00036` |
| `required` | `boolean NOT NULL DEFAULT true` | Se é obrigatória | `00036` |
| `active` | `boolean NOT NULL DEFAULT true` | Se está ativa (visível na pesquisa) | `00036` |
| `is_system` | `boolean NOT NULL DEFAULT false` | Se é pergunta padrão do sistema | `00036` |
| `created_at` | `timestamptz` | Data de criação | `00036` |
| `updated_at` | `timestamptz` | Data da última atualização | `00036` |

**Constraints:** `UNIQUE(empresa_id, key)` — chave única por empresa

**Índices:**
- `nps_perguntas_empresa_idx` ON `nps_perguntas(empresa_id)` — filtro por empresa
- `nps_perguntas_empresa_active_idx` ON `nps_perguntas(empresa_id, active)` — perguntas ativas

**Trigger:** `nps_perguntas_set_updated_at` — atualiza `updated_at` automaticamente

**Perguntas Seed (sistema):**

| Key | Type | Pergunta | Ordem |
|---|---|---|---|
| `nps_score` | `nps` | Em uma escala de 0 a 10, o quanto você recomendaria a nossa empresa para um amigo ou colega? | 1 |
| `nps_comentario` | `text` | Qual o principal motivo da sua nota? | 2 |
| `csat_qualidade` | `csat` | Qualidade do Atendimento | 3 |
| `csat_tempo` | `csat` | Tempo de Resposta | 4 |
| `csat_clareza` | `csat` | Clareza da Comunicação | 5 |
| `csat_resolucao` | `csat` | Resolução do Problema | 6 |
| `csat_cortesia` | `csat` | Cortesia do Consultor | 7 |

> **Nota:** As duas primeiras (`nps_score`, `nps_comentario`) foram inseridas via seed no arquivo `20260623141500_create_nps_perguntas.sql`. As perguntas CSAT (3-7) foram inseridas via seed em `20260623150000_seed_csat_perguntas.sql`.

---

### 2.2 `nps_respostas` — Respostas da Pesquisa

Tabela principal que armazena **todas as respostas** submetidas nas pesquisas. Suporta anonymous INSERT (survey público).

| Coluna | Tipo | Descrição | Origem |
|---|---|---|---|
| `id` | `uuid PK` | Identificador único | `00036` |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa | `00036` |
| `nps_score` | `int` | Nota NPS (0-10) | `00036` |
| `nps_comment` | `text` | Comentário principal | `00036` |
| `csat` | `text` | CSAT geral | `00036` |
| `atendimento_comercial` | `text` | Feedback atendimento comercial | `00036` |
| `entendimento_consultor` | `text` | Feedback entendimento do consultor | `00036` |
| `melhoria_atendimento` | `text` | Sugestão de melhoria | `00036` |
| `experiencia_compra` | `text` | Experiência de compra | `00036` |
| `matrix_facilidade_pedido` | `int` | Matriz: facilidade de pedido (0-10) | `00036` |
| `matrix_clareza_condicoes` | `int` | Matriz: clareza condições comerciais | `00036` |
| `matrix_prazo_entrega` | `int` | Matriz: prazo de entrega | `00036` |
| `matrix_disponibilidade_produtos` | `int` | Matriz: disponibilidade de produtos | `00036` |
| `matrix_comunicacao` | `int` | Matriz: comunicação durante processo | `00036` |
| `expansao_produtos` | `text` | Sugestão de expansão de produtos | `00036` |
| `oportunidade` | `text` | Oportunidade identificada | `00036` |
| `pergunta_final` | `text` | Pergunta final | `00036` |
| `order_id` | `text` | ID do pedido (vinculação) | `00036` |
| `client_id` | `text` | ID do cliente | `00036` |
| `source` | `text` | Origem da resposta (ex: `'whatsapp'`, `'survey'`) | `00036` |
| `client_name` | `text` | Nome do cliente (desnormalizado) | `00036` |
| `vendor_name` | `text` | Nome do vendedor/consultor (desnormalizado) | `00036` |
| `dynamic_answers` | `jsonb` | Respostas dinâmicas de perguntas customizadas | `00036` |
| `created_at` | `timestamptz` | Data da resposta | `00036` |

**Índices:**
- `nps_respostas_empresa_idx` ON `nps_respostas(empresa_id)` — filtro por empresa
- `nps_respostas_created_idx` ON `nps_respostas(created_at)` — ordenação por data
- `nps_respostas_empresa_created_idx` ON `nps_respostas(empresa_id, created_at)` — filtro + ordenação

**Cálculo do NPS:**
```
NPS = % Promotores (nota 9-10) - % Detratores (nota 0-6)
Passivos: nota 7-8 (não contam no cálculo)
```

---

### 2.3 `nps_webhook_config` — Configuração de Webhooks

Configura URLs de webhook para receber notificações quando novas respostas são submetidas.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `url` | `text NOT NULL` | URL do webhook |
| `active` | `boolean NOT NULL DEFAULT true` | Se está ativo |
| `created_at` | `timestamptz` | Data de criação |

**Índice:** `nps_webhook_config_empresa_idx` ON `nps_webhook_config(empresa_id)`

---

### 2.4 `nps_relatorios_envio` — Relatórios de Envio

Histórico de campanhas de envio de pesquisas disparadas (por lote).

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `bigserial PK` | Identificador (sequencial) |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `data_envio` | `date NOT NULL` | Data do disparo |
| `total_processado` | `int NOT NULL` | Total de clientes processados |
| `enviados_sucesso` | `int NOT NULL` | Enviados com sucesso |
| `sem_whatsapp` | `int NOT NULL` | Clientes sem WhatsApp cadastrado |
| `nps_menor_30` | `int NOT NULL` | Clientes cadastrados há < 30 dias (ignorados) |
| `clientes_detalhes` | `text` | Detalhes dos clientes processados |
| `html_relatorio` | `text` | Relatório HTML gerado |
| `created_at` | `timestamptz` | Data de criação do registro |

**Índice:** `nps_relatorios_empresa_idx` ON `nps_relatorios_envio(empresa_id)`

---

## 3. Integração com Empresas Config

Migração `00038` habilita SELECT anônimo na tabela `public.empresas_config` para que a página pública de survey NPS possa ler o tema da empresa (cores, logo) sem autenticação.

```sql
CREATE POLICY "Anon podem ver empresas_config"
ON public.empresas_config FOR SELECT TO anon USING (true);
```

Isso permite que a URL pública da pesquisa (`/nps/survey`) exiba o branding correto da empresa que está solicitando o feedback.

---

## 4. RLS Policies

### 4.1 `nps_perguntas`

| Operação | Policy | Descrição |
|---|---|---|
| `SELECT` | `nps_perguntas_select_public` | Público (`USING (active = true)`) — todos veem perguntas ativas |
| `INSERT` | `nps_perguntas_insert_auth` | Autenticados podem criar |
| `UPDATE` | `nps_perguntas_update_auth` | Autenticados podem editar |
| `DELETE` | `nps_perguntas_delete_auth` | Autenticados podem excluir |

> **Nota:** A policy de SELECT público é fundamental para que o survey funcione sem login.

### 4.2 `nps_respostas`

| Operação | Policy | Descrição |
|---|---|---|
| `INSERT` (anon) | `nps_respostas_insert_anon` | Anônimos podem submeter resposta |
| `INSERT` (auth) | `nps_respostas_insert_auth` | Autenticados também podem |
| `SELECT` | `nps_respostas_select_auth` | Autenticados podem ver todas |
| `DELETE` | `nps_respostas_delete_auth` | Autenticados podem excluir |

> **Nota:** Única tabela no sistema que permite INSERT anônimo — essencial para o survey público.

### 4.3 `nps_webhook_config`

| Operação | Policy |
|---|---|
| `SELECT` | Autenticados |
| `INSERT` | Autenticados |
| `UPDATE` | Autenticados |
| `DELETE` | Autenticados |

### 4.4 `nps_relatorios_envio`

| Operação | Policy |
|---|---|
| `SELECT` | Autenticados |
| `INSERT` | Autenticados |

### Resumo de Acessos por Role

| Tabela | anon | authenticated | service_role |
|---|---|---|---|
| `nps_perguntas` | SELECT (ativas) | ALL | ALL |
| `nps_respostas` | INSERT | SELECT, INSERT, UPDATE, DELETE | ALL |
| `nps_webhook_config` | — | ALL | ALL |
| `nps_relatorios_envio` | — | SELECT, INSERT | ALL |

> **Observação importante:** As policies NPS são mais permissivas que os outros módulos. Autenticados podem ver TODAS as perguntas e respostas de todas as empresas — não há filtro por `empresa_id` via RLS. O controle de acesso é delegado às permissões do frontend e às queries da aplicação. Isso difere do padrão de outros módulos que usam `get_current_empresa_id()` no RLS.

---

## 5. Permissões do Módulo

Definidas em `src/features/nps/permissions.ts`.

### Lista de Permissões

| Chave | Label | Descrição |
|---|---|---|
| `nps_ver_dashboard` | Ver dashboard NPS | Visualizar painel analítico de NPS |
| `nps_ver_respostas` | Ver respostas | Visualizar respostas individuais da pesquisa |
| `nps_gerenciar_perguntas` | Gerenciar perguntas | Criar, editar, ativar/desativar perguntas |
| `nps_gerenciar_webhooks` | Gerenciar webhooks | Configurar webhooks de envio NPS |
| `nps_excluir_respostas` | Excluir respostas | Excluir respostas de pesquisas |
| `nps_ver_relatorios` | Ver relatórios de envio | Visualizar histórico de envios NPS |
| `nps_exportar_dados` | Exportar dados | Exportar CSV de respostas |

### Defaults por Ambiente

| Ambiente | Dashboard | Respostas | Perguntas | Webhooks | Excluir | Relatórios | Exportar |
|---|---|---|---|---|---|---|---|
| `cadastro` | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| `consultor` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `tecnologia` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `suporte` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 6. Rotas do Frontend

### Páginas do Módulo (11 rotas)

| Rota | Arquivo | Descrição |
|---|---|---|
| `/nps` | `src/routes/nps.tsx` | Página principal NPS |
| `/nps/survey` | `src/routes/nps.survey.tsx` | Survey público (anon) |
| `/nps/dashboard` | `src/routes/nps.dashboard.tsx` | Dashboard analítico |
| `/nps/pesquisas` | `src/routes/nps.pesquisas.tsx` | Gerenciamento de perguntas |
| `/nps/preview` | `src/routes/nps.preview.tsx` | Preview da pesquisa |
| `/nps/relatorios` | `src/routes/nps.relatorios.tsx` | Relatórios de envio |
| `/global/nps` | `src/routes/global.nps.tsx` | NPS global do sistema |
| `/nps/tema` | `src/routes/nps.tema.tsx` | Tema da pesquisa |
| `/nps/design` | `src/routes/nps.design.tsx` | Design da pesquisa |
| `/empresa/nps-tema` | `src/routes/empresa.nps-tema.tsx` | Tema por empresa |
| `/empresa/nps-design` | `src/routes/empresa.nps-design.tsx` | Design por empresa |

### Estrutura de Componentes (41 arquivos)

```
src/features/nps/
├── components/
│   └── dashboard/
│       ├── charts/
│       │   ├── chart-colors.ts
│       │   ├── CommentRateCard.tsx
│       │   ├── CompletionRateCard.tsx
│       │   ├── CorrelationCard.tsx
│       │   ├── DetractorAlerts.tsx
│       │   ├── DistributionBarsCard.tsx
│       │   ├── DynamicQuestionsChart.tsx
│       │   ├── EmergingThemes.tsx
│       │   ├── KeyPhrasesCard.tsx
│       │   ├── MetricCard.tsx
│       │   ├── MonthOverMonthCard.tsx
│       │   ├── NPSTrendChart.tsx
│       │   ├── QuestionsManager.tsx
│       │   ├── RepeatCustomerCard.tsx
│       │   ├── ResponseVolumeChart.tsx
│       │   ├── SectionHeader.tsx
│       │   ├── SectionNav.tsx
│       │   ├── SellerComparison.tsx
│       │   ├── SellerMatrixHeatmap.tsx
│       │   ├── SellerRanking.tsx
│       │   ├── SentimentAnalysis.tsx
│       │   ├── SourceComparisonCard.tsx
│       │   └── TimeHeatmap.tsx
│       ├── GlobalNpsDashboardPage.tsx
│       ├── NpsDashboardPage.tsx
│       ├── NpsOperacaoPanel.tsx
│       ├── NpsPesquisasPage.tsx
│       ├── NpsPreviewPage.tsx
│       └── NpsRelatoriosPage.tsx
├── services/
│   ├── index.ts
│   ├── perguntas.ts
│   ├── respostas.ts
│   ├── sellerMetrics.ts
│   ├── sentiment.ts
│   └── webhooks.ts
├── NpsBackground.tsx
├── module.ts
├── permissions.ts
├── theme.ts
├── types.ts
└── index.ts
```

---

## 7. Migrações Relacionadas

| Migration | Data | Descrição |
|---|---|---|
| `00036_nps_module.sql` | — | **CORE**: 4 tabelas (`nps_perguntas`, `nps_respostas`, `nps_webhook_config`, `nps_relatorios_envio`), RLS, índices, grants |
| `00038_nps_empresas_config_public.sql` | — | Policy pública em `empresas_config` para survey NPS exibir tema da empresa |
| `20260623141500_create_nps_perguntas.sql` | 23/06/2026 | Cria tabela `nps_perguntas` (estrutura alternativa) + seed: `nps_score` e `nps_comentario` |
| `20260623150000_seed_csat_perguntas.sql` | 23/06/2026 | Seed: 5 perguntas CSAT (`qualidade`, `tempo`, `clareza`, `resolucao`, `cortesia`) |

> **Nota:** Há duas estruturas de `nps_perguntas` — a original em `00036` com `empresa_id` + UNIQUE composto, e uma segunda versão em `20260623141500` **sem** `empresa_id` mas com `key UNIQUE` global. Isso indica uma possível refatoração em andamento para centralizar perguntas padrão do sistema.

---

## 8. Diagrama de Relacionamentos

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              empresas                                        │
└──┬──────────────────────────────────────────────────────────────────────────┘
   │ 1:N
┌──▼──────────────────────────────────────────────────────────────────────────┐
│                          nps_perguntas                                        │
│  id (PK) │ key | empresa_id (UNIQUE empresa_id, key)                         │
│  type (nps/single_choice/multi_choice/text/matrix)                          │
│  question_text │ options (JSONB) │ order_index │ required │ active          │
│  is_system │ created_at │ updated_at                                         │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          nps_respostas                                        │
│  id (PK) │ empresa_id                                                       │
│  nps_score (0-10) │ nps_comment │ csat                                      │
│  atendimento_comercial │ entendimento_consultor                              │
│  melhoria_atendimento │ experiencia_compra                                   │
│  MATRIX (5 colunas de 0-10):                                                 │
│  └─ matrix_facilidade_pedido                                                 │
│  └─ matrix_clareza_condicoes                                                 │
│  └─ matrix_prazo_entrega                                                    │
│  └─ matrix_disponibilidade_produtos                                         │
│  └─ matrix_comunicacao                                                      │
│  expansao_produtos │ oportunidade │ pergunta_final                           │
│  order_id │ client_id │ source │ client_name │ vendor_name                   │
│  dynamic_answers (JSONB) │ created_at                                        │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                      nps_webhook_config                                       │
│  id (PK) │ empresa_id │ url │ active │ created_at                            │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                     nps_relatorios_envio                                       │
│  id (BIGSERIAL PK) │ empresa_id │ data_envio                                 │
│  total_processado │ enviados_sucesso │ sem_whatsapp │ nps_menor_30           │
│  clientes_detalhes (TEXT) │ html_relatorio (TEXT) │ created_at               │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          empresas_config                                      │
│  (acessível por anon via policy 00038)                                       │
│  empresa_id │ logo_url │ theme (JSONB)                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Notas Finais

1. **Arquitetura Híbrida**: O NPS combina dois tipos de pesquisa — NPS (nota 0-10 + comentário) e CSAT (matriz de satisfação com 5 dimensões). Ambos coexistem na mesma tabela de respostas.

2. **Pesquisa Dinâmica**: A coluna `dynamic_answers` (JSONB) permite adicionar perguntas customizadas sem alterar o schema, dando flexibilidade para cada empresa personalizar sua pesquisa.

3. **Acesso Público**: O survey NPS é a única funcionalidade do ERP que aceita INSERT anônimo. As policies são propositalmente amplas para viabilizar o fluxo público de feedback.

4. **Dados Desnormalizados**: `client_name` e `vendor_name` são armazenados diretamente na resposta para preservar o contexto histórico, mesmo que o cliente ou vendedor sejam alterados posteriormente.

5. **Dashboard Rico**: O módulo possui 22+ componentes de gráfico no dashboard, cobrindo:
   - Tendência NPS mensal (linha)
   - Distribuição por categorias (barras)
   - Matriz de calor por vendedor
   - Ranking de vendedores
   - Análise de sentimento
   - Palavras-chave e temas emergentes
   - Comparação por fonte de resposta
   - Mapa de calor temporal
   - Alertas de detratores

6. **Dualidade da Tabela `nps_perguntas`**: Existem duas definições conflitantes:
   - `00036`: com `empresa_id` e `UNIQUE(empresa_id, key)` — perguntas por empresa
   - `20260623141500`: **sem** `empresa_id` e `UNIQUE(key)` global — perguntas sistêmicas
   
   As seeds de perguntas padrão foram inseridas na segunda versão (sem `empresa_id`), o que sugere que perguntas do sistema são globais, enquanto perguntas customizadas são por empresa.
