# Plano de Refatoração — Design System Ultra-Detalhado
**Branch**: `feat/design-system`  
**Tecnologia**: Tailwind CSS v4 (irrevogável)  
**Persistência**: Supabase JSONB (mais leve)  
**Versão**: semver  

---

## Arquitetura

```
Supabase (design_system_global / empresa / modulo)
  ↓ ThemeResolver (merge preset → global → empresa → módulo)
  ↓ DesignSystemProvider (Context + CSS vars :root)
  ↓ Tailwind CSS v4 @theme (tokens via CSS vars)
  ↓ Componentes UI (shadcn/ui — classes Tailwind, sem CSS Modules)
```

---

## Fase 1 — Banco de Dados

### Tabelas

```sql
-- Presets predefinidos
CREATE TABLE design_system_presets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,        -- 'dark-gold','dark-blue','light-clean','dark-emerald'
  nome TEXT NOT NULL,
  versao TEXT NOT NULL DEFAULT '1.0.0',
  tokens JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Config global (Super Admin)
CREATE TABLE design_system_global (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  preset_key TEXT REFERENCES design_system_presets(key),
  tokens_override JSONB DEFAULT '{}',
  versao TEXT NOT NULL DEFAULT '1.0.0',
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX idx_dsg_singleton ON design_system_global ((true));

-- Config por empresa (Admin)
CREATE TABLE design_system_empresa (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  preset_key TEXT REFERENCES design_system_presets(key),
  tokens_override JSONB DEFAULT '{}',
  versao TEXT NOT NULL DEFAULT '1.0.0',
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id)
);

-- Config por módulo (Admin)
CREATE TABLE design_system_modulo (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  modulo_key TEXT NOT NULL,
  tokens_override JSONB DEFAULT '{}',
  versao TEXT NOT NULL DEFAULT '1.0.0',
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, modulo_key)
);
```

### RLS
- Presets: leitura pública, escrita super_admin
- Global: leitura auth, escrita super_admin
- Empresa/Módulo: leitura por empresa_id, escrita admin

---

## Fase 2 — Token Architecture

### Interface Principal (`DesignTokens`)

```typescript
interface DesignTokens {
  meta: { version: string; name: string; };
  colors: {
    // Background
    bg: string; surface: string; surfaceHover: string; card: string;
    // Texto
    textMain: string; textSecondary: string; textMuted: string; textInverted: string;
    // Bordas
    border: string; borderSubtle: string;
    // Accent
    accent: string; accentHover: string; accentFg: string; accentMuted: string;
    gradientStart: string; gradientMid: string; gradientEnd: string;
    // Feedback
    success: string; successBg: string; warning: string; warningBg: string;
    error: string; errorBg: string; info: string; infoBg: string;
    // Misc
    overlay: string; shadow: string; glassTint: string;
    headerBg: string; scrollbarThumb: string; ring: string;
    hoverBg: string; hoverBorder: string; hoverShadow: string;
    // shadcn aliases
    primary: string; primaryForeground: string;
    secondary: string; secondaryForeground: string;
    muted: string; mutedForeground: string;
    destructive: string; destructiveForeground: string;
    popover: string; popoverForeground: string;
    input: string; inputBg: string; inputBorder: string; inputFocus: string;
  };
  typography: {
    fontFamily: string; fontFamilyMono: string;
    fontSizeXs: string; fontSizeSm: string; fontSizeMd: string;
    fontSizeLg: string; fontSizeXl: string; fontSize2xl: string;
    fontWeightLight: number; fontWeightNormal: number; fontWeightMedium: number;
    fontWeightSemibold: number; fontWeightBold: number;
    lineHeightTight: string; lineHeightNormal: string; lineHeightRelaxed: string;
    letterSpacingTight: string; letterSpacingNormal: string; letterSpacingWide: string;
  };
  spacing: Record<'xs'|'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'|'4xl', string>;
  borders: {
    radiusSm: string; radiusMd: string; radiusLg: string;
    radiusXl: string; radiusFull: string;
  };
  shadows: { sm: string; md: string; lg: string; xl: string; glow: string; accentGlow: string; };
  animations: {
    durationFast: string; durationNormal: string; durationSlow: string;
    easingDefault: string; easingBounce: string;
  };
  components: {
    button: { paddingX: string; paddingY: string; fontSize: string; borderRadius: string; };
    input: { paddingX: string; paddingY: string; fontSize: string; borderRadius: string; };
    card: { padding: string; borderRadius: string; shadow: string; };
    modal: { backdropBg: string; borderRadius: string; shadow: string; };
    sidebar: { width: string; collapsedWidth: string; };
    badge: { paddingX: string; paddingY: string; fontSize: string; borderRadius: string; };
  };
}
```

### 4 Presets

| Key | Paleta |
|-----|--------|
| `dark-gold` | #0f172a + #c9a655 (atual) |
| `dark-blue` | #0f172a + #3b82f6 |
| `light-clean` | #fafafa + #6366f1 |
| `dark-emerald` | #0a0a0a + #10b981 |

---

## Fase 3 — Design System Core

### Estrutura

```
src/design-system/
├── index.ts
├── tokens/
│   ├── types.ts
│   ├── resolver.ts           -- merge preset → global → empresa → módulo
│   ├── css-var-map.ts        -- token → CSS var name
│   └── presets/
│       ├── dark-gold.ts
│       ├── dark-blue.ts
│       ├── light-clean.ts
│       └── dark-emerald.ts
├── provider/
│   ├── DesignSystemProvider.tsx  -- substitui ThemeProvider
│   ├── DesignSystemContext.ts
│   └── ModuleDesignProvider.tsx
├── hooks/
│   ├── useDesignSystem.ts
│   ├── useModuleDesign.ts
│   └── useDesignEditor.ts
├── services/
│   ├── design-system.service.ts  -- CRUD Supabase
│   └── design-system.queries.ts  -- React Query
├── components/
│   ├── TokenEditor/
│   │   ├── TokenEditor.tsx
│   │   ├── ColorPicker.tsx
│   │   ├── TypographyEditor.tsx
│   │   ├── PresetSelector.tsx
│   │   └── LivePreview.tsx
│   └── ComponentShowcase.tsx
└── utils/
    ├── token-to-css.ts
    ├── merge-tokens.ts
    └── validate-tokens.ts
```

---

## Fase 4 — Rotas Admin

| Rota | Acesso | Funcionalidade |
|------|--------|----------------|
| `/global/design` | Super Admin | Preset + tokens globais + live preview |
| `/empresa/design` | Admin | Override tokens da empresa |
| `/<modulo>/design` | Admin | Override tokens do módulo |

Módulos com rota de design:
`nps`, `hub`, `crm`, `linktree`, `mapas`, `funis`, `cadastros`, `dashboard`

---

## Fase 5 — Registry & Permissões

### `ModuleDefinition` — novos campos
```typescript
hasDesignConfig?: boolean;
designRoute?: string;
```

### Novas permissões
```
design_system.global.read / write
design_system.empresa.read / write
design_system.modulo.read / write
```

---

## Fase 6 — Templates & Skills

### Skills novas
| Skill | Trigger |
|-------|---------|
| `criar-design-modulo` | "criar design do módulo" |
| `gerar-formulario` | "gerar formulário" |
| `gerar-modal` | "gerar modal" |
| `gerar-pagina` | "gerar página" |
| `aplicar-design-system` | "aplicar design system" |

### CLI Scripts (`package.json`)
```json
"generate:module": "tsx scripts/generate.ts module",
"generate:form": "tsx scripts/generate.ts form",
"generate:modal": "tsx scripts/generate.ts modal",
"generate:page": "tsx scripts/generate.ts page",
"apply:design": "tsx scripts/generate.ts apply-design",
"validate:design": "tsx scripts/validate-design.ts"
```

---

## Fase 7 — Migração Módulos

Ordem por isolamento:

| Prioridade | Módulo |
|------------|--------|
| 1 | `empresas` (Shared Kernel) |
| 2 | `dashboard` |
| 3 | `cadastros` |
| 4 | `crm` |
| 5 | `nps` (migrar nps.tema → nps/design) |
| 6 | `hub` |
| 7-22 | Restantes incrementalmente |

---

## Verificação Final

```bash
npm run build           # zero erros
npm run lint            # zero warnings
npm run validate:design # 100% compliance
```
