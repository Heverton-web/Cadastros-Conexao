# Análise de Responsividade — Módulo Cadastros

> Documento de análise de responsividade do módulo Cadastros do ERP Conexão.
> Data da análise: 02/07/2026

---

## 1. Objetivo

Verificar se todas as rotas do módulo Cadastros seguem o padrão **Mobile-First** e garantem
usabilidade em qualquer tamanho de tela, desde dispositivos móveis compactos (320px) até
desktops amplos (1920px+).

---

## 2. Rotas Analisadas

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/cadastros/dashboard` | `cadastros.dashboard.tsx` | Dashboard principal com KPIs e status breakdown |
| `/cadastros/solicitacoes` | `cadastros.solicitacoes.tsx` | Lista de solicitações com filtros |
| `/cadastros/clientes` | `cadastros.clientes.tsx` | Lista de clientes aprovados |
| `/cadastros/consultor` | `cadastros.consultor.tsx` | Dashboard do consultor com geração de links |
| `/cadastros/consultor/clientes` | `cadastros.consultor.clientes.tsx` | Lista de clientes do consultor |
| `/cadastros/relatorios` | `cadastros.relatorios.tsx` | Relatórios consolidados |
| `/cadastros/solicitacoes/$id` | `cadastros.solicitacoes.$id.tsx` | Detalhe do cadastro (análise/aprovação) |

---

## 3. Framework de Responsividade

A aplicação utiliza **Tailwind CSS** com breakpoints padrão:

| Breakpoint | Prefixo | Largura | Uso |
|------------|---------|---------|-----|
| Mobile | (sem prefixo) | 0px — 639px | Mobile-First (padrão) |
| SM | `sm:` | 640px+ | Mobile landscape / tablets pequenos |
| MD | `md:` | 768px+ | Tablets |
| LG | `lg:` | 1024px+ | Desktops |
| XL | `xl:` | 1280px+ | Desktops amplos |

---

## 4. Análise por Rota

### 4.1 `/cadastros/dashboard`

#### Layout Principal
- **Container**: `space-y-8 animate-fade-in` — fluxo vertical ✅
- **Header**: `flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4` ✅

#### KPI Cards
- **Grid**: `grid grid-cols-2 lg:grid-cols-4 gap-4` ✅
- **Texto valor**: `text-4xl font-bold` — ⚠️ overflow potencial em 320px

#### Status Breakdown
- **Grid**: `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3`
  - ⚠️ 6 colunas em 1024px pode ficar apertado

#### Verificação

| Critério | Status | Observação |
|----------|--------|------------|
| Header empilha mobile | ✅ | `flex-col sm:flex-row` |
| KPI 2 colunas mobile | ✅ | `grid-cols-2 lg:grid-cols-4` |
| Status breakdown 3 breakpoints | ⚠️ | 6 cols em lg apertado |
| Lista recente 1 coluna mobile | ✅ | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` |

---

### 4.2 `/cadastros/solicitacoes`

#### Header + Filtros
- `flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4` ✅
- Search: `flex flex-col lg:flex-row gap-3` ✅

#### KPI Cards
- `grid grid-cols-2 lg:grid-cols-4 gap-4` ✅
- Texto: `text-4xl font-bold` — ⚠️ overflow potencial

#### Cards de Solicitação
- `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4` ✅
- **Ações**: `opacity-0 group-hover:opacity-100` — ❌ **INVISÍVEL EM TOUCH**

#### Verificação

| Critério | Status | Observação |
|----------|--------|------------|
| Botões de ação em touch | ❌ | `group-hover:opacity-100` não funciona em touch |
| KPI 2 colunas mobile | ✅ | |
| Cards 1 coluna mobile | ✅ | |

---

### 4.3 `/cadastros/clientes`

#### Mesma estrutura de solicitacoes
- Mesmo componente `ClientesPage` — mesmos problemas

#### Verificação

| Critério | Status | Observação |
|----------|--------|------------|
| Botões de ação em touch | ❌ | Mesmo problema de group-hover |

---

### 4.4 `/cadastros/consultor`

#### Layout
- Header com CTA: `flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4` ✅
- Botão: `min-h-[44px]` ✅
- Modal: `w-full max-w-md px-4` ✅

#### Verificação

| Critério | Status | Observação |
|----------|--------|------------|
| Modal responsivo | ✅ | `w-full max-w-md px-4` |
| CTA touch target | ✅ | `min-h-[44px]` |
| Trava scroll modal | ✅ | |

---

### 4.5 `/cadastros/consultor/clientes`

#### Layout
- `flex flex-col gap-6 p-4 pb-24` — pb-24 para BottomNav ✅
- Busca: `w-full ... min-h-[56px]` ✅

#### Verificação

| Critério | Status | Observação |
|----------|--------|------------|
| Layout single-column | ✅ | |
| Touch targets | ✅ | |

---

### 4.6 `/cadastros/relatorios`

#### Filtros
- `flex flex-col sm:flex-row gap-3` ✅

#### KPI + Status
- `grid grid-cols-2 lg:grid-cols-4 gap-4` ✅
- Status: `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3` — ⚠️ 6 cols

#### Verificação

| Critério | Status | Observação |
|----------|--------|------------|
| Filtros empilham mobile | ✅ | |
| KPI responsivo | ✅ | |
| Status breakdown 6 cols | ⚠️ | Apertado em lg |

---

### 4.7 `/cadastros/solicitacoes/$id`

#### Layout
- `flex flex-col gap-6 p-4 pb-28 lg:p-8 lg:pb-8 lg:gap-8` ✅
- Botões: `w-full lg:w-auto flex flex-wrap gap-2 lg:gap-3` ✅
- Tabs mobile: `flex md:hidden` ✅
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8` ✅

#### Verificação

| Critério | Status | Observação |
|----------|--------|------------|
| Tabs mobile | ✅ | `md:hidden` |
| Botões full-width mobile | ✅ | `flex-1 lg:flex-none` |
| Grid 1→2→3 colunas | ✅ | |

---

## 5. Problemas Identificados

### 5.1 Críticos

#### Botões de ação em cards (solicitacoes, clientes)
- **Arquivo**: `cadastros.solicitacoes.tsx:442`, `cadastros.clientes.tsx:255`
- **Problema**: `opacity-0 group-hover:opacity-100` — invisível em touch
- **Impacto**: Usuários mobile não conseguem editar/excluir

### 5.2 Médios

#### Texto KPI `text-4xl` em mobile
- **Arquivos**: dashboard, solicitacoes, consultor, relatorios (KPI cards)
- **Problema**: Valores grandes podem vazar em 320px
- **Sugestão**: `text-3xl sm:text-4xl`

#### Status Breakdown 6 colunas em LG
- **Arquivos**: dashboard:169, relatorios:218
- **Problema**: 6 colunas em 1024px apertado
- **Sugestão**: `lg:grid-cols-5 xl:grid-cols-6`

### 5.3 Baixos

#### Skeleton sem aria-label
- Todos os arquivos com `<Skeleton>` — acessibilidade

---

## 6. Plano de Correção

### Fase 1 — Bugs Críticos

#### Tarefa 1.1: Botões de ação touch (solicitacoes)
- **Arquivo**: `cadastros.solicitacoes.tsx:442`
- **Atual**: `opacity-0 group-hover:opacity-100`
- **Corrigido**: `md:opacity-0 md:group-hover:opacity-100`
- **Critério**: Botões visíveis em mobile, ocultos em desktop até hover

#### Tarefa 1.2: Botões de ação touch (clientes)
- **Arquivo**: `cadastros.clientes.tsx:255`
- **Atual**: `opacity-0 group-hover:opacity-100`
- **Corrigido**: `md:opacity-0 md:group-hover:opacity-100`

### Fase 2 — Adequações

#### Tarefa 2.1: Texto KPI responsivo (4 arquivos)
- **Arquivos**: dashboard, solicitacoes, consultor, relatorios
- **Atual**: `text-4xl font-bold`
- **Corrigido**: `text-3xl sm:text-4xl font-bold`

#### Tarefa 2.2: Status breakdown 5 colunas LG
- **Arquivos**: dashboard:169, relatorios:218
- **Atual**: `lg:grid-cols-6`
- **Corrigido**: `lg:grid-cols-5 xl:grid-cols-6`

### Matriz de Priorização

| Fase | Tarefa | Prioridade | Esforço | Impacto |
|------|--------|------------|---------|---------|
| 1 | 1.1 Botões touch solicitacoes | Crítica | Baixo | Alto |
| 1 | 1.2 Botões touch clientes | Crítica | Baixo | Alto |
| 2 | 2.1 Texto KPI responsivo | Média | Baixo | Médio |
| 2 | 2.2 Status breakdown cols | Média | Baixo | Médio |

### Estimativa de Tempo

| Fase | Tarefas | Tempo |
|------|---------|-------|
| Fase 1 | 2 tarefas | 10 min |
| Fase 2 | 2 tarefas | 15 min |
| **Total** | **4 tarefas** | **~25 min** |

---

## 7. Implementação Realizada

| Data | Fase | Tarefas | Status |
|------|------|---------|--------|
| 02/07/2026 | 1 + 2 | 1.1, 1.2, 2.1, 2.2 | ✅ Concluído |

### Alterações Aplicadas

| Arquivo | Linha | Antes | Depois |
|---------|-------|-------|--------|
| `cadastros.solicitacoes.tsx` | 442 | `opacity-0 group-hover:opacity-100` | `md:opacity-0 md:group-hover:opacity-100` |
| `cadastros.clientes.tsx` | 255 | `opacity-0 group-hover:opacity-100` | `md:opacity-0 md:group-hover:opacity-100` |
| `cadastros.dashboard.tsx` | 112,126,140,154 | `text-4xl` | `text-3xl sm:text-4xl` |
| `cadastros.solicitacoes.tsx` | 266,280,294,308 | `text-4xl` | `text-3xl sm:text-4xl` |
| `cadastros.consultor.tsx` | 292,306,320,334 | `text-4xl` | `text-3xl sm:text-4xl` |
| `cadastros.relatorios.tsx` | 161,175,189,203 | `text-4xl` | `text-3xl sm:text-4xl` |
| `cadastros.dashboard.tsx` | 169 | `lg:grid-cols-6` | `lg:grid-cols-5 xl:grid-cols-6` |
| `cadastros.relatorios.tsx` | 218 | `lg:grid-cols-6` | `lg:grid-cols-5 xl:grid-cols-6` |

### Validação

- [x] Apenas classes Tailwind modificadas
- [x] Lógica de negócio preservada
- [x] JSX intacto
- [x] Nenhum elemento adicionado/removido

---

## 8. Checklist Pós-Implementação

### Mobile (320px — 639px)
- [x] Botões de ação visíveis em touch
- [x] Textos KPI sem overflow
- [x] Header empilhado
- [x] Cards 1-2 colunas

### Tablet (640px — 1023px)
- [x] Header em linha
- [x] KPI 2-4 colunas
- [x] Status breakdown 3-5 colunas

### Desktop (1024px+)
- [x] Botões de ação com hover
- [x] KPI 4 colunas
- [x] Status breakdown 5-6 colunas
