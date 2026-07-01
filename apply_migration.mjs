import pg from "pg";
const { Client } = pg;

const connectionString =
  "postgresql://postgres:%40%23Khen741963%40%23@db.cluuqzhizeqvkgvfdisx.supabase.co:5432/postgres";

const client = new Client({
  connectionString,
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to database.");

    const sql = `
-- 1. Create function
create or replace function public.has_permission(required_permission text)
returns boolean
language sql
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.permissoes
    where usuario_id = auth.uid()
      and (permissoes->>required_permission)::boolean = true
  );
$$;

-- 2. Update select_cadastros_empresa
drop policy if exists "select_cadastros_empresa" on public.cadastros;
create policy "select_cadastros_empresa"
  on public.cadastros for select to authenticated
  using (
    is_super_admin_session()
    or (is_admin_or_super() and empresa_id = get_current_empresa_id())
    or (created_by = auth.uid() and empresa_id = get_current_empresa_id())
    or (public.has_permission('ver_todos_cadastros') and empresa_id = get_current_empresa_id())
  );

-- 3. Update related select policies to match new condition in exists()
drop policy if exists "select_cadastros_pf_empresa" on public.cadastros_pf;
create policy "select_cadastros_pf_empresa"
  on public.cadastros_pf for select to authenticated
  using (is_super_admin_session() or (
    exists (select 1 from public.cadastros where id = cadastro_id
      and (is_admin_or_super() or created_by = auth.uid() or public.has_permission('ver_todos_cadastros'))
      and empresa_id = get_current_empresa_id())
  ));

drop policy if exists "select_cadastros_pj_empresa" on public.cadastros_pj;
create policy "select_cadastros_pj_empresa"
  on public.cadastros_pj for select to authenticated
  using (is_super_admin_session() or (
    exists (select 1 from public.cadastros where id = cadastro_id
      and (is_admin_or_super() or created_by = auth.uid() or public.has_permission('ver_todos_cadastros'))
      and empresa_id = get_current_empresa_id())
  ));

drop policy if exists "select_enderecos_empresa" on public.cadastros_enderecos;
create policy "select_enderecos_empresa"
  on public.cadastros_enderecos for select to authenticated
  using (is_super_admin_session() or (
    exists (select 1 from public.cadastros where id = cadastro_id
      and (is_admin_or_super() or created_by = auth.uid() or public.has_permission('ver_todos_cadastros'))
      and empresa_id = get_current_empresa_id())
  ));

drop policy if exists "select_documentos_empresa" on public.documentos;
create policy "select_documentos_empresa"
  on public.documentos for select to authenticated
  using (is_super_admin_session() or (
    exists (select 1 from public.cadastros where id = cadastro_id
      and (is_admin_or_super() or created_by = auth.uid() or public.has_permission('ver_todos_cadastros'))
      and empresa_id = get_current_empresa_id())
  ));

drop policy if exists "select_atividades_empresa" on public.atividades;
create policy "select_atividades_empresa"
  on public.atividades for select to authenticated
  using (is_super_admin_session() or empresa_id = get_current_empresa_id());
    `;

    await client.query(sql);
    console.log("Migration applied successfully.");
  } catch (err) {
    console.error("Error executing query", err);
  } finally {
    await client.end();
  }
}

run();
