# Análise de Eventos, Botões e Triggers — Módulo NPS

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## 1. Visão Geral

O módulo **NPS** gerencia pesquisas de satisfação e Net Promoter Score. Possui **3 eventos registrados**, com destaque para o evento de detecção automática de detratores.

---

## 2. Eventos do Módulo

### Status Change (2 eventos)

| Evento | Label | Descrição |
|---|---|---|
| `nps.resposta_recebida` | Resposta Recebida | Dispara quando uma resposta é submetida |
| `nps.detrator_detectado` | Detrator Detectado | Dispara quando nota NPS ≤ 6 |

### Button Action (1 evento)

| Evento | Label | Descrição |
|---|---|---|
| `nps.pesquisa_enviada` | Pesquisa Enviada | Dispara quando pesquisas são disparadas |

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
- **Seletor de Módulo**: "NPS"

---

## 5. Observações

- **Evento `detrator_detectado`** é único entre todos os módulos — permite disparar ações de recuperação automaticamente
- Ideal para integração com Evolution API (WhatsApp) para contato automático com detratores
- Suporte a **credenciais com escopo** (`hasCredentialScopes: true`)
- 3 ambientes: cadastro, consultor, tecnologia
