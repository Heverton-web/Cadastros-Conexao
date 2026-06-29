# Avaliação: Server Components

## Contexto
O projeto usa TanStack Router, que é um roteador client-side. Server Components são nativos do Next.js/App Router.

## Análise

### Viabilidade com TanStack Router
- **Não suportado nativamente** — TanStack Router trabalha com client-side rendering
- Migrar para Next.js seria uma reescrita significativa do roteamento

### Alternativas
1. **Supabase Edge Functions** — Para lógica server-side já existente
2. **React Server Components com Vite** — Ainda experimental, não recomendado para produção
3. **Manter SPA** — O projeto já funciona bem como SPA

## Decisão
**NÃO implementar** — O custo de migração não justifica os benefícios. O projeto já usa Supabase para backend e a arquitetura SPA atende bem às necessidades.

## Próximos Passos
- Manter arquitetura atual
- Usar Supabase Edge Functions quando necessário
- Reavaliar quando React Server Components amadurecerem no ecossistema Vite
