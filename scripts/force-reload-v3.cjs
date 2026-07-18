const https = require('https');
const TOKEN = 'sbp_aa98d34c7b02c9545b3ec68f22ef9542bff48839';
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
  console.log('=== FORÇANDO RELOAD POSTGREST (MÉTODO DEFINITIVO) ===\n');

  // Método 1: Touch na tabela + NOTIFY
  console.log('1. ALTER TABLE touch...');
  await q(`ALTER TABLE catalogo_implantes ADD COLUMN IF NOT EXISTS __reload timestamptz;`);
  await q(`ALTER TABLE catalogo_implantes DROP COLUMN IF EXISTS __reload;`);
  console.log('   ✓ Touch feito');

  // Método 2: Recriar função simples (força detecção)
  console.log('2. Recriando get_current_empresa_id...');
  await q(`
    CREATE OR REPLACE FUNCTION public.get_current_empresa_id()
    RETURNS uuid
    LANGUAGE sql
    STABLE
    SECURITY DEFINER
    SET search_path = ''
    AS $$SELECT empresa_id FROM public.profiles WHERE id = auth.uid();$$;
  `);
  console.log('   ✓ Função recriada');

  // Método 3: NOTIFY duplo
  console.log('3. NOTIFY pgrst (duplo)...');
  await q(`NOTIFY pgrst, 'reload schema';`);
  await sleep(500);
  await q(`NOTIFY pgrst, 'reload schema';`);
  console.log('   ✓ NOTIFY enviado');

  // Método 4: Comment on (força catálogo change)
  console.log('4. COMMENT ON TABLE...');
  await q(`COMMENT ON TABLE catalogo_implantes IS 'Implantes do catálogo - ' || now()::text;`);
  console.log('   ✓ Comment atualizado');

  // Esperar PostgREST processar
  console.log('\n5. Aguardando 5s para PostgREST processar...');
  await sleep(5000);

  // 6. Verificar via REST API como anon (deve retornar dados se RLS OK + schema OK)
  console.log('\n6. Teste REST API (anon, sem sessão)...');
  const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODg3NjksImV4cCI6MjA5NzM2NDc2OX0.GM3quHA1z_9kCiMEYsfAh9Pi0KVdnCIFQEYe-wwE9MM';

  // Teste 1: Query simples (sem join)
  const r1 = await new Promise((resolve, reject) => {
    https.get({
      hostname: 'cluuqzhizeqvkgvfdisx.supabase.co',
      path: '/rest/v1/catalogo_implantes?select=sku&limit=3',
      headers: { 'Authorization': 'Bearer ' + ANON_KEY, 'apikey': ANON_KEY },
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ s: res.statusCode, d, body: (() => { try { return JSON.parse(d); } catch { return d; } })() }));
    }).on('error', reject);
  });
  console.log(`   Simples: status=${r1.s} data=${JSON.stringify(r1.body).slice(0, 100)}`);

  // Teste 2: Query COM join (a que o frontend faz)
  console.log('\n7. Teste REST API (anon, COM join)...');
  const joinPath = '/rest/v1/catalogo_implantes?select=sku,linha:catalogo_ips_linhas(nome)&limit=3';
  const r2 = await new Promise((resolve, reject) => {
    https.get({
      hostname: 'cluuqzhizeqvkgvfdisx.supabase.co',
      path: encodeURI(joinPath),
      headers: { 'Authorization': 'Bearer ' + ANON_KEY, 'apikey': ANON_KEY },
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ s: res.statusCode, d, body: (() => { try { return JSON.parse(d); } catch { return d; } })() }));
    }).on('error', reject);
  });
  console.log(`   Join: status=${r2.s} data=${JSON.stringify(r2.body).slice(0, 200)}`);

  // 8. Testar como service_role (deve funcionar sempre)
  console.log('\n8. Teste REST API (service_role, com join)...');
  const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTc4ODc2OSwiZXhwIjoyMDk3MzY0NzY5fQ.nFgZm_frOy8K6e6LUpQNqQ4zVMrNoCKcM8MqYfDv9Ag';
  const r3 = await new Promise((resolve, reject) => {
    https.get({
      hostname: 'cluuqzhizeqvkgvfdisx.supabase.co',
      path: encodeURI('/rest/v1/catalogo_implantes?select=sku,linha:catalogo_ips_linhas(nome)&limit=3'),
      headers: { 'Authorization': 'Bearer ' + SERVICE_KEY, 'apikey': SERVICE_KEY },
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ s: res.statusCode, d, body: (() => { try { return JSON.parse(d); } catch { return d; } })() }));
    }).on('error', reject);
  });
  console.log(`   Join (SR): status=${r3.s} data=${JSON.stringify(r3.body).slice(0, 200)}`);

  // Diagnóstico final
  console.log('\n=== DIAGNÓSTICO ===');
  if (r2.s === 200 && Array.isArray(r2.body) && r2.body.length > 0) {
    console.log('✅ PostgREST reconhece a FK! JOIN funciona como anon.');
    console.log('   → Se o frontend ainda não mostra dados, o problema é autenticação (JWT/expired session).');
  } else if (r2.s === 400) {
    console.log('❌ PostgREST NÃO reconhece a FK. Erro 400 = schema cache antigo.');
    console.log('   → Recarregue via Dashboard: Settings → API → Reload Schema');
  } else if (r2.s === 200 && r2.body.length === 0) {
    console.log('✓ PostgREST OK, FK OK, mas RLS bloqueia anon (esperado).');
    console.log('   → Teste logado no ERP. Se não funciona, pode ser session expirada.');
  } else {
    console.log(`⚠️  Status inesperado: ${r2.s}`);
    console.log(`   ${JSON.stringify(r2.body).slice(0, 300)}`);
  }
}

main().catch(console.error);
