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
      headers: { 'Authorization': 'Bearer ' + TOKEN, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
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
  console.log('=== CRIANDO TABELA catalogo_protocolo_fresagem ===\n');

  const steps = [
    {
      name: '1. Criar tabela',
      sql: `
        CREATE TABLE IF NOT EXISTS public.catalogo_protocolo_fresagem (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          empresa_id uuid NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
          implante_sku text NOT NULL,
          fresa_sku text NOT NULL,
          tipo_osso text,
          ordem_uso integer DEFAULT 0,
          created_at timestamptz DEFAULT now()
        );
      `
    },
    {
      name: '2. Índices',
      sql: `
        CREATE INDEX IF NOT EXISTS idx_proto_fresagem_empresa ON public.catalogo_protocolo_fresagem(empresa_id);
        CREATE INDEX IF NOT EXISTS idx_proto_fresagem_implante ON public.catalogo_protocolo_fresagem(implante_sku, empresa_id);
      `
    },
    {
      name: '3. FK → implantes',
      sql: `
        ALTER TABLE public.catalogo_protocolo_fresagem
          ADD CONSTRAINT fk_proto_fresagem_implante
          FOREIGN KEY (implante_sku, empresa_id)
          REFERENCES public.catalogo_implantes(sku, empresa_id)
          ON DELETE CASCADE;
      `
    },
    {
      name: '4. FK → fresas',
      sql: `
        ALTER TABLE public.catalogo_protocolo_fresagem
          ADD CONSTRAINT fk_proto_fresagem_fresa
          FOREIGN KEY (fresa_sku, empresa_id)
          REFERENCES public.catalogo_fresas(sku, empresa_id)
          ON DELETE CASCADE;
      `
    },
    {
      name: '5. RLS',
      sql: `
        ALTER TABLE public.catalogo_protocolo_fresagem ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "proto_fresagem_select_own" ON public.catalogo_protocolo_fresagem
          FOR SELECT USING (empresa_id = public.get_current_empresa_id() OR public.is_super_admin_session());
        
        CREATE POLICY "proto_fresagem_insert_own" ON public.catalogo_protocolo_fresagem
          FOR INSERT WITH CHECK (empresa_id = public.get_current_empresa_id() OR public.is_super_admin_session());
        
        CREATE POLICY "proto_fresagem_update_own" ON public.catalogo_protocolo_fresagem
          FOR UPDATE USING (empresa_id = public.get_current_empresa_id() OR public.is_super_admin_session());
        
        CREATE POLICY "proto_fresagem_delete_own" ON public.catalogo_protocolo_fresagem
          FOR DELETE USING (empresa_id = public.get_current_empresa_id() OR public.is_super_admin_session());
      `
    },
    {
      name: '6. Grants',
      sql: `
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.catalogo_protocolo_fresagem TO authenticated;
        GRANT SELECT ON public.catalogo_protocolo_fresagem TO anon;
      `
    },
    {
      name: '7. Reload PostgREST',
      sql: `NOTIFY pgrst, 'reload schema';`
    },
  ];

  for (const step of steps) {
    console.log(`${step.name}...`);
    const r = await q(step.sql);
    if (r?.message) {
      if (r.message.includes('already exists')) console.log('   ✓ Já existe');
      else console.log(`   ❌ ${r.message.slice(0, 150)}`);
    } else {
      console.log('   ✓ OK');
    }
  }

  await sleep(3000);

  // Verificar
  console.log('\n--- Verificação ---');
  const verify = await q(`
    SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='catalogo_protocolo_fresagem') AS existe;
  `);
  if (Array.isArray(verify) && verify[0]) console.log(`   Tabela existe: ${verify[0].existe}`);

  // FKs
  const fks = await q(`
    SELECT kcu.column_name, ccu.table_name AS ref_table, ccu.column_name AS ref_col
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name AND tc.table_schema = ccu.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public' AND tc.table_name = 'catalogo_protocolo_fresagem';
  `);
  if (Array.isArray(fks)) for (const f of fks) console.log(`   FK: ${f.column_name} → ${f.ref_table}.${f.ref_col}`);

  // Teste REST
  console.log('\n--- Teste REST (service_role) ---');
  const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTc4ODc2OSwiZXhwIjoyMDk3MzY0NzY5fQ.nFgZm_frOy8K6e6LUpQNqQ4zVMrNoCKcM8MqYfDv9Ag';
  const EMPRESA = '6687e2f0-1ff6-406d-b621-7927764f121a';

  // Teste 1: Query implante COM join de protocolos
  const r1 = await new Promise((resolve, reject) => {
    const path = `/rest/v1/catalogo_implantes?select=*,protocolos:catalogo_protocolo_fresagem(*,fresa:catalogo_fresas(*))&empresa_id=eq.${EMPRESA}&sku=eq.IMP-003`;
    https.get({
      hostname: 'cluuqzhizeqvkgvfdisx.supabase.co',
      path: encodeURI(path),
      headers: { 'Authorization': 'Bearer ' + SERVICE_KEY, 'apikey': SERVICE_KEY },
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ s: res.statusCode, body: (() => { try { return JSON.parse(d); } catch { return d; } })() }));
    }).on('error', reject);
  });
  if (r1.s === 200) {
    console.log(`   ✓ Implante+protocolos: ${r1.body?.length ?? 0} rows`);
    if (r1.body?.[0]) console.log(`     protocolos: ${r1.body[0].protocolos?.length ?? 0}`);
  } else {
    console.log(`   ❌ ${r1.s}: ${JSON.stringify(r1.body).slice(0, 200)}`);
  }

  // Teste 2: Query protocolos diretamente
  const r2 = await new Promise((resolve, reject) => {
    https.get({
      hostname: 'cluuqzhizeqvkgvfdisx.supabase.co',
      path: encodeURI(`/rest/v1/catalogo_protocolo_fresagem?select=*,fresa:catalogo_fresas(*)*&empresa_id=eq.${EMPRESA}`),
      headers: { 'Authorization': 'Bearer ' + SERVICE_KEY, 'apikey': SERVICE_KEY },
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ s: res.statusCode, body: (() => { try { return JSON.parse(d); } catch { return d; } })() }));
    }).on('error', reject);
  });
  if (r2.s === 200) {
    console.log(`   ✓ Protocolos: ${r2.body?.length ?? 0} rows (vazio = ok, dados serão populados via UI)`);
  } else {
    console.log(`   ❌ ${r2.s}: ${JSON.stringify(r2.body).slice(0, 200)}`);
  }

  console.log('\n✅ CONCLUÍDO! Teste o frontend agora.');
}

main().catch(console.error);
