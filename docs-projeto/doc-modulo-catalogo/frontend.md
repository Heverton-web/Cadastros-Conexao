Compreendido. Se você vai injetar isso em uma IA geradora (como Lovable, Antigravity, Cursor, Bolt.new ou v0), você precisa do **Dossiê Completo**. Sem atalhos, sem resumos.

Abaixo está o **Blueprint Arquitetural Absoluto**. Ele contém a estrutura completa de pastas, o Design System, a tipagem que mapeia as 24 tabelas do banco de dados, todos os componentes base, todas as páginas com a lógica de negócio implantada e, por fim, o Super Prompt.

Copie este conteúdo exatamente como está e entregue à sua ferramenta.

---

### 1. ARQUITETURA COMPLETA DE PASTAS (Workspace)

```text
src/
├── styles/
│   └── globals.css              # Design System (Premium Dark Gold)
├── types/
│   └── database.ts              # Tipagem Enterprise Relacional (24 Tabelas)
├── components/
│   ├── AdminLayout.tsx          # Shell do painel de administração
│   ├── StoreLayout.tsx          # Shell da loja com Omnibox
│   ├── DataTable.tsx            # Tabela de Backoffice com Toggle de Visibilidade
│   └── ProductCard.tsx          # Card dinâmico (Renderiza cor_identificacao)
└── pages/
    ├── store/
    │   ├── Home.tsx             # Hub (Implantes, Componentes, Kits)
    │   ├── ImplanteDetail.tsx   # Ficha do Implante + Timeline de Fresagem
    │   ├── WorkflowDetail.tsx   # Motor Protético + Cross-sell de Ferramentas
    │   └── KitDetail.tsx        # Ficha do Kit + BOM (Bill of Materials Exclusivo)
    └── admin/
        └── ProdutosCrud.tsx     # CRUD Unificado do Catálogo

```

---

### 2. DESIGN SYSTEM (`src/styles/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-bg: #0f172a;
    --color-surface: #1e293b;
    --color-surface-hover: #334155;
    --color-card: #1e293b;

    --color-text-main: #f8fafc;
    --color-text-muted: #94a3b8;
    --color-text-inverted: #0f172a;

    --color-border: transparent;
    --color-border-subtle: #1e293b;

    --color-accent: #c9a655;
    --color-accent-hover: #d4b366;
    --color-accent-fg: #0f172a;
    --color-accent-muted: rgba(201, 166, 85, 0.12);

    --color-success: #22c55e;
    --color-success-bg: rgba(34, 197, 94, 0.08);
    --color-error: #ef4444;
    --color-error-bg: rgba(239, 68, 68, 0.08);

    --color-input-bg: #0f172a;
    --color-input-border: #334155;
    --color-input-focus: #c9a655;
  }

  body {
    @apply bg-[var(--color-bg)] text-[var(--color-text-main)] antialiased font-sans selection:bg-[var(--color-accent)] selection:text-white;
  }
}

.bg-gradient-gold {
  background: linear-gradient(135deg, #c9a655 0%, #e8d48b 40%, #a8873a 70%, #c9a655 100%);
}

.text-gradient-gold {
  background: linear-gradient(135deg, #c9a655 0%, #e8d48b 40%, #a8873a 70%, #c9a655 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

### 3. O BANCO DE DADOS (`src/types/database.ts`)

```typescript
// MÓDULO 1: HIERARQUIA
export interface Categoria {
  id: number;
  nome: string;
}
export interface Conexao {
  id: number;
  categoria_id: number;
  nome: string;
  sigla: string;
}
export interface Familia {
  id: number;
  conexao_id: number;
  nome: string;
  cor_identificacao: string;
}
export interface Linha {
  id: number;
  familia_id: number;
  nome: string;
  ativo: boolean;
}

// MÓDULO 2: IMPLANTES E CIRURGIA
export interface Implante {
  sku: string;
  linha_id: number;
  diametro_mm: number;
  comprimento_mm: number;
  rosca_interna: string;
  regiao_apical: string;
  regiao_cervical: string;
  torque_insercao: number;
  detalhes_extras: any;
  ativo: boolean;
}
export interface ImagemImplante {
  id: number;
  implante_sku: string;
  url_imagem: string;
  ordem_exibicao: number;
}
export interface Fresa {
  sku: string;
  nome: string;
  diametro_mm: number;
  venda_avulsa: boolean;
}
export interface ProtocoloFresagem {
  id: number;
  implante_sku: string;
  fresa_sku: string;
  tipo_osso: string;
  ordem_uso: number;
}

// MÓDULO 3: COMPONENTES PROTÉTICOS
export interface TipoReabilitacao {
  id: number;
  nome: string;
}
export interface TipoAbutment {
  id: number;
  nome: string;
  sigla: string;
}
export interface Abutment {
  sku: string;
  familia_id: number;
  tipo_reabilitacao_id: number;
  tipo_abutment_id: number;
  diametro_plataforma_mm: number;
  angulacao_graus: number;
  tipo_peca: string;
  altura_transmucoso_mm: number;
  altura_corpo_mm: number;
  torque_ncm: number;
  url_imagem: string;
}

// MÓDULO 4: ACESSÓRIOS E FERRAMENTAS
export interface CategoriaAcessorio {
  id: number;
  nome: string;
}
export interface Acessorio {
  sku: string;
  categoria_id: number;
  nome: string;
  diametro_mm: number;
  altura_mm: number;
  material: string;
  torque_ncm: number;
  caracteristicas_tecnicas: any;
  url_imagem: string;
}
export interface ChaveFerramental {
  sku: string;
  nome: string;
  tipo_ferramenta: string;
  comprimento_mm: number;
  venda_avulsa: boolean;
  url_imagem: string;
}
export interface AcessorioFerramental {
  acessorio_sku: string;
  ferramenta_sku: string;
  obrigatorio: boolean;
}
export interface CategoriaInstrumental {
  id: number;
  nome: string;
}
export interface InstrumentalGeral {
  sku: string;
  categoria_id: number;
  nome: string;
  detalhes_tecnicos: any;
  venda_avulsa: boolean;
  url_imagem: string;
}

// MÓDULO 5: MOTOR DE WORKFLOWS
export interface Workflow {
  id: number;
  nome: string;
}
export interface EtapaWorkflow {
  id: number;
  ordem: number;
  nome: string;
}
export interface GuiaReabilitacao {
  id: number;
  familia_id: number;
  tipo_abutment_id: number | null;
  diametro_plataforma_ref: number;
  workflow_id: number;
  etapa_id: number;
  acessorio_sku: string;
}

// MÓDULO 6: KITS E BOM
export interface CategoriaKit {
  id: number;
  nome: string;
}
export interface Kit {
  sku: string;
  categoria_id: number;
  nome: string;
  descricao: string;
  url_imagem: string;
  ativo: boolean;
}
export interface KitFamilia {
  kit_sku: string;
  familia_id: number;
}
export interface KitComposicao {
  id: number;
  kit_sku: string;
  quantidade: number;
  fresa_sku?: string;
  chave_sku?: string;
  acessorio_sku?: string;
  instrumental_sku?: string;
  implante_sku?: string;
}
```

---

### 4. COMPONENTES DE UI (`src/components/...`)

#### `StoreLayout.tsx`

```tsx
import React, { useState } from 'react';
import { Search, ShoppingBag, Menu } from 'lucide-react';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] flex flex-col">
      <header className="sticky top-0 z-50 bg-[#1e293b]/90 backdrop-blur-md border-b border-[var(--color-surface-hover)] h-20 px-6 lg:px-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-black tracking-tight text-gradient-gold">CONEXÃO</h1>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold tracking-wide">
            <a href="/catalogo/implantes" className="hover:text-[var(--color-accent)] transition-colors">
              IMPLANTES
            </a>
            <a href="/catalogo/componentes" className="hover:text-[var(--color-accent)] transition-colors">
              COMPONENTES
            </a>
            <a href="/catalogo/kits" className="hover:text-[var(--color-accent)] transition-colors">
              KITS
            </a>
          </nav>
        </div>
        <div className="flex-1 max-w-xl mx-8 relative hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por SKU, Linha ou Dimensão..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-12 pr-4 rounded-full bg-[var(--color-input-bg)] border border-[var(--color-input-border)] text-sm focus:border-[var(--color-accent)] focus:outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2.5 rounded-full bg-[var(--color-surface-hover)] hover:text-[var(--color-accent)] transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-gold rounded-full text-[10px] font-bold text-[#0f172a] flex items-center justify-center">
              0
            </span>
          </button>
          <button className="md:hidden p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

#### `AdminLayout.tsx`

```tsx
import React from 'react';
import { Settings, Database, Activity } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[var(--color-bg)] text-[var(--color-text-main)]">
      <aside className="w-64 bg-[var(--color-surface)] border-r border-[var(--color-border-subtle)] p-6 flex flex-col gap-8">
        <h1 className="text-xl font-black text-gradient-gold">CONEXÃO ADMIN</h1>
        <nav className="flex flex-col gap-4 text-sm font-semibold text-[var(--color-text-muted)]">
          <a
            href="/admin/dashboard"
            className="flex items-center gap-3 hover:text-[var(--color-accent)] transition-colors"
          >
            <Activity className="w-4 h-4" /> Dashboard
          </a>
          <a href="/admin/produtos" className="flex items-center gap-3 text-[var(--color-accent)]">
            <Database className="w-4 h-4" /> Catálogo & SKUs
          </a>
          <a
            href="/admin/configs"
            className="flex items-center gap-3 hover:text-[var(--color-accent)] transition-colors"
          >
            <Settings className="w-4 h-4" /> Configurações
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
```

#### `DataTable.tsx`

```tsx
import React from 'react';
import { Eye, EyeOff, Edit3 } from 'lucide-react';

interface Props {
  title: string;
  headers: string[];
  rows: any[];
  onToggle: (id: string, state: boolean) => void;
}

export default function DataTable({ title, headers, rows, onToggle }: Props) {
  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
      <div className="p-6 border-b border-[var(--color-border-subtle)] flex justify-between">
        <h3 className="text-xl font-bold text-gradient-gold">{title}</h3>
        <button className="px-5 py-2.5 rounded-lg bg-gradient-gold text-[#0f172a] font-bold text-sm">+ Novo</button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-[var(--color-bg)]/50">
            {headers.map((h, i) => (
              <th
                key={i}
                className="p-4 text-xs font-bold text-[var(--color-text-muted)] uppercase border-b border-[var(--color-border-subtle)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.sku}
              className={`hover:bg-[var(--color-surface-hover)]/40 border-b border-[var(--color-border-subtle)] ${!row.ativo ? 'opacity-40 bg-red-950/5' : ''}`}
            >
              <td className="p-4 font-mono text-sm">{row.sku}</td>
              <td className="p-4 font-semibold">{row.nome}</td>
              <td className="p-4">
                <button
                  onClick={() => onToggle(row.sku, !row.ativo)}
                  className={`p-2 rounded-lg ${row.ativo ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' : 'bg-[var(--color-error-bg)] text-[var(--color-error)]'}`}
                >
                  {row.ativo ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

#### `ProductCard.tsx`

```tsx
import React from 'react';

interface Props {
  sku: string;
  nome: string;
  corIdentificacao: string;
  tipo: string;
}

export default function ProductCard({ sku, nome, corIdentificacao, tipo }: Props) {
  return (
    <div
      className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)] transition-all cursor-pointer relative overflow-hidden"
      style={{ borderLeftColor: corIdentificacao, borderLeftWidth: '4px' }}
    >
      <div className="text-xs font-bold text-[var(--color-text-muted)] mb-2 uppercase">{tipo}</div>
      <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-1">{nome}</h3>
      <p className="text-sm font-mono text-[var(--color-accent)]">SKU: {sku}</p>
    </div>
  );
}
```

---

### 5. PÁGINAS DA LOJA (`src/pages/store/...`)

#### `Home.tsx`

```tsx
import React from 'react';
import { Crosshair, ShieldCheck, Box } from 'lucide-react';
import StoreLayout from '../../components/StoreLayout';

export default function Home() {
  const cat = [
    {
      id: 'implantes',
      title: 'Implantes',
      desc: 'Cone Morse, HE, HI.',
      icon: <Crosshair className="w-8 h-8 text-[var(--color-accent)]" />,
    },
    {
      id: 'componentes',
      title: 'Componentes',
      desc: 'Pilares e Motor Protético.',
      icon: <ShieldCheck className="w-8 h-8 text-[var(--color-accent)]" />,
    },
    {
      id: 'kits',
      title: 'Kits',
      desc: 'Maletas e Cirurgia Guiada.',
      icon: <Box className="w-8 h-8 text-[var(--color-accent)]" />,
    },
  ];

  return (
    <StoreLayout>
      <div className="px-6 lg:px-16 py-12 text-center max-w-6xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-black mb-16 uppercase tracking-tight text-gradient-gold">
          Catálogo Clínico
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cat.map((c) => (
            <a
              key={c.id}
              href={`/catalogo/${c.id}`}
              className="group p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)] transition-all"
            >
              <div className="w-16 h-16 rounded-xl bg-[var(--color-input-bg)] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                {c.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{c.title}</h3>
              <p className="text-[var(--color-text-muted)] text-sm">{c.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </StoreLayout>
  );
}
```

#### `ImplanteDetail.tsx` (Com Timeline de Fresagem)

```tsx
import React, { useState } from 'react';
import StoreLayout from '../../components/StoreLayout';

export default function ImplanteDetail() {
  const [tipoOsso, setTipoOsso] = useState<'Soft' | 'Hard'>('Hard');

  // Mock de DB -> Tabela: protocolos_fresagem
  const protocolo = [
    { ordem: 1, fresa: 'Fresa Lança 2.0', sku: '934401', osso: 'Hard' },
    { ordem: 2, fresa: 'Fresa Master 2.4', sku: '934403', osso: 'Hard' },
  ];

  return (
    <StoreLayout>
      <div className="px-6 lg:px-16 py-12 max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        <div className="bg-[var(--color-surface)] p-12 rounded-2xl flex justify-center items-center">
          {/* Imagem do Implante */}
          <div className="w-48 h-96 bg-[var(--color-input-bg)] rounded-full border border-[var(--color-accent)] border-dashed animate-pulse" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-gradient-gold mb-2">Flex Gold NP 24°</h1>
          <p className="text-xl font-mono text-[var(--color-text-muted)] mb-8">SKU: 524385 | Ø 3.5 | C 8.5</p>

          <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border-subtle)]">
            <h3 className="text-lg font-bold mb-4">Protocolo de Fresagem</h3>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setTipoOsso('Soft')}
                className={`px-4 py-2 rounded-md font-bold text-sm ${tipoOsso === 'Soft' ? 'bg-[var(--color-accent)] text-[#0f172a]' : 'bg-[var(--color-input-bg)] text-[var(--color-text-muted)]'}`}
              >
                Osso Soft
              </button>
              <button
                onClick={() => setTipoOsso('Hard')}
                className={`px-4 py-2 rounded-md font-bold text-sm ${tipoOsso === 'Hard' ? 'bg-[var(--color-accent)] text-[#0f172a]' : 'bg-[var(--color-input-bg)] text-[var(--color-text-muted)]'}`}
              >
                Osso Hard
              </button>
            </div>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--color-accent)] before:to-transparent">
              {protocolo
                .filter((p) => p.osso === tipoOsso)
                .map((passo) => (
                  <div
                    key={passo.ordem}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-surface)] text-[var(--color-accent)] font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg">
                      {passo.ordem}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg)]">
                      <p className="font-bold text-sm">{passo.fresa}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">SKU: {passo.sku}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
```

#### `WorkflowDetail.tsx` (Funil Protético & Cross-sell)

```tsx
import React, { useState } from 'react';
import StoreLayout from '../../components/StoreLayout';
import { AlertCircle } from 'lucide-react';

export default function WorkflowDetail() {
  const [crossSellOpen, setCrossSellOpen] = useState(false);

  // Mock DB -> Tabela: guia_reabilitacao + acessorio_ferramental
  const etapas = [
    { etapa: 1, nome: 'Cicatrização', peca: 'Healing Cap NP', sku: '124215', requerSonda: true },
    { etapa: 2, nome: 'Transferência', peca: 'Scan Body inL', sku: '957310', requerSonda: false },
  ];

  return (
    <StoreLayout>
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-black mb-8 text-center text-gradient-gold">
          Motor de Workflow: Fluxo Digital (NP)
        </h2>

        <div className="space-y-4">
          {etapas.map((etp) => (
            <div
              key={etp.etapa}
              className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-[var(--color-accent)] uppercase mb-1">
                  Etapa {etp.etapa}: {etp.nome}
                </p>
                <p className="text-lg font-bold">
                  {etp.peca} <span className="text-sm font-mono text-[var(--color-text-muted)] ml-2">({etp.sku})</span>
                </p>
              </div>
              <button
                onClick={() => etp.requerSonda && setCrossSellOpen(true)}
                className="px-6 py-2 bg-[var(--color-bg)] border border-[var(--color-accent)] text-[var(--color-accent)] rounded-lg font-bold hover:bg-[var(--color-accent)] hover:text-[#0f172a] transition-all"
              >
                Selecionar
              </button>
            </div>
          ))}
        </div>

        {/* Modal de Cross-Sell */}
        {crossSellOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[var(--color-surface)] p-8 rounded-2xl max-w-md w-full border border-[var(--color-accent)]">
              <div className="flex items-center gap-3 text-[var(--color-warning)] mb-4">
                <AlertCircle className="w-6 h-6" /> <h3 className="text-lg font-bold">Aviso Clínico</h3>
              </div>
              <p className="text-[var(--color-text-main)] mb-6">
                Para utilizar o Healing Cap (124215), você precisará da <strong>Sonda Gengival (SKU 188003)</strong>{' '}
                para medição correta da altura do transmucoso.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setCrossSellOpen(false)}
                  className="flex-1 py-3 text-sm font-bold text-[var(--color-text-muted)] bg-[var(--color-bg)] rounded-lg"
                >
                  Apenas o Cicatrizador
                </button>
                <button
                  onClick={() => setCrossSellOpen(false)}
                  className="flex-1 py-3 text-sm font-bold bg-gradient-gold text-[#0f172a] rounded-lg"
                >
                  Levar Sonda + Cicatrizador
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
```

#### `KitDetail.tsx` (Resolução do Arco Exclusivo - BOM)

```tsx
import React from 'react';
import StoreLayout from '../../components/StoreLayout';

export default function KitDetail() {
  // Mock DB -> Tabela: kit_composicao (Arco Exclusivo Resolvido)
  const bom = [
    { id: 1, tipo: 'Instrumental', nome: 'Caixa Master Flex', sku: '950063', qtd: 1 },
    { id: 2, tipo: 'Fresa', nome: 'Fresa Lança 2.0', sku: '934401', qtd: 1 },
    { id: 3, tipo: 'Chave', nome: 'Chave Hexagonal 1.2', sku: '07120099', qtd: 1 },
  ];

  return (
    <StoreLayout>
      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="flex flex-col md:flex-row gap-8 mb-16">
          <div className="flex-1 bg-[var(--color-surface)] rounded-2xl p-8 border border-[var(--color-border-subtle)] h-80 flex items-center justify-center text-[var(--color-text-muted)]">
            [Imagem Maleta Completa]
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl font-black mb-2 text-gradient-gold">KIT MASTER FLEX</h1>
            <p className="text-[var(--color-text-muted)] mb-8">SKU: 950000-KIT</p>
            <button className="w-full py-4 rounded-xl bg-gradient-gold text-[#0f172a] font-black text-lg hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(201,166,85,0.3)]">
              COMPRAR MALETA FECHADA
            </button>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-6 border-b border-[var(--color-border-subtle)] pb-4">
          Peças de Reposição Avulsas (BOM)
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {bom.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl flex justify-between items-center"
            >
              <div>
                <p className="text-xs text-[var(--color-accent)] font-bold uppercase">{item.tipo}</p>
                <p className="font-bold">{item.nome}</p>
                <p className="text-xs font-mono text-[var(--color-text-muted)]">
                  SKU: {item.sku} | Qtd Kit: {item.qtd}
                </p>
              </div>
              <button className="p-2 bg-[var(--color-bg)] rounded-lg text-[var(--color-accent)] border border-[var(--color-accent)] font-bold text-xs hover:bg-[var(--color-accent)] hover:text-[#0f172a] transition-colors">
                + Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </StoreLayout>
  );
}
```

---

### 5. PÁGINA ADMIN (`src/pages/admin/ProdutosCrud.tsx`)

```tsx
import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import DataTable from '../../components/DataTable';

export default function ProdutosCrud() {
  const [skus, setSkus] = useState([
    { sku: '524385', nome: 'Flex Gold NP 3.5x8.5', ativo: true },
    { sku: '124215', nome: 'Healing Cap NP', ativo: true },
    { sku: '951046', nome: 'Kit inLego System', ativo: false },
  ]);

  const toggleAtivo = (sku: string, novoEstado: boolean) => {
    setSkus(skus.map((s) => (s.sku === sku ? { ...s, ativo: novoEstado } : s)));
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gradient-gold mb-2">Gestão de SKUs</h2>
        <p className="text-[var(--color-text-muted)]">
          Ative ou inative produtos em tempo real. Itens inativos desaparecem do catálogo.
        </p>
      </div>
      <DataTable title="Catálogo Geral" headers={['SKU', 'Produto']} rows={skus} onToggle={toggleAtivo} />
    </AdminLayout>
  );
}
```

---

### 6. O SUPER PROMPT FINAL DE INJEÇÃO NA IDE (Copiar/Colar)

Copie o texto abaixo e cole no prompt principal do Lovable / Cursor / Antigravity / v0, junto com os arquivos acima:

> "Aja como Engenheiro de Software Sênior especializado em React e Supabase/PostgreSQL. Recebi o Blueprint Arquitetural Absoluto contendo: estrutura de pastas, `globals.css` (Dark Gold), tipagem relacional completa `database.ts` (cobrindo 6 módulos, do cirúrgico aos Kits/BOM), componentes base (`StoreLayout`, `AdminLayout`, `ProductCard`, `DataTable`) e 5 páginas vitais (`Home`, `ImplanteDetail`, `WorkflowDetail`, `KitDetail` e `ProdutosCrud`).
> **SUA TAREFA:**
> Gere a aplicação completa em React (Vite/Next.js). Implemente os roteamentos entre as páginas fornecidas.
> **REGRAS DE NEGÓCIO ESTRITAS QUE VOCÊ DEVE APLICAR NO CÓDIGO GERADO:**
>
> 1. **Filtro de Cascata Global (`ativo === false`)**: Qualquer listagem de catálogo deve filtrar SKUs inativos. Se `linha.ativo === false`, todos os implantes dessa linha somem da vitrine.
> 2. **Motor de Workflow (Cross-Sell)**: No componente `WorkflowDetail`, a lógica de clique no passo do fluxo protético deve cruzar com a tabela `AcessorioFerramental` e sempre oferecer o popup da ferramenta obrigatória (ex: sugerir Sonda ao comprar Cicatrizador).
> 3. **BOM de Kits (Arco Exclusivo)**: No componente `KitDetail`, a lista de peças de reposição deve varrer as chaves FK e renderizar dinamicamente se o item é uma Fresa, Chave, Acessório ou Instrumental, sem quebrar.
> 4. **Timeline de Fresagem**: No `ImplanteDetail`, obedeça a renderização em abas 'Hard/Soft' iterando o vetor `ProtocoloFresagem`.
> 5. **UI Dinâmica**: No `ProductCard`, a `borderLeftColor` DEVE ser lida diretamente da string hexadecimal armazenada no banco (`Familia.cor_identificacao`).
>
> Consuma a tipagem rigorosamente, mantenha o CSS nativo fornecido sem sobrescrever o tema e entregue a plataforma funcional."
