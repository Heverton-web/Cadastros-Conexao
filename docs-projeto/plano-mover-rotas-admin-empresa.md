# Plano: Mover Rotas Admin para o Módulo Empresa

## Objetivo

Migrar todas as rotas de configuração exclusivas do admin da empresa para o módulo
`empresas-core`, seguindo o padrão `/empresa/<modulo>/<pagina>` já estabelecido com
`/empresa/rotas/config`.

---

## Parte 1: Criar `/rotas/design` (módulo rotas)

O módulo rotas atualmente tem `hasDesignConfig: true` mas usa `/empresa/rotas/config`
como `designRoute`. Precisa de uma rota de design separada, como os demais módulos.

| Arquivo | Ação |
|---------|------|
| `src/routes/rotas.design.tsx` | Criar — `ModuloDesignPage` com path `/rotas/design` |
| `src/features/rotas/module.ts` | Adicionar `/rotas/design` nas `routes`, atualizar `designRoute` |
| `src/routeTree.gen.ts` | Import + registro da nova rota |

---

## Parte 2: Mover 13 rotas para `/empresa/<modulo>/<pagina>`

Cada rota segue o mesmo padrão usado em `/empresa/rotas/config`:

1. Criar `src/routes/empresa.<modulo>-<pagina>.tsx` com o mesmo componente e path
2. Fazer redirect da rota antiga para a nova (via `beforeLoad` com `throw redirect`)
3. Adicionar nav item em `src/features/empresas/module.ts`
4. Atualizar `src/routeTree.gen.ts` (import + registro)
5. Atualizar `designRoute` no `module.ts` de cada módulo (quando aplicável)
6. Remover nav item do `module.ts` de cada módulo original (quando existir)

### Rotas de Design System (8)

| # | Rota atual | Nova rota | designRoute |
|---|-----------|-----------|-------------|
| 1 | `/nps/design` | `/empresa/nps/design` | Atualizar em `features/nps/module.ts` |
| 2 | `/linktree/design` | `/empresa/linktree/design` | Atualizar em `features/linktree/module.ts` |
| 3 | `/hub/design` | `/empresa/hub/design` | Atualizar em `features/hub/module.ts` |
| 4 | `/mapas/design` | `/empresa/mapas/design` | Atualizar em `features/mapas/module.ts` |
| 5 | `/funis/design` | `/empresa/funis/design` | Atualizar em `features/funis/module.ts` |
| 6 | `/crm/design` | `/empresa/crm/design` | Atualizar em `features/crm/module.ts` |
| 7 | `/cadastros/design` | `/empresa/cadastros/design` | Atualizar em `features/cadastros/module.ts` |
| 8 | `/despesas/design` | `/empresa/despesas/design` | Atualizar em `features/despesas/module.ts` |

### Rotas de Tema Visual (2)

| # | Rota atual | Nova rota | Observação |
|---|-----------|-----------|------------|
| 9 | `/nps/tema` | `/empresa/nps/tema` | Salva em `empresa_config.theme.nps_survey` |
| 10 | `/linktree/tema` | `/empresa/linktree/tema` | Salva em `empresa_config.theme.linktree` |

### Rotas de Config de Módulo (2)

| # | Rota atual | Nova rota | Observação |
|---|-----------|-----------|------------|
| 11 | `/hub/admin/chatbot` | `/empresa/hub/chatbot` | Config chatbot |
| 12 | `/rotas/design` | `/empresa/rotas/design` | Design system rotas |

### Já implementado

| # | Rota atual | Nova rota | Status |
|---|-----------|-----------|--------|
| 13 | `/rotas/config` | `/empresa/rotas/config` | **OK** |

### Atualização dos nav items no módulo empresa

Em `src/features/empresas/module.ts`, adicionar na ordem (continuando de `order: 80`):

| Nav ID | Label | Rota | Order | permissionCheck |
|--------|-------|------|-------|-----------------|
| `empresa-nps-tema` | NPS Tema | `/empresa/nps/tema` | 81 | `() => true` |
| `empresa-nps-design` | NPS Design | `/empresa/nps/design` | 82 | `() => true` |
| `empresa-linktree-tema` | Linktree Tema | `/empresa/linktree/tema` | 83 | `() => true` |
| `empresa-linktree-design` | Linktree Design | `/empresa/linktree/design` | 84 | `() => true` |
| `empresa-hub-chatbot` | Hub Chatbot | `/empresa/hub/chatbot` | 85 | `() => true` |
| `empresa-hub-design` | Hub Design | `/empresa/hub/design` | 86 | `() => true` |
| `empresa-mapas-design` | Mapas Design | `/empresa/mapas/design` | 87 | `() => true` |
| `empresa-funis-design` | Funis Design | `/empresa/funis/design` | 88 | `() => true` |
| `empresa-crm-design` | CRM Design | `/empresa/crm/design` | 89 | `() => true` |
| `empresa-cadastros-design` | Cadastros Design | `/empresa/cadastros/design` | 90 | `() => true` |
| `empresa-despesas-design` | Despesas Design | `/empresa/despesas/design` | 91 | `() => true` |
| `empresa-rotas-design` | Rotas Design | `/empresa/rotas/design` | 92 | `() => true` |

---

## Parte 3: DELETAR `/crm/dev/convites`, `/crm/dev/demo`, `/crm/dev/usuarios`

Essas 3 rotas de desenvolvimento do CRM não têm nav item próprio — são acessadas
exclusivamente via QuickActions no dashboard do CRM.

### Arquivos para deletar

| Arquivo |
|---------|
| `src/routes/_auth.crm.dev.convites.tsx` |
| `src/routes/_auth.crm.dev.demo.tsx` |
| `src/routes/_auth.crm.dev.usuarios.tsx` |

### Arquivos para editar

| Arquivo | O que remover |
|---------|---------------|
| `src/routeTree.gen.ts` | 3 imports + 3 registros em `authLayout.addChildren` |
| `src/features/crm/permissions.ts` | 3 entradas: `crm_dev_convites`, `crm_dev_demo`, `crm_dev_usuarios` |
| `src/features/crm/module.ts` | 3 rotas do array `routes`, 3 keys do `crmAllTrue`, 3 entries do `registerPermissionDefaults` |
| `src/routes/_auth.crm.dashboard.tsx` | 3 `<QuickAction>` (linhas 361-363) |

### Ajustes no dashboard CRM

Remover do JSX:
```tsx
<QuickAction to="/crm/dev/usuarios" icon={ShieldCheck} title="Usuários" subtitle="Ativar, inativar, vincular" />
<QuickAction to="/crm/dev/convites" icon={UserPlus} title="Convites" subtitle="CRUD com magic link" />
<QuickAction to="/crm/dev/demo" icon={Settings} title="Cartões demo" subtitle="Habilitar/ocultar acesso rápido" />
```

Os KPI cards "Convites pendentes" e "Demo cards" (linhas 356-357) devem permanecer
pois mostram métricas mesmo sem link de navegação.

---

## Resumo de Alterações

| Categoria | Arquivos criados | Arquivos editados | Arquivos deletados |
|-----------|:-:|:-:|:-:|
| Parte 1: rotas/design | 1 | 2 | — |
| Parte 2: mover 13 rotas | 12 | ~26 | — |
| Parte 3: deletar CRM dev | — | 4 | 3 |
| **Total** | **13** | ~**32** | **3** |

Ordem de execução recomendada:
1. Parte 1 (criar rotas/design)
2. Parte 3 (deletar CRM dev — mais simples)
3. Parte 2 (mover 13 rotas — repetitivo, usar paralelismo)
4. Build final para validar
