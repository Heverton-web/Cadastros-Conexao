# Análise de Eventos, Botões e Triggers — Módulo CRM

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## 1. Visão Geral

O módulo **CRM** gerencia relacionamento com clientes, carteira de consultores, pipeline de vendas, tarefas, visitas e transferências. Possui **3 eventos registrados**.

---

## 2. Eventos do Módulo

### Status Change (2 eventos)

| Evento | Label | Descrição |
|---|---|---|
| `cliente.criado` | Cliente Criado | Quando um novo cliente é adicionado |
| `cliente.transferido` | Cliente Transferido | Quando um cliente é transferido |

### Button Action (1 evento)

| Evento | Label | Descrição |
|---|---|---|
| `visita.realizada` | Visita Realizada | Quando uma visita é registrada |

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
- **Seletor de Módulo**: "CRM"

---

## 5. Observações

- Evento `cliente.transferido` é único — permite integração com webhook ao transferir cliente entre consultores
- Apesar de ter **13 rotas**, possui apenas **3 eventos** — potencial para expansão
- Suporte a **design config** (`hasDesignConfig: true`)
- 3 ambientes: cadastro, consultor, tecnologia
