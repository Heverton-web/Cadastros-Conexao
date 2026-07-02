# Análise de Responsividade — Módulo Funis

> Documento de análise de responsividade do módulo Funis do ERP Conexão.
> Data da análise: 2026-07-02

---

## 1. Objetivo

Verificar se todas as rotas do módulo Funis seguem o padrão **Mobile-First** e garantem
usabilidade em qualquer tamanho de tela, desde dispositivos móveis compactos (320px) até
desktops amplos (1920px+).

---

## 2. Rotas Analisadas

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/funis/dashboard` | `FunisDashboardPage.tsx` | Dashboard com lista de funis |
| `/funis/funil/$funilId` | `FunilDetallePage.tsx` | Detalhe do funil com Kanban |
| `/funis/templates` | `TemplateManager.tsx` | Gerenciador de templates |
| `/funis/funil/$funilId/automations` | `AutomationRules.tsx` | Regras de automação |

---

## 3. Framework de Responsividade

A aplicação utiliza **Tailwind CSS** com breakpoints padrão:

| Breakpoint | Prefixo | Largura | Uso |
|------------|---------|---------|-----|
| Mobile | (sem prefixo) | 0px — 639px | Mobile-First (padrão) |
| SM | `sm:` | 640px+ | Mobile landscape |
| MD | `md:` | 768px+ | Tablets |
| LG | `lg:` | 1024px+ | Desktops |
| XL | `xl:` | 1280px+ | Desktops amplos |

---

## 4. Análise por Rota

### 4.1 `/funis/dashboard`

#### Layout Principal
- **Container**: `space-y-8 animate-fade-in`
- **Header**: `flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6`

#### Grids
- Skeleton: `grid grid-cols-2 lg:grid-cols-4 gap-4`
  - Mobile: 2 colunas (pode ser problemático em 320px)
  - LG: 4 colunas
- Lista de funis: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5`
  - Mobile: 1 coluna
  - SM: 2 colunas
  - LG: 3 colunas

#### Verificação de Responsividade

| Critério | Status | Observação |
|----------|--------|------------|
| Container responsivo | ✅ | Usa flex-col sm:flex-row |
| Grid mobile-first | ⚠️ | Skeleton usa grid-cols-2 sem mobile |
| Botão Novo funil | ✅ | w-full sm:w-auto + min-h-[44px] |
| Cards responsivos | ✅ | Grid 1/2/3 colunas |
| Empty state | ✅ | p-10 sm:p-14 |

---

### 4.2 `/funis/templates`

#### Layout Principal
- **Container**: `space-y-8 animate-fade-in`
- **Header**: `flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6`

#### Grids
- Skeleton: `grid grid-cols-2 lg:grid-cols-4 gap-4`
  - Mobile: 2 colunas (problema em 320px)
- Lista de templates: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5`
  - Mobile: 1 coluna
  - SM: 2 colunas
  - LG: 3 colunas

#### Verificação de Responsividade

| Critério | Status | Observação |
|----------|--------|------------|
| Container responsivo | ✅ | Usa flex-col sm:flex-row |
| Grid mobile-first | ⚠️ | Skeleton usa grid-cols-2 sem mobile |
| Botão Novo template | ✅ | w-full sm:w-auto + min-h-[44px] |
| Cards responsivos | ✅ | Grid 1/2/3 colunas |
| Empty state | ✅ | p-10 sm:p-14 |

---

### 4.3 `/funis/funil/$funilId`

#### Layout Principal
- **Container**: `flex flex-col h-full w-full overflow-hidden animate-fade-in`
- **Header**: `flex items-center justify-between px-4 py-3 bg-transparent`

#### Kanban
- **Container**: `flex gap-4 px-4 pb-4 overflow-x-auto h-full items-stretch w-full`
- **Colunas**: `flex-shrink-0 flex-grow flex-1 min-w-[280px] max-w-[450px]`

#### Verificação de Responsividade

| Critério | Status | Observação |
|----------|--------|------------|
| Container Kanban | ✅ | overflow-x-auto para scroll horizontal |
| Colunas mínimas | ⚠️ | min-w-[280px] pode causar overflow em mobile |
| Header funil | ✅ | Flex com gap |
| Botões ação | ⚠️ | p-2 sem min-h explícito |
| Título funil | ⚠️ | text-2xl sem responsivo |

---

### 4.4 `/funis/funil/$funilId/automations`

#### Layout Principal
- **Container**: `space-y-8 animate-fade-in`
- **Header**: `flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6`

#### Listas
- Lista de automações: `space-y-3`
- Cards: `flex items-center gap-4 rounded-xl bg-surface border border-border p-4`

#### Verificação de Responsividade

| Critério | Status | Observação |
|----------|--------|------------|
| Container responsivo | ✅ | Usa flex-col sm:flex-row |
| Botão Nova automação | ✅ | w-full sm:w-auto + min-h-[44px] |
| Cards automações | ⚠️ | flex items-center pode empilhar mal em mobile |
| Empty state | ✅ | p-10 sm:p-14 |

---

## 5. Padrões de Layout Global

### AppLayout (`src/components/layout/AppLayout.tsx`)

- **Container**: `min-h-dvh bg-bg-dark`
- **Header**: `sticky top-0 z-40 border-b border-border/50 bg-header-bg/80 backdrop-blur-xl`
- **Conteúdo**: `mx-auto max-w-[1600px] p-4 md:p-6 lg:p-8`
- **Funis pages**: `h-[calc(100vh-70px)] overflow-hidden` + `max-w-none p-0`

**Observações**:
- Layout global é bem responsivo
- Páginas de funis Kanban usam altura fixa (100vh-70px) — correto para Kanban
- Padding responsivo: p-4 → md:p-6 → lg:p-8

---

## 6. Problemas Identificados

### 6.1 Críticos

1. **ShareModal: Botão deletar invisível em touch** (`ShareModal.tsx:188`)
   - `opacity-0 group-hover/opt:opacity-100` — invisível em dispositivos touch
   - Impacto: Usuários mobile não conseguem ver/remover colaboradores

### 6.2 Médios

1. **Skeletons sem grid mobile-first** (`FunisDashboardPage.tsx:185`, `TemplateManager.tsx:108`)
   - `grid grid-cols-2 lg:grid-cols-4` — 2 colunas em 320px pode ser apertado
   - Sugestão: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`

2. **Kanban colunas min-width alto** (`KanbanView.tsx:90`)
   - `min-w-[280px]` — em mobile 320px, apenas 1 coluna visível com scroll
   - Sugestão: Considerar `min-w-[260px]` ou `min-w-[85vw]` em mobile

3. **Título funil sem responsivo** (`FunilDetallePage.tsx:177`)
   - `text-2xl` — pode ser grande em mobile
   - Sugestão: `text-xl sm:text-2xl`

4. **Cards automações flex em mobile** (`AutomationRules.tsx:148`)
   - `flex items-center gap-4` — badges podem vazar em telas estreitas
   - Sugestão: `flex flex-col sm:flex-row sm:items-center gap-4`

### 6.3 Baixos

1. **Skeletons sem role="status"** (vários componentes)
   - Acessibilidade: Skeletons devem ter `role="status"` para screen readers

2. **Botões ação funil sem min-h** (`FunilDetallePage.tsx:186-208`)
   - Botões Share/Edit/Delete usam `p-2` sem `min-h-[44px]`
   - Sugestão: Adicionar `min-h-[44px] min-w-[44px]`

---

## 7. Checklist de Responsividade

### Mobile (320px — 639px)
- [ ] Grids com 1 coluna
- [ ] Botões com min-h 44px
- [ ] Textos não vazam
- [ ] Touch targets adequados
- [ ] Modais com scroll

### Tablet (640px — 1023px)
- [ ] Grids com 2 colunas
- [ ] Headers empilham horizontalmente
- [ ] Cards com padding adequado

### Desktop (1024px+)
- [ ] Grids com 3+ colunas
- [ ] Sidebar visível
- [ ] Layout com largura máxima

---

## 8. Plano de Correção

### Fase 1 — Bugs Críticos

#### Tarefa 1.1: Corrigir botão deletar invisível em touch
- **Arquivo**: `src/features/funis/components/ShareModal.tsx:188`
- **Problema**: `opacity-0 group-hover/opt:opacity-100`
- **Solução**: `md:opacity-0 md:group-hover/opt:opacity-100`
- **Critério**: Botão visível em mobile, oculto apenas em desktop

### Fase 2 — Adequações

#### Tarefa 2.1: Corrigir grid skeletons para mobile-first
- **Arquivo**: `src/features/funis/components/FunisDashboardPage.tsx:185`
- **Problema**: `grid grid-cols-2 lg:grid-cols-4`
- **Solução**: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- **Critério**: 1 coluna em mobile, 2 em sm, 4 em lg

#### Tarefa 2.2: Corrigir grid skeletons templates para mobile-first
- **Arquivo**: `src/features/funis/components/TemplateManager.tsx:108`
- **Problema**: `grid grid-cols-2 lg:grid-cols-4`
- **Solução**: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- **Critério**: 1 coluna em mobile, 2 em sm, 4 em lg

#### Tarefa 2.3: Reduzir min-width colunas Kanban
- **Arquivo**: `src/features/funis/components/KanbanView.tsx:90`
- **Problema**: `min-w-[280px]`
- **Solução**: `min-w-[260px] sm:min-w-[280px]`
- **Critério**: Colunas menores em mobile, normais em sm+

#### Tarefa 2.4: Título funil responsivo
- **Arquivo**: `src/features/funis/components/FunilDetallePage.tsx:177`
- **Problema**: `text-2xl`
- **Solução**: `text-xl sm:text-2xl`
- **Critério**: Título menor em mobile

#### Tarefa 2.5: Cards automações responsivos
- **Arquivo**: `src/features/funis/components/AutomationRules.tsx:148`
- **Problema**: `flex items-center gap-4`
- **Solução**: `flex flex-col sm:flex-row sm:items-center gap-4`
- **Critério**: Empilha verticalmente em mobile

### Fase 3 — Melhorias

#### Tarefa 3.1: Adicionar role="status" nos skeletons
- **Arquivo**: Vários (FunisDashboardPage, TemplateManager, AutomationRules)
- **Problema**: Skeletons sem role
- **Solução**: Adicionar `role="status"` em cada Skeleton
- **Critério**: Acessibilidade melhorada

#### Tarefa 3.2: Botões ação funil com min-h
- **Arquivo**: `src/features/funis/components/FunilDetallePage.tsx:186-208`
- **Problema**: Botões Share/Edit/Delete sem min-h
- **Solução**: Adicionar `min-h-[44px] min-w-[44px]`
- **Critério**: Touch targets de 44px

### Matriz de Priorização

| Fase | Tarefa | Prioridade | Esforço | Impacto |
|------|--------|------------|---------|---------|
| 1 | 1.1 | Crítica | Baixo | Alto |
| 2 | 2.1 | Média | Baixo | Médio |
| 2 | 2.2 | Média | Baixo | Médio |
| 2 | 2.3 | Média | Baixo | Médio |
| 2 | 2.4 | Média | Baixo | Baixo |
| 2 | 2.5 | Média | Baixo | Médio |
| 3 | 3.1 | Baixa | Baixo | Baixo |
| 3 | 3.2 | Baixa | Baixo | Baixo |

### Estimativa de Tempo

| Fase | Tarefas | Tempo |
|------|---------|-------|
| 1 | 1 | ~2min |
| 2 | 5 | ~5min |
| 3 | 2 | ~3min |
| **Total** | **8** | **~10min** |

---

## 9. Testes Pós-Implementação

### Viewports

| Dispositivo | Largura | Altura | Testar |
|-------------|---------|--------|--------|
| iPhone SE | 375px | 667px | Grids, botões, Kanban scroll |
| iPad Mini | 768px | 1024px | Layout 2 colunas |
| Desktop | 1280px | 800px | Layout completo |

### Checklist

- [ ] Nenhum overflow horizontal
- [ ] Todos os botões com min-h 44px
- [ ] Textos não vazam em 320px
- [ ] Touch funciona corretamente
- [ ] Modais com scroll adequado
- [ ] Kanban scroll horizontal funciona
- [ ] Botão deletar ShareModal visível em mobile

---

## 10. Implementação Realizada

| Data | Fase | Tarefas | Status |
|------|------|---------|--------|
| 2026-07-02 | 1 | 1.1 | ✅ Concluído |
| 2026-07-02 | 2 | 2.1, 2.2, 2.3, 2.4, 2.5 | ✅ Concluído |
| 2026-07-02 | 3 | 3.1, 3.2 | ✅ Concluído |

### Alterações Aplicadas

| Arquivo | Linha | Antes | Depois |
|---------|-------|-------|--------|
| `ShareModal.tsx` | 188 | `opacity-0 group-hover/opt:opacity-100` | `md:opacity-0 md:group-hover/opt:opacity-100` |
| `FunisDashboardPage.tsx` | 185 | `grid grid-cols-2 lg:grid-cols-4` | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` |
| `TemplateManager.tsx` | 108 | `grid grid-cols-2 lg:grid-cols-4` | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` |
| `KanbanView.tsx` | 90 | `min-w-[280px]` | `min-w-[260px] sm:min-w-[280px]` |
| `FunilDetallePage.tsx` | 177 | `text-2xl` | `text-xl sm:text-2xl` |
| `AutomationRules.tsx` | 148 | `flex items-center gap-4` | `flex flex-col sm:flex-row sm:items-center gap-4` |
| `FunisDashboardPage.tsx` | 187 | `<Skeleton ...>` | `<Skeleton ... role="status">` |
| `TemplateManager.tsx` | 110 | `<Skeleton ...>` | `<Skeleton ... role="status">` |
| `AutomationRules.tsx` | 118 | `<Skeleton ...>` | `<Skeleton ... role="status">` |
| `FunilDetallePage.tsx` | 188 | `p-2 rounded-lg ...` | `p-2 rounded-lg ... min-h-[44px] min-w-[44px]` |
| `FunilDetallePage.tsx` | 197 | `p-2 rounded-lg ...` | `p-2 rounded-lg ... min-h-[44px] min-w-[44px]` |
| `FunilDetallePage.tsx` | 204 | `p-2 rounded-lg ...` | `p-2 rounded-lg ... min-h-[44px] min-w-[44px]` |

### Validação

- [x] TypeScript sem erros
- [x] Lógica preservada
- [x] JSX intacto
- [x] Apenas classes modificadas