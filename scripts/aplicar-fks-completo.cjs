const https = require('https');
const fs = require('fs');
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
  console.log('=== APLICANDO MIGRATION COMPLETA DE FKs ===\n');

  // Aplicar em blocos para isolar erros
  const blocks = [
    {
      name: 'FASE 1: Adicionar id em catalogo_parafusos',
      sql: `
        ALTER TABLE public.catalogo_parafusos ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();
        UPDATE public.catalogo_parafusos SET id = gen_random_uuid() WHERE id IS NULL;
        ALTER TABLE public.catalogo_parafusos ALTER COLUMN id SET NOT NULL;
        CREATE UNIQUE INDEX IF NOT EXISTS idx_parafusos_id ON public.catalogo_parafusos(id);
      `
    },
    {
      name: 'FASE 1: Adicionar id em catalogo_chaves',
      sql: `
        ALTER TABLE public.catalogo_chaves ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();
        UPDATE public.catalogo_chaves SET id = gen_random_uuid() WHERE id IS NULL;
        ALTER TABLE public.catalogo_chaves ALTER COLUMN id SET NOT NULL;
        CREATE UNIQUE INDEX IF NOT EXISTS idx_chaves_id ON public.catalogo_chaves(id);
      `
    },
    {
      name: 'FASE 1: Adicionar id em catalogo_implantes',
      sql: `
        ALTER TABLE public.catalogo_implantes ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();
        UPDATE public.catalogo_implantes SET id = gen_random_uuid() WHERE id IS NULL;
        ALTER TABLE public.catalogo_implantes ALTER COLUMN id SET NOT NULL;
        CREATE UNIQUE INDEX IF NOT EXISTS idx_implantes_id ON public.catalogo_implantes(id);
      `
    },
    {
      name: 'FASE 2: Corrigir parafuso_id text→uuid',
      sql: `
        ALTER TABLE public.catalogo_abutments ALTER COLUMN parafuso_id TYPE uuid USING parafuso_id::uuid;
        ALTER TABLE public.catalogo_componentes ALTER COLUMN parafuso_id TYPE uuid USING parafuso_id::uuid;
      `
    },
    {
      name: 'FASE 3: FK abutments→tipos_abutments',
      sql: `
        ALTER TABLE public.catalogo_abutments DROP CONSTRAINT IF EXISTS fk_abutments_tipo_abutment;
        ALTER TABLE public.catalogo_abutments ADD CONSTRAINT fk_abutments_tipo_abutment FOREIGN KEY (tipo_abutment_id) REFERENCES public.catalogo_cps_tipos_abutments(id) ON DELETE SET NULL;
      `
    },
    {
      name: 'FASE 3: FK abutments→parafusos',
      sql: `ALTER TABLE public.catalogo_abutments ADD CONSTRAINT fk_abutments_parafuso FOREIGN KEY (parafuso_id) REFERENCES public.catalogo_parafusos(id) ON DELETE SET NULL;`
    },
    {
      name: 'FASE 3: FK abutments→chaves',
      sql: `ALTER TABLE public.catalogo_abutments ADD CONSTRAINT fk_abutments_chave FOREIGN KEY (chave_id) REFERENCES public.catalogo_chaves(id) ON DELETE SET NULL;`
    },
    {
      name: 'FASE 3: FK componentes→parafusos',
      sql: `ALTER TABLE public.catalogo_componentes ADD CONSTRAINT fk_componentes_parafuso FOREIGN KEY (parafuso_id) REFERENCES public.catalogo_parafusos(id) ON DELETE SET NULL;`
    },
    {
      name: 'FASE 3: FK componentes→chaves',
      sql: `ALTER TABLE public.catalogo_componentes ADD CONSTRAINT fk_componentes_chave FOREIGN KEY (chave_id) REFERENCES public.catalogo_chaves(id) ON DELETE SET NULL;`
    },
    {
      name: 'FASE 3: FK parafusos→chaves',
      sql: `ALTER TABLE public.catalogo_parafusos ADD CONSTRAINT fk_parafusos_chave FOREIGN KEY (chave_id) REFERENCES public.catalogo_chaves(id) ON DELETE SET NULL;`
    },
    {
      name: 'FASE 3: FK cicatrizadores→implantes',
      sql: `ALTER TABLE public.catalogo_cicatrizadores ADD CONSTRAINT fk_cicatrizadores_implante FOREIGN KEY (implante_id) REFERENCES public.catalogo_implantes(id) ON DELETE SET NULL;`
    },
    {
      name: 'FASE 3: FK cicatrizadores→chaves',
      sql: `ALTER TABLE public.catalogo_cicatrizadores ADD CONSTRAINT fk_cicatrizadores_chave FOREIGN KEY (chave_id) REFERENCES public.catalogo_chaves(id) ON DELETE SET NULL;`
    },
  ];

  for (const block of blocks) {
    console.log(`${block.name}...`);
    const r = await q(block.sql);
    const err = r?.message;
    if (err && err.includes('already exists')) {
      console.log(`   ✓ Já existe (ok)`);
    } else if (err) {
      console.log(`   ❌ ERRO: ${err.slice(0, 200)}`);
    } else {
      console.log(`   ✓ OK`);
    }
  }

  // Reload PostgREST
  console.log('\nReload PostgREST...');
  await q(`NOTIFY pgrst, 'reload schema';`);
  await sleep(500);
  await q(`NOTIFY pgrst, 'reload schema';`);
  await sleep(3000);
  console.log('   ✓ NOTIFY enviado');

  // Verificar FKs finais
  console.log('\n--- FKs finais ---');
  const fks = await q(`
    SELECT tc.table_name, kcu.column_name, ccu.table_name AS ref_table, ccu.column_name AS ref_col
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name AND tc.table_schema = ccu.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
      AND tc.table_name IN ('catalogo_abutments','catalogo_componentes','catalogo_parafusos','catalogo_cicatrizadores','catalogo_implantes')
    ORDER BY tc.table_name, kcu.column_name;
  `);
  if (Array.isArray(fks)) for (const f of fks) console.log(`   ✓ ${f.table_name}.${f.column_name} → ${f.ref_table}.${f.ref_col}`);

  // Teste REST
  console.log('\n--- Teste REST (service_role) ---');
  const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTc4ODc2OSwiZXhwIjoyMDk3MzY0NzY5fQ.nFgZm_frOy8K6e6LUpQNqQ4zVMrNoCKcM8MqYfDv9Ag';
  
  const tests = [
    { name: 'abutments', path: '/rest/v1/catalogo_abutments?select=sku,tipo_abutment:catalogo_cps_tipos_abutments(nome)&limit=2' },
    { name: 'componentes', path: '/rest/v1/catalogo_componentes?select=sku,tipo_componente:catalogo_cps_tipos_componentes(nome)&limit=2' },
    { name: 'parafusos', path: '/rest/v1/catalogo_parafusos?select=sku,tipo_parafuso:catalogo_cps_tipos_parafusos(nome)&limit=2' },
    { name: 'cicatrizadores', path: '/rest/v1/catalogo_cicatrizadores?select=sku,implante:catalogo_implantes(sku)&limit=2' },
  ];

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
    if (r.s === 200 && Array.isArray(r.body)) {
      console.log(`   ✓ ${t.name}: ${r.body.length} rows ${r.body.length > 0 ? JSON.stringify(r.body[0]).slice(0, 80) : ''}`);
    } else {
      console.log(`   ❌ ${t.name}: ${r.s} ${JSON.stringify(r.body).slice(0, 120)}`);
    }
  }

  console.log('\n✅ CONCLUÍDO!');
}

main().catch(console.error);
