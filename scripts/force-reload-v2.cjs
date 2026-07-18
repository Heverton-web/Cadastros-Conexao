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

async function main() {
  console.log('=== FORÇANDO RELOAD VIA SCHEMA CHANGE ===\n');

  // 1. Adicionar coluna dummy
  console.log('1. Adicionando coluna dummy...');
  const r1 = await q(`ALTER TABLE catalogo_implantes ADD COLUMN IF NOT EXISTS _reload_ts timestamptz DEFAULT now();`);
  console.log(`   ${JSON.stringify(r1)}`);

  // 2. Remover coluna dummy
  console.log('2. Removendo coluna dummy...');
  const r2 = await q(`ALTER TABLE catalogo_implantes DROP COLUMN IF EXISTS _reload_ts;`);
  console.log(`   ${JSON.stringify(r2)}`);

  // 3. NOTIFY again
  console.log('3. NOTIFY pgrst...');
  const r3 = await q(`NOTIFY pgrst, 'reload schema';`);
  console.log(`   ${JSON.stringify(r3)}`);

  // 4. Aguardar
  console.log('4. Aguardando 3s...');
  await new Promise(r => setTimeout(r, 3000));

  // 5. Verificar via REST API (service role)
  console.log('5. Verificando via REST...');
  const SUPABASE_URL = 'https://cluuqzhizeqvkgvfdisx.supabase.co';
  const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTc4ODc2OSwiZXhwIjoyMDk3MzY0NzY5fQ.nFgZm_frOy8K6e6LUpQNqQ4zVMrNoCKcM8MqYfDv9Ag';
  const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODg3NjksImV4cCI6MjA5NzM2NDc2OX0.GM3quHA1z_9kCiMEYsfAh9Pi0KVdnCIFQEYe-wwE9MM';

  // Testar via REST com service role
  const r4 = await new Promise((resolve, reject) => {
    https.get({
      hostname: 'cluuqzhizeqvkgvfdisx.supabase.co',
      path: '/rest/v1/catalogo_implantes?select=sku&limit=3',
      headers: { 'Authorization': 'Bearer ' + SERVICE_KEY, 'apikey': SERVICE_KEY },
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ s: res.statusCode, d: JSON.parse(d) }));
    }).on('error', reject);
  });
  console.log(`   Service role: status=${r4.s} rows=${r4.d?.length}`);

  // 6. Verificar políticas
  console.log('\n6. Verificando políticas restantes...');
  const r5 = await q(`
    SELECT schemaname, tablename, policyname, cmd
    FROM pg_policies 
    WHERE schemaname='public' AND tablename LIKE 'catalogo_implantes%'
    ORDER BY tablename, cmd;
  `);
  if (Array.isArray(r5)) {
    for (const p of r5) console.log(`   ${p.tablename} | ${p.cmd} | ${p.policyname}`);
  }

  console.log('\n✅ Schema alterado. Teste o frontend agora.');
}

main().catch(console.error);
