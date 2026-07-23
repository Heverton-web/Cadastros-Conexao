const { Client } = require('pg');

const c = new Client({
  host: 'db.cluuqzhizeqvkgvfdisx.supabase.co', port: 5432, database: 'postgres',
  user: 'postgres', password: '@#Khen741963@#', ssl: { rejectUnauthorized: false },
});

const stmts = [
  { name: 'Tabela catalogo_seq_proteticas', sql: `CREATE TABLE IF NOT EXISTS catalogo_seq_proteticas (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), nome text NOT NULL, sigla text, ativo boolean DEFAULT true, created_at timestamptz DEFAULT now());` },
  { name: 'RLS catalogo_seq_proteticas', sql: `ALTER TABLE catalogo_seq_proteticas ENABLE ROW LEVEL SECURITY;` },
  { name: 'Policy select seq_proteticas', sql: `DROP POLICY IF EXISTS empresa_select_own ON catalogo_seq_proteticas; CREATE POLICY empresa_select_own ON catalogo_seq_proteticas FOR SELECT USING (true);` },
  { name: 'Policy insert seq_proteticas', sql: `DROP POLICY IF EXISTS empresa_insert_own ON catalogo_seq_proteticas; CREATE POLICY empresa_insert_own ON catalogo_seq_proteticas FOR INSERT WITH CHECK (true);` },
  { name: 'Policy update seq_proteticas', sql: `DROP POLICY IF EXISTS empresa_update_own ON catalogo_seq_proteticas; CREATE POLICY empresa_update_own ON catalogo_seq_proteticas FOR UPDATE USING (true);` },
  { name: 'Policy delete seq_proteticas', sql: `DROP POLICY IF EXISTS empresa_delete_own ON catalogo_seq_proteticas; CREATE POLICY empresa_delete_own ON catalogo_seq_proteticas FOR DELETE USING (true);` },

  { name: 'Pivot seq_protetica_abutments', sql: `CREATE TABLE IF NOT EXISTS catalogo_seq_protetica_abutments (seq_id uuid NOT NULL REFERENCES catalogo_seq_proteticas(id) ON DELETE CASCADE, abutment_sku text NOT NULL REFERENCES catalogo_abutments(sku) ON DELETE CASCADE, PRIMARY KEY (seq_id, abutment_sku));` },
  { name: 'RLS seq_protetica_abutments', sql: `ALTER TABLE catalogo_seq_protetica_abutments ENABLE ROW LEVEL SECURITY;` },
  { name: 'Policy select seq_abutments', sql: `DROP POLICY IF EXISTS empresa_select_own ON catalogo_seq_protetica_abutments; CREATE POLICY empresa_select_own ON catalogo_seq_protetica_abutments FOR SELECT USING (true);` },
  { name: 'Policy insert seq_abutments', sql: `DROP POLICY IF EXISTS empresa_insert_own ON catalogo_seq_protetica_abutments; CREATE POLICY empresa_insert_own ON catalogo_seq_protetica_abutments FOR INSERT WITH CHECK (true);` },
  { name: 'Policy delete seq_abutments', sql: `DROP POLICY IF EXISTS empresa_delete_own ON catalogo_seq_protetica_abutments; CREATE POLICY empresa_delete_own ON catalogo_seq_protetica_abutments FOR DELETE USING (true);` },

  { name: 'Pivot seq_protetica_etapas', sql: `CREATE TABLE IF NOT EXISTS catalogo_seq_protetica_etapas (seq_id uuid NOT NULL REFERENCES catalogo_seq_proteticas(id) ON DELETE CASCADE, etapa_id uuid NOT NULL REFERENCES catalogo_cps_etapas_workflows(id) ON DELETE CASCADE, PRIMARY KEY (seq_id, etapa_id));` },
  { name: 'RLS seq_protetica_etapas', sql: `ALTER TABLE catalogo_seq_protetica_etapas ENABLE ROW LEVEL SECURITY;` },
  { name: 'Policy select seq_etapas', sql: `DROP POLICY IF EXISTS empresa_select_own ON catalogo_seq_protetica_etapas; CREATE POLICY empresa_select_own ON catalogo_seq_protetica_etapas FOR SELECT USING (true);` },
  { name: 'Policy insert seq_etapas', sql: `DROP POLICY IF EXISTS empresa_insert_own ON catalogo_seq_protetica_etapas; CREATE POLICY empresa_insert_own ON catalogo_seq_protetica_etapas FOR INSERT WITH CHECK (true);` },
  { name: 'Policy delete seq_etapas', sql: `DROP POLICY IF EXISTS empresa_delete_own ON catalogo_seq_protetica_etapas; CREATE POLICY empresa_delete_own ON catalogo_seq_protetica_etapas FOR DELETE USING (true);` },

  { name: 'Pivot seq_protetica_componentes', sql: `CREATE TABLE IF NOT EXISTS catalogo_seq_protetica_componentes (seq_id uuid NOT NULL REFERENCES catalogo_seq_proteticas(id) ON DELETE CASCADE, componente_sku text NOT NULL REFERENCES catalogo_componentes(sku) ON DELETE CASCADE, PRIMARY KEY (seq_id, componente_sku));` },
  { name: 'RLS seq_protetica_componentes', sql: `ALTER TABLE catalogo_seq_protetica_componentes ENABLE ROW LEVEL SECURITY;` },
  { name: 'Policy select seq_componentes', sql: `DROP POLICY IF EXISTS empresa_select_own ON catalogo_seq_protetica_componentes; CREATE POLICY empresa_select_own ON catalogo_seq_protetica_componentes FOR SELECT USING (true);` },
  { name: 'Policy insert seq_componentes', sql: `DROP POLICY IF EXISTS empresa_insert_own ON catalogo_seq_protetica_componentes; CREATE POLICY empresa_insert_own ON catalogo_seq_protetica_componentes FOR INSERT WITH CHECK (true);` },
  { name: 'Policy delete seq_componentes', sql: `DROP POLICY IF EXISTS empresa_delete_own ON catalogo_seq_protetica_componentes; CREATE POLICY empresa_delete_own ON catalogo_seq_protetica_componentes FOR DELETE USING (true);` },

  { name: 'Reload schema', sql: `NOTIFY pgrst, 'reload schema';` },
];

async function main() {
  await c.connect();
  console.log('Conectado ao Supabase.');
  for (const s of stmts) {
    try {
      await c.query(s.sql);
      console.log(`  ✓ ${s.name}`);
    } catch (e) {
      console.error(`  ✗ ${s.name}: ${e.message}`);
    }
  }
  await c.end();
  console.log('Done.');
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
