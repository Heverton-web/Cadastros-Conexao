# Análise de Performance e Otimização — ERP Conexão

> **Documento gerado em:** 04/07/2026

---

## 1. Visão Geral

Performance do ERP Conexão focada em: React Query caching, lazy loading, code splitting, e otimizações de build.

---

## 2. React Query Cache

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000 },  // 1 min
  },
});
```

### Estratégia por Tipo de Dado

| Dado | staleTime | Motivo |
|---|---|---|
| Listas | 30-60s | Mudam frequentemente |
| Notificações | 5s | Polling quase real-time |
| Design tokens | Infinity | Raramente mudam |
| Dados de mapa | Infinity | Estáticos |

---

## 3. Code Splitting

- **TanStack Router**: lazy loading automático de rotas
- **Vite**: chunk splitting automático
- **Tree shaking**: Lucide icons importados individualmente

---

## 4. Otimizações de Build

```javascript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        ui: ['lucide-react'],
        query: ['@tanstack/react-query'],
      },
    },
  },
}
```

---

## 5. Cache de Assets (Nginx)

```
location /icons/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 6. Sentry Performance

```typescript
Sentry.init({
  tracesSampleRate: 0.1,  // 10% das transações
  replaysSessionSampleRate: 0,  // Desligado
  replaysOnErrorSampleRate: 1.0,  // 100% em erro
});
```

---

## 7. Otimizações de Banco

- **Índices**: `idx_cadastros_empresa`, `idx_credenciais_empresa`, etc.
- **COUNT via `count=exact`**: Queries de dashboard usam `limit=0` + `count=exact`
- **RLS eficiente**: Funções `SECURITY DEFINER` com cache de query

---

## 8. Recomendações

| Melhoria | Impacto | Esforço |
|---|---|---|
| Code splitting por módulo | Alto | Médio |
| Imagens otimizadas (WebP) | Médio | Baixo |
| Service worker offiline-first | Médio | Alto |
| Virtual scrolling (listas grandes) | Médio | Médio |
