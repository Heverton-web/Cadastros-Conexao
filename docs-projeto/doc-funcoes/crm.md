# Análise das Funções — Módulo CRM

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral do Módulo](#1-visão-geral-do-módulo)
2. [Funções do Módulo](#2-funções-do-módulo)
3. [Referências Técnicas](#3-referências-técnicas)

---

## 1. Visão Geral do Módulo

O módulo **CRM** gerencia relacionamento com clientes e equipe comercial. Segundo maior módulo em número de rotas (13), com pipeline Kanban, carteira de clientes, tarefas e hierarquia de equipe.

| Aspecto | Detalhe |
|---|---|
| **Key** | `crm` |
| **Descrição** | Gestão de relacionamento com clientes |
| **Ambientes** | cadastro, consultor, tecnologia |
| **Permissões** | 10 funções granulares |
| **Eventos** | 3 webhooks |
| **Rotas** | 13 páginas |
| **Design Config** | ✅ `/empresa/crm/design` |

---

## 2. Funções do Módulo

### 2.1 Função: Dashboard CRM

**Rota**: `/crm/dashboard`
**Permissão**: `crm_dashboard`

KPIs do time comercial: total clientes, visitas do mês, taxa de conversão, pipeline.

---

### 2.2 Função: Carteira de Clientes

**Rota**: `/crm/carteira`
**Permissão**: `crm_carteira`

Lista de clientes com busca, filtros, status. Ações: criar visita, transferir cliente.

---

### 2.3 Função: Pipeline de Vendas

**Rota**: `/crm/pipeline`
**Permissão**: `crm_pipeline`

Kanban com estágios de vendas (prospecção, qualificação, proposta, negociação, fechamento). Arrastar cards entre colunas.

---

### 2.4 Função: Tarefas

**Rota**: `/crm/tarefas`
**Permissão**: `crm_tarefas`

Gerenciamento de tarefas com checklists, prazos, atribuição.

---

### 2.5 Função: Detalhe do Cliente

**Rota**: `/crm/cliente/$id`
**Permissão**: `crm_cliente_detalhe`

Perfil completo do cliente: dados cadastrais, histórico de visitas, pipeline, tarefas.

---

### 2.6 Função: Equipe

**Rota**: `/crm/equipe`
**Permissão**: `crm_equipe`

Visualização da hierarquia de equipe: super_admin → diretor → gestor → consultor.

---

### 2.7 Função: Métricas

**Rota**: `/crm/metricas`
**Permissão**: `crm_metricas`

Métricas avançadas com gráficos: produção por consultor, taxa de conversão, visitas.

---

### 2.8 Função: BI

**Rota**: `/crm/bi`
**Permissão**: `crm_bi`

Business Intelligence com dados consolidados do CRM.

---

### 2.9 Função: Transferência

**Rota**: `/crm/transferencia`
**Permissão**: `crm_transferencia`

Transferência de clientes entre consultores. Sub-rota: `/crm/transferencia/consultores` (histórico).

---

### 2.10 Função: Diretoria

**Rota**: `/crm/diretoria`
**Permissão**: `crm_diretoria`

Visão executiva: desempenho por gestor, drill-down em `/crm/diretoria/gestor/$id`.

---

### 2.11 Função: Aceitar Convite

**Rota**: `/crm/aceitar-convite/$token`
**Permissão**: Pública (com token)

Aceita convite para entrar na equipe CRM de uma empresa.

---

### 2.12 Funções Granulares (10)

| Key | Grupo | Descrição |
|---|---|---|
| `crm_dashboard` | CRM | Acessar dashboard |
| `crm_carteira` | CRM | Visualizar carteira |
| `crm_pipeline` | CRM | Acessar pipeline |
| `crm_tarefas` | CRM | Gerenciar tarefas |
| `crm_cliente_detalhe` | CRM | Ver detalhes do cliente |
| `crm_equipe` | CRM | Visualizar equipe |
| `crm_metricas` | CRM | Acessar métricas |
| `crm_bi` | CRM | Acessar BI |
| `crm_transferencia` | CRM | Gerenciar transferências |
| `crm_diretoria` | CRM | Acessar diretoria |

---

### 2.13 Eventos (3)

`cliente.criado`, `cliente.transferido`, `visita.realizada`

---

## 3. Referências Técnicas

| Arquivo | Função |
|---|---|
| `src/features/crm/module.ts` | Definição do módulo, 13 rotas |
| `src/features/crm/permissions.ts` | 10 permissões |
| `supabase/migrations/20260629120000_crm_pipeline_tarefas.sql` | Tabelas CRM |
