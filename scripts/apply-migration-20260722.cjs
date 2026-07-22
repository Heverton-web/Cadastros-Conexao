const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const PROJECT = 'cluuqzhizeqvkgvfdisx';
const PASSWORD = process.env.SUPABASE_DB_PASSWORD || '@#Khen741963@#';

const client = new Client({
  host: `db.${PROJECT}.supabase.co`,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: PASSWORD,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  console.log('Conectando ao banco...');
  await client.connect();
  console.log('✓ Conectado\n');

  const sql = fs.readFileSync(
    path.join(__dirname, '..', 'supabase', 'migrations', '20260722000000_restore_pks_and_fks_catalogo.sql'),
    'utf8'
  );

  console.log('Executando migration...');
  try {
    await client.query(sql);
    console.log('✓ Migration aplicada com sucesso');
  } catch (err) {
    console.error('✗ Erro na migration:', err.message);
    // Try block by block
    const blocks = sql.split(/\n-- =+\n/).filter(b => b.trim());
    for (const block of blocks) {
      if (block.trim().startsWith('--')) continue;
      try {
        await client.query(block);
        console.log('  ✓ Bloco executado');
      } catch (e) {
        console.error('  ✗ Bloco falhou:', e.message.substring(0, 120));
      }
    }
  }

  // Reload PostgREST schema cache
  console.log('\nRecarregando schema cache...');
  await client.query("NOTIFY pgrst, 'reload schema';");
  await new Promise(r => setTimeout(r, 2000));
  await client.query("NOTIFY pgrst, 'reload schema';");
  console.log('✓ Schema cache recarregado');

  // Verify PKs
  console.log('\n--- PKs verificadas ---');
  const pks = await client.query(`
    SELECT tc.table_name, kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.constraint_type = 'PRIMARY KEY'
      AND tc.table_schema = 'public'
      AND tc.table_name IN ('catalogo_abutments','catalogo_componentes','catalogo_parafusos','catalogo_cicatrizadores','catalogo_chaves','catalogo_implantes')
    ORDER BY tc.table_name
  `);
  for (const r of pks.rows) console.log(`  ✓ ${r.table_name}: PK = ${r.column_name}`);

  // Verify FKs
  console.log('\n--- FKs verificadas ---');
  const fks = await client.query(`
    SELECT tc.table_name, kcu.column_name, ccu.table_name AS ref_table, ccu.column_name AS ref_col
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
      AND tc.table_name IN ('catalogo_abutments','catalogo_componentes','catalogo_parafusos','catalogo_cicatrizadores')
    ORDER BY tc.table_name, kcu.column_name
  `);
  for (const r of fks.rows) console.log(`  ✓ ${r.table_name}.${r.column_name} → ${r.ref_table}.${r.ref_col}`);

  await client.end();
  console.log('\n✅ CONCLUÍDO');
}

main().catch(err => { console.error('Erro fatal:', err.message); process.exit(1); });
