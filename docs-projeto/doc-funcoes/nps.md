# Análise das Funções — Módulo NPS

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral do Módulo](#1-visão-geral-do-módulo)
2. [Funções do Módulo](#2-funções-do-módulo)
3. [Referências Técnicas](#3-referências-técnicas)

---

## 1. Visão Geral do Módulo

O módulo **NPS** gerencia pesquisas de satisfação (Net Promoter Score), coleta de respostas via survey público, e dashboard analítico com gráficos e insights.

| Aspecto | Detalhe |
|---|---|
| **Key** | `nps` |
| **Descrição** | Pesquisas de satisfação e Net Promoter Score |
| **Ambientes** | cadastro, consultor, tecnologia |
| **Permissões** | 7 funções granulares |
| **Eventos** | 3 webhooks |
| **Rotas** | 6 páginas |
| **Design Config** | ✅ `/empresa/nps/design` |
| **Tema Survey** | 58+ tokens `--nps-*` personalizáveis |

---

## 2. Funções do Módulo

### 2.1 Função: Dashboard Analítico NPS

**Rota**: `/nps/dashboard`
**Permissão**: `nps_ver_dashboard`

Dashboard completo com gráficos Recharts: distribuição NPS, CSAT, matriz de avaliação, tendência, heatmap, ranking de vendedores, análise de sentimento, temas emergentes e respostas recentes com busca e paginação.

**Quem usa**: Admin/Cadastro (default true), Tecnologia (true), Consultor (false)

---

### 2.2 Função: Gerenciar Perguntas

**Rota**: `/nps/pesquisas`
**Permissão**: `nps_gerenciar_perguntas`

CRUD de perguntas da pesquisa NPS. Cria, edita, ativa/desativa perguntas. Suporte a perguntas de sistema (protegidas contra edição por não-super-admin).

---

### 2.3 Função: Preview da Pesquisa

**Rota**: `/nps/preview`
**Permissão**: `nps_gerenciar_perguntas`

Visualização ao vivo de como a pesquisa NPS aparece para o cliente final. Testa o fluxo completo: notas NPS, perguntas CSAT, perguntas abertas.

---

### 2.4 Função: Relatórios de Envio

**Rota**: `/nps/relatorios`
**Permissão**: `nps_ver_relatorios`

Histórico de envios em lote da pesquisa NPS para clientes.

---

### 2.5 Função: Survey Público

**Rota**: `/nps/survey`
**Permissão**: Pública (anônimo pode responder)

Único módulo do sistema com INSERT anônimo no banco. Coleta nota NPS (0-10), perguntas CSAT, matriz de avaliação, perguntas subjetivas. Tema customizável via `empresas_config.theme.nps_survey`.

---

### 2.6 Funções Granulares (7 Permissões)

| Key | Grupo | Descrição |
|---|---|---|
| `nps_ver_dashboard` | NPS | Visualizar painel analítico |
| `nps_ver_respostas` | NPS | Visualizar respostas individuais |
| `nps_gerenciar_perguntas` | NPS | Criar, editar, ativar/desativar perguntas |
| `nps_gerenciar_webhooks` | NPS | Configurar webhooks de envio |
| `nps_excluir_respostas` | NPS | Excluir respostas |
| `nps_ver_relatorios` | NPS | Visualizar histórico de envios |
| `nps_exportar_dados` | NPS | Exportar CSV de respostas |

**Registro**: `src/features/nps/permissions.ts` → `registerPermission()` + `registerPermissionDefaults()`

---

### 2.7 Função: Eventos/Webhooks (3)

| Evento | Dispara |
|---|---|
| `nps.resposta_recebida` | Resposta submetida |
| `nps.detrator_detectado` | Nota ≤ 6 |
| `nps.pesquisa_enviada` | Pesquisas disparadas em lote |

---

## 3. Referências Técnicas

| Arquivo | Função |
|---|---|
| `src/features/nps/module.ts` | Definição do módulo, rotas, permissões |
| `src/features/nps/permissions.ts` | 7 permissões |
| `src/features/nps/theme.ts` | 58+ tokens `--nps-*`, defaults da survey |
| `src/features/nps/NpsBackground.tsx` | Componente de fundo com blobs |
| `src/routes/nps.survey.tsx` | Survey público |
| `supabase/migrations/00036_nps_module.sql` | Tabelas NPS |
