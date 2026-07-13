# Análise de Responsividade — ERP Conexão

> **Documento gerado em:** 04/07/2026 | **Stack:** Tailwind v4 mobile-first

---

## 1. Visão Geral

O design system do ERP Conexão é **MOBILE-FIRST** (Tailwind v4). Todos os grids começam com 1 coluna e escalam.

---

## 2. Breakpoints

| Prefixo | Largura | Dispositivo |
|---|---|---|
| (base) | < 640px | Mobile |
| `sm:` | 640px+ | Tablet retrato |
| `md:` | 768px+ | Tablet paisagem |
| `lg:` | 1024px+ | Desktop |
| `xl:` | 1280px+ | Desktop wide |

---

## 3. Padrões Obrigatórios

### Grids
```html
<!-- ❌ ERRADO: quebra no mobile -->
<div class="grid grid-cols-3 gap-4">

<!-- ✅ CORRETO: mobile-first -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
```

### Headers
```html
<!-- ✅ CORRETO: empilha no mobile -->
<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
```

### Touch Targets
```html
<!-- ✅ CORRETO: mínimo 44px para toque -->
<button class="min-h-[44px] px-4 py-2">
```

### Hovers (mobile não tem hover)
```html
<!-- ✅ CORRETO: sempre visível no mobile -->
<div class="sm:opacity-0 sm:group-hover:opacity-100">
```

### Dialogs
```html
<!-- ✅ CORRETO: cabe no mobile -->
<DialogContent class="w-[calc(100%-2rem)] max-w-lg">
```

---

## 4. Padrões por Componente

| Componente | Mobile | Desktop |
|---|---|---|
| Forms | Full width | `max-w-md` |
| Tabelas | `overflow-x-auto` | Normal |
| KPIs | 2 colunas | 4 colunas |
| Sidebar | `hidden` (hamburger) | fixed |
| Modais | `95vw` | `max-w-lg` |
| Breadcrumb | `text-xs` | `text-sm` |
