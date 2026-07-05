-- ============================================================
-- 00055_modelos_ia.sql
-- Tabelas para monitoramento de modelos de IA do mercado
-- ============================================================

create table if not exists public.modelos_ia_versoes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  total_modelos int not null default 0
);

create table if not exists public.modelos_ia (
  id uuid default gen_random_uuid() primary key,
  versao_id uuid not null references public.modelos_ia_versoes(id) on delete cascade,
  modelo_id text not null,
  nome text not null,
  provedor text not null,
  modalidade text,
  win_rate numeric(5,1),
  top_arena text,
  input_cost numeric(10,4),
  output_cost numeric(10,4),
  context_window numeric(10,1),
  max_output numeric(10,1),
  created_at timestamptz default now()
);

create index if not exists idx_modelos_ia_versao_id on public.modelos_ia(versao_id);
create index if not exists idx_modelos_ia_versoes_created_at on public.modelos_ia_versoes(created_at desc);

alter table public.modelos_ia enable row level security;
alter table public.modelos_ia_versoes enable row level security;

-- Super admin pode ler tudo
create policy "Super admin pode ler modelos_ia_versoes"
  on public.modelos_ia_versoes for select
  using (coalesce(current_setting('request.jwt.claims', true)::json->>'is_super_admin', 'false')::boolean);

create policy "Super admin pode inserir modelos_ia_versoes"
  on public.modelos_ia_versoes for insert
  with check (coalesce(current_setting('request.jwt.claims', true)::json->>'is_super_admin', 'false')::boolean);

create policy "Super admin pode ler modelos_ia"
  on public.modelos_ia for select
  using (coalesce(current_setting('request.jwt.claims', true)::json->>'is_super_admin', 'false')::boolean);

create policy "Super admin pode inserir modelos_ia"
  on public.modelos_ia for insert
  with check (coalesce(current_setting('request.jwt.claims', true)::json->>'is_super_admin', 'false')::boolean);
