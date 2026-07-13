# Análise de Workflows e Automações — ERP Conexão

> **Documento gerado em:** 04/07/2026

---

## 1. Workflow Builder (Central de Ações)

A **Central de Ações** (`/empresa/acoes`) é um workflow builder visual que permite:

1. **Selecionar módulo** → ver eventos disponíveis
2. **Para cada evento** → configurar sequência de ações:
   - Notificações internas (in-app)
   - Webhooks HTTP
   - API Connectors (chamadas externas)
3. **Ordenar ações** com setas up/down
4. **Testar payload** antes de salvar
5. **Visualizar logs** de execução

---

## 2. Orquestrador de Eventos

```
Evento → dispararWebhooks()
  ├── Busca notificações ativas
  ├── Busca webhooks ativos  
  └── Busca api_connectors ativos
      ↓
  Ordena por ordem numérica
      ↓
  Executa sequencialmente:
    ├── Notificação (in-app)
    ├── Webhook (HTTP fetch)
    └── API Connector (RPC pg_net)
      ↓
  Log em webhook_logs
```

---

## 3. Pipeline de Cadastro (Automático)

```
link_gerado → dados_enviados → em_analise → [em_correcao] → aprovado/reprovado
```

Cada transição de status dispara eventos automaticamente.

---

## 4. Automações do Funis

O módulo Funis possui **regras de automação** com evento `automacao.executada`:
- Move tarefas entre colunas automaticamente
- Adiciona labels por trigger
- Notifica responsáveis

---

## 5. Integrações Automáticas

| Integração | Gatilho | Ação |
|---|---|---|
| Evolution API | Qualquer evento | Envio de WhatsApp |
| Gmail SMTP | Qualquer evento | Envio de e-mail |
| Google Sheets | Aprovação | Inserir linha |
| Google Maps | Consulta CEP | Geocodificar |
