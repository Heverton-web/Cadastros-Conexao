const { Client } = require('pg');

const c = new Client({
  host: 'db.cluuqzhizeqvkgvfdisx.supabase.co', port: 5432, database: 'postgres',
  user: 'postgres', password: '@#Khen741963@#', ssl: { rejectUnauthorized: false },
});

const stmts = [
  { name: 'Tabela catalogo_abutment_chaves', sql: `CREATE TABLE IF NOT EXISTS catalogo_abutment_chaves (abutment_sku text NOT NULL REFERENCES catalogo_abutments(sku) ON DELETE CASCADE, chave_id text NOT NULL REFERENCES catalogo_chaves(sku) ON DELETE CASCADE, PRIMARY KEY (abutment_sku, chave_id));` },
  { name: 'RLS catalogo_abutment_chaves', sql: `ALTER TABLE catalogo_abutment_chaves ENABLE ROW LEVEL SECURITY;` },
  { name: 'Policy select abutment_chaves', sql: `DROP POLICY IF EXISTS empresa_select_own ON catalogo_abutment_chaves; CREATE POLICY empresa_select_own ON catalogo_abutment_chaves FOR SELECT USING (true);` },
  { name: 'Policy insert abutment_chaves', sql: `DROP POLICY IF EXISTS empresa_insert_own ON catalogo_abutment_chaves; CREATE POLICY empresa_insert_own ON catalogo_abutment_chaves FOR INSERT WITH CHECK (true);` },
  { name: 'Policy delete abutment_chaves', sql: `DROP POLICY IF EXISTS empresa_delete_own ON catalogo_abutment_chaves; CREATE POLICY empresa_delete_own ON catalogo_abutment_chaves FOR DELETE USING (true);` },

  { name: 'Tabela catalogo_abutment_kits', sql: `CREATE TABLE IF NOT EXISTS catalogo_abutment_kits (abutment_sku text NOT NULL REFERENCES catalogo_abutments(sku) ON DELETE CASCADE, kit_sku text NOT NULL REFERENCES catalogo_kits(sku) ON DELETE CASCADE, PRIMARY KEY (abutment_sku, kit_sku));` },
  { name: 'RLS catalogo_abutment_kits', sql: `ALTER TABLE catalogo_abutment_kits ENABLE ROW LEVEL SECURITY;` },
  { name: 'Policy select abutment_kits', sql: `DROP POLICY IF EXISTS empresa_select_own ON catalogo_abutment_kits; CREATE POLICY empresa_select_own ON catalogo_abutment_kits FOR SELECT USING (true);` },
  { name: 'Policy insert abutment_kits', sql: `DROP POLICY IF EXISTS empresa_insert_own ON catalogo_abutment_kits; CREATE POLICY empresa_insert_own ON catalogo_abutment_kits FOR INSERT WITH CHECK (true);` },
  { name: 'Policy delete abutment_kits', sql: `DROP POLICY IF EXISTS empresa_delete_own ON catalogo_abutment_kits; CREATE POLICY empresa_delete_own ON catalogo_abutment_kits FOR DELETE USING (true);` },

  { name: 'Tabela catalogo_abutment_parafusos', sql: `CREATE TABLE IF NOT EXISTS catalogo_abutment_parafusos (abutment_sku text NOT NULL REFERENCES catalogo_abutments(sku) ON DELETE CASCADE, parafuso_sku text NOT NULL REFERENCES catalogo_parafusos(sku) ON DELETE CASCADE, PRIMARY KEY (abutment_sku, parafuso_sku));` },
  { name: 'RLS catalogo_abutment_parafusos', sql: `ALTER TABLE catalogo_abutment_parafusos ENABLE ROW LEVEL SECURITY;` },
  { name: 'Policy select abutment_parafusos', sql: `DROP POLICY IF EXISTS empresa_select_own ON catalogo_abutment_parafusos; CREATE POLICY empresa_select_own ON catalogo_abutment_parafusos FOR SELECT USING (true);` },
  { name: 'Policy insert abutment_parafusos', sql: `DROP POLICY IF EXISTS empresa_insert_own ON catalogo_abutment_parafusos; CREATE POLICY empresa_insert_own ON catalogo_abutment_parafusos FOR INSERT WITH CHECK (true);` },
  { name: 'Policy delete abutment_parafusos', sql: `DROP POLICY IF EXISTS empresa_delete_own ON catalogo_abutment_parafusos; CREATE POLICY empresa_delete_own ON catalogo_abutment_parafusos FOR DELETE USING (true);` },

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
