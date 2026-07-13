# Links

> Geração de links personalizados: WhatsApp, UTMs, Google Review, Maps, Waze e QR Code

**Key:** `gerador-links` | **Ícone:** `Link` | **Ambientes:** `cadastro, tecnologia`

---

## 1. Core do Módulo

O módulo **Links** permite gerar links personalizados para diversos canais — WhatsApp, UTMs para campanhas de marketing, Google Review, Google Maps, Waze e QR Codes. Cada link gerado pode ser salvo no histórico com suporte a tracking de cliques (redirecionamento via URL encurtada `/r/{id}`). O dashboard exibe métricas como total de cliques, cliques por tipo de link, dispositivos, navegadores, sistemas operacionais e origem dos cliques (referrer). O módulo também suporta templates reutilizáveis de mensagens WhatsApp e presets UTM.

---

## 2. Estrutura do Módulo

```
src/features/gerador-links/
├── module.ts              # Definição do módulo (rotas, permissões, nav items)
├── permissions.ts         # Chaves de permissões e labels dos tipos de link
├── types.ts               # Tipos TypeScript (LinkSalvo, TemplateMensagem, UtmParams, etc.)
├── hooks/
│   ├── useDashboard.ts    # Hook para stats do dashboard
│   ├── useLinks.ts        # Hook para CRUD de links (listar, criar, editar, deletar)
│   └── useTemplates.ts    # Hook para CRUD de templates
├── services/
│   ├── geradores.service.ts    # Funções de geração de URLs (WhatsApp, UTM, Google Review, Maps, Waze)
│   ├── links.service.ts        # Supabase CRUD para tabela gerador_links
│   ├── templates.service.ts    # Supabase CRUD para tabela gerador_templates
│   └── tracking.service.ts     # Tracking de cliques, dashboard stats, CSV export
├── utils/
│   ├── csv.ts             # Export CSV com BOM UTF-8
│   └── userAgent.ts       # Parser de User-Agent (dispositivo, navegador, SO)
└── components/
    ├── DashboardPage.tsx         # Dashboard com gráficos (recharts)
    ├── HistoricoList.tsx         # Lista de links salvos com filtros
    ├── LinkSavedDialog.tsx       # Modal pós-salvar (tracking + QR Code)
    ├── TemplateManager.tsx       # Gerenciamento de templates
    └── sections/
        ├── WhatsappGenerator.tsx    # Gerador wa.me
        ├── UtmGenerator.tsx         # Gerador UTM
        ├── GoogleReviewGenerator.tsx # Gerador Google Review
        ├── GoogleMapsGenerator.tsx   # Gerador Google Maps
        ├── WazeGenerator.tsx         # Gerador Waze
        └── QrCodeGenerator.tsx       # Gerador QR Code
```

| Diretório | Arquivos | Descrição |
|-----------|----------|-----------|
| `components/sections/` | 6 | Geradores individuais de cada tipo de link |
| `components/` | 3 | Dashboard, histórico, dialog de link salvo |
| `services/` | 4 | Lógica de geração e acesso ao Supabase |
| `hooks/` | 3 | React Query hooks para dados |
| `utils/` | 2 | Utilitários (CSV, User-Agent) |

---

## 3. Rotas

| Rota | Componente | Descrição | Acesso |
|------|-----------|-----------|--------|
| `/ferramentas/links` | `DashboardPage` | Dashboard com métricas e gráficos | `lk_ver` |
| `/ferramentas/links/historico` | `HistoricoList` | Histórico de links salvos com filtros | `lk_ver` |
| `/ferramentas/links/templates` | `TemplateManager` | Gerenciamento de templates | `lk_gerenciar_templates` |
| `/ferramentas/links/whatsapp` | `WhatsappGenerator` | Gerador de link WhatsApp | `lk_gerar` |
| `/ferramentas/links/utm` | `UtmGenerator` | Gerador de URL com UTM | `lk_gerar` |
| `/ferramentas/links/google-review` | `GoogleReviewGenerator` | Gerador de link Google Review | `lk_gerar` |
| `/ferramentas/links/maps` | `GoogleMapsGenerator` | Gerador de link Google Maps | `lk_gerar` |
| `/ferramentas/links/waze` | `WazeGenerator` | Gerador de link Waze | `lk_gerar` |
| `/ferramentas/links/qrcode` | `QrCodeGenerator` | Gerador de QR Code | `lk_gerar` |

---

## 4. Permissões

| Chave | Label | Descrição | Grupo |
|-------|-------|-----------|-------|
| `lk_ver` | Ver módulo | Visualizar o módulo de links | Links |
| `lk_gerar` | Gerar links | Gerar qualquer tipo de link | Links |
| `lk_salvar` | Salvar links | Salvar links no histórico | Links |
| `lk_editar` | Editar links | Editar links salvos no histórico | Links |
| `lk_excluir` | Excluir links | Excluir links do histórico | Links |
| `lk_gerenciar_templates` | Gerenciar templates | CRUD de templates de mensagem/UTM | Links |

---

## 5. Defaults por Papel

| Permissão | Cadastro | Consultor | Tecnologia | Suporte |
|-----------|----------|-----------|------------|---------|
| `lk_ver` | ✅ | ✅ | ✅ | ❌ |
| `lk_gerar` | ✅ | ✅ | ✅ | ❌ |
| `lk_salvar` | ✅ | ❌ | ✅ | ❌ |
| `lk_editar` | ✅ | ❌ | ✅ | ❌ |
| `lk_excluir` | ✅ | ❌ | ✅ | ❌ |
| `lk_gerenciar_templates` | ✅ | ❌ | ✅ | ❌ |

---

## 6. Navegação (Sidebar)

| ID | Label | Rota | Ícone | Permissão | Ordem |
|----|-------|------|-------|-----------|-------|
| `gerador-links-dashboard` | Dashboard | `/ferramentas/links` | `BarChart3` | `lk_ver` | 10 |
| `gerador-links-historico` | Histórico | `/ferramentas/links/historico` | `History` | `lk_ver` | 15 |
| `gerador-links-templates` | Templates | `/ferramentas/links/templates` | `LayoutTemplate` | `lk_gerenciar_templates` | 16 |
| `gerador-links-whatsapp` | WhatsApp | `/ferramentas/links/whatsapp` | `MessageCircle` | `lk_gerar` | 20 |
| `gerador-links-utm` | UTM | `/ferramentas/links/utm` | `Link` | `lk_gerar` | 30 |
| `gerador-links-google-review` | Google Review | `/ferramentas/links/google-review` | `Star` | `lk_gerar` | 40 |
| `gerador-links-maps` | Google Maps | `/ferramentas/links/maps` | `MapPin` | `lk_gerar` | 50 |
| `gerador-links-waze` | Waze | `/ferramentas/links/waze` | `Navigation` | `lk_gerar` | 60 |
| `gerador-links-qrcode` | QR Code | `/ferramentas/links/qrcode` | `QrCode` | `lk_gerar` | 70 |

---

## 7. Tipos de Link Gerados

| Tipo | Função Geradora | URL de Exemplo | Descrição |
|------|-----------------|----------------|-----------|
| `whatsapp` | `gerarWhatsApp(telefone, mensagem?)` | `https://wa.me/5511999999999?text=Olá` | Link direto para WhatsApp com mensagem |
| `utm` | `gerarUtm(params)` | `https://exemplo.com?utm_source=google&utm_medium=cpc` | URL com parâmetros UTM |
| `google_review` | `gerarGoogleReview(placeId)` | `https://search.google.com/local/writereview?placeid=...` | Link direto para avaliação Google |
| `google_maps` | `gerarGoogleMaps(lat, lng, nome?)` | `https://www.google.com/maps/dir/?api=1&destination=lat,lng` | Rota Google Maps |
| `waze` | `gerarWaze(lat, lng)` | `https://www.waze.com/ul?ll=lat,lng&navigate=yes` | Rota Waze |
| `qrcode` | N/A (renderizado via `qrcode.react`) | — | QR Code gerado em tela (canvas) |

---

## 8. Tracking de Cliques

- Cada link salvo recebe uma URL de tracking no formato `/r/{linkId}`
- Quando acessada, a rota `/r/{linkId}` registra o clique na tabela `gerador_link_cliques` via RPC `registrar_clique`
- Dados coletados: data/hora, User-Agent, IP, Referrer
- Dashboard exibe: cliques por dia, por tipo de link, top links, dispositivos, navegadores, SO e origem

### User-Agent Parsing

O módulo possui parser próprio em `utils/userAgent.ts` que identifica:
- **Dispositivo:** mobile, tablet, desktop, unknown
- **Navegador:** Chrome, Safari, Firefox, Edge, Opera, Samsung Internet
- **SO:** Android, iOS, Windows, macOS, Linux

---

## 9. Funcionalidades

| Flag | Ativo | Detalhe |
|------|-------|---------|
| Design Config | ❌ | — |
| Credenciais | ❌ | — |
| Laboratório | ❌ | — |
| Formulário | ❌ | — |
| Ações Customizadas | ❌ | — |
| API Connectors | ❌ | — |
| Export CSV | ✅ | Dashboard e cliques individuais |
| QR Code | ✅ | Geração via `qrcode.react` com download PNG |
| Templates | ✅ | Reutilizáveis por tipo (whatsapp_msg, utm_preset) |

---

## 10. Tabelas do Banco de Dados

| Tabela | Uso |
|--------|-----|
| `gerador_links` | Links salvos (empresa_id, tipo, titulo, url_gerada, params JSON) |
| `gerador_templates` | Templates de mensagem/preset UTM (empresa_id, tipo, conteudo JSON) |
| `gerador_link_cliques` | Cliques registrados (link_id, clique_em, user_agent, ip, ref) |

### `gerador_links`

```sql
CREATE TABLE gerador_links (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id  UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  tipo        TEXT NOT NULL,
  titulo      TEXT NOT NULL,
  url_gerada  TEXT NOT NULL,
  params      JSONB DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` | PK |
| `empresa_id` | `uuid` | FK → `empresas(id)` |
| `tipo` | `text` | Tipo do link (whatsapp, utm, google_review, google_maps, waze, qrcode) |
| `titulo` | `text` | Título descritivo do link |
| `url_gerada` | `text` | URL final gerada |
| `params` | `jsonb` | Parâmetros usados na geração (ex: telefone, mensagem, lat, lng, etc.) |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

### `gerador_templates`

```sql
CREATE TABLE gerador_templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id  UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  tipo        TEXT NOT NULL,
  nome        TEXT NOT NULL,
  conteudo    JSONB DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` | PK |
| `empresa_id` | `uuid` | FK → `empresas(id)` |
| `tipo` | `text` | Tipo do template (whatsapp_msg, utm_preset) |
| `nome` | `text` | Nome do template |
| `conteudo` | `jsonb` | Conteúdo (ex: { telefone, mensagem } para WhatsApp) |
| `created_at` | `timestamptz` | Data de criação |

### `gerador_link_cliques`

```sql
CREATE TABLE gerador_link_cliques (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id     UUID NOT NULL REFERENCES gerador_links(id) ON DELETE CASCADE,
  clique_em   TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_agent  TEXT,
  ip          TEXT,
  ref         TEXT
);
```

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` | PK |
| `link_id` | `uuid` | FK → `gerador_links(id)` |
| `clique_em` | `timestamptz` | Data/hora do clique |
| `user_agent` | `text` | User-Agent do navegador |
| `ip` | `text` | Endereço IP |
| `ref` | `text` | Referrer (origem do clique) |

---

## 11. Dependências

### Bibliotecas Externas

| Biblioteca | Uso |
|------------|-----|
| `qrcode.react` | Geração de QR Code no navegador |
| `recharts` | Gráficos do dashboard (PieChart, BarChart) |
| `lucide-react` | Icones do módulo |

### Módulos do Sistema

| Módulo | Relação |
|--------|---------|
| `core/supabase` | Conexão com Supabase via `~/core/supabase` |
| `registry` | Registro de módulo, permissões e nav items |
| `lib/auth` | Hook `useAuth` para permissões e profile |
| `components/ui` | PageHeader, Card, Input, Button, Skeleton, EmptyState |
| `components/shared` | `EmpresaSuperAdminSelector`, `useEmpresaSuperAdmin` |

### Migrações

| Migration | Descrição |
|-----------|-----------|
| `20260701000000_gerador_links_module.sql` | Criação do módulo (tabelas gerador_links, gerador_templates, gerador_link_cliques) |
| `20260701000001_gerador_links_tracking.sql` | Função RPC `registrar_clique` e RLS policies |

---

## 12. Notas

- O módulo não possui design config (tema customizável)
- O dashboard usa `recharts` para gráficos — PieChart para tipos de link e dispositivos, BarChart para cliques por dia
- O export CSV inclui BOM UTF-8 para compatibilidade com Excel
- Templates são específicos por empresa (multi-tenant via `empresa_id`)
- O parser de User-Agent é próprio (não usa biblioteca externa)
- Tracking de cliques requer que o link tenha sido salvo (apenas links com `id` no banco geram URL de tracking)
- Super Admin pode visualizar dados de qualquer empresa via `EmpresaSuperAdminSelector`
