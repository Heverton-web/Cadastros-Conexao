# cadastros-conexao — Plano de Execução

## Stack

| Camada | Tecnologia |
|--------|------------|
| Nome do Projeto | **cadastros-conexao** |
| Framework | TanStack Start (React Router) |
| Estilo | Tailwind CSS + shadcn/ui |
| Design System | Conexão Implantes (dark navy + gold accent) |
| Database/Auth | Supabase |
| Deploy | `cadastros.vpsconexao.org` (VPS ou Vercel — **a confirmar**) |
| Abordagem | **Mobile-First** (PWA-ready, touch-first, responsivo progressivo) |

## Mobile-First — Princípios Norteadores

A aplicação é construída **primordialmente para uso mobile** (acesso via celular por corretores/consultores em campo). Desktop é aprimoramento progressivo.

### Regras Fixas

1. **Touch-first** — botões com `min-height: 44px`, alvos de toque ≥48px, gestos de swipe onde fizer sentido
2. **Bottom Navigation** — navegação principal na barra inferior (não sidebar), seguindo padrão iOS/Android
3. **Sheet em vez de Modal** — telas secundárias abrem como `Drawer`/`Sheet` de baixo para cima (padrão mobile nativo)
4. **DataTable vira Card List** — em mobile, tabelas se transformam em lista de cards vertical
5. **Kanban vira Lista Horizontal** — kanban drag-and-drop em mobile vira swipe horizontal entre estágios ou ação "Mover estágio" via select
6. **Formulários single-column** — um campo por linha, botão fixo no fundo (sticky footer CTA)
7. **Snackbar/Toast** — feedback sempre via toast no topo ou snackbar no fundo, nunca popup
8. **Header compacto** — header com no máximo 56px, título + botão voltar + ação principal no máximo
9. **PWA** — service worker para funcionamento offline parcial, `manifest.json` com ícones do favicon
10. **Pull-to-refresh** — recarregar dados com gesto de puxar para baixo nas listas

## Escopo de Telas

```
/login              → Login (email+senha)
/recuperar          → Reset de senha
/dashboard          → Overview (gráficos, totais)
/contratos          → Lista com DataTable + search + filters
/contratos/novo     → Formulário de criação
/contratos/:id      → Detalhe + edição
/leads              → Kanban board (arrastável)
/leads/novo         → Formulário de criação
/leads/:id          → Detalhe + timeline
/pacientes          → Lista com busca
/pacientes/:id      → Perfil + histórico
/relatorios         → Filtros + exportar PDF
```

## Fases

### FASE 0 — Foundation (1 dia)

- [ ] Scaffold monorepo (`create-tanstack-app` + React Router)
- [ ] Copiar assets: `F:\#LOGOS\#PNG\*` → `public/logos/`, `favicon.png` → `public/`
- [ ] Implementar 42 tokens CSS do design system em `globals.css`
- [ ] Configurar Tailwind + shadcn/ui (dark mode default, gold accent)
- [ ] Componente `Logo` (horizontal/vertical, branco/preto)
- [ ] Gradiente-assinatura da marca em hero/CTA/headers
- [ ] **Mobile-first setup**: viewport meta, `min-height: 100dvh`, safe-area insets (env(safe-area-inset-*)), touch-action manipulation
- [ ] **PWA manifest**: `manifest.json`, service worker básico, ícones 192/512px a partir do favicon
- [ ] **Bottom navigation**: componente `BottomNav` fixo com ícones + labels, oculto em desktop (substituído por sidebar)
- [ ] **Responsive layout**: `<main>` com padding dinâmico, breakpoints `sm: 640px`, `md: 768px`, `lg: 1024px`
- [ ] **Componentes base mobile-first**: `MobileSheet` (Drawer de baixo), `CardList` (substitui DataTable em mobile), `StickyFooterCTA`, `PullToRefresh`
- [ ] **shadcn/ui adaptado**: substituir `Dialog` por `Sheet` como padrão, `Table` por `CardList` em breakpoint &lt;lg (1024px)

### FASE 1 — Auth + Multi-usuário (1 dia)

- [ ] Supabase client setup + RLS policies
- [ ] Auth email+senha (login, registro, reset) — hook `useAuth.tsx`
- [ ] Auth middleware server-side (`auth-middleware.ts`)
- [ ] Roles: Admin, Editor, Viewer — tabela `profiles` + RLS
- [ ] Rotas protegidas + layout `_auth.tsx`
- [ ] Páginas de login/recovery com design system

### FASE 2 — Core Features MVP (3 dias)

- [ ] Dashboard: total contratos, leads por estágio, gráfico timeline
- [ ] CRUD Contratos: DataTable → Formulário → Detalhe
- [ ] Schema Supabase `contratos`
- [ ] Kanban de Leads (drag-and-drop): Novo → Contato → Proposta → Fechado/Perdido
- [ ] Schema Supabase `leads`

### FASE 3 — Advanced Features (2 dias)

- [ ] Perfil do Paciente + histórico de contratos + timeline
- [ ] Schema `pacientes`
- [ ] Relatórios / exportação PDF
- [ ] Timeline de atividades (log de ações)

### FASE 4 — Migração de Dados (1 dia)

- [ ] Mapear schemas Bubble → Supabase
- [ ] Script ETL (Python ou Node)
- [ ] Validar integridade pós-migração

### FASE 5 — Deploy (0.5 dia)

- [ ] Configurar VPS (Docker + Nginx reverse proxy + SSL) ou Vercel
- [ ] CI/CD GitHub
- [ ] DNS: `cadastros.vpsconexao.org`

## Timeline Estimada

```
Fase 0:  1.0 dia  (inclui setup mobile-first + PWA)
Fase 1:  1.0 dia
Fase 2:  3.0 dias
Fase 3:  2.0 dias
Fase 4:  1.0 dia
Fase 5:  0.5 dia
----------------------
Total:  ~8.5 dias
```

## Schemas Supabase

```sql
-- Profiles (estendido de auth.users)
profiles: id, email, nome, role (admin|editor|viewer), avatar_url, created_at

-- Pacientes
pacientes: id, nome, cpf, email, telefone, observacoes, created_by, created_at

-- Contratos
contratos: id, paciente_id (FK), titulo, status (ativo|encerrado|cancelado),
  valor, data_inicio, data_fim, responsavel_id (FK profiles),
  observacoes, created_at, updated_at

-- Leads
leads: id, nome, contato, origem, estagio (novo|contato|proposta|fechado|perdido),
  valor_estimado, assigned_to (FK profiles), observacoes, created_at, updated_at

-- Atividades / Timeline
atividades: id, entidade_tipo (lead|contrato|paciente), entidade_id,
  acao, descricao, usuario_id (FK profiles), created_at
```

## Decisões Tomadas

| Decisão | Escolha |
|---------|---------|
| Auth | Email + senha (Supabase) |
| Domínio | `cadastros.vpsconexao.org` |
| Dados Bubble | Exportáveis — ETL na Fase 4 |
| Multi-usuário | Sim, com roles Admin/Editor/Viewer |
| Deploy | **Pendente**: VPS (Docker) vs Vercel |
| Abordagem | Mobile-First (PWA-ready, touch-first) |
