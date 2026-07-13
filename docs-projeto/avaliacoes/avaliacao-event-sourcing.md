# Avaliação: Event Sourcing

## Contexto

Event Sourcing armazena todas as mudanças como eventos, permitindo auditoria completa e reconstrução de estado.

## Análise

### Supabase + Auditoria

- Supabase não tem event sourcing nativo
- Possível criar tabela de audit logs manualmente
- Triggers PostgreSQL para registrar mudanças

### Quando Event Sourcing faz sentido

- Compliance que exige auditoria granular
- Necessidade de reconstruir estado histórico
- Debugging de problemas complexos
- Sistemas financeiros ou regulados

### Custo vs Benefício

| Aspecto      | Audit Logs (atual) | Event Sourcing   |
| ------------ | ------------------ | ---------------- |
| Simplicidade | ✅ Alta            | ❌ Baixa         |
| Auditoria    | ⚠️ Básica          | ✅ Completa      |
| Performance  | ✅ Boa             | ⚠️ Pode degradar |
| Manutenção   | ✅ Baixa           | ❌ Alta          |

## Decisão

**NÃO implementar agora** — Usar audit logs do Supabase para necessidades básicas de auditoria.

## Próximos Passos

- Implementar tabela de audit logs com triggers
- Registrar mudanças em tabelas críticas
- Reavaliar se compliance exigir auditoria granular
