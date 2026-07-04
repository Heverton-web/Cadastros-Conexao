# PLANO DE REFATORAÇÃO ARQUITETURAL — CADASTROS CONEXÃO

**Versão:** 1.0
**Objetivo:** Transformar a arquitetura monolítica em modular (core + features + registry).

## Estrutura Final

```
src/
├── core/                  ← Framework base (0 dependência de features)
│   ├── auth/              ← AuthProvider + useAuth + types
│   ├── layout/            ← AppLayout, BottomNav, DeviceGate...
│   ├── permissions/       ← Permissoes type + services + constants
│   ├── router/            ← AuthGuard
│   ├── services/          ← atividades, notificacoes, webhooks
│   ├── supabase/          ← client + types
│   ├── ui/                ← Button, Input, Card, DocViewer...
│   └── utils/             ← cn, formatPhone, viacep
├── features/              ← Cada feature auto-contida
│   ├── admin/             ← Config, integracoes, demos, api_connectors
│   ├── clientes/          ← Cadastro CRUD + pages
│   ├── consultor/         ← Painel do consultor
│   ├── credenciais/       ← Credenciais CRUD
│   ├── dashboard/         ← Dashboard
│   ├── documentos/        ← Documentos + DocList
│   ├── form-schema/       ← Schema dinâmico
│   ├── paytrack/          ← Esqueleto (futuro)
│   ├── precadastro/       ← Pré-cadastro público
│   ├── relatorios/        ← Relatórios
│   └── revisoes/          ← Revisão de campos
├── registry/              ← Sistema de registro
│   ├── nav-items.ts       ← NavItemsRegistry
│   └── permissions-registry.ts
├── routes/                ← Apenas re-export (≤5 linhas cada)
├── legacy/                ← Backup do código original
├── main.tsx
├── routeTree.gen.ts
└── styles/globals.css
```

## Etapas

1. Estrutura de diretórios
2. core/supabase + core/utils
3. core/permissions
4. core/auth
5. core/ui + core/layout + core/router
6. core/services (atividades, notificacoes, webhooks)
7. features/form-schema
8. features/revisoes
9. features/documentos
10. features/clientes
11. features/dashboard
12. features/relatorios
13. features/credenciais
14. features/consultor
15. features/precadastro
16. features/admin
17. features/paytrack (esqueleto)
18. Registry system
19. Atualização das rotas
20. Atualização do main.tsx + verificação

Ver: visitas-conexao/ para plano detalhado da refatoração.
