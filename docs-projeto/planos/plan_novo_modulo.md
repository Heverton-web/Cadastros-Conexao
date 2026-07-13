# PLANO DE INTEGRAÇÃO — MÓDULO CRM NO ERP CONEXÃO

**Data:** 29/06/2026
**Status:** Aprovado (aguardando implementação)
**Fonte:** https://github.com/ConexaoImplantes/crm-conexao

---

## 1. Contexto e Análise Inicial

### 1.1. Ponto de Partida

O usuário solicitou a criação de um novo módulo CRM para o ERP Conexão, sendo uma **cópia idêntica** do repositório `crm-conexao` já existente no GitHub. O primeiro passo foi entender a arquitetura de ambos os projetos para definir a melhor estratégia de integração.

### 1.2. Descoberta do CRM (repositório fonte)

A análise via GitHub revelou:

| Aspecto          | Detalhe                                                                           |
| ---------------- | --------------------------------------------------------------------------------- |
| **Stack**        | TanStack Start + React Router + Vite + Supabase                                   |
| **Linguagem**    | TypeScript 92.5%, PLpgSQL 5.4%, CSS 1.8%                                          |
| **UI**           | Radix UI + Tailwind CSS (shadcn/ui)                                               |
| **Banco**        | Supabase (PostgreSQL)                                                             |
| **Autenticação** | Supabase Auth com hook `useAuth` próprio                                          |
| **Migrations**   | 11 arquivos SQL em `supabase/migrations/`                                         |
| **Rotas**        | 17 arquivos (TanStack Router flat file)                                           |
| **Componentes**  | 4 componentes + pasta `ui/` (shadcn)                                              |
| **Hooks**        | `useAuth.tsx`, `use-mobile.tsx`                                                   |
| **Libs**         | `comercial.ts`, `visitas.functions.ts`, `demo.ts`, `error-capture.ts`, `utils.ts` |

### 1.3. Descoberta do ERP (repositório destino)

Análise da estrutura de módulos do ERP:

- **Registry**: `src/registry/modules.ts` — sistema de registro dinâmico com `registerModule()`, `registerNavItem()`, `registerPermission()`
- **Auth**: `_auth.tsx` carrega módulos via `mod.setup()` no `AuthGuard`
- **7 módulos existentes**: Cadastros, Hub, Funis, NPS, Mapas, LinkTree, Empresa
- **21 features** em `src/features/`
- **Padrão**: cada feature tem `module.ts`, `permissions.ts`, `index.ts`, `components/`, `lib/`, `services/`

---

## 2. Decisões de Arquitetura

| Decisão                      | Escolha                                 | Justificativa                                                   |
| ---------------------------- | --------------------------------------- | --------------------------------------------------------------- |
| **Banco de dados**           | Mesmo Supabase do ERP                   | Confirmado pelo usuário — tabelas do CRM no mesmo DB            |
| **Estratégia de integração** | Módulo no ERP (src/features/crm/)       | Confirmado pelo usuário — segue padrão dos 7 módulos existentes |
| **Componentes UI**           | Reusar `ui/` existente do ERP           | Mesmo shadcn/ui, evitar duplicidade                             |
| **Supabase client**          | Reusar client do ERP                    | Mesmo projeto Supabase, mesma conexão                           |
| **useAuth**                  | Adaptar para usar o `useAuth` do ERP    | Auth centralizado, não duplicar contexto                        |
| **Rotas**                    | Prefixar com `crm.*` (flat file)        | Integrar no TanStack Router existente sem layout separado       |
| **Migrations SQL**           | Copiar para supabase/migrations/ do ERP | Mesmo banco, migrations precisam estar no mesmo lugar           |
| **Supabase types**           | Mesclar types do CRM no types.ts geral  | Adicionar tabelas novas ao types existente                      |
| **Nav items**                | Registrar via setup()                   | Seguir padrão dos outros módulos                                |

---

## 3. Workflow de Análise (Passo a Passo)

### Passo 1: Exploração do repositório CRM

Acesso às páginas do GitHub para mapear:

- Estrutura de pastas (`src/components`, `src/routes`, `src/hooks`, `src/lib`, `src/integrations`)
- `package.json` para identificar dependências
- `supabase/migrations/` para entender schema do banco
- Rotas para entender as telas do sistema

### Passo 2: Exploração do ERP existente

Leitura profunda via subagent `explore`:

- `src/registry/modules.ts` — tipo `ModuleDefinition` com key, nome, descricao, icon, routes, permissions, events
- `src/registry/nav-items.ts` — `NavItemRegistration` com id, label, icon, to, permissionCheck, order
- `src/registry/permissions-registry.ts` — `PermissionDefinition` com key, label, description, group
- `src/features/` — 21 diretórios, cada módulo com `module.ts` que chama `registerModule()`
- `src/routes/_auth.tsx` — `AuthGuard` que carrega `mod.setup()` para cada módulo ativo
- `package.json` — dependências completas do ERP

### Passo 3: Comparação de stacks

Verificação de compatibilidade:

| Componente      | CRM | ERP | Compatível? |
| --------------- | --- | --- | ----------- |
| React           | 19  | 19  | ✅          |
| TanStack Router | v1  | v1  | ✅          |
| Vite            | 7   | 6+  | ✅          |
| Radix UI        | Sim | Sim | ✅          |
| Tailwind CSS    | v4  | v4  | ✅          |
| Supabase        | Sim | Sim | ✅          |
| shadcn/ui       | Sim | Sim | ✅          |
| zod             | Sim | Sim | ✅          |

**Conclusão**: Stacks idênticas. Integração direta possível, sem necessidade de adaptações de framework.

### Passo 4: Verificação de dependências novas

O CRM usa:

- `@hookform/resolvers` + `react-hook-form` — `react-hook-form` já está no ERP, `@hookform/resolvers` precisa ser adicionado
- `sonner` — já está no ERP
- `date-fns` — já está no ERP
- `recharts` — já está no ERP
- `cmdk` — já está no ERP

**Ação necessária**: Instalar `@hookform/resolvers` no ERP.

### Passo 5: Mapeamento de rotas

Análise das 17 rotas do CRM e como ficam no ERP:

| CRM (standalone)                      | ERP (módulo)                              | Rota URL                         |
| ------------------------------------- | ----------------------------------------- | -------------------------------- |
| `_auth.tsx`                           | Reusar `_auth.tsx` existente              | Layout compartilhado             |
| `_auth.dashboard.tsx`                 | `_auth.crm.dashboard.tsx`                 | `/crm/dashboard`                 |
| `_auth.carteira.tsx`                  | `_auth.crm.carteira.tsx`                  | `/crm/carteira`                  |
| `_auth.cliente.$id.tsx`               | `_auth.crm.cliente.$id.tsx`               | `/crm/cliente/:id`               |
| `_auth.equipe.tsx`                    | `_auth.crm.equipe.tsx`                    | `/crm/equipe`                    |
| `_auth.bi.tsx`                        | `_auth.crm.bi.tsx`                        | `/crm/bi`                        |
| `_auth.transferencia.tsx`             | `_auth.crm.transferencia.tsx`             | `/crm/transferencia` (layout)    |
| `_auth.transferencia.index.tsx`       | `_auth.crm.transferencia.index.tsx`       | `/crm/transferencia`             |
| `_auth.transferencia.consultores.tsx` | `_auth.crm.transferencia.consultores.tsx` | `/crm/transferencia/consultores` |
| `_auth.diretoria.index.tsx`           | `_auth.crm.diretoria.index.tsx`           | `/crm/diretoria`                 |
| `_auth.diretoria.gestor.$id.tsx`      | `_auth.crm.diretoria.gestor.$id.tsx`      | `/crm/diretoria/gestor/:id`      |
| `_auth.dev.convites.tsx`              | `_auth.crm.dev.convites.tsx`              | `/crm/dev/convites`              |
| `_auth.dev.demo.tsx`                  | `_auth.crm.dev.demo.tsx`                  | `/crm/dev/demo`                  |
| `_auth.dev.usuarios.tsx`              | `_auth.crm.dev.usuarios.tsx`              | `/crm/dev/usuarios`              |
| `aceitar-convite.$token.tsx`          | `crm.aceitar-convite.$token.tsx`          | `/crm/aceitar-convite/:token`    |
| `index.tsx` (login)                   | Não copiar                                | ERP já tem login próprio         |
| `__root.tsx`                          | Não copiar                                | ERP já tem root layout           |

### Passo 6: Mapeamento de componentes

| Componente CRM           | Destino no ERP             | Ação                           |
| ------------------------ | -------------------------- | ------------------------------ |
| `ClientePickerModal.tsx` | `features/crm/components/` | Copiar                         |
| `NovaVisitaModal.tsx`    | `features/crm/components/` | Copiar                         |
| `VisitaDetalheModal.tsx` | `features/crm/components/` | Copiar                         |
| `Logo.tsx`               | `features/crm/components/` | Copiar                         |
| `ui/*`                   | Não copiar                 | Reusar `components/ui/` do ERP |

### Passo 7: Mapeamento de hooks e libs

| Arquivo CRM                                | Destino no ERP        | Ação                                     |
| ------------------------------------------ | --------------------- | ---------------------------------------- |
| `hooks/useAuth.tsx`                        | Não copiar            | Reusar `hooks/useAuth.tsx` do ERP        |
| `hooks/use-mobile.tsx`                     | `features/crm/hooks/` | Copiar ou reusar existente               |
| `lib/comercial.ts`                         | `features/crm/lib/`   | Copiar                                   |
| `lib/visitas.functions.ts`                 | `features/crm/lib/`   | Copiar                                   |
| `lib/demo.ts`                              | `features/crm/lib/`   | Copiar                                   |
| `lib/error-capture.ts`                     | `features/crm/lib/`   | Copiar                                   |
| `lib/error-page.ts`                        | `features/crm/lib/`   | Copiar                                   |
| `lib/utils.ts`                             | Não copiar            | Reusar `cn()` do ERP                     |
| `integrations/supabase/client.ts`          | Não copiar            | Reusar client do ERP                     |
| `integrations/supabase/client.server.ts`   | Não copiar            | Reusar client server do ERP              |
| `integrations/supabase/auth-middleware.ts` | Não copiar            | Reusar do ERP                            |
| `integrations/supabase/auth-attacher.ts`   | Não copiar            | Reusar do ERP                            |
| `integrations/supabase/types.ts`           | Mesclar               | Adicionar tabelas CRM ao types.ts do ERP |

### Passo 8: Definição de permissões

Permissões do módulo CRM (prefixo `crm_`):

```typescript
crm_dashboard; // Acessar dashboard CRM
crm_carteira; // Visualizar carteira de clientes
crm_cliente_detalhe; // Visualizar detalhes do cliente
crm_equipe; // Visualizar equipe
crm_bi; // Acessar Business Intelligence
crm_transferencia; // Gerenciar transferências
crm_diretoria; // Acessar visão diretoria
crm_dev_convites; // Gerenciar convites (dev)
crm_dev_demo; // Acessar modo demo (dev)
crm_dev_usuarios; // Gerenciar usuários (dev)
```

### Passo 9: Definição de nav items

| ID                  | Label         | Icon            | Rota                 | Ordem |
| ------------------- | ------------- | --------------- | -------------------- | ----- |
| `crm-dashboard`     | Dashboard     | LayoutDashboard | `/crm/dashboard`     | 50    |
| `crm-carteira`      | Carteira      | Users           | `/crm/carteira`      | 51    |
| `crm-equipe`        | Equipe        | UserCheck       | `/crm/equipe`        | 52    |
| `crm-bi`            | BI            | BarChart3       | `/crm/bi`            | 53    |
| `crm-transferencia` | Transferência | ArrowLeftRight  | `/crm/transferencia` | 54    |
| `crm-diretoria`     | Diretoria     | Crown           | `/crm/diretoria`     | 55    |

---

## 4. Estrutura Final do Módulo

```
src/features/crm/
├── module.ts                   # ModuleDefinition + setup() + nav items
├── permissions.ts              # 10 permissões crm_*
├── index.ts                    # Barrel export
├── components/
│   ├── ClientePickerModal.tsx
│   ├── NovaVisitaModal.tsx
│   ├── VisitaDetalheModal.tsx
│   └── Logo.tsx
├── hooks/
│   └── use-mobile.tsx          # (se não existir genérico no ERP)
├── lib/
│   ├── comercial.ts
│   ├── visitas.functions.ts
│   ├── demo.ts
│   ├── error-capture.ts
│   └── error-page.ts
├── services/                   # Funções de acesso a dados (Supabase)
└── types/                      # Tipos específicos do CRM

src/routes/
├── _auth.crm.dashboard.tsx
├── _auth.crm.carteira.tsx
├── _auth.crm.cliente.$id.tsx
├── _auth.crm.equipe.tsx
├── _auth.crm.bi.tsx
├── _auth.crm.transferencia.tsx
├── _auth.crm.transferencia.index.tsx
├── _auth.crm.transferencia.consultores.tsx
├── _auth.crm.diretoria.index.tsx
├── _auth.crm.diretoria.gestor.$id.tsx
├── _auth.crm.dev.convites.tsx
├── _auth.crm.dev.demo.tsx
├── _auth.crm.dev.usuarios.tsx
└── crm.aceitar-convite.$token.tsx

supabase/migrations/
├── 20260512144729_cc13f5b1-...sql  # (11 migrations do CRM)
├── ...
└── 20260623233216_fe190786-...sql
```

---

## 5. Fluxo de Registro (Module Registry)

```
Auth carrega → _auth.tsx AuthGuard
  → useAuth() retorna modulosAtivos (ou todos se super_admin)
  → Para cada modulo: getModule(key)?.setup()
    → CRM: setup() chama:
      → registerPermission('crm_dashboard', ...)
      → registerPermission('crm_carteira', ...)
      → ...
      → registerNavItem({ id: 'crm-dashboard', label: 'Dashboard', ... })
      → registerNavItem({ id: 'crm-carteira', label: 'Carteira', ... })
      → ...
  → AppLayout usa getNavItems(perms) para renderizar sidebar
  → CRM aparece na sidebar para usuários com permissão
```

---

## 6. Riscos e Mitigações

| Risco                      | Impacto | Mitigação                                                   |
| -------------------------- | ------- | ----------------------------------------------------------- |
| **Tabelas já existentes**  | Alto    | Verificar nomes das tabelas nas migrations antes de aplicar |
| **Conflito de types**      | Médio   | Mesclar types cuidadosamente, não sobrescrever              |
| **Auth context diferente** | Alto    | Adaptar imports de `useAuth` do CRM para usar o do ERP      |
| **Imports quebrados**      | Médio   | Substituir todos os `@/` paths para `~/` (padrão ERP)       |
| **Dependência faltando**   | Baixo   | Instalar `@hookform/resolvers` se necessário                |
| **Supabase RLS policies**  | Alto    | As migrations incluem RLS — verificar se não conflitam      |

---

## 7. Checklist de Implementação

- [ ] 1. Clonar repo CRM para pasta temporária
- [ ] 2. Criar estrutura `src/features/crm/`
- [ ] 3. Criar `module.ts` com definição do módulo
- [ ] 4. Criar `permissions.ts` com permissões `crm_*`
- [ ] 5. Copiar componentes (4 arquivos)
- [ ] 6. Copiar libs e hooks
- [ ] 7. Copiar rotas com prefixo `crm.*`
- [ ] 8. Mesclar Supabase types
- [ ] 9. Copiar migrations SQL
- [ ] 10. Adaptar imports (`@/` → `~/`, reusar `useAuth` do ERP)
- [ ] 11. Instalar dependências novas (`@hookform/resolvers`)
- [ ] 12. Registrar módulo em `src/registry/` (se necessário)
- [ ] 13. Rodar `npm run lint`
- [ ] 14. Rodar `npm run dev` e testar rotas
- [ ] 15. Verificar permissões e nav items na sidebar

---

## 8. Referências

- [CRM repo fonte](https://github.com/ConexaoImplantes/crm-conexao)
- [ERP Module Registry](../../src/registry/modules.ts)
- [ERP AuthGuard](../../src/routes/_auth.tsx)
- [ERP Nav Items Registry](../../src/registry/nav-items.ts)
- [Plano Módulo Hub](./PLANO-MODULO-HUB.md) — padrão seguido
