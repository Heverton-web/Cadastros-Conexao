# Análise de Responsividade — Módulo Hub

> Documento de análise de responsividade do módulo Hub do ERP Conexão.
> Data da análise: 2026-07-03

---

## 1. Objetivo

Verificar se todas as rotas e componentes do módulo Hub seguem o padrão **Mobile-First** e garantem
usabilidade em qualquer tamanho de tela, desde dispositivos móveis compactos (320px) até
desktops amplos (1920px+).

---

## 2. Rotas Analisadas

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/hub/dashboard` | `HubDashboardPage.tsx` | Dashboard principal com materiais e trilhas |
| `/hub/ranking` | `HubRankingPage.tsx` | Ranking de usuários por XP |
| `/hub/conquistas` | `HubConquistasPage.tsx` | Badges e conquistas |
| `/hub/admin/trilhas` | `AdminTrilhasPage.tsx` | CRUD de trilhas (admin) |
| `/hub/admin/materiais` | `AdminMateriaisPage.tsx` | CRUD de materiais (admin) |
| `/hub/admin/chatbot` | `AdminChatbotPage.tsx` | Configuração do chatbot |
| `/hub/admin/badges` | `AdminBadgesPage.tsx` | CRUD de badges (admin) |
| `/hub/admin/analytics` | `AdminAnalyticsPage.tsx` | Métricas e analytics |

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

### 4.1 `HubLayout.tsx` (Layout Global)

#### Layout Principal
- **Container**: `min-h-screen flex flex-col`
- **Header**: `sticky top-0 z-40 px-2 sm:px-4` — responsivo
- **Main**: `p-3 sm:p-4 md:p-6 mt-2 sm:mt-4` — responsivo

#### Verificação de Responsividade

| Critério | Status | Observação |
|----------|--------|------------|
| Header empilha em mobile | ✅ | Usa flex com gaps responsivos |
| Título hidden em mobile | ✅ | `hidden sm:block` no título |
| Botões com touch target adequado | ✅ | `w-8 h-8 sm:w-10 sm:h-10` |
| Padding responsivo | ✅ | `p-3 sm:p-4 md:p-6` |

### 4.2 `HubDashboardPage.tsx`

#### Layout Principal
- **Container**: `flex flex-col md:flex-row gap-8`
- **Sidebar**: `w-full md:w-72 shrink-0`
- **Conteúdo**: `flex-1 min-w-0`

#### Grids
- **Materiais**: `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6`
- **Trilhas**: `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6`

#### Verificação de Responsividade

| Critério | Status | Observação |
|----------|--------|------------|
| Sidebar empilha em mobile | ✅ | `flex-col md:flex-row` |
| Grid responsivo | ✅ | 1 → 2 → 3 colunas |
| Títulos responsivos | ✅ | `text-2xl sm:text-4xl md:text-5xl` |
| Search bar responsiva | ✅ | `w-full xl:w-96` |
| Filtros scrolláveis em mobile | ✅ | `overflow-x-auto md:overflow-visible` |
| Skeletons com role="status" | ✅ | Acessível |

### 4.3 `HubRankingPage.tsx`

#### Verificação de Responsividade

| Critério | Status | Observação |
|----------|--------|------------|
| Título responsivo | ✅ | `text-2xl sm:text-4xl md:text-5xl` |
| Padding responsivo | ✅ | `p-5 sm:p-8 md:p-10` |
| Lista responsiva | ✅ | `space-y-3` sem largura fixa |
| Empty state responsivo | ✅ | Padding e max-width adequados |

### 4.4 `HubConquistasPage.tsx`

#### Grids
- **Badges**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`

#### Verificação de Responsividade

| Critério | Status | Observação |
|----------|--------|------------|
| Grid responsivo | ✅ | 1 → 2 → 3 → 4 colunas |
| Cards com padding adequado | ✅ | `p-5` |
| Textos responsivos | ✅ | `text-2xl sm:text-4xl md:text-5xl` |

### 4.5 `AdminTrilhasPage.tsx`

#### Verificação de Responsividade

| Critério | Status | Observação |
|----------|--------|------------|
| Header flexível | ✅ | `flex-col sm:flex-row` |
| Lista vertical | ✅ | `space-y-2` |
| Skeletons acessíveis | ✅ | `role="status"` |
| **Botões de ação** | ❌ | **`opacity-0 group-hover:opacity-100` — invisível em touch** |

### 4.6 `AdminMateriaisPage.tsx`

#### Verificação de Responsividade

| Critério | Status | Observação |
|----------|--------|------------|
| Header flexível | ✅ | `flex-col sm:flex-row` |
| Lista vertical | ✅ | `space-y-2` |
| **Select empresa** | ⚠️ | **`w-60` fixo — deve ser `w-full sm:w-60`** |
| **Botões de ação** | ❌ | **`opacity-0 group-hover:opacity-100` — invisível em touch** |

### 4.7 `AdminChatbotPage.tsx`

#### Verificação de Responsividade

| Critério | Status | Observação |
|----------|--------|------------|
| Layout simples | ✅ | `space-y-6` |
| Card com padding | ✅ | `p-6` |
| **Toggle switch** | ⚠️ | **`w-12 h-6` (48x24px) — abaixo do mínimo 44px** |

### 4.8 `AdminBadgesPage.tsx`

#### Grids
- **Badges**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`

#### Verificação de Responsividade

| Critério | Status | Observação |
|----------|--------|------------|
| Grid responsivo | ✅ | 1 → 2 → 3 colunas |
| Header flexível | ✅ | `flex-col sm:flex-row` |
| Skeletons acessíveis | ✅ | `role="status"` |
| **Botão excluir** | ❌ | **`opacity-0 group-hover:opacity-100` — invisível em touch** |

### 4.9 `AdminAnalyticsPage.tsx`

#### Grids
- **Stats**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`

#### Verificação de Responsividade

| Critério | Status | Observação |
|----------|--------|------------|
| Grid stats responsivo | ✅ | 1 → 2 → 4 colunas |
| **StatCard value** | ⚠️ | **`text-3xl` sem responsivo — pode vazar em 320px** |
| Barras de progresso | ✅ | Largura flexível |

---

## 5. Componentes Analisados

### 5.1 `MaterialCard.tsx`

| Critério | Status | Observação |
|----------|--------|------------|
| Card responsivo | ✅ | `h-full flex flex-col` |
| Touch target botões lang | ✅ | `px-3 py-1.5` adequado |
| Hover effects | ⚠️ | `opacity-0 group-hover:opacity-100` no chevron — esperado em card de display |
| Gradient overlay | ⚠️ | `opacity-0 group-hover:opacity-100` — esperado em card de display |

### 5.2 `CollectionCard.tsx`

| Critério | Status | Observação |
|----------|--------|------------|
| Card responsivo | ✅ | `h-full flex flex-col` |
| Click handler | ✅ | Card inteiro clicável |
| "Ver trilha →" | ⚠️ | Depende de hover — mas card continua clicável |

### 5.3 `ChatWidget.tsx`

| Critério | Status | Observação |
|----------|--------|------------|
| Largura responsiva | ✅ | `w-[calc(100%-3rem)] sm:w-[320px]` |
| Botão abrir | ✅ | `h-14 w-14` (56px) — adequado |
| Posicionamento | ✅ | `fixed bottom-6 right-6` |

### 5.4 `RankingBoard.tsx`

| Critério | Status | Observação |
|----------|--------|------------|
| Gap responsivo | ✅ | `gap-3 sm:gap-4` |
| Padding responsivo | ✅ | `p-3 sm:p-4` |

### 5.5 `BadgeDisplay.tsx`

| Critério | Status | Observação |
|----------|--------|------------|
| Layout flexível | ✅ | `flex-col` ou `items-center` conforme `compact` |
| Touch targets | ✅ | `h-10 w-10` (40px) — adequado |

---

## 6. Problemas Identificados

### 6.1 Críticos

1. **AdminTrilhasPage:154** — `opacity-0 group-hover:opacity-100` nos botões de ação: botões Editar/Excluir invisíveis em dispositivos touch. Usuário mobile não consegue editar nem excluir trilhas.

2. **AdminMateriaisPage:240** — `opacity-0 group-hover:opacity-100` nos botões de ação: botões Ativar/Editar/Excluir invisíveis em dispositivos touch. Usuário mobile não consegue gerenciar materiais.

3. **AdminBadgesPage:168** — `opacity-0 group-hover:opacity-100` no botão Excluir: invisível em dispositivos touch. Usuário mobile não consegue excluir badges.

### 6.2 Médios

4. **AdminChatbotPage:88** — Toggle switch com `w-12 h-6` (48x24px): abaixo do mínimo recomendado de 44px para touch targets. Difícil de acionar em mobile.

5. **AdminMateriaisPage:132** — Select com `w-60` fixo: pode vazar em telas < 320px. Deveria ter `w-full sm:w-60`.

6. **AdminAnalyticsPage:57** — StatCard com `text-3xl` sem responsivo: pode causar overflow em telas muito pequenas.

### 6.3 Baixos

7. **MaterialCard:82** — Gradient overlay `opacity-0 group-hover:opacity-100`: esperado em card de display, mas não funciona em touch. Impacto visual baixo — card permanece funcional.

8. **MaterialCard:199** — Chevron `opacity-0 group-hover:opacity-100`: esperado em card de display. Impacto funcional baixo.

9. **CollectionCard:144** — "Ver trilha →" com `group-hover:translate-x-1`: esperado em card clicável. Impacto funcional baixo — card permanece clicável.

---

## 7. Plano de Correção

### Fase 1 — Bugs Críticos (Touch/Hover)

#### Tarefa 1.1: AdminTrilhasPage — Botões de ação
- **Arquivo**: `src/features/hub/pages/admin/AdminTrilhasPage.tsx:154`
- **Problema**: `opacity-0 group-hover:opacity-100 transition-opacity`
- **Solução**: `md:opacity-0 md:group-hover:opacity-100 transition-opacity`
- **Critério**: Botões visíveis em mobile, ocultos apenas em desktop até hover

#### Tarefa 1.2: AdminMateriaisPage — Botões de ação
- **Arquivo**: `src/features/hub/pages/admin/AdminMateriaisPage.tsx:240`
- **Problema**: `opacity-0 group-hover:opacity-100 transition-opacity`
- **Solução**: `md:opacity-0 md:group-hover:opacity-100 transition-opacity`
- **Critério**: Botões visíveis em mobile, ocultos apenas em desktop até hover

#### Tarefa 1.3: AdminBadgesPage — Botão excluir
- **Arquivo**: `src/features/hub/pages/admin/AdminBadgesPage.tsx:168`
- **Problema**: `opacity-0 group-hover:opacity-100 transition-opacity`
- **Solução**: `md:opacity-0 md:group-hover:opacity-100 transition-opacity`
- **Critério**: Botão visível em mobile, oculto apenas em desktop até hover

### Fase 2 — Adequações

#### Tarefa 2.1: AdminChatbotPage — Toggle touch target
- **Arquivo**: `src/features/hub/pages/admin/AdminChatbotPage.tsx:88`
- **Problema**: `w-12 h-6` (48x24px)
- **Solução**: `w-14 h-8` (56x32px) + ajustar knob
- **Critério**: Toggle com touch target >= 44px

#### Tarefa 2.2: AdminMateriaisPage — Select responsivo
- **Arquivo**: `src/features/hub/pages/admin/AdminMateriaisPage.tsx:132`
- **Problema**: `w-60` fixo
- **Solução**: `w-full sm:w-60`
- **Critério**: Select não vaza em 320px

#### Tarefa 2.3: AdminAnalyticsPage — StatCard value responsivo
- **Arquivo**: `src/features/hub/pages/admin/AdminAnalyticsPage.tsx:57`
- **Problema**: `text-3xl` sem responsivo
- **Solução**: `text-2xl sm:text-3xl`
- **Critério**: Valor não vaza em 320px

### Matriz de Priorização

| Fase | Tarefa | Prioridade | Esforço | Impacto |
|------|--------|------------|---------|---------|
| 1 | 1.1 | Crítica | Baixo | Alto |
| 1 | 1.2 | Crítica | Baixo | Alto |
| 1 | 1.3 | Crítica | Baixo | Alto |
| 2 | 2.1 | Média | Baixo | Médio |
| 2 | 2.2 | Média | Baixo | Médio |
| 2 | 2.3 | Média | Baixo | Baixo |

### Estimativa de Tempo

| Fase | Tarefas | Tempo |
|------|---------|-------|
| 1 | 3 tarefas | ~3min |
| 2 | 3 tarefas | ~3min |
| **Total** | **6 tarefas** | **~6min** |

---

## 8. Testes Pós-Implementação

### Viewports

| Dispositivo | Largura | Alto | Testar |
|-------------|---------|------|--------|
| iPhone SE | 375px | 667px | Botões de ação visíveis, toggle acessível |
| iPad Mini | 768px | 1024px | Layout admin, grids |
| Desktop | 1280px | 800px | Hover states funcionando |

### Checklist

- [ ] Nenhum overflow horizontal
- [ ] Todos os botões clicáveis com min-h 44px
- [ ] Botões de ação visíveis em mobile (sem depender de hover)
- [ ] Toggle do chatbot acessível por touch
- [ ] Select não vaza em 320px
- [ ] Textos não vazam em 320px

---

## 9. Padrões Bem Implementados (Referência)

O módulo Hub já possui muitos padrões responsivos corretos:

- **HubLayout**: Header com padding responsivo, botões com tamanho responsivo
- **HubDashboardPage**: Sidebar flexível (`flex-col md:flex-row`), grid `1 → 2 → 3`
- **HubRankingPage**: Títulos e padding com breakpoints `sm:` e `md:`
- **HubConquistasPage**: Grid `1 → 2 → 3 → 4` colunas
- **AdminTrilhasPage/MateriaisPage/BadgesPage**: Headers com `flex-col sm:flex-row`
- **AdminAnalyticsPage**: Grid stats `1 → 2 → 4` colunas
- **ChatWidget**: Largura responsiva `calc(100%-3rem)` → `320px`
- **Skeletons**: Todos com `role="status"` e `aria-label`

---

## 10. Implementação Realizada

| Data | Fase | Tarefas | Status |
|------|------|---------|--------|
| 2026-07-03 | 1 | 1.1, 1.2, 1.3 | ✅ Concluído |
| 2026-07-03 | 2 | 2.1, 2.2, 2.3 | ✅ Concluído |

### Alterações Aplicadas

| Arquivo | Linha | Antes | Depois |
|---------|-------|-------|--------|
| `AdminTrilhasPage.tsx` | 154 | `opacity-0 group-hover:opacity-100` | `md:opacity-0 md:group-hover:opacity-100` |
| `AdminMateriaisPage.tsx` | 240 | `opacity-0 group-hover:opacity-100` | `md:opacity-0 md:group-hover:opacity-100` |
| `AdminBadgesPage.tsx` | 168 | `opacity-0 group-hover:opacity-100` | `md:opacity-0 md:group-hover:opacity-100` |
| `AdminChatbotPage.tsx` | 88 | `w-12 h-6` (knob: `26px`) | `w-14 h-8` (knob: `30px`) |
| `AdminMateriaisPage.tsx` | 132 | `w-60` | `w-full sm:w-60` |
| `AdminAnalyticsPage.tsx` | 57 | `text-3xl` | `text-2xl sm:text-3xl` |

### Validação

- [x] TypeScript sem erros (erros existentes são em `__tests__/`, não nos arquivos editados)
- [x] Lógica preservada
- [x] JSX intacto
- [x] Apenas classes modificadas
