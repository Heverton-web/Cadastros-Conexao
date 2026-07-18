const https = require('https');
const TOKEN = process.env.SUPABASE_SERVICE_TOKEN || '';
const PROJECT = 'cluuqzhizeqvkgvfdisx';

function q(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const req = https.request({
      hostname: 'api.supabase.com',
      path: '/v1/projects/' + PROJECT + '/database/query',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + TOKEN,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve(data); } });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log('=== APLICANDO 8 FKs FALTANTES ===\n');

  // 1. Verificar integridade
  const checks = [
    { tbl: 'catalogo_abutments', col: 'tipo_abutment_id', ref: 'catalogo_cps_tipos_abutments' },
    { tbl: 'catalogo_abutments', col: 'parafuso_id', ref: 'catalogo_parafusos' },
    { tbl: 'catalogo_abutments', col: 'chave_id', ref: 'catalogo_chaves' },
    { tbl: 'catalogo_componentes', col: 'parafuso_id', ref: 'catalogo_parafusos' },
    { tbl: 'catalogo_componentes', col: 'chave_id', ref: 'catalogo_chaves' },
    { tbl: 'catalogo_parafusos', col: 'chave_id', ref: 'catalogo_chaves' },
    { tbl: 'catalogo_cicatrizadores', col: 'implante_id', ref: 'catalogo_implantes' },
    { tbl: 'catalogo_cicatrizadores', col: 'chave_id', ref: 'catalogo_chaves' },
  ];

  console.log('--- Verificação de integridade ---');
  let hasOrphans = false;
  for (const c of checks) {
    const r = await q(`
      SELECT count(*) AS orphans FROM ${c.tbl} t
      LEFT JOIN ${c.ref} r ON t.${c.col} = r.id
      WHERE t.${c.col} IS NOT NULL AND r.id IS NULL;
    `);
    const orphans = Array.isArray(r) ? Number(r[0]?.orphans) : -1;
    if (orphans > 0) {
      console.log(`   ⚠️  ${c.tbl}.${c.col}: ${orphans} órfãos!`);
      hasOrphans = true;
    } else {
      console.log(`   ✓ ${c.tbl}.${c.col}: OK`);
    }
  }

  if (hasOrphans) {
    console.log('\n❌ Dados órfãos encontrados! Corrija antes de criar FKs.');
    return;
  }

  // 2. Criar todas as FKs
  console.log('\n--- Criando FKs ---');
  const fkSql = `
-- FKs para resource embedding do catálogo

-- catalogo_abutments → catalogo_cps_tipos_abutments
ALTER TABLE public.catalogo_abutments
  ADD CONSTRAINT fk_abutments_tipo_abutment
  FOREIGN KEY (tipo_abutment_id)
  REFERENCES public.catalogo_cps_tipos_abutments(id)
  ON DELETE SET NULL;

-- catalogo_abutments → catalogo_parafusos
ALTER TABLE public.catalogo_abutments
  ADD CONSTRAINT fk_abutments_parafuso
  FOREIGN KEY (parafuso_id)
  REFERENCES public.catalogo_parafusos(id)
  ON DELETE SET NULL;

-- catalogo_abutments → catalogo_chaves
ALTER TABLE public.catalogo_abutments
  ADD CONSTRAINT fk_abutments_chave
  FOREIGN KEY (chave_id)
  REFERENCES public.catalogo_chaves(id)
  ON DELETE SET NULL;

-- catalogo_componentes → catalogo_parafusos
ALTER TABLE public.catalogo_componentes
  ADD CONSTRAINT fk_componentes_parafuso
  FOREIGN KEY (parafuso_id)
  REFERENCES public.catalogo_parafusos(id)
  ON DELETE SET NULL;

-- catalogo_componentes → catalogo_chaves
ALTER TABLE public.catalogo_componentes
  ADD CONSTRAINT fk_componentes_chave
  FOREIGN KEY (chave_id)
  REFERENCES public.catalogo_chaves(id)
  ON DELETE SET NULL;

-- catalogo_parafusos → catalogo_chaves
ALTER TABLE public.catalogo_parafusos
  ADD CONSTRAINT fk_parafusos_chave
  FOREIGN KEY (chave_id)
  REFERENCES public.catalogo_chaves(id)
  ON DELETE SET NULL;

-- catalogo_cicatrizadores → catalogo_implantes
ALTER TABLE public.catalogo_cicatrizadores
  ADD CONSTRAINT fk_cicatrizadores_implante
  FOREIGN KEY (implante_id)
  REFERENCES public.catalogo_implantes(id)
  ON DELETE SET NULL;

-- catalogo_cicatrizadores → catalogo_chaves
ALTER TABLE public.catalogo_cicatrizadores
  ADD CONSTRAINT fk_cicatrizadores_chave
  FOREIGN KEY (chave_id)
  REFERENCES public.catalogo_chaves(id)
  ON DELETE SET NULL;
  `;

  const result = await q(fkSql);
  console.log(`   Resultado: ${JSON.stringify(result)}`);

  // 3. Verificar FKs criadas
  console.log('\n--- Verificação pós-criação ---');
  const verify = await q(`
    SELECT 
      tc.table_name AS from_table,
      kcu.column_name AS from_col,
      ccu.table_name AS to_table
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name AND tc.table_schema = ccu.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_schema = 'public'
      AND tc.table_name IN ('catalogo_abutments', 'catalogo_componentes', 'catalogo_parafusos', 'catalogo_cicatrizadores', 'catalogo_implantes')
    ORDER BY tc.table_name, kcu.column_name;
  `);
  if (Array.isArray(verify)) {
    for (const fk of verify) console.log(`   ✓ ${fk.from_table}.${fk.from_col} → ${fk.to_table}`);
  }

  // 4. Forçar reload PostgREST
  console.log('\n--- Reload PostgREST ---');
  await q(`NOTIFY pgrst, 'reload schema';`);
  await sleep(500);
  await q(`NOTIFY pgrst, 'reload schema';`);
  console.log('   ✓ NOTIFY enviado');

  // 5. Teste rápido via REST
  await sleep(3000);
  const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODg3NjksImV4cCI6MjA5NzM2NDc2OX0.GM3quHA1z_9kCiMEYsfAh9Pi0KVdnCIFQEYe-wwE9MM';
  const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTc4ODc2OSwiZXhwIjoyMDk3MzY0NzY5fQ.nFgZm_frOy8K6e6LUpQNqQ4zVMrNoCKcM8MqYfDv9Ag';

  const tests = [
    { name: 'abutments', path: '/rest/v1/catalogo_abutments?select=sku,tipo_abutment:catalogo_cps_tipos_abutments(nome),parafuso:catalogo_parafusos(nome),chave:catalogo_chaves(nome)&limit=2' },
    { name: 'componentes', path: '/rest/v1/catalogo_componentes?select=sku,tipo_componente:catalogo_cps_tipos_componentes(nome),parafuso:catalogo_parafusos(nome),chave:catalogo_chaves(nome)&limit=2' },
    { name: 'parafusos', path: '/rest/v1/catalogo_parafusos?select=nome,tipo_parafuso:catalogo_cps_tipos_parafusos(nome),chave:catalogo_chaves(nome)&limit=2' },
    { name: 'cicatrizadores', path: '/rest/v1/catalogo_cicatrizadores?select=sku,implante:catalogo_implantes(sku),chave:catalogo_chaves(nome)&limit=2' },
  ];

  console.log('\n--- Teste REST (service_role) ---');
  for (const t of tests) {
    const r = await new Promise((resolve, reject) => {
      https.get({
        hostname: 'cluuqzhizeqvkgvfdisx.supabase.co',
        path: encodeURI(t.path),
        headers: { 'Authorization': 'Bearer ' + SERVICE_KEY, 'apikey': SERVICE_KEY },
      }, (res) => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve({ s: res.statusCode, body: (() => { try { return JSON.parse(d); } catch { return d; } })() }));
      }).on('error', reject);
    });
    if (r.s === 200 && Array.isArray(r.body) && r.body.length > 0) {
      console.log(`   ✓ ${t.name}: ${JSON.stringify(r.body[0]).slice(0, 120)}`);
    } else {
      console.log(`   ❌ ${t.name}: status=${r.s} ${JSON.stringify(r.body).slice(0, 100)}`);
    }
  }

  console.log('\n✅ CONCLUÍDO! Teste o frontend em todas as abas do catálogo.');
}

main().catch(console.error);
