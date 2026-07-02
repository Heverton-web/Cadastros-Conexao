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
| `nps_perguntas` | CRUD de perguntas da pesquisa (CRUD via `perguntas.ts`) |
| `nps_respostas` | Respostas submetidas pelos clientes (CRUD + cálculos via `respostas.ts`) |
| `nps_webhook_config` | Configuração de webhooks por empresa (CRUD via `webhooks.ts`) |

### Módulos Relacionados

| Módulo | Tipo de Relação |
|--------|-----------------|
| `empresas` | Lê dados da empresa (`buscarEmpresa`, `buscarEmpresaConfig`) para o survey público e tema |

---

## 10. Notas

- O survey público (`/nps-survey`) não requer autenticação — acessível via `?e=<empresa_id>`
- Análise de sentimento é baseada em dicionário de palavras (não usa IA), com suporte a negadores ("não", "nunca", etc.)
- Métricas de vendedor (`sellerMetrics.ts`) agrupam respostas por `vendor_name` e calculam NPS e média de matriz por vendedor
- O tema do survey (`theme.ts`) suporta 90+ variáveis CSS, background sólido/gradiente, blobs animados e configuração de logo/header
- Webhooks são disparados via `fetch` com `mode: "no-cors"` — não há tratamento de resposta
- A tabela `nps_respostas` suporta `dynamic_answers` (JSON) para perguntas dinâmicas adicionais
