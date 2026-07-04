# Avaliação: GraphQL

## Contexto

O projeto usa Supabase com REST/RPC via `@supabase/supabase-js`. GraphQL seria uma camada adional.

## Análise

### Supabase + GraphQL

- Supabase **não suporta GraphQL nativamente** — seria necessário usar `pg_graphql` extensão ou criar API GraphQL separada
- `pg_graphql` pode ser habilitado no Supabase, mas adiciona complexidade

### Custos vs Benefícios

| Aspecto       | REST/RPC (atual) | GraphQL                     |
| ------------- | ---------------- | --------------------------- |
| Simplicidade  | ✅ Alta          | ❌ Baixa                    |
| Performance   | ✅ Boa           | ⚠️ Depende de implementação |
| Flexibilidade | ⚠️ Média         | ✅ Alta                     |
| Manutenção    | ✅ Baixa         | ❌ Alta                     |

### Quando GraphQL faz sentido

- Múltiplos clientes com necessidades diferentes
- Queries complexas com muitos joins
- APIs públicas para terceiros

## Decisão

**NÃO implementar** — O projeto já usa Supabase REST/RPC eficientemente. A complexidade adicional não justifica os benefícios para o caso de uso atual.

## Próximos Passos

- Manter Supabase REST/RPC
- Usar Supabase Edge Functions para queries complexas
- Reavaliar se surgir necessidade de API pública
