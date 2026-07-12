# Conexão Implantes

Plataforma **B2B de catálogo e vendas** para sistemas de implantes dentários,
componentes protéticos, kits cirúrgicos e pacotes promocionais. Front-end
construído em **React 19 + TanStack Start (Vite 7)** com tema **Dark Gold**
totalmente configurável em tempo real.

> Backend atualmente em **memória** (mocks + `useSyncExternalStore` +
> `localStorage`). Toda a camada de dados foi projetada para migrar para
> **Lovable Cloud (Supabase)** sem alterar a UI — ver
> `src/data/README.md`.

---

## 1. Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | TanStack Start v1 (SSR + file-based routing) |
| Build | Vite 7 |
| UI | React 19 + Tailwind v4 + shadcn/ui |
| Ícones | lucide-react |
| Estado global | `useSyncExternalStore` (`src/data/store.ts`) |
| Persistência local | `localStorage` (carrinho, tema, cupons, frete, social) |
| Rotas | `src/routes/*` (flat dot-convention) |

---

## 2. Estrutura

```
src/
├── components/     UI reutilizável (StoreLayout, AdminLayout, DataTable, ProductSheet…)
├── data/           ÚNICO ponto de acoplamento com o backend
│   ├── database.ts   Tipagem das 24 tabelas relacionais (6 módulos)
│   ├── mock.ts       Dataset inicial em memória
│   ├── repo.ts       Funções assíncronas consumidas pelas rotas
│   ├── store.ts      Mutations + reatividade + regras de cascata
│   ├── crud.ts       Schemas genéricos p/ tabelas auxiliares
│   ├── cart.ts       Carrinho persistente
│   ├── coupons.ts    Cupons de desconto
│   ├── shipping.ts   Frete via ViaCEP
│   ├── promocionais  Pacotes com countdown
│   ├── social.ts     Redes sociais do rodapé
│   └── theme.ts      Tokens de cor (Dark Gold configurável)
├── routes/         File-based routing (loja + /admin/*)
├── hooks/          useCountdown, use-mobile
└── styles.css      Tailwind v4 + tokens semânticos
```

---

## 3. Lógica da plataforma

### 3.1 Cascata Global de Ativação
Se qualquer nível superior está `ativo === false`, **todos os descendentes
somem** da vitrine pública (filtro aplicado em `repo.ts`):

```
Família → Linha → Implante
Família → Abutment → Workflow
Kit.ativo === false
```

O admin continua vendo tudo em `/admin/produtos` (toggle Ativo/Inativo).

### 3.2 Motor de Workflows (Cross-Sell Protético)
`workflows` × `etapas_workflow` × `guias_reabilitacao` mapeiam qual
**acessório** deve ser sugerido em cada **etapa (Moldagem, Prova, Instalação…)**
para cada combinação `família + tipo_abutment + plataforma`. A ficha de
Abutment renderiza a **Sequência Protética** e permite comprar cada item
avulso.

### 3.3 BOM de Kits — Arco Exclusivo
`kit_composicao` tem 5 FKs (`fresa_sku`, `chave_sku`, `acessorio_sku`,
`instrumental_sku`, `implante_sku`) e **exatamente uma** deve estar
preenchida por linha. Validado no modal de cadastro e em `store.ts`.

### 3.4 Timeline de Fresagem (Hard / Soft)
`protocolo_fresagem` guarda a ordem de uso das brocas para osso
**Soft (III-IV)** e **Hard (I-II)**. A ficha do implante renderiza duas
timelines com botão de compra individual por fresa.

### 3.5 UI Dinâmica
- **Famílias** carregam `cor_identificacao` — usada em bordas, chips e
  miniaturas (`ProductThumb`).
- **Tema global** (`/admin/cores`) grava tokens CSS
  (`--color-accent`, `--color-bg`, `--color-text-main`…) em `localStorage`
  e aplica em `:root` — trocas em tempo real, sem reload.

### 3.6 Ficha técnica global
Qualquer clique em produto (loja, admin, carrinho, promocional) abre o
`ProductSheet` global registrado em `__root.tsx`. Campos vazios são
ocultados automaticamente; sem foto, aplica-se placeholder.

### 3.7 Carrinho & Checkout
`cart.ts` persiste em `localStorage`. `/checkout` calcula frete via
**ViaCEP**, aplica cupom, gera protocolo `CX-XXXXXX` (fictício).

---

## 4. Fluxos de navegação (loja)

**Implantes** — `Conexão → Família → Linha → Implante → Ficha`
**Componentes** — `Reabilitação → Família → Abutment → Workflow (Analógico/Digital) → Ficha`
**Kits** — `Categoria de Kit → Kit → BOM`
**Promocionais** — `/catalogo/promocionais → Detalhe com countdown`

Cada nível persiste em query params, então o **BackButton** volta ao nível
anterior do drilldown, não ao início.

---

## 5. Área administrativa

Rotas sob `/admin/*` (todas com `noindex`):

| Rota | Função |
| --- | --- |
| `/admin/produtos` | CRUD de SKUs (Implantes, Componentes, Kits) |
| `/admin/cadastros` | 15 tabelas relacionais auxiliares |
| `/admin/promocionais` | Pacotes com timer regressivo |
| `/admin/cupons` | Cupons percentuais / valor fixo |
| `/admin/frete` | Regras e faixas de frete |
| `/admin/social` | 10 redes sociais do rodapé |
| `/admin/cores` | Tema Dark Gold + presets + color-pickers |
| `/admin/dashboard` | KPIs agregados |
| `/admin/configuracoes` | Preferências gerais |

> Categorias de sistema (**Implantes, Componentes, Kits, Promocionais**)
> são `locked` — só o super admin pode alterar.

---

## 6. Workflow de cadastro (ORDEM OBRIGATÓRIA)

A ordem abaixo respeita as **FKs** do schema. Pular etapas gera erro de
validação nos modais.

### Etapa 0 — Cores & Branding
1. `/admin/cores` → definir paleta.
2. `/admin/social` → publicar redes.

### Etapa 1 — Hierarquia (base de tudo)
Em `/admin/cadastros`:

1. **Categorias** (Implantes, Componentes, Kits — já vêm locked)
2. **Conexões** (ex.: Cone Morse, Hexágono Externo) — FK: categoria
3. **Famílias** (ex.: CM Titamax) — FK: conexão + `cor_identificacao`
4. **Linhas** (ex.: CM Titamax EX) — FK: família + `ativo`

### Etapa 2 — Cirúrgico
5. **Fresas** (`venda_avulsa` opcional)
6. Em `/admin/produtos → + Novo → Implante`:
   - SKU, diâmetro, comprimento, torque, região apical/cervical
   - **Sequência de fresagem Hard** (ordem 1..n)
   - **Sequência de fresagem Soft** (ordem 1..n)
   - Metadados: material, superfície, chave de aperto
   - Imagens (ordem_exibicao)

### Etapa 3 — Protético
7. **Tipos de Reabilitação** (Unitário, Protocolo, Overdenture…)
8. **Tipos de Abutment** (UCLA, Mini-pilar, Munhão…)
9. Em `/admin/produtos → + Novo → Componente`:
   - FK família + reabilitação + tipo_abutment
   - Diâmetro plataforma, angulação, altura transmucoso/corpo, torque

### Etapa 4 — Acessórios & Ferramentas
10. **Categorias de Acessório**
11. **Acessórios** (scan bodies, transferentes, análogos…)
12. **Chaves Ferramentais** (Aperto / Medição / Cirúrgica)
13. **Acessório × Ferramental** (relação obrigatório/opcional)

### Etapa 5 — Instrumentais
14. **Categorias de Instrumental**
15. **Instrumentais Gerais**

### Etapa 6 — Workflows Protéticos (Cross-Sell)
16. **Workflows** (Analógico, Digital)
17. **Etapas do Workflow** (Moldagem, Prova, Instalação, Manutenção…)
18. **Guias de Reabilitação** — vincula `família + tipo_abutment +
    plataforma → workflow → etapa → acessório`. Este é o motor que
    popula a **Sequência Protética** nas fichas de Abutment.

### Etapa 7 — Kits (Arco Exclusivo)
19. **Categorias de Kit**
20. Em `/admin/produtos → + Novo → Kit`:
    - Nome, descrição, categoria, famílias compatíveis
    - **BOM**: adicionar linhas, cada uma com **exatamente uma** FK
      (fresa / chave / acessório / instrumental / implante) + quantidade

### Etapa 8 — Promoções & Comercial
21. `/admin/promocionais` — montar pacote (SKUs + preço + expiração)
22. `/admin/cupons` — códigos %/R\$
23. `/admin/frete` — faixas por CEP

---

## 7. Executar

```bash
bun install
bun run dev       # http://localhost:8080
```

Build:

```bash
bun run build
```

---

## 8. Migração para Lovable Cloud

Ver **`src/data/README.md`**. Resumo:

1. Ativar Lovable Cloud.
2. Criar as 24 tabelas espelhando `database.ts`.
3. Adicionar constraint SQL do **Arco Exclusivo** em `kit_composicao`
   (exatamente 1 FK não-nula por linha).
4. Substituir funções de `repo.ts` por queries Supabase.
5. Remover `store.ts` e usar `queryClient.invalidateQueries`.

Nenhuma página precisa mudar — o contrato de `repo.ts` é estável.
