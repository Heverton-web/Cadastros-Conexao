# Análise de Eventos, Botões e Triggers — Módulo Despesas

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## 1. Visão Geral

O módulo **Despesas em Rota** gerencia despesas, aprovação e reembolso. Possui **7 eventos registrados** cobrindo lançamento, aprovação, pagamento e períodos.

---

## 2. Eventos do Módulo

### Button Action (2 eventos)

| Evento | Label | Descrição |
|---|---|---|
| `despesa.criada` | Despesa Criada | Dispara quando uma nova despesa é lançada |
| `despesa.enviada` | Despesa Enviada | Dispara quando despesas são enviadas para aprovação |

### Status Change (5 eventos)

| Evento | Label | Descrição |
|---|---|---|
| `despesa.aprovada` | Despesa Aprovada | Dispara quando despesas são aprovadas |
| `despesa.reprovada` | Despesa Reprovada | Dispara quando despesas são reprovadas |
| `pagamento.agendado` | Pagamento Agendado | Dispara quando pagamento é agendado |
| `periodo.aberto` | Período Aberto | Dispara quando um período é aberto |
| `periodo.fechando` | Período Fechando | Dispara quando período está prestes a fechar |

**Total: 7 eventos disponíveis para workflow.**

---

## 3. Quem Pode Configurar

| Perfil | Acesso |
|---|---|
| Super Admin | Total |
| Admin de Empresa | `/empresa/acoes` |
| Consultor | Sem acesso |
| TI | Sem acesso direto |

---

## 4. Onde Configurar

- **Rota**: `/empresa/acoes` ou `/global/acoes`
- **Seletor de Módulo**: "Despesas em Rota"

---

## 5. Banco de Dados

Tabelas padrão: `webhooks`, `webhook_logs`, `notificacoes_templates`, `notificacoes`, `api_connectors`

---

## 6. Observações

- Único módulo com evento de **período** (`periodo.aberto`, `periodo.fechando`)
- Evento `pagamento.agendado` permite integração com sistemas financeiros externos
- Suporte a **credenciais com escopo** (`hasCredentialScopes: true`)
- Workflow de aprovação: Criada → Enviada → Aprovada/Reprovada → Pagamento Agendado
