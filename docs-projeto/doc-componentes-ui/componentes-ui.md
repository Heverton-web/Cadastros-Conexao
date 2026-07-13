# Catálogo de Componentes UI — ERP Conexão

> **Documento gerado em:** 04/07/2026 | **Stack:** shadcn/ui + Tailwind v4 + Lucide Icons

---

## 1. Visão Geral

O ERP Conexão utiliza **~59 componentes shadcn/ui** customizados com design system dark gold.

---

## 2. Componentes Base (shadcn/ui)

| Componente | Pasta | Uso |
|---|---|---|
| `Button` | `~/components/ui/button` | Ações primárias, secundárias, outline |
| `Input` | `~/components/ui/input` | Campos de texto |
| `Textarea` | `~/components/ui/textarea` | Texto longo |
| `Select` | `~/components/ui/select` | Dropdown |
| `Dialog` | `~/components/ui/dialog` | Modais |
| `AlertDialog` | `~/components/ui/alert-dialog` | Confirmação de exclusão |
| `Card` | `~/components/ui/card` | Containers |
| `Badge` | `~/components/ui/badge` | Status tags |
| `Skeleton` | `~/components/ui/skeleton` | Loading states |
| `Tabs` | `~/components/ui/tabs` | Abas |
| `Table` | `~/components/ui/table` | Tabelas de dados |
| `Accordion` | `~/components/ui/accordion` | Acordeão |
| `Toast` (react-hot-toast) | — | Notificações toast |
| `Sheet` | `~/components/ui/sheet` | Painel lateral |
| `Tooltip` | `~/components/ui/tooltip` | Tooltip |

---

## 3. Componentes Customizados

| Componente | Local | Função |
|---|---|---|
| `PageHeader` | `~/components/ui/page-header` | Título + breadcrumb padrão |
| `EmptyState` | `~/components/ui/empty-state` | Estado vazio com ícone |
| `PasswordInput` | `~/components/ui/password-input` | Senha com toggle |
| `AppLayout` | `~/components/layout/AppLayout` | Layout principal |
| `CentralAcoesTab` | `~/components/admin/CentralAcoesTab` | Workflow builder |

---

## 4. Ícones

**Lucide React** — mais de 50 ícones utilizados:

| Categoria | Ícones |
|---|---|
| Navegação | `LayoutDashboard`, `Users`, `Map`, `Route`, `Settings` |
| Ações | `Plus`, `Trash2`, `Save`, `Edit`, `Copy`, `Check` |
| Status | `Loader2`, `CheckCircle2`, `AlertTriangle`, `X` |
| Módulos | `Building2`, `UserCircle`, `Receipt`, `ClipboardCheck`, `Megaphone` |

---

## 5. Padrões de Página

### Estrutura Padrão
```tsx
<div className="space-y-6 animate-fade-in">
  <PageHeader title="Título" breadcrumb={[...]} />
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* KPIs */}
  </div>
  <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
    {/* Conteúdo */}
  </div>
</div>
```

### Estados
- **Loading**: `<Skeleton className="h-32 rounded-2xl" />` em grid
- **Empty**: `<EmptyState icon={<Icon />} title="..." description="..." />`
- **Error**: Tratamento com `try/catch` + toast + fallback UI
