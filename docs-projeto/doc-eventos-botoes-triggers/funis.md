# Análise de Eventos, Botões e Triggers — Módulo Funis

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## 1. Visão Geral

O módulo **Funis** gerencia funis Kanban para fluxos de trabalho, com sistema de tarefas, colunas, labels, anexos, comentários e automações. É o módulo com **o maior número de eventos registrados (12 eventos)**, cobrindo todo o ciclo de vida de funis e tarefas.

---

## 2. Eventos do Módulo

### Status Change (9 eventos)

| Evento | Label | Descrição |
|---|---|---|
| `funil.criado` | Funil Criado | Quando um novo funil é criado |
| `funil.atualizado` | Funil Atualizado | Quando um funil é editado |
| `funil.excluido` | Funil Excluído | Quando um funil é removido |
| `tarefa.criada` | Tarefa Criada | Quando uma nova tarefa é adicionada |
| `tarefa.comentario_adicionado` | Comentário Adicionado | Quando um comentário é adicionado a uma tarefa |
| `tarefa.anexo_adicionado` | Anexo Adicionado | Quando um anexo é adicionado a uma tarefa |
| `tarefa.label_adicionado` | Label Adicionado | Quando um label é adicionado a uma tarefa |
| `tarefa.atrasada` | Tarefa Atrasada | Quando uma tarefa ultrapassa a data fim |
| `funil.criado_template` | Funil Criado via Template | Quando um funil é criado a partir de template |

### Button Action (3 eventos)

| Evento | Label | Descrição |
|---|---|---|
| `tarefa.concluida` | Tarefa Concluída | Quando uma tarefa é marcada como concluída |
| `tarefa.movida` | Tarefa Movida | Quando uma tarefa é movida entre colunas |
| `automacao.executada` | Automação Executada | Quando uma regra de automação é executada |

**Total: 12 eventos disponíveis para workflow.**

---

## 3. Quem Pode Configurar

| Perfil | Acesso |
|---|---|
| Super Admin | Total — `/global/acoes` |
| Admin de Empresa | `/empresa/acoes` |
| Consultor | Sem acesso |
| TI | Sem acesso direto |

---

## 4. Onde Configurar

- **Rota**: `/empresa/acoes` (admin empresa) ou `/global/acoes` (super admin)
- **Seletor de Módulo**: "Funis"

---

## 5. Banco de Dados

As mesmas tabelas do sistema global:
- `webhooks`, `webhook_logs`, `notificacoes_templates`, `notificacoes`, `api_connectors`, `atividades`

As variáveis de payload incluem: `{{funil_id}}`, `{{tarefa_id}}`, `{{coluna_origem}}`, `{{coluna_destino}}`, `{{comentario}}`, etc.

---

## 6. Observações

- **Maior número de eventos** entre todos os módulos (12)
- Possui evento de **tarefa atrasada** — único módulo com detecção temporal automática
- Possui evento de **automação executada** — suporte a regras de automação
- Suporte a **credenciais com escopo** (`hasCredentialScopes: true`)
