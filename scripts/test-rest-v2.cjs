/**
 * Teste REST API com chaves corretas
 */

const https = require('https');

const SUPABASE_URL = 'https://cluuqzhizeqvkgvfdisx.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODg3NjksImV4cCI6MjA5NzM2NDc2OX0.GM3quHA1z_9kCiMEYsfAh9Pi0KVdnCIFQEYe-wwE9MM';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTc4ODc2OSwiZXhwIjoyMDk3MzY0NzY5fQ.PLACEHOLDER_SERVICE_ROLE_KEY';

function restQuery(path, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SUPABASE_URL);
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'apikey': token,
        'Content-Type': 'application/json',
      },
    }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, data: JSON.parse(data) }); } catch { resolve({ status: res.statusCode, data }); } });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('=== TESTE REST API ===\n');

  // 1. Anon: implantes
  console.log('--- Anon: catalogo_implantes ---');
  const r1 = await restQuery('/rest/v1/catalogo_implantes?select=sku,nome,empresa_id&limit=5&order=sku', ANON_KEY);
  console.log(`   Status: ${r1.status}`);
  if (Array.isArray(r1.data)) {
    console.log(`   Dados: ${r1.data.length} rows`);
    for (const d of r1.data) console.log(`   - ${d.sku} | ${d.nome} | ${d.empresa_id}`);
  } else {
    console.log(`   Resposta: ${JSON.stringify(r1.data).substring(0, 300)}`);
  }

  // 2. Anon: categorias
  console.log('\n--- Anon: catalogo_categorias ---');
  const r2 = await restQuery('/rest/v1/catalogo_categorias?select=nome,empresa_id&limit=5', ANON_KEY);
  console.log(`   Status: ${r2.status}`);
  if (Array.isArray(r2.data)) {
    console.log(`   Dados: ${r2.data.length} rows`);
    for (const d of r2.data) console.log(`   - ${d.nome} | ${d.empresa_id}`);
  } else {
    console.log(`   Resposta: ${JSON.stringify(r2.data).substring(0, 300)}`);
  }

  // 3. Anon: empresas
  console.log('\n--- Anon: empresas ---');
  const r3 = await restQuery('/rest/v1/empresas?select=id,nome,ativo', ANON_KEY);
  console.log(`   Status: ${r3.status}`);
  if (Array.isArray(r3.data)) {
    console.log(`   Dados: ${r3.data.length} rows`);
    for (const d of r3.data) console.log(`   - ${d.id} | ${d.nome} | ${d.ativo}`);
  } else {
    console.log(`   Resposta: ${JSON.stringify(r3.data).substring(0, 300)}`);
  }

  // 4. Anon: RPC
  console.log('\n--- Anon: RPC get_current_empresa_id ---');
  const r4 = await restQuery('/rest/v1/rpc/get_current_empresa_id', ANON_KEY);
  console.log(`   Status: ${r4.status}`);
  console.log(`   Resultado: ${JSON.stringify(r4.data)}`);

  // 5. Anon: RPC is_super_admin
  console.log('\n--- Anon: RPC is_super_admin_session ---');
  const r5 = await restQuery('/rest/v1/rpc/is_super_admin_session', ANON_KEY);
  console.log(`   Status: ${r5.status}`);
  console.log(`   Resultado: ${JSON.stringify(r5.data)}`);

  console.log('\n=== FIM ===');
  console.log('Anon key = requests do frontend (com sessão Supabase)');
  console.log('Se status 200 + dados = PostgREST enxerga tudo');
  console.log('Se status 401 = chave errada');
  console.log('Se status 200 + vazio = RLS bloqueando (esperado sem auth)');
}

main().catch(console.error);
