# Plano: Universalização de Eventos na Central de Ações

> **ERP Conexão** — Gerado em: 04/07/2026
> **Objetivo:** Tornar TODOS os eventos, botões e triggers de cada módulo disponíveis para personalização na Central de Ações (super admin e admin de empresa).

---

## Sumário

1. [Diagnóstico Atual](#1-diagnóstico-atual)
2. [O Que Já Funciona](#2-o-que-já-funciona)
3. [Gaps Identificados](#3-gaps-identificados)
4. [Plano de Ação Detalhado](#4-plano-de-ação-detalhado)
5. [Priorização](#5-priorização)
6. [Estimativa de Esforço](#6-estimativa-de-esforço)
7. [Checklist de Implementação](#7-checklist-de-implementação)

---

## 1. Diagnóstico Atual

### 1.1 Eventos Registrados vs Disparados

| Módulo | Eventos Definidos | Eventos Disparados | % Cobertura |
|---|---|---|---|
| **Cadastros** | 6 (+11 legados = 17) | 17 (todos) | **100%** ✅ |
| **Funis** | 12 | 8 (em services) | **67%** 🔶 |
| **Hub** | 8 | 0 | **0%** 🔴 |
| **Mapas** | 8 | 0 | **0%** 🔴 |
| **Despesas** | 7 | 0 | **0%** 🔴 |
| **Rotas** | 4 | 0 | **0%** 🔴 |
| **CRM** | 3 | 0 | **0%** 🔴 |
| **NPS** | 3 | 0 | **0%** 🔴 |
| **LinkTree** | 3 | 0 | **0%** 🔴 |
| **Gerador Links** | 0 | 0 | N/A |
| **Marketing** | 0 | 0 | N/A |
| **Empresa** | 0 | 0 | N/A |
| **Total** | **54** | **25** | **46%** |

### 1.2 Como os Eventos São Disparados Hoje

**`dispararWebhooks(evento, payload, empresaId)`** — usado pelo módulo **Cadastros**:
- Chamado diretamente das rotas (`cadastros.solicitacoes.$id.tsx`, `cadastros.consultor.tsx`, `pre-cadastro.$token.tsx`)
- Dispara webhooks + notificações + API connectors simultaneamente

**`dispararEventoModulo(moduloKey, eventoKey, payload, empresaId)`** — usado pelo módulo **Funis**:
- Chamado dos services (`tarefas.ts`, `funis.ts`, `comments.ts`, `automations.ts`, `attachments.ts`)
- Dispara apenas webhooks filtrados por `modulo_key`

### 1.3 O Que a Central de Ações Já Suporta

A `CentralAceesTab` em `src/components/admin/CentralAcosTab.tsx` **já lê dinamicamente** os eventos de qualquer módulo através de:

```typescript
const activeModule = getModule(activeModuleKey);
const eventosGerais = activeModule?.events?.map(e => ({
  value: e.key,
  label: e.label,
  tipo: e.type || "status_change",
})) || [];
```

Isso significa que **se o evento estiver cadastrado no `module.ts`**, ele já aparece na UI da Central de Ações. A personalização (criar webhook, notificação, API) já funciona.

**O problema não é a UI — é a ausência de disparo no código real.**

---

## 2. O Que Já Funciona

### 2.1 Infraestrutura Completa ✅

| Componente | Status | Arquivo |
|---|---|---|
| Definição de eventos em module.ts | ✅ Funciona | `src/features/*/module.ts` |
| Leitura dinâmica na Central de Ações | ✅ Funciona | `CentralAceesTab.tsx:258` |
| Matriz de Gatilhos (Workflow Builder) | ✅ Funciona | `CentralAceesTab.tsx` |
| Criação de webhooks | ✅ Funciona | `webhooks.ts` |
| Criação de notificações | ✅ Funciona | `notificacoes.ts` |
| Criação de API connectors | ✅ Funciona | `api-connectors` |
| Orquestrador de disparo (sequencial por ordem) | ✅ Funciona | `webhooks.ts:dispararWebhooks()` |
| Resolução dinâmica de `{{tabela.coluna}}` | ✅ Funciona | `webhooks.ts` |
| Logs de execução | ✅ Funciona | `webhook_logs` |
| Teste de payload | ✅ Funciona | `CentralAceesTab.tsx` |
| Importador de cURL | ✅ Funciona | `CentralAceesTab.tsx` |
| Assistente de colunas do banco | ✅ Funciona | `CentralAceesTab.tsx` |
| Modelos de integração nativa | ✅ Funciona | `CentralAceesTab.tsx` |
| Filtro por empresa (global vs específica) | ✅ Funciona | `CentralAceesTab.tsx` |
| Reordenação de passos | ✅ Funciona | `CentralAceesTab.tsx:moverPasso()` |

### 2.2 Módulos com Disparo Funcional ✅

**Cadastros** — Completo (11 eventos no pipeline + 6 module events):
- `link_gerado`, `dados_enviados`, `em_analise`, `em_correcao`, `aprovado`, `reprovado`
- `botao_compartilhar_link`, `botao_aprovar`, `botao_reprovar`, `botao_corrigir`
- `criacao_credencial`, `cadastro.criado`, `cadastro.aprovado`, `cadastro.reprovado`
- `documento.aprovado`, `documento.reprovado`, `link.gerado`

**Funis** — Parcial (8 de 12):
- ✅ `funil.criado`, `funil.atualizado`, `funil.excluido`, `funil.criado_template`
- ✅ `tarefa.criada`, `tarefa.concluida`, `tarefa.movida`
- ✅ `automacao.executada`
- ✅ `tarefa.comentario_adicionado`
- ✅ `tarefa.anexo_adicionado`
- ❌ `tarefa.label_adicionado` — não disparado
- ❌ `tarefa.atrasada` — não disparado (necessita scheduler/trigger temporal)

---

## 3. Gaps Identificados

### 🔴 Gap 1 — Eventos Definidos mas NUNCA Disparados (CRÍTICO)

**54 eventos definidos, apenas 25 são realmente disparados de algum lugar do código.**

| Módulo | Eventos sem disparo | Impacto |
|---|---|---|
| **Hub** (todos 8) | `material.acessado`, `material.concluido`, `trilha.concluida`, `gamification.level_up`, `badge.conquistado`, `convite.gerado`, `usuario.registrado`, `usuario.status_alterado` | Alto — treinamento, gamificação, onboarding |
| **Mapas** (todos 8) | `mapas.distribuidor.criado`, `.atualizado`, `.excluido`, `mapas.consultor.criado`, `.atualizado`, `.excluido`, `mapas.estado.clicado`, `mapas.pin.clicado` | Alto — presença comercial, tracking de interesse |
| **Despesas** (todos 7) | `despesa.criada`, `.enviada`, `.aprovada`, `.reprovada`, `pagamento.agendado`, `periodo.aberto`, `periodo.fechando` | Alto — fluxo financeiro, aprovação |
| **Rotas** (todos 4) | `rota.criada`, `rota.iniciada`, `rota.finalizada`, `visita.registrada` | Alto — execução de campo, visitas |
| **CRM** (todos 3) | `cliente.criado`, `cliente.transferido`, `visita.realizada` | Médio — relacionamento cliente |
| **NPS** (todos 3) | `nps.resposta_recebida`, `nps.detrator_detectado`, `nps.pesquisa_enviada` | Médio — satisfação, retenção |
| **LinkTree** (todos 3) | `colaborador.criado`, `.ativado`, `.inativado` | Baixo — colaboradores |
| **Funis** (2) | `tarefa.label_adicionado`, `tarefa.atrasada` | Médio — automação funis |

### 🔴 Gap 2 — Módulos Sem Eventos (CRÍTICO)

| Módulo | Situação | Impacto |
|---|---|---|
| **Marketing** (13 submódulos) | 0 eventos em todos os submódulos | Alto — leads, email, LP não disparam nada |
| **Gerador Links** | 0 eventos (mas tem tracking de cliques) | Médio — links gerados sem integração |
| **Empresa** | 0 eventos (infraestrutura) | Baixo — não gera eventos de domínio |

### 🟡 Gap 3 — Divergências Técnicas

| # | Problema | Local | Severidade |
|---|---|---|---|
| 3.1 | **Eventos sem `type`** | `mapas/module.ts` (8 eventos) | Média — quebra filtro na Central |
| 3.2 | **Eventos legados duplicados** | `webhooks.ts:EVENTOS_STATUS_CHANGE` + `EVENTOS_BUTTON_ACTION` | Média — manutenção duplicada |
| 3.3 | **`tipo_evento` é nullable** | Tabela `api_connectors` | Baixa — mas pode causar inconsistência |
| 3.4 | **Mapas não tem `registerPermissionDefaults`** | `mapas/module.ts:setup()` | Baixa — sem defaults de permissão |

### 🟡 Gap 4 — UX / Central de Ações

| # | Problema | Severidade |
|---|---|---|
| 4.1 | **Central de Ações só mostra eventos do módulo selecionado** — não exibe visão cross-módulo | Média |
| 4.2 | **Sem métricas de quantas ações estão configuradas** por módulo, por evento | Baixa |
| 4.3 | **Sem indicador visual** de quais eventos têm ações customizadas configuradas | Baixa |
| 4.4 | **Logs de execução mostram apenas últimos 100** — sem busca ou paginação | Baixa |
| 4.5 | **Não há retry automático** em webhooks com falha | Baixa |

---

## 4. Plano de Ação Detalhado

### Fase 1: 🔴 Emergencial — Conectar Eventos ao Código Real

#### 1.1 Hub (8 eventos)
**Arquivos a modificar:**
- `src/features/hub/services/materiais.ts` — adicionar `dispararEventoModulo("hub", "material.acessado", ...)` e `material.concluido`
- `src/features/hub/services/trilhas.ts` — adicionar `dispararEventoModulo("hub", "trilha.concluida", ...)`
- `src/features/hub/services/gamification.ts` — adicionar `dispararEventoModulo("hub", "gamification.level_up", ...)` e `badge.conquistado`
- `src/features/hub/services/convites.ts` — adicionar `dispararEventoModulo("hub", "convite.gerado", ...)`
- `src/features/hub/services/usuarios.ts` — adicionar `dispararEventoModulo("hub", "usuario.registrado", ...)` e `usuario.status_alterado`

**Payload padrão:** `{ usuario_id, material_id, trilha_id, badge_id, nivel, pontos }`

#### 1.2 Mapas (8 eventos)
**Arquivos a modificar:**
- `src/features/mapas/services/distribuidores.ts` — eventos de CRUD distribuidor
- `src/features/mapas/services/consultores.ts` — eventos de CRUD consultor

**Observação:** Eventos `estado.clicado` e `pin.clicado` são eventos de UI — precisam ser disparados no componente (pode ser via hook ou store, mas o recomendado é chamar `dispararWebhooks` no `onClick`).

**Payload padrão:** `{ entidade_id, nome, estado, regiao, lat, lng }`

#### 1.3 Despesas (7 eventos)
**Arquivos a modificar:**
- `src/features/despesas/services/despesas.ts` — `despesa.criada`, `despesa.enviada`, `despesa.aprovada`, `despesa.reprovada`
- `src/features/despesas/services/pagamentos.ts` — `pagamento.agendado`
- `src/features/despesas/services/periodos.ts` — `periodo.aberto`, `periodo.fechando`

**Payload padrão:** `{ despesa_id, valor, periodo_id, status, usuario_id }`

#### 1.4 Rotas (4 eventos)
**Arquivos a modificar:**
- `src/features/rotas/services/rotas.ts` — `rota.criada`, `rota.iniciada`, `rota.finalizada`
- `src/features/rotas/services/visitas.ts` — `visita.registrada`

**Payload padrão:** `{ rota_id, cliente_id, visita_id, data, status, usuario_id }`

#### 1.5 CRM (3 eventos)
**Arquivos a modificar:**
- `src/features/crm/services/clientes.ts` — `cliente.criado`, `cliente.transferido`
- `src/features/crm/services/visitas.ts` — `visita.realizada`

**Payload padrão:** `{ cliente_id, nome, consultor_origem, consultor_destino, visita_id }`

#### 1.6 NPS (3 eventos)
**Arquivos a modificar:**
- `src/features/nps/services/pesquisas.ts` — `nps.pesquisa_enviada`
- `src/features/nps/services/respostas.ts` — `nps.resposta_recebida`, `nps.detrator_detectado`

**Payload padrão:** `{ nps_id, cliente_id, nota, comentario, empresa_id }`

#### 1.7 LinkTree (3 eventos)
**Arquivos a modificar:**
- `src/features/linktree/services/colaboradores.ts` — `colaborador.criado`, `colaborador.ativado`, `colaborador.inativado`

**Payload padrão:** `{ colaborador_id, nome, email, status, empresa_id }`

#### 1.8 Funis — Completar (2 eventos restantes)
- `src/features/funis/services/tarefas.ts` — adicionar `tarefa.label_adicionado`
- `src/features/funis/services/tarefas.ts` — adicionar `tarefa.atrasada` (com verificação de data fim)

---

### Fase 2: 🟡 Média Prioridade — Adicionar Eventos aos Módulos Sem

#### 2.1 Marketing (13 submódulos)
**Eventos sugeridos por submódulo:**

| Submódulo | Eventos | Arquivo alvo |
|---|---|---|
| Leads | `lead.capturado`, `lead.convertido`, `lead.perdido` | `src/features/marketing/leads/services/` |
| Email Marketing | `email.enviado`, `email.aberto`, `email.clicado` | `src/features/marketing/email-marketing/services/` |
| Landing Pages | `pagina.publicada`, `pagina.visitante` | `src/features/marketing/landing-pages/services/` |
| Pixels | `evento.registrado`, `conversao.registrada` | `src/features/marketing/pixels/services/` |
| WhatsApp | `mensagem.enviada`, `template.cadastrado` | `src/features/marketing/whatsapp/services/` |

**Payload padrão:** `{ lead_id, email_id, pagina_id, pixel_id, mensagem_id, dados }`

#### 2.2 Gerador Links
| Evento | Descrição |
|---|---|
| `link.gerado_whatsapp` | Quando link do WhatsApp é gerado |
| `link.gerado_qrcode` | Quando QR Code é gerado |
| `link.clicado` | Quando link gerado é clicado (tracking da tabela `gerador_link_cliques`) |

**Payload padrão:** `{ link_id, tipo, url, cliques, usuario_id }`

---

### Fase 3: 🟢 Baixa Prioridade — Correções Técnicas

#### 3.1 Adicionar `type` aos eventos do Mapas
No arquivo `src/features/mapas/module.ts`, adicionar `type` para cada evento:

```typescript
// Antes:
{ key: "mapas.distribuidor.criado", label: "Distribuidor Criado", descricao: "..." }

// Depois:
{ key: "mapas.distribuidor.criado", label: "Distribuidor Criado", descricao: "...", type: "status_change" }
{ key: "mapas.estado.clicado", label: "Estado Clicado", descricao: "...", type: "button_action" }
{ key: "mapas.pin.clicado", label: "Pin Clicado", descricao: "...", type: "button_action" }
```

#### 3.2 Unificar Eventos Legados
- Mover `EVENTOS_STATUS_CHANGE` e `EVENTOS_BUTTON_ACTION` de `webhooks.ts` para o `module.ts` do Cadastros
- Garantir que todos os 17 eventos do Cadastros estejam no mesmo lugar

#### 3.3 Adicionar `registerPermissionDefaults` ao Mapas
```typescript
registerPermissionDefaults("mapas-interativos", {
  cadastro: { mapas_gerir_distribuidores: true, mapas_gerir_consultores: true, ... },
  consultor: { mapas_ver_mapa_publico: true, ... },
});
```

---

### Fase 4: 🔵 Melhorias na Central de Ações

#### 4.1 Visão Cross-Módulo na Central
Adicionar uma aba "Visão Geral" que mostra todos os eventos de todos os módulos em uma única lista, com:
- Quantas ações configuradas por evento
- Indicador de ativo/inativo
- Filtro por módulo

#### 4.2 Métricas e Dashboard
Adicionar cards na Central de Ações:
- Total de ações configuradas
- Eventos com mais ações vinculadas
- Taxa de sucesso dos webhooks (últimas 24h)
- Eventos sem nenhuma ação configurada

#### 4.3 Retry Automático
Adicionar suporte a retry em webhooks com falha:
- 3 tentativas com backoff exponencial (1s, 5s, 30s)
- Notificação ao admin após 3 falhas consecutivas

#### 4.4 Webhook de Debug
Adicionar modo "debug" que captura o payload sem executar a ação real:
- Útil para testar templates e placeholders
- Loga o payload completo sem chamar endpoint externo

#### 4.5 Sugestão Inteligente de Eventos
Quando o admin estiver configurando um módulo sem eventos (Marketing, Gerador Links), exibir:
- "Este módulo ainda não possui eventos registrados. Deseja adicionar?"
- Sugestão de eventos baseada no tipo de módulo

---

## 5. Priorização

### 🚨 Fase 1 — Emergencial (fazer AGORA)
Duração estimada: **3-4 dias**

| # | Tarefa | Esforço | Impacto | Dependências |
|---|---|---|---|---|
| 1.1 | Conectar Hub (8 eventos) | 1 dia | Alto — treinamento em tempo real | Nenhuma |
| 1.3 | Conectar Despesas (7 eventos) | 1 dia | Alto — fluxo financeiro | Nenhuma |
| 1.2 | Conectar Mapas (8 eventos) | 1 dia | Alto — presença comercial | Nenhuma |
| 1.4 | Conectar Rotas (4 eventos) | 0.5 dia | Alto — execução de campo | Nenhuma |
| 1.5 | Conectar CRM (3 eventos) | 0.5 dia | Médio | Nenhuma |
| 1.6 | Conectar NPS (3 eventos) | 0.5 dia | Médio | Nenhuma |
| 1.7 | Conectar LinkTree (3 eventos) | 0.25 dia | Baixo | Nenhuma |
| 1.8 | Completar Funis (2 eventos) | 0.25 dia | Médio | Nenhuma |

### 📋 Fase 2 — Média Prioridade (próxima sprint)
Duração estimada: **2-3 dias**

| # | Tarefa | Esforço | Impacto |
|---|---|---|---|
| 2.1 | Adicionar eventos ao Marketing | 2 dias | Alto — automação de marketing |
| 2.2 | Adicionar eventos ao Gerador Links | 1 dia | Médio — tracking de links |

### 🔧 Fase 3 — Correções Técnicas (contínuo)
Duração estimada: **1 dia**

| # | Tarefa | Esforço |
|---|---|---|
| 3.1 | Adicionar type nos eventos do Mapas | 15 min |
| 3.2 | Unificar eventos legados do Cadastros | 30 min |
| 3.3 | Adicionar permission defaults no Mapas | 15 min |

### ✨ Fase 4 — Melhorias UX (próximas sprints)
Duração estimada: **3-5 dias**

| # | Tarefa | Esforço | Prioridade |
|---|---|---|---|
| 4.1 | Visão cross-módulo | 2 dias | Média |
| 4.2 | Métricas e dashboard | 1 dia | Baixa |
| 4.3 | Retry automático | 1 dia | Média |
| 4.4 | Webhook de debug | 0.5 dia | Baixa |
| 4.5 | Sugestão inteligente de eventos | 0.5 dia | Baixa |

---

## 6. Estimativa de Esforço Total

| Fase | Dias | Complexidade |
|---|---|---|
| Fase 1 — Emergencial | 3-4 dias | Média (simples, mas muitos arquivos) |
| Fase 2 — Média Prioridade | 2-3 dias | Alta (criar serviços novos) |
| Fase 3 — Correções Técnicas | 1 dia | Baixa |
| Fase 4 — Melhorias UX | 3-5 dias | Alta (componente novo) |
| **Total** | **9-13 dias** | |

---

## 7. Checklist de Implementação

### 🔴 Fase 1 — Checklist

- [ ] **1.1 Hub** — `dispararEventoModulo()` nos services de:
  - [ ] `materiais.ts` (2 eventos)
  - [ ] `trilhas.ts` (1 evento)
  - [ ] `gamification.ts` (2 eventos)
  - [ ] `convites.ts` (1 evento)
  - [ ] `usuarios.ts` (2 eventos)
- [ ] **1.2 Mapas** — `dispararEventoModulo()` nos services de:
  - [ ] `distribuidores.ts` (3 eventos)
  - [ ] `consultores.ts` (3 eventos)
  - [ ] Eventos de UI (`estado.clicado`, `pin.clicado`)
- [ ] **1.3 Despesas** — `dispararEventoModulo()` nos services de:
  - [ ] `despesas.ts` (4 eventos)
  - [ ] `pagamentos.ts` (1 evento)
  - [ ] `periodos.ts` (2 eventos)
- [ ] **1.4 Rotas** — `dispararEventoModulo()` nos services de:
  - [ ] `rotas.ts` (3 eventos)
  - [ ] `visitas.ts` (1 evento)
- [ ] **1.5 CRM** — `dispararEventoModulo()` nos services de:
  - [ ] `clientes.ts` (2 eventos)
  - [ ] `visitas.ts` (1 evento)
- [ ] **1.6 NPS** — `dispararEventoModulo()` nos services de:
  - [ ] `pesquisas.ts` (1 evento)
  - [ ] `respostas.ts` (2 eventos)
- [ ] **1.7 LinkTree** — `dispararEventoModulo()` nos services de:
  - [ ] `colaboradores.ts` (3 eventos)
- [ ] **1.8 Funis** — completar eventos faltantes:
  - [ ] `tarefa.label_adicionado`
  - [ ] `tarefa.atrasada`

### 🟡 Fase 2 — Checklist
- [ ] **2.1 Marketing** — adicionar `events: []` com eventos sugeridos
  - [ ] Registrar eventos nos module.ts de cada submódulo
  - [ ] Adicionar `dispararEventoModulo()` nos services
- [ ] **2.2 Gerador Links**
  - [ ] Adicionar eventos ao module.ts
  - [ ] Integrar tracking de cliques com webhooks

### 🔧 Fase 3 — Checklist
- [ ] **3.1** Adicionar `type` aos eventos do Mapas
- [ ] **3.2** Unificar eventos legados no module.ts do Cadastros
- [ ] **3.3** Adicionar `registerPermissionDefaults` no Mapas

### ✨ Fase 4 — Checklist
- [ ] **4.1** Visão cross-módulo na Central de Ações
- [ ] **4.2** Métricas e dashboard de eventos
- [ ] **4.3** Retry automático em webhooks
- [ ] **4.4** Webhook de debug
- [ ] **4.5** Sugestão inteligente de eventos

---

## 8. Anexo: Mapa de Eventos por Módulo

### Cadastros (17 eventos — 100% funcional)
```
Status Change (8):
  - link_gerado ✅
  - dados_enviados ✅
  - em_analise ✅
  - em_correcao ✅
  - aprovado ✅
  - reprovado ✅
  - cadastro.criado ✅
  - cadastro.aprovado ✅
  - cadastro.reprovado ✅

Button Action (9):
  - botao_compartilhar_link ✅
  - botao_aprovar ✅
  - botao_reprovar ✅
  - botao_corrigir ✅
  - criacao_credencial ✅
  - documento.aprovado ✅
  - documento.reprovado ✅
  - link.gerado ✅
```

### Funis (12 eventos — 67% funcional)
```
Status Change (9):
  - funil.criado ✅
  - funil.atualizado ✅
  - funil.excluido ✅
  - tarefa.criada ✅
  - tarefa.comentario_adicionado ✅
  - tarefa.anexo_adicionado ✅
  - tarefa.label_adicionado ❌
  - tarefa.atrasada ❌
  - funil.criado_template ✅

Button Action (3):
  - tarefa.concluida ✅
  - tarefa.movida ✅
  - automacao.executada ✅
```

### Hub (8 eventos — 0% funcional)
```
Status Change (7):
  - material.acessado ❌
  - material.concluido ❌
  - trilha.concluida ❌
  - gamification.level_up ❌
  - badge.conquistado ❌
  - usuario.registrado ❌
  - usuario.status_alterado ❌

Button Action (1):
  - convite.gerado ❌
```

### Mapas (8 eventos — 0% funcional) ⚠️ Sem type
```
Sem type definido (todos):
  - mapas.distribuidor.criado ❌
  - mapas.distribuidor.atualizado ❌
  - mapas.distribuidor.excluido ❌
  - mapas.consultor.criado ❌
  - mapas.consultor.atualizado ❌
  - mapas.consultor.excluido ❌
  - mapas.estado.clicado ❌
  - mapas.pin.clicado ❌
```

### Despesas (7 eventos — 0% funcional)
```
Status Change (5):
  - despesa.aprovada ❌
  - despesa.reprovada ❌
  - pagamento.agendado ❌
  - periodo.aberto ❌
  - periodo.fechando ❌

Button Action (2):
  - despesa.criada ❌
  - despesa.enviada ❌
```

### Rotas (4 eventos — 0% funcional)
```
Status Change (2):
  - rota.criada ❌
  - rota.finalizada ❌

Button Action (2):
  - rota.iniciada ❌
  - visita.registrada ❌
```

### CRM (3 eventos — 0% funcional)
```
Status Change (2):
  - cliente.criado ❌
  - cliente.transferido ❌

Button Action (1):
  - visita.realizada ❌
```

### NPS (3 eventos — 0% funcional)
```
Status Change (2):
  - nps.resposta_recebida ❌
  - nps.detrator_detectado ❌

Button Action (1):
  - nps.pesquisa_enviada ❌
```

### LinkTree (3 eventos — 0% funcional)
```
Status Change (3):
  - colaborador.criado ❌
  - colaborador.ativado ❌
  - colaborador.inativado ❌
```

### Gerador Links (0 eventos)
```
Nenhum evento registrado.
Recomendado: link.gerado_whatsapp, link.gerado_qrcode, link.clicado
```

### Marketing (0 eventos em 13 submódulos)
```
Nenhum evento registrado em nenhum submódulo.
Recomendado: 15+ eventos (leads, email, LP, pixels, whatsapp)
```

### Empresa (0 eventos)
```
Módulo de infraestrutura — não gera eventos de domínio.
```

---

## 9. Conclusão

**A Central de Ações já está pronta para receber personalização de todos os módulos.** A UI, orquestrador, tabelas e serviços de webhooks/notificações/APIs estão completos e funcionais.

**O que falta não é infraestrutura — são as chamadas de `dispararWebhooks()` ou `dispararEventoModulo()` no código real de cada módulo.**

Das 54 definições de evento, apenas 25 (46%) são efetivamente chamadas no código. A Fase 1 do plano resolve isso adicionando os pontos de disparo nos serviços de cada módulo — é trabalho cirúrgico, não arquitetural.

Após a Fase 1, quaisquer eventos definidos em `module.ts` já estarão automaticamente disponíveis para personalização na Central de Ações, sem necessidade de alterar a UI.
