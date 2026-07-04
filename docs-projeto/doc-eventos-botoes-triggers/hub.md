# Análise de Eventos, Botões e Triggers — Módulo Hub

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## 1. Visão Geral

O módulo **Hub** é a plataforma de treinamento e gamificação do ERP Conexão. Possui **8 eventos registrados** cobrindo materiais, trilhas, gamificação, badges e usuários.

---

## 2. Eventos do Módulo

### Status Change (7 eventos)

| Evento | Label | Descrição |
|---|---|---|
| `material.acessado` | Material Acessado | Quando um material é visualizado |
| `material.concluido` | Material Concluído | Quando um material é concluído |
| `trilha.concluida` | Trilha Concluída | Quando uma trilha é concluída |
| `gamification.level_up` | Level Up | Quando um usuário sobe de nível |
| `badge.conquistado` | Badge Conquistado | Quando um badge é desbloqueado |
| `usuario.registrado` | Usuário Registrado | Quando um usuário se registra via convite |
| `usuario.status_alterado` | Status Alterado | Quando status do usuário muda |

### Button Action (1 evento)

| Evento | Label | Descrição |
|---|---|---|
| `convite.gerado` | Convite Gerado | Quando um convite é criado |

**Total: 8 eventos disponíveis para workflow.**

---

## 3. Quem Pode Configurar

| Perfil | Acesso |
|---|---|
| Super Admin | Total |
| Admin de Empresa | `/empresa/acoes` |
| Consultor/Distribuidor | Sem acesso |
| TI | Sem acesso direto |

---

## 4. Onde Configurar

- **Rota**: `/empresa/acoes` ou `/global/acoes`
- **Seletor de Módulo**: "Hub"

---

## 5. Banco de Dados

Tabelas padrão: `webhooks`, `webhook_logs`, `notificacoes_templates`, `notificacoes`, `api_connectors`

Variáveis de payload típicas: `{{material_id}}`, `{{usuario_id}}`, `{{nivel}}`, `{{badge_id}}`, `{{trilha_id}}`, `{{pontos}}`

---

## 6. Observações

- **Único módulo com evento de gamificação** (`level_up`, `badge.conquistado`)
- Eventos de material podem ser usados para disparar ações de follow-up automático
- Suporte a **credenciais com escopo** (`hasCredentialScopes: true`)
- Possui aba própria de **integrações** e **chatbot** na configuração do módulo
- Módulo com **18 rotas** e **5 perfis de acesso** (admin, gestor, consultor, distribuidor, cliente)
