# Análise de Eventos, Botões e Triggers — Módulo LinkTree

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## 1. Visão Geral

O módulo **LinkTree** gerencia cartões digitais e QR Codes dos colaboradores. Possui **3 eventos registrados**, focados no ciclo de vida dos colaboradores.

---

## 2. Eventos do Módulo

### Status Change (3 eventos)

| Evento | Label | Descrição |
|---|---|---|
| `colaborador.criado` | Colaborador Criado | Dispara quando um novo colaborador é cadastrado |
| `colaborador.ativado` | Colaborador Ativado | Dispara quando um colaborador é ativado |
| `colaborador.inativado` | Colaborador Inativado | Dispara quando um colaborador é inativado |

**Total: 3 eventos disponíveis para workflow.**

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
- **Seletor de Módulo**: "LinkTree"

---

## 5. Observações

- Eventos focados em colaboradores (submódulo) — submódulo de empresa não possui eventos
- Suporte a **credenciais com escopo** (`hasCredentialScopes: true`)
- Nav items registrados sob o módulo **marketing** (não linktree)
