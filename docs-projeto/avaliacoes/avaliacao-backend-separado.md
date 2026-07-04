# Avaliação: Separar Backend

## Contexto

O projeto usa Supabase como backend completo (banco, auth, storage, edge functions). Separar o backend significaria criar uma API Node.js/Express independente.

## Análise

### Supabase como Backend

| Aspecto        | Supabase (atual) | Backend Separado            |
| -------------- | ---------------- | --------------------------- |
| Manutenção     | ✅ Baixa         | ❌ Alta                     |
| Custo          | ✅ Baixo         | ❌ Alto (servidor separado) |
| Escalabilidade | ✅ Automática    | ⚠️ Manual                   |
| Flexibilidade  | ⚠️ Média         | ✅ Alta                     |
| Complexidade   | ✅ Baixa         | ❌ Alta                     |

### Quando Backend Separado faz sentido

- Lógica de negócio muito complexa para Edge Functions
- Necessidade de processamento assíncrono pesado
- Integrações que exigem servidor persistente
- Compliance que exige controle total do backend

## Decisão

**NÃO implementar agora** — Supabase atende bem às necessidades. Usar Edge Functions para lógica server-side.

## Próximos Passos

- Usar Supabase Edge Functions para lógica complexa
- Monitorar performance e escalabilidade
- Reavaliar se surgirem necessidades específicas
