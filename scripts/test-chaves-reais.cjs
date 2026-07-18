const https = require('https');
const SUPABASE_URL = 'https://cluuqzhizeqvkgvfdisx.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODg3NjksImV4cCI6MjA5NzM2NDc2OX0.GM3quHA1z_9kCiMEYsfAh9Pi0KVdnCIFQEYe-wwE9MM';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTc4ODc2OSwiZXhwIjoyMDk3MzY0NzY5fQ.nFgZm_frOy8K6e6LUpQNqQ4zVMrNoCKcM8MqYfDv9Ag';

function q(path, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SUPABASE_URL);
    https.get({
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: { 'Authorization': 'Bearer ' + token, 'apikey': token },
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve({ s: res.statusCode, d: JSON.parse(d) }); } catch { resolve({ s: res.statusCode, d }); } });
    }).on('error', reject);
  });
}

async function main() {
  console.log('=== TESTE COM CHAVES REAIS ===\n');

  // Service role: dados existem?
  console.log('--- service_role: implantes ---');
  const r1 = await q('/rest/v1/catalogo_implantes?select=sku,nome,empresa_id&limit=5&order=sku', SERVICE_KEY);
  console.log(`  Status: ${r1.s} | Rows: ${Array.isArray(r1.d) ? r1.d.length : 'erro'}`);
  if (Array.isArray(r1.d) && r1.d.length > 0) r1.d.forEach(x => console.log(`  ${x.sku} | ${x.nome} | ${x.empresa_id}`));
  else console.log(`  ${JSON.stringify(r1.d).substring(0, 200)}`);

  // Service role: empresas
  console.log('\n--- service_role: empresas ---');
  const r2 = await q('/rest/v1/empresas?select=id,nome,ativo', SERVICE_KEY);
  console.log(`  Status: ${r2.s} | Rows: ${Array.isArray(r2.d) ? r2.d.length : 'erro'}`);
  if (Array.isArray(r2.d)) r2.d.forEach(x => console.log(`  ${x.id} | ${x.nome} | ${x.ativo}`));

  // Anon: implantes (com RLS, sem sessão = deve retornar vazio)
  console.log('\n--- anon (sem sessão): implantes ---');
  const r3 = await q('/rest/v1/catalogo_implantes?select=sku&limit=3', ANON_KEY);
  console.log(`  Status: ${r3.s} | Rows: ${Array.isArray(r3.d) ? r3.d.length : 'erro'}`);
  if (r3.s !== 200) console.log(`  ${JSON.stringify(r3.d).substring(0, 200)}`);

  // Verificar se PostgREST enxerga as funções
  console.log('\n--- anon: RPC get_current_empresa_id ---');
  const r4 = await q('/rest/v1/rpc/get_current_empresa_id', ANON_KEY);
  console.log(`  Status: ${r4.s} | Result: ${JSON.stringify(r4.d)}`);

  console.log('\n=== CONCLUSÃO ===');
  console.log('Se service_role tem dados = banco OK');
  console.log('Se anon retorna vazio = RLS funcionando (esperado sem sessão)');
  console.log('Se RPC retorna null = correto (sem auth.uid())');
  console.log('\nO problema do frontend é:');
  console.log('  1. PostgREST cache NÃO recarregou (NOTIFY não propaga da Management API)');
  console.log('  2. OU frontend não está enviando sessão autenticada');
}

main().catch(console.error);
