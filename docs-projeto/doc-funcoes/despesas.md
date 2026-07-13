# Análise das Funções — Módulo Despesas

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral do Módulo](#1-visão-geral-do-módulo)
2. [Funções do Módulo](#2-funções-do-módulo)
3. [Referências Técnicas](#3-referências-técnicas)

---

## 1. Visão Geral do Módulo

O módulo **Despesas em Rota** gerencia o pipeline completo de despesas: lançamento → envio para aprovação → aprovação/reprovação → pagamento.

| Aspecto | Detalhe |
|---|---|
| **Key** | `despesas` |
| **Descrição** | Gestão de despesas em rota, aprovação e reembolso |
| **Ambientes** | cadastro, consultor, tecnologia, suporte |
| **Permissões** | 8 funções granulares |
| **Eventos** | 7 webhooks |
| **Rotas** | 4 páginas |
| **Design Config** | ✅ `/empresa/despesas/design` |

---

## 2. Funções do Módulo

### 2.1 Função: Minhas Despesas

**Rota**: `/despesas`
**Permissão**: `despesas_lancar`

Lançamento de despesas em rota. Formulário com tipo, valor, data, descrição, comprovante. Status: rascunho. Ações: enviar lote.

---

### 2.2 Função: Aprovação de Despesas

**Rota**: `/despesas/aprovacao`
**Permissão**: `despesas_aprovar` ou `despesas_reprovar`

Lista de despesas enviadas para aprovação. Ações: aprovar, reprovar com comentário.

---

### 2.3 Função: Meus Relatórios

**Rota**: `/despesas/meus-relatorios`
**Permissão**: `despesas_lancar` ou `despesas_enviar`

Histórico de envios do usuário. Visualização de status (aprovado, reprovado, pago).

---

### 2.4 Função: Relatórios Gerais

**Rota**: `/despesas/relatorios`
**Permissão**: `despesas_ver_relatorios`

Relatórios com filtros por período, colaborador, status. Exportação.

---

### 2.5 Funções Granulares (8)

| Key | Grupo | Descrição |
|---|---|---|
| `despesas_lancar` | Despesas | Lançar novas despesas |
| `despesas_enviar` | Despesas | Enviar lote para aprovação |
| `despesas_aprovar` | Aprovação | Aprovar envios |
| `despesas_reprovar` | Aprovação | Reprovar envios |
| `despesas_definir_pagamento` | Pagamento | Definir forma/data de pagamento |
| `despesas_configurar` | Administração | Configurar tipos e valores |
| `despesas_ver_relatorios` | Visualização | Visualizar relatórios |
| `despesas_ver_todas` | Visualização | Ver despesas de todos colaboradores |

---

### 2.6 Eventos (7)

`despesa.criada`, `despesa.enviada`, `despesa.aprovada`, `despesa.reprovada`, `pagamento.agendado`, `periodo.aberto`, `periodo.fechando`

---

## 3. Referências Técnicas

| Arquivo | Função |
|---|---|
| `src/features/despesas/module.ts` | Definição do módulo |
| `src/features/despesas/permissions.ts` | 8 permissões |
| `src/features/despesas/types.ts` | Types do módulo |
| `supabase/migrations/20260629130000_despesas_module.sql` | Tabelas `despesas_*` |
