# Análise das Funções — Módulo Rotas

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral do Módulo](#1-visão-geral-do-módulo)
2. [Funções do Módulo](#2-funções-do-módulo)
3. [Referências Técnicas](#3-referências-técnicas)

---

## 1. Visão Geral do Módulo

O módulo **Rotas de Visitas** gerencia planejamento e execução de rotas de visitas a clientes, com integração a Google Maps e otimização de trajeto.

| Aspecto | Detalhe |
|---|---|
| **Key** | `rotas` |
| **Descrição** | Planejamento e execução de rotas de visitas |
| **Ambientes** | cadastro, consultor, tecnologia |
| **Permissões** | 6 funções granulares |
| **Eventos** | 4 webhooks |
| **Rotas** | 3 páginas |
| **Design Config** | ✅ `/empresa/rotas/design` |

---

## 2. Funções do Módulo

### 2.1 Função: Planejamento de Rotas

**Rota**: `/rotas`
**Permissão**: `rotas_planejar` ou `rotas_executar`

Lista de rotas com filtro por status (planejada, em_execucao, realizada, nao_realizada). KPIs: total clientes, rotas planejadas, rotas hoje. Criação de nova rota com seleção de clientes.

---

### 2.2 Função: Execução de Rota

**Rota**: `/rotas/$id`
**Permissão**: `rotas_executar`

Detalhes da rota com lista de visitas. Iniciar/finalizar rota, registrar visitas com formulário pós-visita. Navegação integrada ao Google Maps/Waze.

---

### 2.3 Função: Configuração de Rotas

**Rota**: `/rotas/config`
**Permissão**: `rotas_configurar`

Configuração de valor por KM, raio permitido, upload da base de clientes via CSV, formulário pós-visita configurável.

---

### 2.4 Funções Granulares (6)

| Key | Grupo | Descrição |
|---|---|---|
| `rotas_planejar` | Rotas | Criar e editar planejamento de rotas |
| `rotas_executar` | Rotas | Iniciar e finalizar rotas e visitas |
| `rotas_configurar` | Administração | Configurar valor KM e raio |
| `rotas_upload_base` | Administração | Upload base clientes via CSV |
| `rotas_ver_relatorios` | Visualização | Visualizar relatórios |
| `rotas_form_config` | Administração | Configurar formulário pós-visita |

---

### 2.5 Eventos (4)

| Evento | Dispara quando |
|---|---|
| `rota.criada` | Nova rota planejada |
| `rota.iniciada` | Consultor inicia execução |
| `rota.finalizada` | Rota concluída |
| `visita.registrada` | Visita finalizada |

---

## 3. Referências Técnicas

| Arquivo | Função |
|---|---|
| `src/features/rotas/module.ts` | Definição do módulo |
| `src/features/rotas/permissions.ts` | 6 permissões |
| `src/features/rotas/types.ts` | Types (RotaStatus, RotaTipo) |
| `supabase/migrations/20260629150000_rotas_module.sql` | Tabelas `rotas_*` |
