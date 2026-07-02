# NPS

> Pesquisas de satisfação e Net Promoter Score

**Key:** `nps` | **Ícone:** `ClipboardCheck` | **Ambientes:** `cadastro, consultor, tecnologia`

---

## 1. Core do Módulo

O módulo NPS permite criar e gerenciar pesquisas de satisfação com clientes, coletando respostas via link público (survey). Os gestores visualizam o dashboard com métricas consolidadas (NPS score, tendências, ranking de vendedores, análise de sentimento e alertas de detratores), gerenciam as perguntas da pesquisa, acompanham relatórios de envio e exportam dados em CSV. O survey público é acessível sem autenticação, passando o ID da empresa como parâmetro de query string, e renderiza perguntas com suporte a múltiplos tipos: NPS (0–10), escolha única, múltipla, texto e matriz. O tema visual do survey é totalmente customizável por empresa.

---

## 2. Estrutura do Módulo

```
src/features/nps/
├── module.ts
├── permissions.ts
├── index.ts
├── types.ts
├── theme.ts
├── NpsBackground.tsx
├── services/
│   ├── index.ts
│   ├── perguntas.ts
│   ├── respostas.ts
│   ├── webhooks.ts
│   ├── sentiment.ts
│   └── sellerMetrics.ts
└── components/
    └── dashboard/
        ├── GlobalNpsDashboardPage.tsx
        ├── NpsDashboardPage.tsx
        ├── NpsPesquisasPage.tsx
        ├── NpsPreviewPage.tsx
        ├── NpsRelatoriosPage.tsx
        ├── NpsOperacaoPanel.tsx
        └── charts/
            ├── CommentRateCard.tsx
            ├── CompletionRateCard.tsx
            ├── CorrelationCard.tsx
            ├── DetractorAlerts.tsx
            ├── DistributionBarsCard.tsx
            ├── DynamicQuestionsChart.tsx
            ├── EmergingThemes.tsx
            ├── KeyPhrasesCard.tsx
            ├── MetricCard.tsx
            ├── MonthOverMonthCard.tsx
            ├── NPSTrendChart.tsx
            ├── QuestionsManager.tsx
            ├── RepeatCustomerCard.tsx
            ├── ResponseVolumeChart.tsx
            ├── SectionHeader.tsx
            ├── SectionNav.tsx
            ├── SellerComparison.tsx
            ├── SellerMatrixHeatmap.tsx
            ├── SellerRanking.tsx
            ├── SentimentAnalysis.tsx
            ├── SourceComparisonCard.tsx
            └── TimeHeatmap.tsx
```

| Diretório | Arquivos | Descrição |
|-----------|----------|-----------|
| `components/dashboard/` | 6 | Páginas principais (Dashboard, Pesquisas, Relatórios, Preview) |
| `components/dashboard/charts/` | 21 | Componentes de gráficos e cards analíticos |
| `services/` | 5 | Camada de acesso ao Supabase e lógica de negócio |
| (raiz) | 6 | Module definition, permissions, types, theme, background |

---

## 3. Rotas

| Rota | Componente | Descrição | Acesso |
|------|-----------|-----------|--------|
| `/nps` | `Navigate → /global/nps` | Redirect para dashboard global | Todos autenticados |
| `/nps/dashboard` | `NpsDashboardPage` | Dashboard NPS da empresa | `nps_ver_dashboard` |
| `/nps/pesquisas` | `NpsPesquisasPage` | Gerenciar perguntas da pesquisa | `nps_gerenciar_perguntas` |
| `/nps/relatorios` | `NpsRelatoriosPage` | Relatórios de envio NPS | `nps_ver_relatorios` |
| `/nps/preview` | `NpsPreviewPage` | Preview da pesquisa (editor) | `nps_gerenciar_perguntas` |
| `/nps-survey` | `NpsSurveyPage` | Survey público (sem auth) | Público (query `?e=empresaId`) |
| `/global/nps` | `GlobalNpsDashboardPage` | Dashboard global de NPS | Todos autenticados |
| `/empresa/nps/design` | `ModuloDesignPage` | Configuração de tema do survey | Config empresa |

---

## 4. Permissões

| Chave | Label | Descrição | Grupo |
|-------|-------|-----------|-------|
| `nps_ver_dashboard` | Ver dashboard NPS | Visualizar painel analítico de NPS | NPS |
| `nps_ver_respostas` | Ver respostas | Visualizar respostas individuais da pesquisa | NPS |
| `nps_gerenciar_perguntas` | Gerenciar perguntas | Criar, editar, ativar/desativar perguntas | NPS |
| `nps_gerenciar_webhooks` | Gerenciar webhooks | Configurar webhooks de envio NPS | NPS |
| `nps_excluir_respostas` | Excluir respostas | Excluir respostas de pesquisas | NPS |
| `nps_ver_relatorios` | Ver relatórios de envio | Visualizar histórico de envios NPS | NPS |
| `nps_exportar_dados` | Exportar dados | Exportar CSV de respostas | NPS |

---

## 5. Defaults por Papel

| Permissão | Cadastro | Consultor | Tecnologia | Suporte |
|-----------|----------|-----------|------------|---------|
| `nps_ver_dashboard` | ✅ | ❌ | ✅ | ❌ |
| `nps_ver_respostas` | ✅ | ❌ | ✅ | ❌ |
| `nps_gerenciar_perguntas` | ✅ | ❌ | ✅ | ❌ |
| `nps_gerenciar_webhooks` | ❌ | ❌ | ✅ | ❌ |
| `nps_excluir_respostas` | ❌ | ❌ | ✅ | ❌ |
| `nps_ver_relatorios` | ✅ | ❌ | ✅ | ❌ |
| `nps_exportar_dados` | ✅ | ❌ | ✅ | ❌ |

---

## 6. Navegação (Sidebar)

| Label | Rota | Ícone | Permissão | Ordem |
|-------|------|-------|-----------|-------|
| Dashboard NPS | `/nps/dashboard` | `ClipboardCheck` | `nps_ver_dashboard` | 15 |
| Gerenciar Perguntas | `/nps/pesquisas` | `Settings` | `nps_gerenciar_perguntas` | 16 |
| Relatórios Envio | `/nps/relatorios` | `FileText` | `nps_ver_relatorios` | 17 |
| Preview da Pesquisa | `/nps/preview` | `Eye` | `nps_gerenciar_perguntas` | 18 |

---

## 7. Eventos / Webhooks

| Chave | Label | Descrição | Tipo |
|-------|-------|-----------|------|
| `nps.resposta_recebida` | Resposta Recebida | Dispara quando uma resposta é submetida | `status_change` |
| `nps.detrator_detectado` | Detrator Detectado | Dispara quando nota NPS ≤ 6 | `status_change` |
| `nps.pesquisa_enviada` | Pesquisa Enviada | Dispara quando pesquisas são disparadas | `button_action` |

---

## 8. Funcionalidades

| Flag | Ativo | Detalhe |
|------|-------|---------|
| Design Config | ✅ | `/empresa/nps/design` — tema visual do survey customizável |
| Credenciais | ✅ | Escopos de credenciais configuráveis |
| Laboratório | ❌ | — |
| Formulário | ❌ | — |
| Ações Customizadas | ❌ | — |
| API Connectors | ❌ | — |

---

## 9. Dependências

### Tabelas Supabase

| Tabela | Uso |
|--------|-----|
| `nps_perguntas` | CRUD de perguntas da pesquisa (via `perguntas.ts`) |
| `nps_respostas` | Respostas submetidas pelos clientes (via `respostas.ts`) |
| `nps_webhook_config` | Configuração de webhooks por empresa (via `webhooks.ts`) |
| `nps_relatorios_envio` | Relatórios de envio de pesquisas (via `NpsRelatoriosPage.tsx`) |

### Módulos Relacionados

| Módulo | Tipo de Relação |
|--------|-----------------|
| `empresas` | Lê dados da empresa (`buscarEmpresa`, `buscarEmpresaConfig`) para o survey público e tema |

---

## 10. Schema das Tabelas

> Schema SQL consolidado das tabelas exclusivas do módulo. Colunas adicionadas via migrations estão incluídas.

### `nps_perguntas`

```sql
CREATE TABLE IF NOT EXISTS nps_perguntas (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id    UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  key           TEXT NOT NULL,
  order_index   INT NOT NULL DEFAULT 0,
  type          TEXT NOT NULL CHECK (type IN ('nps','single_choice','multi_choice','text','matrix')),
  question_text TEXT NOT NULL,
  options       JSONB NOT NULL DEFAULT '[]'::jsonb,
  required      BOOLEAN NOT NULL DEFAULT true,
  active        BOOLEAN NOT NULL DEFAULT true,
  is_system     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(empresa_id, key)
);
```

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identificador único |
| `empresa_id` | `uuid` | NOT NULL, FK → `empresas(id)`, ON DELETE CASCADE | Empresa dona do registro |
| `key` | `text` | NOT NULL | Chave identificadora da pergunta |
| `order_index` | `int` | NOT NULL, default `0` | Ordem de exibição |
| `type` | `text` | NOT NULL, CHECK (`nps`, `single_choice`, `multi_choice`, `text`, `matrix`) | Tipo da pergunta |
| `question_text` | `text` | NOT NULL | Texto da pergunta exibido ao cliente |
| `options` | `jsonb` | NOT NULL, default `'[]'` | Opções para choice/multi_choice |
| `required` | `boolean` | NOT NULL, default `true` | Se a pergunta é obrigatória |
| `active` | `boolean` | NOT NULL, default `true` | Se a pergunta está ativa |
| `is_system` | `boolean` | NOT NULL, default `false` | Se é pergunta do sistema (não removível) |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Data de criação |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Data da última atualização |

### `nps_respostas`

```sql
CREATE TABLE IF NOT EXISTS nps_respostas (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id                UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nps_score                 INT,
  nps_comment               TEXT DEFAULT '',
  csat                      TEXT DEFAULT '',
  atendimento_comercial     TEXT DEFAULT '',
  entendimento_consultor    TEXT DEFAULT '',
  melhoria_atendimento      TEXT DEFAULT '',
  experiencia_compra        TEXT DEFAULT '',
  matrix_facilidade_pedido  INT DEFAULT 0,
  matrix_clareza_condicoes  INT DEFAULT 0,
  matrix_prazo_entrega      INT DEFAULT 0,
  matrix_disponibilidade_produtos INT DEFAULT 0,
  matrix_comunicacao        INT DEFAULT 0,
  expansao_produtos         TEXT DEFAULT '',
  oportunidade              TEXT DEFAULT '',
  pergunta_final            TEXT DEFAULT '',
  order_id                  TEXT,
  client_id                 TEXT,
  source                    TEXT,
  client_name               TEXT,
  vendor_name               TEXT,
  dynamic_answers           JSONB DEFAULT '{}'::jsonb,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identificador único |
| `empresa_id` | `uuid` | NOT NULL, FK → `empresas(id)`, ON DELETE CASCADE | Empresa dona do registro |
| `nps_score` | `int` | NULLABLE | Nota NPS (0–10) |
| `nps_comment` | `text` | default `''` | Comentário principal do NPS |
| `csat` | `text` | default `''` | Resposta CSAT |
| `atendimento_comercial` | `text` | default `''` | Avaliação do atendimento comercial |
| `entendimento_consultor` | `text` | default `''` | Entendimento do consultor |
| `melhoria_atendimento` | `text` | default `''` | Sugestão de melhoria |
| `experiencia_compra` | `text` | default `''` | Experiência de compra |
| `matrix_facilidade_pedido` | `int` | default `0` | Nota matriz: facilidade de pedido |
| `matrix_clareza_condicoes` | `int` | default `0` | Nota matriz: clareza comercial |
| `matrix_prazo_entrega` | `int` | default `0` | Nota matriz: prazo de entrega |
| `matrix_disponibilidade_produtos` | `int` | default `0` | Nota matriz: disponibilidade |
| `matrix_comunicacao` | `int` | default `0` | Nota matriz: comunicação |
| `expansao_produtos` | `text` | default `''` | Interesse em expansão de produtos |
| `oportunidade` | `text` | default `''` | Oportunidade identificada |
| `pergunta_final` | `text` | default `''` | Resposta da pergunta final |
| `order_id` | `text` | NULLABLE | ID do pedido relacionado |
| `client_id` | `text` | NULLABLE | ID do cliente |
| `source` | `text` | NULLABLE | Origem da resposta (ex: `whatsapp`) |
| `client_name` | `text` | NULLABLE | Nome do cliente |
| `vendor_name` | `text` | NULLABLE | Nome do vendedor |
| `dynamic_answers` | `jsonb` | default `'{}'` | Respostas dinâmicas adicionais (JSON) |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Data de criação |

### `nps_webhook_config`

```sql
CREATE TABLE IF NOT EXISTS nps_webhook_config (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id  UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identificador único |
| `empresa_id` | `uuid` | NOT NULL, FK → `empresas(id)`, ON DELETE CASCADE | Empresa dona do registro |
| `url` | `text` | NOT NULL | URL do endpoint webhook |
| `active` | `boolean` | NOT NULL, default `true` | Se o webhook está ativo |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Data de criação |

### `nps_relatorios_envio`

```sql
CREATE TABLE IF NOT EXISTS nps_relatorios_envio (
  id                BIGSERIAL PRIMARY KEY,
  empresa_id        UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  data_envio        DATE NOT NULL,
  total_processado  INT NOT NULL DEFAULT 0,
  enviados_sucesso  INT NOT NULL DEFAULT 0,
  sem_whatsapp      INT NOT NULL DEFAULT 0,
  nps_menor_30      INT NOT NULL DEFAULT 0,
  clientes_detalhes TEXT,
  html_relatorio    TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `bigserial` | PK | Identificador único (sequencial) |
| `empresa_id` | `uuid` | NOT NULL, FK → `empresas(id)`, ON DELETE CASCADE | Empresa dona do registro |
| `data_envio` | `date` | NOT NULL | Data do envio das pesquisas |
| `total_processado` | `int` | NOT NULL, default `0` | Total de clientes processados |
| `enviados_sucesso` | `int` | NOT NULL, default `0` | Enviados com sucesso |
| `sem_whatsapp` | `int` | NOT NULL, default `0` | Sem WhatsApp cadastrado |
| `nps_menor_30` | `int` | NOT NULL, default `0` | Clientes com NPS menor que 30 dias |
| `clientes_detalhes` | `text` | NULLABLE | Detalhes dos clientes (JSON/texto) |
| `html_relatorio` | `text` | NULLABLE | HTML do relatório gerado |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Data de criação |

---

## 11. Notas

- O survey público (`/nps-survey`) não requer autenticação — acessível via `?e=<empresa_id>`
- Análise de sentimento é baseada em dicionário de palavras (não usa IA), com suporte a negadores ("não", "nunca", etc.)
- Métricas de vendedor (`sellerMetrics.ts`) agrupam respostas por `vendor_name` e calculam NPS e média de matriz por vendedor
- O tema do survey (`theme.ts`) suporta 90+ variáveis CSS, background sólido/gradiente, blobs animados e configuração de logo/header
- Webhooks são disparados via `fetch` com `mode: "no-cors"` — não há tratamento de resposta
- A tabela `nps_respostas` suporta `dynamic_answers` (JSON) para perguntas dinâmicas adicionais
- `nps_perguntas` tem política RLS pública para SELECT (survey público precisa ler perguntas ativas)
- `nps_respostas` permite INSERT via `anon` (survey público pode gravar respostas)
- Seeds em `20260623150000_seed_csat_perguntas.sql` inserem 5 perguntas CSAT padrão
