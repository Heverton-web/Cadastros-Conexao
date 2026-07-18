/**
 * Teste via Supabase REST API - simula queries do frontend
 * Usa service_role para bypass RLS e verificar dados
 * Usa anon key para testar com RLS real
 */

const https = require('https');

const SUPABASE_URL = 'https://cluuqzhizeqvkgvfdisx.supabase.co';
// Usar service_role para queries de teste (bypass RLS)
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbHVxemhpemVxdmtndmZkaXh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTY4MjgwMCwiZXhwIjoyMDUxMjU4ODAwfQ.dBn2sMGnK4k2mHkGN2b2b9KJfBn1dNq3Gx1Y3z8a0sA';

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
  console.log('=== TESTE REST API - SIMULANDO FRONTEND ===\n');

  // 1. service_role: dados existem?
  console.log('--- 1. service_role: implantes (bypass RLS) ---');
  const r1 = await restQuery('/rest/v1/catalogo_implantes?select=sku,nome,empresa_id&limit=3', SERVICE_ROLE);
  console.log(`   Status: ${r1.status}`);
  if (Array.isArray(r1.data)) {
    console.log(`   Dados: ${r1.data.length} rows`);
    for (const d of r1.data) console.log(`   - ${d.sku} | ${d.nome} | ${d.empresa_id}`);
  } else {
    console.log(`   Resposta: ${JSON.stringify(r1.data).substring(0, 200)}`);
  }

  // 2. service_role: categorias
  console.log('\n--- 2. service_role: categorias ---');
  const r2 = await restQuery('/rest/v1/catalogo_categorias?select=nome,empresa_id&limit=5', SERVICE_ROLE);
  console.log(`   Status: ${r2.status}`);
  if (Array.isArray(r2.data)) {
    console.log(`   Dados: ${r2.data.length} rows`);
    for (const d of r2.data) console.log(`   - ${d.nome} | ${d.empresa_id}`);
  }

  // 3. Verificar PostgREST enxerga as funções (RPC)
  console.log('\n--- 3. RPC: get_current_empresa_id (service_role) ---');
  const r3 = await restQuery('/rest/v1/rpc/get_current_empresa_id', SERVICE_ROLE);
  console.log(`   Status: ${r3.status}`);
  console.log(`   Resultado: ${JSON.stringify(r3.data)}`);

  // 4. Verificar anon key (sem auth)
  console.log('\n--- 4. Anon key: implantes (com RLS) ---');
  const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbHVxemhpemVxdmtndmZkaXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2ODI4MDAsImV4cCI6MjA1MTI1ODgwMH0.RnDl8sN0t0J8hOJ2Fh6i9L3K5m7N9pQ1rS4t6W8x0Y';
  const r4 = await restQuery('/rest/v1/catalogo_implantes?select=sku,nome&limit=3', ANON);
  console.log(`   Status: ${r4.status}`);
  if (Array.isArray(r4.data)) {
    console.log(`   Dados: ${r4.data.length} rows (esperado 0 sem auth)`);
  } else {
    console.log(`   Resposta: ${JSON.stringify(r4.data).substring(0, 300)}`);
  }

  console.log('\n=== FIM ===');
  console.log('Se service_role retorna dados mas anon retorna vazio = RLS OK');
  console.log('Se ambos retornam vazio = problema nos dados');
  console.log('Se ambos retornam dados = RLS desabilitado');
}

main().catch(console.error);
