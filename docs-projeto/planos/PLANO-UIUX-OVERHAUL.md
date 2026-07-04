# Plano de Overhaul UI/UX — ERP Conexão

**Branch:** `refactor/ui-ux-overhaul`
**Data:** 2026-06-29
**Status:** Em execução

---

## Diagnóstico Atual

| Aspecto        | Estado Atual         | Nota                                   |
| -------------- | -------------------- | -------------------------------------- |
| Paleta         | Dark slate + dourado | ✅ Boa, mas precisa de mais contraste  |
| Tipografia     | Outfit (system-ui)   | ⚠️ Poderia usar Plus Jakarta Sans      |
| Componentes    | shadcn/ui + Radix    | ✅ Base sólida                         |
| Espaçamento    | Inconsistente        | ⚠️ Precisa de escala padronizada       |
| Cards          | Sem bordas visíveis  | ⚠️ Faltam bordas sutis                 |
| Tabelas        | Overflow básico      | ⚠️ Precisa de melhor tratamento mobile |
| Formulários    | Labels uppercase     | ⚠️ Melhorar hierarquia visual          |
| Animações      | Básicas              | ⚠️ Adicionar micro-interações          |
| Acessibilidade | Parcial              | ⚠️ Focus states e contraste            |

---

## Violações Críticas Encontradas

| Arquivo            | Linha    | Violação                                                   |
| ------------------ | -------- | ---------------------------------------------------------- |
| `clientes.$id.tsx` | 463, 477 | `alert()` nativo — PROIBIDO pelo AGENTS.md                 |
| `clientes.tsx`     | 169-173  | Botões com `p-1.5` — toque < 44px                          |
| `dashboard.tsx`    | 89-90    | `text-[9px]` — abaixo do mínimo acessível                  |
| `clientes.tsx`     | 181      | `text-[10px]` — abaixo do mínimo acessível                 |
| `NavSidebar.tsx`   | 66       | Módulo ativo usa `text-text-muted` em vez de `text-accent` |

---

## Fase 1: Design System Foundation

**Arquivo:** `src/styles/globals.css`

- [ ] Substituir Outfit por Plus Jakarta Sans
- [ ] Adicionar cor `text-secondary` (#cbd5e1)
- [ ] Tornar `border-subtle` visível (#334155)
- [ ] Definir escala de shadows (sm/md/lg)
- [ ] Definir escala de z-index
- [ ] Definir escala de espaçamento
- [ ] Melhorar focus ring (2px offset dourado)
- [ ] Aumentar scrollbar para 6px

## Fase 2: Componentes Base

**Arquivos:** `src/components/ui/`

- [ ] `button.tsx` — Variante loading, hover transform, size xs
- [ ] `card.tsx` — Border sutil, padding consistente, hover state
- [ ] `input.tsx` — Focus ring 2px, ícones erro/sucesso
- [ ] `table.tsx` — Overflow wrapper, zebra striping, sticky header
- [ ] `badge.tsx` — Variantes success/warning/error
- [ ] `dialog.tsx` — Backdrop blur maior, animação suave
- [ ] `skeleton.tsx` — **NOVO** Skeleton screens
- [ ] `empty-state.tsx` — **NOVO** Estado vazio
- [ ] `page-header.tsx` — **NOVO** Header com breadcrumbs

## Fase 3: Layout e Navegação

**Arquivos:** `src/components/layout/`

- [ ] `AppLayout.tsx` — Breadcrumbs, page transitions, error boundary
- [ ] `NavSidebar.tsx` — Tooltip collapsed, scroll indicador, item ativo
- [ ] `BottomNav.tsx` — Labels textuais, max 5 itens, indicador ativo

## Fase 4: Formulários

- [ ] Labels sentence-case, text-sm font-medium
- [ ] Validação visual inline (bordas vermelhas/verdes)
- [ ] Loading states nos botões
- [ ] Empty states reutilizáveis
- [ ] Touch targets mínimos 44×44px
- [ ] Substituir alert() nativos por toast/dialog

## Fase 5: Tabelas e Listagens

- [ ] Cards empilhados em mobile
- [ ] Filtros com chips e botão limpar
- [ ] Paginação reutilizável
- [ ] Ações em massa (checkbox + barra flutuante)
- [ ] Eliminar text-[9px]/text-[10px] — mínimo text-xs

## Fase 6: Dashboard

- [ ] KPI Cards com ícone + valor + variação
- [ ] Quick actions
- [ ] Grid responsivo otimizado
- [ ] Skeleton loading
- [ ] Error feedback com toast

## Fase 7: Micro-interações

- [ ] Hover em cards (shadow + translate)
- [ ] Skeletons em todas as listagens
- [ ] Toasts padronizados
- [ ] Focus ring dourado
- [ ] Transitions 200ms + prefers-reduced-motion

## Fase 8: Acessibilidade

- [ ] Contraste mínimo 4.5:1
- [ ] Keyboard nav com tab order lógico
- [ ] ARIA labels em botões de ícone
- [ ] prefers-reduced-motion respeitado
- [ ] Touch targets 44×44px

---

## Ordem de Execução

```
Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 5 → Fase 6 → Fase 7 → Fase 8
   ↓         ↓         ↓         ↓         ↓         ↓         ↓         ↓
Globals   Components  Layout    Forms    Tables   Dashboard  Motion   A11y
```

Cada fase é commitada separadamente.
