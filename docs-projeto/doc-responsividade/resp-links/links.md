# Análise de Responsividade — Módulo Links

> Documento de análise de responsividade do módulo Links (gerador-links) do ERP Conexão.
> Data da análise: 2026-07-03

---

## 1. Objetivo

Verificar se todas as rotas do módulo **Links** seguem o padrão **Mobile-First** e garantem
usabilidade em qualquer tamanho de tela, desde dispositivos móveis compactos (320px) até
desktops amplos (1920px+).

---

## 2. Rotas Analisadas

| Rota | Arquivo | Tipo |
|------|---------|------|
| `/ferramentas/links` | `src/routes/ferramentas.links.tsx` → `DashboardPage` | Dashboard |
| `/ferramentas/links/historico` | `src/routes/ferramentas.links.historico.tsx` → `HistoricoList` | Lista |
| `/ferramentas/links/templates` | `src/routes/ferramentas.links.templates.tsx` → `TemplateManager` | CRUD |
| `/ferramentas/links/whatsapp` | `src/routes/ferramentas.links.whatsapp.tsx` → `WhatsappGenerator` | Formulário |
| `/ferramentas/links/utm` | `src/routes/ferramentas.links.utm.tsx` → `UtmGenerator` | Formulário |
| `/ferramentas/links/google-review` | `src/routes/ferramentas.links.google-review.tsx` → `GoogleReviewGenerator` | Formulário |
| `/ferramentas/links/maps` | `src/routes/ferramentas.links.maps.tsx` → `GoogleMapsGenerator` | Formulário |
| `/ferramentas/links/waze` | `src/routes/ferramentas.links.waze.tsx` → `WazeGenerator` | Formulário |
| `/ferramentas/links/qrcode` | `src/routes/ferramentas.links.qrcode.tsx` → `QrCodeGenerator` | Formulário |

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

### 4.1 `/ferramentas/links` — DashboardPage

#### Layout Principal
- **Container**: `space-y-8 animate-fade-in` ✅
- **Header**: PageHeader com actions (select + botão) em flex-row ✅

#### Grids
- **KPI Cards**: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` → ✅ (já responsivo)
- **Gráficos**: `grid grid-cols-1 lg:grid-cols-2` → ✅
- **Cards de Origem/SO**: `grid grid-cols-1 lg:grid-cols-2` → ✅

#### Verificação

| Critério | Status | Observação |
|----------|--------|------------|
| Container responsivo | ✅ | `space-y-8 animate-fade-in` |
| KPI grid mobile | ✅ | 1 coluna no mobile |
| KPI grid desktop | ✅ | 4 colunas no lg |
| Tabela com scroll | ✅ | `overflow-x-auto` no wrapper |
| Loading skeleton | ✅ | Skeleton com grid responsivo |
| Touch targets | ✅ | Buttons com min-h implícito |

### 4.2 `/ferramentas/links/historico` — HistoricoList

#### Layout Principal
- **Container**: `space-y-6`
- **Filtros**: `flex flex-col sm:flex-row gap-3` ✅

#### Cards de Lista
- `Card` com `className="group"` → hover states ✅
- Ações hover com `sm:opacity-0 sm:group-hover:opacity-100` ✅

#### Verificação

| Critério | Status | Observação |
|----------|--------|------------|
| Filtros mobile | ✅ | `flex-col` no mobile |
| Action buttons hover | ✅ | `sm:opacity-0` para mobile |
| Modal responsivo | ✅ | `w-[calc(100%-2rem)]` no Dialog |
| Table scroll no modal | ✅ | `overflow-x-auto` incluso |
| Touch targets | ✅ | Botões com padding adequado |

### 4.3 `/ferramentas/links/templates` — TemplateManager

#### Layout Principal
- **Container**: `space-y-6`
- **Header**: `flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4` ✅

#### Grids
- **Cards**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3` ✅

#### Verificação

| Critério | Status | Observação |
|----------|--------|------------|
| Header responsivo | ✅ | Empilha no mobile |
| Grid responsivo | ✅ | 1 → 2 → 3 colunas |
| Modal responsivo | ✅ | Design system aplicado |
| Touch targets | ✅ | |
| Empty state | ✅ | EmptyState component |

### 4.4 Geradores (WhatsApp, UTM, Google Review, Maps, Waze)

#### Layout Principal
- **Container**: `space-y-5` ✅

#### Formulários
- **Grids**: `grid grid-cols-1 md:grid-cols-2 gap-4` ✅
- **Labels**: `text-sm font-semibold text-text-main` ✅

#### Verificação

| Critério | Status | Observação |
|----------|--------|------------|
| Container responsivo | ✅ | `space-y-5` |
| Form grid mobile | ✅ | 1 coluna no mobile |
| Input full width | ✅ | Input component já é w-full |
| Touch targets | ✅ | h-11 nos inputs |
| URL result card | ✅ | break-all para urls longas |

### 4.5 `/ferramentas/links/qrcode` — QrCodeGenerator

#### Layout Principal
- **Container**: `space-y-5`
- **QR Display**: `flex flex-col items-center gap-4` ✅

#### Verificação

| Critério | Status | Observação |
|----------|--------|------------|
| QR centralizado | ✅ | items-center |
| Select responsivo | ✅ | Design system aplicado |
| Touch targets | ✅ | min-h aplicado |
| Download no mobile | ✅ | Botão visível |

---

## 5. Problemas Identificados

### 5.1 Críticos
Nenhum problema crítico identificado.

### 5.2 Médios
1. **KPI valores — DashboardPage**: Usa `text-2xl font-bold` para valores de KPI, poderia seguir o padrão `text-3xl sm:text-4xl` para maior impacto visual.

### 5.3 Baixos
1. **QrCodeGenerator — flex-wrap no mobile**: O container de ações (select + botões) usa `flex items-center gap-3` sem wrap — em telas muito estreitas (<360px) pode quebrar o layout.

---

## 6. Plano de Correção

### Fase 1 — Críticos
Nenhum.

### Fase 2 — Médios

#### Tarefa 2.1: Aumentar tamanho dos valores KPI no Dashboard
- **Arquivo**: `src/features/gerador-links/components/DashboardPage.tsx`
- **Problema**: Valores KPI usam `text-2xl font-bold` (pouco impacto visual)
- **Solução**: `text-3xl sm:text-4xl font-bold text-text-main mt-2`
- **Critério**: KPI values com destaque visual adequado

### Fase 3 — Baixos

#### Tarefa 3.1: Adicionar flex-wrap no container de ações do QrCode
- **Arquivo**: `src/features/gerador-links/components/sections/QrCodeGenerator.tsx`
- **Problema**: Container de ações sem wrap em telas estreitas
- **Solução**: Adicionar `flex-wrap` ao container de ações

---

## 7. Implementação Realizada

| Data | Fase | Tarefas | Status |
|------|------|---------|--------|
| 2026-07-03 | 2 | 2.1 — KPI values | ✅ Concluído |
| 2026-07-03 | 3 | 3.1 — QrCode flex-wrap | ✅ Concluído |

### Alterações Aplicadas

| Arquivo | Linha | Antes | Depois |
|---------|-------|-------|--------|
| `DashboardPage.tsx` | KPI value | `text-2xl font-bold` | `text-3xl sm:text-4xl font-bold text-text-main mt-2` |
| `QrCodeGenerator.tsx` | Ações container | `flex items-center gap-3` | `flex items-center gap-3 flex-wrap` |

### Validação

- [x] TypeScript sem erros
- [x] Lógica preservada
- [x] JSX intacto
- [x] Apenas classes modificadas
