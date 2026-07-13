# Design System ERP Odonto

> Versão: 1.0.0 | Última atualização: 2026-07-13

## Sumário

1. [Visão Geral](#visão-geral)
2. [Tokens](#tokens)
3. [Cores](#cores)
4. [Tipografia](#tipografia)
5. [Espaçamentos](#espaçamentos)
6. [Bordas e Border Radius](#bordas-e-border-radius)
7. [Sombras](#sombras)
8. [Animações](#animações)
9. [Componentes](#componentes)
10. [Layout](#layout)
11. [Formulários](#formulários)
12. [Modais](#modais)
13. [Padrões de Utilidade](#padrões-de-utilidade)
14. [Presets de Tema](#presets-de-tema)

---

## Visão Geral

O Design System ERP Odonto é um sistema de design unificado construído sobre:

- **Tailwind CSS v4** com variáveis CSS customizadas
- **shadcn/ui** como base de componentes
- **Radix UI** para primitivas acessíveis
- **class-variance-authority (CVA)** para variantes de componentes
- **Plus Jakarta Sans** como fonte principal (tema Dark Gold)
- **Roboto** como fonte alternativa (tema Dark Emerald)

### Arquitetura de Tokens

```
tokens/
├── types.ts          # Interface DesignTokens
├── resolver.ts       # Resolução de tokens com precedência
└── presets/
    ├── dark-gold.ts      # Tema padrão (Gold accent)
    ├── dark-blue.ts      # Tema azul
    ├── dark-emerald.ts   # Tema esmeralda
    └── light-clean.ts    # Tema claro
```

**Precedência de resolução:**
```
preset base → global override → empresa override → módulo override
```

---

## Tokens

### Paleta de Cores - Tema Dark Gold (Padrão)

#### Base

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-bg` | `#0f172a` | Fundo principal |
| `--color-surface` | `#1e293b` | Superfícies, cards |
| `--color-surface-hover` | `#334155` | Hover em superfícies |
| `--color-card` | `#1e293b` | Fundo de cards |

#### Tipografia

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-text-main` | `#f8fafc` | Texto principal |
| `--color-text-secondary` | `#cbd5e1` | Texto secundário |
| `--color-text-muted` | `#94a3b8` | Texto desabilitado/muted |
| `--color-text-inverted` | `#0f172a` | Texto em fundo claro |

#### Bordas

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-border` | `#334155` | Bordas principais |
| `--color-border-subtle` | `#1e293b` | Bordas sutis |

#### Accent (Gold)

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-accent` | `#c9a655` | Cor principal da marca |
| `--color-accent-hover` | `#d4b366` | Hover do accent |
| `--color-accent-fg` | `#0f172a` | Texto sobre accent |
| `--color-accent-muted` | `#c9a65520` | Accent com opacidade |

#### Gradiente

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-gradient-start` | `#c9a655` | Início do gradiente |
| `--color-gradient-mid` | `#e8d48b` | Meio do gradiente |
| `--color-gradient-end` | `#a8873a` | Fim do gradiente |

#### Feedback

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-success` | `#22c55e` | Sucesso |
| `--color-success-bg` | `#22c55e15` | Fundo de sucesso |
| `--color-warning` | `#eab308` | Atenção |
| `--color-warning-bg` | `#eab30815` | Fundo de atenção |
| `--color-error` | `#ef4444` | Erro |
| `--color-error-bg` | `#ef444415` | Fundo de erro |

#### Componentes

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-input-bg` | `#0f172a` | Fundo de inputs |
| `--color-input-border` | `#475569` | Bordas de inputs |
| `--color-input-focus` | `#c9a655` | Focus de inputs |
| `--color-btn-primary-bg` | `#c9a655` | Fundo botão primário |
| `--color-btn-primary-text` | `#3D2B00` | Texto botão primário |
| `--color-badge-bg` | `#334155` | Fundo de badges |
| `--color-tooltip-bg` | `#f8fafc` | Fundo de tooltips |
| `--color-tooltip-text` | `#0f172a` | Texto de tooltips |

#### Efeitos

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-overlay` | `#00000080` | Overlay de modais |
| `--color-shadow` | `#00000040` | Sombras |
| `--color-glass-tint` | `#ffffff10` | Efeito glass |
| `--color-header-bg` | `#1e293b` | Fundo do header |
| `--color-scrollbar-thumb` | `#475569` | Thumb da scrollbar |
| `--color-scrollbar-track` | `transparent` | Track da scrollbar |
| `--color-ring` | `#c9a65580` | Ring de foco |

#### Hover

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-hover-bg` | `#334155` | Fundo hover |
| `--color-hover-border` | `#c9a65540` | Border hover |
| `--color-hover-shadow` | `#c9a65525` | Shadow hover |

#### shadcn/ui Aliases

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-background` | `#0f172a` | Background |
| `--color-foreground` | `#f8fafc` | Foreground |
| `--color-card-foreground` | `#f8fafc` | Card foreground |
| `--color-popover` | `#1e293b` | Popover background |
| `--color-popover-foreground` | `#f8fafc` | Popover foreground |
| `--color-primary` | `#c9a655` | Primary |
| `--color-primary-foreground` | `#3D2B00` | Primary foreground |
| `--color-secondary` | `#334155` | Secondary |
| `--color-secondary-foreground` | `#f8fafc` | Secondary foreground |
| `--color-muted` | `#1e293b` | Muted |
| `--color-muted-foreground` | `#94a3b8` | Muted foreground |
| `--color-accent-foreground` | `#f8fafc` | Accent foreground |
| `--color-destructive` | `#ef4444` | Destructive |
| `--color-destructive-foreground` | `#f8fafc` | Destructive foreground |
| `--color-input` | `#334155` | Input |

---

## Tipografia

### Fontes

| Família | Uso | CSS |
|---------|-----|-----|
| **Plus Jakarta Sans** | Fonte principal (Dark Gold) | `"Plus Jakarta Sans", system-ui, -apple-system, sans-serif` |
| **Roboto** | Fonte alternativa (Dark Emerald) | `"Roboto", system-ui, -apple-system, sans-serif` |
| **JetBrains Mono** | Código/monospace | `"JetBrains Mono", "Fira Code", monospace` |

### Tamanhos de Fonte

| Token | Valor | Tailwind |
|-------|-------|----------|
| `fontSizeXs` | `0.75rem` | `text-xs` |
| `fontSizeSm` | `0.875rem` | `text-sm` |
| `fontSizeMd` | `1rem` | `text-base` |
| `fontSizeLg` | `1.125rem` | `text-lg` |
| `fontSizeXl` | `1.25rem` | `text-xl` |
| `fontSize2xl` | `1.5rem` | `text-2xl` |

### Pesos de Fonte

| Token | Valor | Tailwind |
|-------|-------|----------|
| `fontWeightLight` | 300 | `font-light` |
| `fontWeightNormal` | 400 | `font-normal` |
| `fontWeightMedium` | 500 | `font-medium` |
| `fontWeightSemibold` | 600 | `font-semibold` |
| `fontWeightBold` | 700 | `font-bold` |

### Alturas de Linha

| Token | Valor | Tailwind |
|-------|-------|----------|
| `lineHeightTight` | `1.25` | `leading-tight` |
| `lineHeightNormal` | `1.5` | `leading-normal` |
| `lineHeightRelaxed` | `1.75` | `leading-relaxed` |

### Espaçamento de Letras

| Token | Valor | Tailwind |
|-------|-------|----------|
| `letterSpacingTight` | `-0.025em` | `tracking-tight` |
| `letterSpacingNormal` | `0em` | `tracking-normal` |
| `letterSpacingWide` | `0.025em` | `tracking-wide` |

---

## Espaçamentos

| Token | Valor | Tailwind |
|-------|-------|----------|
| `xs` | `0.25rem` (4px) | `p-1` / `m-1` |
| `sm` | `0.5rem` (8px) | `p-2` / `m-2` |
| `md` | `1rem` (16px) | `p-4` / `m-4` |
| `lg` | `1.5rem` (24px) | `p-6` / `m-6` |
| `xl` | `2rem` (32px) | `p-8` / `m-8` |
| `2xl` | `3rem` (48px) | - |
| `3xl` | `4rem` (64px) | - |
| `4xl` | `6rem` (96px) | - |

---

## Bordas e Border Radius

### Border Radius

| Token | Valor | Tailwind |
|-------|-------|----------|
| `--radius-sm` | `0.375rem` (6px) | `rounded-lg` |
| `--radius-md` | `0.5rem` (8px) | `rounded-xl` |
| `--radius-lg` | `0.75rem` (12px) | `rounded-2xl` |
| `--radius-xl` | `1rem` (16px) | `rounded-3xl` |
| `--radius-full` | `9999px` | `rounded-full` |

**Padrão do ERP:** Componentes usam `rounded-xl` (0.5rem) como padrão.

---

## Sombras

| Token | Valor | Tailwind |
|-------|-------|----------|
| `--shadow-sm` | `0 1px 2px 0 rgba(0,0,0,0.3)` | `shadow-sm` |
| `--shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -2px rgba(0,0,0,0.3)` | `shadow-md` |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -4px rgba(0,0,0,0.3)` | `shadow-lg` |
| `--shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.3), 0 8px 10px -6px rgba(0,0,0,0.3)` | `shadow-xl` |

### Sombras Especiais

| Classe | Uso |
|--------|-----|
| `shadow-primary/25` | Sombra com accent (botões) |
| `shadow-destructive/25` | Sombra vermelha (botões destrutivos) |
| `shadow-2xl shadow-black/40` | Modais |

---

## Animações

### Durações

| Token | Valor |
|-------|-------|
| `durationFast` | `150ms` |
| `durationNormal` | `300ms` |
| `durationSlow` | `500ms` |

### Easing

| Token | Valor |
|-------|-------|
| `easingDefault` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `easingBounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

### Keyframes

| Nome | Descrição |
|------|-----------|
| `fade-in` | Animação de opacidade 0 → 1 |
| `slide-up` | Translação Y de 12px → 0 + opacidade |
| `shimmer` | Efeito de brilho em skeleton |
| `glow` | Efeito de brilho pulsante (accent) |
| `accordion-up` | Accordion fechando |
| `accordion-down` | Accordion abrindo |
| `pulse-subtle` | Pulsar sutil de opacidade |

### Classes de Animação

| Classe | Uso |
|--------|-----|
| `animate-fade-in` | Fade in (0.3s) |
| `animate-slide-up` | Slide up (0.3s) |
| `animate-shimmer` | Shimmer em skeleton (1.5s infinite) |
| `animate-glow` | Glow pulsante (2s infinite) |
| `animate-spin` | Rotação (Loader2) |

---

## Componentes

### Button

**Variantes:**

| Variante | Classe | Uso |
|----------|--------|-----|
| `default` | `bg-primary text-primary-foreground shadow-lg shadow-primary/25` | Botão principal |
| `destructive` | `bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25` | Ações destrutivas |
| `outline` | `border-2 border-border bg-transparent` | Botão secundário |
| `secondary` | `bg-secondary text-secondary-foreground` | Botão neutro |
| `ghost` | `hover:bg-surface-hover` | Botão fantasma |
| `ghost-destructive` | `text-error hover:bg-error/10` | Delete fantasma |
| `ghost-edit` | `text-blue-400 hover:bg-blue-500/10` | Editar fantasma |
| `link` | `text-primary underline-offset-4 hover:underline` | Link estilizado |

**Tamanhos:**

| Tamanho | Classe | Altura |
|---------|--------|--------|
| `xs` | `h-8 rounded-lg px-2.5 text-xs` | 32px |
| `default` | `h-11 px-5 py-2` | 44px |
| `sm` | `h-9 rounded-lg px-3.5 text-xs` | 36px |
| `lg` | `h-12 rounded-xl px-8 text-base` | 48px |
| `icon` | `h-10 w-10` | 40px |

**Props especiais:**
- `loading`: Exibe Loader2 animado
- `asChild`: Renderiza como Slot (Radix)

**Estilo base:**
```
inline-flex items-center justify-center gap-2 whitespace-nowrap
rounded-xl text-sm font-semibold cursor-pointer
transition-all duration-200
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
active:scale-[0.97]
```

---

### Input

**Estilo:**
```
flex h-11 w-full rounded-xl border border-border bg-input-bg
px-4 py-2.5 text-sm text-text-main font-medium shadow-sm
transition-all duration-200
placeholder:text-text-muted/60 placeholder:font-normal
hover:border-accent/30
focus-visible:outline-none focus-visible:border-transparent focus-visible:ring-0
focus-visible:shadow-[0_0_0_0.5px_var(--color-accent-muted)]
```

**Estados:**
- **Hover:** `border-accent/30`
- **Focus:** `shadow-[0_0_0_0.5px_var(--color-accent-muted)]`
- **Disabled:** `cursor-not-allowed opacity-50`
- **Invalid:** `border-error ring-error/30`

---

### Dialog (Modal)

**Estrutura:**
```tsx
<Dialog>
  <DialogTrigger />
  <DialogContent>
    <DialogHeader>
      <DialogTitle />
      <DialogDescription />
    </DialogHeader>
    {/* Body com scroll */}
    <DialogFooter />
  </DialogContent>
</Dialog>
```

**DialogContent:**
```
fixed left-[50%] top-[50%] z-[100] w-[calc(100%-2rem)] max-w-lg
translate-x-[-50%] translate-y-[-50%]
bg-card border border-border/50 rounded-2xl shadow-2xl shadow-black/40
max-h-[90dvh] flex flex-col
```

**DialogHeader:**
```
bg-gradient-to-br from-accent/20 via-accent/10 to-transparent
px-6 pt-6 pb-6 border-b border-border/50
```

**DialogFooter:**
```
flex flex-col-reverse gap-3 sm:flex-row sm:justify-end
px-6 pb-8 pt-6 border-t border-border/50
```

**Padrão de scroll (OBRIGATÓRIO):**
```tsx
<DialogContent className="flex flex-col max-h-[85vh] overflow-hidden">
  <DialogHeader className="shrink-0">...</DialogHeader>
  <div className="overflow-y-auto flex-1 min-h-0 px-6 py-4">
    {/* Conteúdo com scroll */}
  </div>
  <DialogFooter className="shrink-0">...</DialogFooter>
</DialogContent>
```

---

### AlertDialog (Confirmação)

**Estrutura:**
```tsx
<AlertDialog>
  <AlertDialogTrigger />
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle />
      <AlertDialogDescription />
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel />
      <AlertDialogAction />
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**AlertDialogHeader:**
```
bg-gradient-to-br from-red-500/20 via-red-500/10 to-transparent
px-6 pt-6 pb-4 border-b border-red-500/20
```

**AlertDialogAction (Destrutivo):**
```
flex-1 sm:flex-none rounded-xl bg-red-500 px-6 py-2.5
text-sm font-semibold text-white shadow-lg shadow-red-500/25
hover:bg-red-600 hover:shadow-xl hover:shadow-red-500/30
min-h-[44px]
```

**AlertDialogCancel:**
```
flex-1 sm:flex-none rounded-xl border border-border px-6 py-2.5
text-sm text-text-muted font-semibold
hover:text-text-main hover:bg-surface-hover
min-h-[44px]
```

---

### Card

**Estrutura:**
```tsx
<Card>
  <CardHeader>
    <CardTitle />
    <CardDescription />
  </CardHeader>
  <CardContent />
  <CardFooter />
</Card>
```

**Card:**
```
rounded-2xl border border-border/60 bg-card text-card-foreground
shadow-md transition-all duration-300
```

**CardHeader:**
```
flex flex-col space-y-1.5 p-6 pb-4
```

**CardTitle:**
```
text-lg font-bold leading-none tracking-tight text-text-main
```

**CardDescription:**
```
text-sm text-text-muted leading-relaxed
```

**CardContent:**
```
p-6 pt-0
```

**CardFooter:**
```
flex items-center p-6 pt-0 gap-3
```

---

### Badge

**Variantes:**

| Variante | Classe |
|----------|--------|
| `default` | `bg-primary/15 text-primary border border-primary/20` |
| `secondary` | `bg-secondary text-secondary-foreground border border-border/50` |
| `destructive` | `bg-error/15 text-error border border-error/20` |
| `outline` | `border-2 border-border text-text-secondary` |
| `success` | `bg-success/15 text-success border border-success/20` |
| `warning` | `bg-warning/15 text-warning border border-warning/20` |

**Estilo base:**
```
inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold
transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1
```

---

### Select

**SelectTrigger:**
```
flex h-11 w-full items-center justify-between whitespace-nowrap
rounded-md border border-border/70 bg-surface/60 px-3.5 py-2
text-sm shadow-sm ring-offset-background cursor-pointer
transition-colors hover:border-border
focus:outline-none focus:border-transparent focus:ring-0
focus:shadow-[0_0_0_0.5px_var(--color-accent-muted)]
```

**SelectContent:**
```
relative z-[200] max-h-(--radix-select-content-available-height)
min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md
border bg-popover text-popover-foreground shadow-md
```

---

### Tabs

**TabsList:**
```
inline-flex h-11 items-center justify-center rounded-lg bg-muted p-1
text-muted-foreground
```

**TabsTrigger:**
```
inline-flex items-center justify-center whitespace-nowrap rounded-md
px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer
transition-all
data-[state=active]:bg-background data-[state=active]:text-foreground
data-[state=active]:shadow
```

---

### Table

**Table:**
```
relative w-full overflow-x-auto rounded-xl border border-border
```

**TableHead:**
```
h-11 px-4 text-left align-middle font-semibold text-text-secondary
sticky top-0 bg-surface z-10
```

**TableRow:**
```
border-b border-border transition-colors duration-150
hover:bg-surface-hover/50 data-[state=selected]:bg-accent/10
```

**TableCell:**
```
px-4 py-3 align-middle
```

---

### PageHeader

**Estrutura:**
```tsx
<PageHeader
  title="Título"
  description="Descrição"
  breadcrumbs={[{ label: "Home", href: "/" }, { label: "Página" }]}
  actions={<Button>Ação</Button>}
/>
```

**Estilo:**
```
mb-6 space-y-2
```

**Título:**
```
text-2xl font-bold text-text-main tracking-tight
```

**Breadcrumb:**
```
flex items-center gap-1 text-xs text-text-muted
```

---

## Layout

### AppLayout

**Sidebar:**
- Largura: `16rem` (256px)
- Largura collapsed: `3.5rem` (56px)

**Header:**
- Fundo: `--color-header-bg` (#1e293b)

### Breakpoints (Mobile-first)

| Breakpoint | Largura |
|------------|---------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

### Safe Area (PWA)

```css
padding-top: env(safe-area-inset-top, 0px);
padding-bottom: env(safe-area-inset-bottom, 0px);
padding-left: env(safe-area-inset-left, 0px);
padding-right: env(safe-area-inset-right, 0px);
```

---

## Formulários

### Padrão React Hook Form + Zod

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
});

function MeuFormulario() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```

### Componentes de Formulário

| Componente | Uso |
|------------|-----|
| `Form` | Provider do React Hook Form |
| `FormField` | Wrapper do Controller |
| `FormItem` | Container do campo (space-y-2) |
| `FormLabel` | Label do campo |
| `FormControl` | Slot para o input |
| `FormDescription` | Descrição do campo |
| `FormMessage` | Mensagem de erro |

---

## Modais

### Padrão Obrigatório

**NUNCA usar alertas nativos:**
- ❌ `window.confirm()`
- ❌ `window.alert()`
- ❌ `window.prompt()`

**SEMPRE usar componentes de modal:**
- ✅ `AlertDialog` - Confirmações de exclusão
- ✅ `Dialog` - Modais de conteúdo genérico

### Padrão de Exclusão

```tsx
const [itemParaDeletar, setItemParaDeletar] = useState<ItemType | null>(null);

// Botão
<button onClick={() => setItemParaDeletar(item)}>
  <Trash2 size={14} />
</button>

// Modal
<AlertDialog open={!!itemParaDeletar} onOpenChange={(o) => !o && setItemParaDeletar(null)}>
  <AlertDialogContent className="bg-card border-border">
    <AlertDialogHeader>
      <AlertDialogTitle>Excluir item?</AlertDialogTitle>
      <AlertDialogDescription>
        Esta ação não pode ser desfeita.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive">
        Excluir
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## Padrões de Utilidade

### Botões de Ação (Tabela)

| Classe | Uso |
|--------|-----|
| `btn-hover-destructive` | Hover vermelho para delete |
| `btn-hover-edit` | Hover azul para editar |
| `btn-hover-neutral` | Hover neutro para ações secundárias |

### Skeleton Loading

```css
.skeleton {
  background: linear-gradient(90deg, var(--color-surface) 25%, var(--color-surface-hover) 50%, var(--color-surface) 75%);
  background-size: 200% 100%;
  animation: var(--animate-shimmer);
  border-radius: var(--radius-md);
}
```

### Gradiente da Marca

```css
.bg-gradient-brand {
  background: linear-gradient(135deg, var(--color-gradient-start) 0%, var(--color-gradient-mid) 40%, var(--color-gradient-end) 70%, var(--color-gradient-start) 100%);
}
```

### Scrollbar Customizada

```css
/* Global */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--color-scrollbar-thumb) transparent;
}

/* Modal */
.scrollbar-modal {
  scrollbar-width: thin;
  scrollbar-color: #475569 transparent;
}
```

### Focus Ring Global

```css
*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

### Modal Inputs Focus

```css
[role="dialog"] input:focus-visible,
[role="alertdialog"] input:focus-visible {
  outline: none;
  box-shadow: 0 0 0 0.5px var(--color-accent);
  border-color: var(--color-accent);
}
```

### Previne Zoom no Focus (Mobile)

```css
@media screen and (max-width: 768px) {
  input, select, textarea {
    font-size: 16px !important;
  }
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Presets de Tema

### Dark Gold (Padrão)

- **Accent:** Gold (#c9a655)
- **Fonte:** Plus Jakarta Sans
- **Uso:** Tema padrão do ERP

### Dark Emerald

- **Accent:** Esmeralda (#10b981)
- **Fonte:** Roboto
- **Uso:** Tema alternativo

### Dark Blue

- **Accent:** Azul
- **Uso:** Tema corporativo

### Light Clean

- **Tema:** Claro
- **Uso:** Modo diurno

---

## Variáveis Globais (Mapas/Heat)

```css
:root {
  --state-exclusive: #d4a843;
  --state-nonexclusive: #b8944a;
  --state-empty: #0f1724;
  --state-empty-fg: #3b5998;
  --map-stroke: #1e2d45;
  --map-stroke-selected: #f0d080;
  --state-glow: drop-shadow(0 0 8px rgba(212, 168, 67, 0.5));
  --heat-1: #0f1724;
  --heat-2: #1a3a6a;
  --heat-3: #2563a0;
  --heat-4: #3b82f6;
  --heat-5: #60a5fa;
}
```

---

## Dependências

| Pacote | Uso |
|--------|-----|
| `tailwindcss` | CSS utility-first |
| `@radix-ui/react-dialog` | Dialog |
| `@radix-ui/react-alert-dialog` | AlertDialog |
| `@radix-ui/react-select` | Select |
| `@radix-ui/react-tabs` | Tabs |
| `@radix-ui/react-label` | Label |
| `@radix-ui/react-slot` | Slot (asChild) |
| `class-variance-authority` | Variantes |
| `clsx` | Classes condicionais |
| `tailwind-merge` | Merge de classes |
| `lucide-react` | Ícones |
| `react-hook-form` | Formulários |
| `@hookform/resolvers` | Validação Zod |
| `zod` | Schema validation |

---

## Referências

- **Arquivo principal:** `src/styles/globals.css`
- **Design System:** `src/design-system/`
- **Tokens:** `src/design-system/tokens/`
- **Componentes:** `src/components/ui/`
- **Utils:** `src/lib/utils.ts` (função `cn`)
