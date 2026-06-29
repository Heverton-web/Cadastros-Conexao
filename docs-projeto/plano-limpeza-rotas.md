# Plano: Limpeza e Otimização de Rotas

**Objetivo:** Identificar e resolver rotas não pertinentes, redundantes ou mal posicionadas.

---

## Diagnóstico: 81 Rotas Totais

| Categoria | Qtd | Descrição |
|-----------|-----|-----------|
| Raiz/Públicas | 6 | Login, pré-cadastro, survey, linktree público, hub cliente, convite CRM |
| Redirect | 3 | Apenas redirecionam para outra rota |
| Admin global | 13 | `/global/*` — configurações de super admin |
| Config empresa | 6 | `/empresa/*` — configurações da empresa |
| Módulo cadastros | 7 | Dashboard, clientes, consultor, relatórios, credenciais |
| Módulo mapas | 6 | Distribuidores, consultores, gestão, insights |
| Módulo NPS | 6 | Dashboard, pesquisas, relatórios, preview, tema, survey |
| Módulo funis | 2 | Dashboard, detalhe do funil |
| Módulo linktree | 3 | Dashboard, tema, público |
| Módulo hub | 16 | Admin, gestor, consultor, distribuidor (dash, ranking, conquistas) |
| Módulo CRM | 12 | Dashboard, carteira, equipe, BI, transferência, diretoria, dev |

---

## Problemas Identificados

### 1. Rotas Redirect Desnecessárias (3)

| Rota | Redireciona para | Arquivo |
|------|------------------|---------|
| `/nps` | `/global/nps` | `src/routes/nps.tsx` |
| `/mapas` | `/mapas/distribuidores` | `src/routes/mapas.tsx` |
| `/funis` | `/funis/dashboard` | `src/routes/funis.tsx` |

### 2. Rotas CRM com Prefixo "dev" (3)

| Rota | Função | Arquivo |
|------|--------|---------|
| `/crm/dev/convites` | Gerenciar convites | `_auth.crm.dev.convites.tsx` |
| `/crm/dev/demo` | Modo demo | `_auth.crm.dev.demo.tsx` |
| `/crm/dev/usuarios` | Gerenciar usuários | `_auth.crm.dev.usuarios.tsx` |

São ferramentas de administração, não de desenvolvimento.

### 3. Rotas Hub com Mesmos Componentes (9)

4 rotas usam `HubDashboardPage`, 2 usam `HubRankingPage`, 3 usam `HubConquistasPage`.

**Decisão:** Manter separadas (mais explícito por perfil).

### 4. Rotas Admin Avulsas (3)

`/global/laboratorio`, `/global/limits`, `/global/demos` — funcionalidades sem módulo claro.

**Decisão:** Manter onde estão.

---

## Plano de Ação

### Ação 1: Remover Rotas Redirect (3 arquivos)

- `src/routes/nps.tsx` → Remover
- `src/routes/mapas.tsx` → Remover
- `src/routes/funis.tsx` → Remover

### Ação 2: Renomear Rotas CRM dev → global (3 arquivos)

- `/crm/dev/convites` → `/global/crm/convites`
- `/crm/dev/demo` → `/global/crm/demo`
- `/crm/dev/usuarios` → `/global/crm/usuarios`

### Ação 3: Atualizar routeTree.gen.ts

- Remover imports das rotas redirect
- Atualizar imports das rotas CRM renomeadas

### Ação 4: Atualizar Nav Items

- Verificar se nav items do CRM apontam para paths corretos

---

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/routes/nps.tsx` | Remover |
| `src/routes/mapas.tsx` | Remover |
| `src/routes/funis.tsx` | Remover |
| `src/routes/_auth.crm.dev.convites.tsx` | Renomear para `global.crm.convites.tsx` |
| `src/routes/_auth.crm.dev.demo.tsx` | Renomear para `global.crm.demo.tsx` |
| `src/routes/_auth.crm.dev.usuarios.tsx` | Renomear para `global.crm.usuarios.tsx` |
| `src/routeTree.gen.ts` | Atualizar imports e árvore |
| `src/features/crm/module.ts` | Atualizar routes array |

---

## Resultado Esperado

| Métrica | Antes | Depois |
|---------|-------|--------|
| Total de rotas | 81 | 78 |
| Rotas redirect | 3 | 0 |
| Rotas com prefixo "dev" | 3 | 0 |

---

## Validação

1. `npm run build` deve compilar sem erros
2. Todas as rotas devem estar acessíveis
3. Nenhuma funcionalidade deve ser perdida
4. Os nav items devem apontar para os paths corretos
