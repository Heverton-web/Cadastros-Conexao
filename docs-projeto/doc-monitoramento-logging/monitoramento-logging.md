# Análise de Monitoramento e Logging — ERP Conexão

> **Documento gerado em:** 04/07/2026

---

## 1. Logging Existentes

### 1.1 Webhook Logs

Tabela `webhook_logs` registra **todas as execuções** de webhooks e API connectors:

| Coluna | Descrição |
|---|---|
| `webhook_id` | Webhook executado |
| `evento` | Evento disparado |
| `url` | URL chamada |
| `status_code` | HTTP status |
| `resposta` | Resposta (truncada 2000 chars) |
| `sucesso` | Booleano |
| `payload_enviado` | Payload completo |
| `created_at` | Timestamp |

### 1.2 Atividades (Activity Log)

Tabela `atividades` registra ações de usuários:

```typescript
await logAtividade("cadastro", cadastroId, "aprovado", "Cadastro aprovado por admin");
```

### 1.3 Console.log / console.error

Usado extensivamente para debugging:

```typescript
console.error("Erro ao buscar dados:", err);
console.warn("BrasilAPI falhou, tentando ViaCEP...");
```

---

## 2. Sentry (Error Tracking)

```typescript
// src/core/monitoring/sentry.ts
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
});
```

### Eventos Capturados

| Evento | Captura |
|---|---|
| Erros não tratados | ✅ (automático) |
| Promises rejeitadas | ✅ (automático) |
| Erros em React Query | ⚠️ Parcial |
| Erros de Supabase | ⚠️ Parcial (via catch) |

---

## 3. Monitoramento de Performance (K6)

Scripts em `tests/k6/` para stress test da API Supabase:

| Script | O que monitora |
|---|---|
| `k6-complete-stress.js` | Dashboard + listagens + RPCs |
| `k6-auth-login.js` | Login concorrente |
| `k6-dashboard.js` | 6 queries de status |

### Thresholds

```javascript
error_rate < 5%
p(95) response time < 5s
```

---

## 4. Health Check

Não há health check endpoint implementado. Sugere-se:
- `GET /api/health` → verifica conexão Supabase
- `GET /api/health/db` → verifica RLS functions
- Container health → Docker HEALTHCHECK

---

## 5. Alertas

| Tipo | Atual | Sugerido |
|---|---|---|
| Erro no Sentry | ✅ | — |
| Webhook falhando | ✅ (log visível) | Alerta por e-mail |
| Stress test falhando | ✅ (relatório) | CI/CD gate |
| Downtime | ❌ | Uptime monitor |
| SSL expirando | ❌ | Let's Encrypt auto |
| Banco lento | ❌ | Supabase advisor |

---

## 6. Recomendações

1. Adicionar **health check endpoint**
2. Configurar **alerta de webhook falhando** no Sentry
3. Adicionar **logging de RLS violations**
4. **Agregar webhook_logs** em dashboard de monitoramento
5. **Rate limiting** nas chamadas de API externas
