# GEMINI.md — Módulo Catálogo

## Context

ERP Odonto module for dental implant catalog management. React + TanStack Start + Supabase. Handles products (implants, abutments, kits, components, instrumentals), public store, cart, checkout, quotes, orders, customer management, store design, CSV import, and workflows.

## Tech Stack

- **Frontend**: React 19, TanStack Router/Query, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + RLS + Edge Functions)
- **State**: React Query for server state, React Context for UI state
- **Forms**: React Hook Form + Zod validation
- **Auth**: Supabase Auth + custom permission system

## Key Files

| File | Purpose |
|---|---|
| `module.ts` | Module registration (routes, events, nav items, permissions) |
| `permissions.ts` | 3-tier permissions: admin, collaborator, customer |
| `types/index.ts` | All TypeScript interfaces (700+ lines) |
| `hooks/useCatalogo.ts` | Main data hook (959 lines) |
| `services/*.service.ts` | Supabase data access layer |
| `components/admin/produtos/ProdutoFormModal.tsx` | Multi-type product form |
| `import/engine/` | CSV import pipeline (parser → mapper → validator → executor) |

## Database Schema

Core tables: `catalogo_implantes`, `catalogo_abutments`, `catalogo_kits`, `catalogo_componentes`, `catalogo_parafusos`, `catalogo_cicatrizadores`, `catalogo_chaves`, `catalogo_fresas`, `catalogo_complementares`, `catalogo_opcionais`

Commerce tables: `catalogo_pedidos`, `catalogo_pedido_itens`, `catalogo_orcamentos`, `catalogo_orcamento_itens`, `catalogo_clientes`, `catalogo_favoritos`, `catalogo_cupons`, `catalogo_promocionais`

Structure tables: `catalogo_categorias`, `catalogo_ips_conexoes`, `catalogo_ips_familias`, `catalogo_ips_linhas` (hierarchy: Category → Connection → Family → Line → Product)

Pivot tables (N:M): `catalogo_implante_abutment`, `catalogo_implante_chaves`, `catalogo_kit_chaves`, `catalogo_kit_fresas`, etc.

RLS is ENABLED on: `catalogo_clientes`, `catalogo_pedidos`, `catalogo_pedido_itens`, `catalogo_favoritos`, `catalogo_orcamentos`, `catalogo_orcamento_itens`

## Product Hierarchy

```
Categoria → Conexão → Família → Linha → Implante
                                         ├→ Abutment (via tipo_reabilitacao → tipo_abutment)
                                         ├→ Componente (via tipo_componente)
                                         ├→ Parafuso → Chave
                                         └→ Cicatrizador

Kit → { Chaves, Fresas, Complementares, Opcionais } (N:M via pivot tables)
```

## Permissions

- `catalogo_gerenciar_*` — Admin CRUD operations
- `catalogo_colab_*` — Collaborator (quote creation, price viewing)
- `catalogo_cliente_*` — Customer (view products, buy, track orders)

## Routes

- `/catalogo` — Public store
- `/catalogo/admin/*` — Admin panel (dashboard, products, orders, quotes, clients, design, etc.)
- `/loja/$slug` — Store by company slug
- `/loja/$slug/login` — Customer login
- `/loja/$slug/pedidos` — Customer orders
- `/loja/$slug/favoritos` — Customer favorites
- `/loja/$slug/orcamento/$token` — Public quote link

## Events (Action Center)

Product: `produto.criado`, `produto.atualizado`, `produto.removido`
Quote: `orcamento.criado`, `orcamento.enviado`, `orcamento.aprovado`, `orcamento.reprovado`, `orcamento.pedido_criado`
Order: `pedido.criado`, `pedido.pago`, `pedido.confirmado`, `pedido.enviado`, `pedido.entregue`, `pedido.cancelado`
Customer: `cliente.credencial_criada`
Access Request: `solicitacao_acesso.criada`, `solicitacao_acesso.aprovada`, `solicitacao_acesso.rejeitada`

## UI Rules

- Use `RequirePermission` on all admin routes
- Dialogs: `DialogContent flex flex-col max-h-[85vh] overflow-hidden`
- FORBIDDEN: `window.confirm()`, `window.alert()`, `window.prompt()`
- Use `AlertDialog` for confirmations, `Dialog` for content

## Import Pipeline

CSV import follows: `FileParser → ColumnMapper → RowValidator → Executor`
Each step has its own hook in `import/hooks/`.
