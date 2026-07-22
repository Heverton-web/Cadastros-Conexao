const { Client } = require('pg');

const c = new Client({
  host: 'db.cluuqzhizeqvkgvfdisx.supabase.co', port: 5432, database: 'postgres',
  user: 'postgres', password: '@#Khen741963@#', ssl: { rejectUnauthorized: false },
});

const stmts = [
  // ============================================================
  // 1. PKs em id UUID (empresa_id foi dropado, PKs quebradas)
  // ============================================================
  { name: 'PK catalogo_abutments', sql: 'ALTER TABLE catalogo_abutments DROP CONSTRAINT IF EXISTS catalogo_abutments_pkey; ALTER TABLE catalogo_abutments ADD PRIMARY KEY (sku);' },
  { name: 'PK catalogo_componentes', sql: 'ALTER TABLE catalogo_componentes DROP CONSTRAINT IF EXISTS catalogo_componentes_pkey; ALTER TABLE catalogo_componentes ADD PRIMARY KEY (sku);' },
  { name: 'PK catalogo_cicatrizadores', sql: 'ALTER TABLE catalogo_cicatrizadores DROP CONSTRAINT IF EXISTS catalogo_cicatrizadores_pkey; ALTER TABLE catalogo_cicatrizadores ADD PRIMARY KEY (sku);' },
  { name: 'PK catalogo_chaves', sql: 'ALTER TABLE catalogo_chaves DROP CONSTRAINT IF EXISTS catalogo_chaves_pkey; ALTER TABLE catalogo_chaves ADD PRIMARY KEY (sku);' },
  { name: 'PK catalogo_implantes', sql: 'ALTER TABLE catalogo_implantes DROP CONSTRAINT IF EXISTS catalogo_implantes_pkey; ALTER TABLE catalogo_implantes ADD PRIMARY KEY (sku);' },
  { name: 'PK catalogo_kits', sql: 'ALTER TABLE catalogo_kits DROP CONSTRAINT IF EXISTS catalogo_kits_pkey; ALTER TABLE catalogo_kits ADD PRIMARY KEY (sku);' },

  // ============================================================
  // 2. UNIQUE em sku (PostgREST usa para resolver joins)
  // ============================================================
  { name: 'UNIQUE sku catalogo_abutments', sql: 'CREATE UNIQUE INDEX IF NOT EXISTS idx_abutments_sku ON catalogo_abutments(sku);' },
  { name: 'UNIQUE sku catalogo_componentes', sql: 'CREATE UNIQUE INDEX IF NOT EXISTS idx_componentes_sku ON catalogo_componentes(sku);' },
  { name: 'UNIQUE sku catalogo_parafusos', sql: 'CREATE UNIQUE INDEX IF NOT EXISTS idx_parafusos_sku ON catalogo_parafusos(sku);' },
  { name: 'UNIQUE sku catalogo_cicatrizadores', sql: 'CREATE UNIQUE INDEX IF NOT EXISTS idx_cicatrizadores_sku ON catalogo_cicatrizadores(sku);' },
  { name: 'UNIQUE sku catalogo_chaves', sql: 'CREATE UNIQUE INDEX IF NOT EXISTS idx_chaves_sku ON catalogo_chaves(sku);' },
  { name: 'UNIQUE sku catalogo_implantes', sql: 'CREATE UNIQUE INDEX IF NOT EXISTS idx_implantes_sku ON catalogo_implantes(sku);' },

  // ============================================================
  // 3. FKs TEXT → sku (parafuso_id, chave_id, implante_id são TEXT)
  // ============================================================
  // Abutments
  { name: 'FK abutments→parafusos', sql: 'ALTER TABLE catalogo_abutments ADD CONSTRAINT fk_abutments_parafuso FOREIGN KEY (parafuso_id) REFERENCES catalogo_parafusos(sku) ON DELETE SET NULL;' },
  { name: 'FK abutments→chaves', sql: 'ALTER TABLE catalogo_abutments ADD CONSTRAINT fk_abutments_chave FOREIGN KEY (chave_id) REFERENCES catalogo_chaves(sku) ON DELETE SET NULL;' },

  // Componentes
  { name: 'FK componentes→parafusos', sql: 'ALTER TABLE catalogo_componentes ADD CONSTRAINT fk_componentes_parafuso FOREIGN KEY (parafuso_id) REFERENCES catalogo_parafusos(sku) ON DELETE SET NULL;' },
  { name: 'FK componentes→chaves', sql: 'ALTER TABLE catalogo_componentes ADD CONSTRAINT fk_componentes_chave FOREIGN KEY (chave_id) REFERENCES catalogo_chaves(sku) ON DELETE SET NULL;' },

  // Parafusos
  { name: 'FK parafusos→chaves', sql: 'ALTER TABLE catalogo_parafusos ADD CONSTRAINT fk_parafusos_chave FOREIGN KEY (chave_id) REFERENCES catalogo_chaves(sku) ON DELETE SET NULL;' },

  // Cicatrizadores
  { name: 'FK cicatrizadores→chaves', sql: 'ALTER TABLE catalogo_cicatrizadores ADD CONSTRAINT fk_cicatrizadores_chave FOREIGN KEY (chave_id) REFERENCES catalogo_chaves(sku) ON DELETE SET NULL;' },
  { name: 'FK cicatrizadores→implantes', sql: 'ALTER TABLE catalogo_cicatrizadores ADD CONSTRAINT fk_cicatrizadores_implante FOREIGN KEY (implante_id) REFERENCES catalogo_implantes(sku) ON DELETE SET NULL;' },

  // ============================================================
  // 4. FKs UUID → id (tipo_abutment_id, tipo_componente_id, etc.)
  // ============================================================
  { name: 'FK abutments→tipo_abutment', sql: 'DO $$ BEGIN ALTER TABLE catalogo_abutments ADD CONSTRAINT fk_abutments_tipo_abutment FOREIGN KEY (tipo_abutment_id) REFERENCES catalogo_cps_tipos_abutments(id) ON DELETE SET NULL; EXCEPTION WHEN duplicate_object THEN END $$;' },
  { name: 'FK componentes→tipo_componente', sql: 'DO $$ BEGIN ALTER TABLE catalogo_componentes ADD CONSTRAINT fk_componentes_tipo FOREIGN KEY (tipo_componente_id) REFERENCES catalogo_cps_tipos_componentes(id) ON DELETE SET NULL; EXCEPTION WHEN duplicate_object THEN END $$;' },
  { name: 'FK componentes→tipo_abutment', sql: 'DO $$ BEGIN ALTER TABLE catalogo_componentes ADD CONSTRAINT fk_componentes_tipo_abutment FOREIGN KEY (tipo_abutment_id) REFERENCES catalogo_cps_tipos_abutments(id) ON DELETE SET NULL; EXCEPTION WHEN duplicate_object THEN END $$;' },
  { name: 'FK parafusos→tipo_parafuso', sql: 'DO $$ BEGIN ALTER TABLE catalogo_parafusos ADD CONSTRAINT fk_parafusos_tipo FOREIGN KEY (tipo_parafuso_id) REFERENCES catalogo_cps_tipos_parafusos(id) ON DELETE SET NULL; EXCEPTION WHEN duplicate_object THEN END $$;' },
];

async function main() {
  console.log('Conectando ao banco...');
  await c.connect();
  console.log('✓ Conectado\n');

  let ok = 0, fail = 0;
  for (const s of stmts) {
    try {
      await c.query(s.sql);
      console.log(`  ✓ ${s.name}`);
      ok++;
    } catch (e) {
      console.error(`  ✗ ${s.name}: ${e.message.substring(0, 100)}`);
      fail++;
    }
  }

  // Reload PostgREST
  console.log('\nRecarregando schema cache...');
  await c.query("NOTIFY pgrst, 'reload schema';");
  await new Promise(r => setTimeout(r, 2000));
  await c.query("NOTIFY pgrst, 'reload schema';");
  console.log('✓ OK\n');

  // Verify
  console.log('--- PKs ---');
  const pk = await c.query(`
    SELECT tc.table_name, string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) as cols
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu USING (constraint_name, table_schema)
    WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_schema = 'public'
      AND tc.table_name IN ('catalogo_abutments','catalogo_componentes','catalogo_parafusos','catalogo_cicatrizadores','catalogo_chaves','catalogo_implantes')
    GROUP BY tc.table_name ORDER BY tc.table_name
  `);
  for (const r of pk.rows) console.log(`  ${r.table_name}: PK(${r.cols})`);

  console.log('\n--- FKs (TEXT→sku) ---');
  const fk = await c.query(`
    SELECT tc.table_name, kcu.column_name, ccu.table_name AS ref_table, ccu.column_name AS ref_col
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu USING (constraint_name, table_schema)
    JOIN information_schema.constraint_column_usage ccu USING (constraint_name, table_schema)
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
      AND tc.table_name IN ('catalogo_abutments','catalogo_componentes','catalogo_parafusos','catalogo_cicatrizadores')
    ORDER BY tc.table_name, kcu.column_name
  `);
  for (const r of fk.rows) console.log(`  ${r.table_name}.${r.column_name} → ${r.ref_table}.${r.ref_col}`);

  console.log(`\n✅ ${ok} OK, ${fail} falhas`);
  await c.end();
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
