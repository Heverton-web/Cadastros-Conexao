const https = require('https');
const TOKEN = process.env.SUPABASE_SERVICE_TOKEN || '';
const PROJECT = 'cluuqzhizeqvkgvfdisx';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTc4ODc2OSwiZXhwIjoyMDk3MzY0NzY5fQ.nFgZm_frOy8K6e6LUpQNqQ4zVMrNoCKcM8MqYfDv9Ag';

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

function rest(path) {
  return new Promise((resolve, reject) => {
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
}

async function main() {
  console.log('=== DIAGNÓSTICO FICHA TÉCNICA IMPLANTE ===\n');

  // 1. Verificar FK: catalogo_protocolo_fresagem → catalogo_implantes
  console.log('--- 1. FK protocolo_fresagem → implantes ---');
  const fk1 = await q(`
    SELECT tc.table_name, kcu.column_name, ccu.table_name AS ref_table, ccu.column_name AS ref_col
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name AND tc.table_schema = ccu.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
      AND tc.table_name IN ('catalogo_protocolo_fresagem', 'catalogo_fresas')
    ORDER BY tc.table_name;
  `);
  if (Array.isArray(fk1)) for (const f of fk1) console.log(`   ${f.table_name}.${f.column_name} → ${f.ref_table}.${f.ref_col}`);
  else console.log('   Nenhuma FK encontrada!', JSON.stringify(fk1).slice(0, 200));

  // 2. Verificar FK: catalogo_fresas → catalogo_tipos_fresas
  console.log('\n--- 2. FK fresas → tipos_fresas ---');
  const fk2 = await q(`
    SELECT tc.table_name, kcu.column_name, ccu.table_name AS ref_table
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name AND tc.table_schema = ccu.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
      AND tc.table_name = 'catalogo_fresas';
  `);
  if (Array.isArray(fk2)) for (const f of fk2) console.log(`   ${f.table_name}.${f.column_name} → ${f.ref_table}`);
  else console.log('   Nenhuma FK!', JSON.stringify(fk2).slice(0, 200));

  // 3. PKs das tabelas
  console.log('\n--- 3. PKs ---');
  const pks = await q(`
    SELECT tc.table_name, kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
    WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_schema = 'public'
      AND tc.table_name IN ('catalogo_protocolo_fresagem', 'catalogo_fresas', 'catalogo_tipos_fresas')
    ORDER BY tc.table_name;
  `);
  if (Array.isArray(pks)) for (const p of pks) console.log(`   ${p.table_name}: ${p.column_name}`);

  // 4. Teste REST: query exata do frontend (com join)
  console.log('\n--- 4. Teste REST: getImplanteDetalhe (join) ---');
  const EMPRESA = '6687e2f0-1ff6-406d-b621-7927764f121a';
  const r1 = await rest(`/rest/v1/catalogo_implantes?select=*,linha:catalogo_ips_linhas(*,familia:catalogo_ips_familias(*,conexao:catalogo_ips_conexoes(*,categoria:catalogo_categorias(*)))),conexao:catalogo_ips_conexoes(*),familia:catalogo_ips_familias(*),protocolos:catalogo_protocolo_fresagem(*,fresa:catalogo_fresas(*))&empresa_id=eq.${EMPRESA}&sku=eq.IMP-003`);
  if (r1.s === 200 && Array.isArray(r1.body)) {
    console.log(`   ✓ Status 200, ${r1.body.length} rows`);
    if (r1.body.length > 0) {
      const imp = r1.body[0];
      console.log(`   SKU: ${imp.sku}`);
      console.log(`   linha: ${imp.linha?.nome ?? 'null'}`);
      console.log(`   familia: ${imp.linha?.familia?.nome ?? 'null'}`);
      console.log(`   conexao: ${imp.conexao?.nome ?? 'null'}`);
      console.log(`   protocolos: ${imp.protocolos?.length ?? 0}`);
      if (imp.protocolos?.length > 0) {
        console.log(`   proto[0]: ${JSON.stringify(imp.protocolos[0]).slice(0, 120)}`);
      }
      console.log(`   diametro: ${imp.diametro_mm}`);
      console.log(`   comprimento: ${imp.comprimento_mm}`);
      console.log(`   rosca_interna: ${imp.rosca_interna}`);
      console.log(`   torque: ${imp.torque_insercao}`);
    }
  } else {
    console.log(`   ❌ Status ${r1.s}: ${JSON.stringify(r1.body).slice(0, 300)}`);
  }

  // 5. Teste REST: query SEM join (só pra ver se dados existem)
  console.log('\n--- 5. Teste REST: sem join ---');
  const r2 = await rest(`/rest/v1/catalogo_implantes?select=*&empresa_id=eq.${EMPRESA}&sku=eq.IMP-003`);
  if (r2.s === 200 && Array.isArray(r2.body)) {
    console.log(`   ✓ ${r2.body.length} rows`);
    if (r2.body.length > 0) console.log(`   data: ${JSON.stringify(r2.body[0]).slice(0, 200)}`);
  } else {
    console.log(`   ❌ ${r2.s}: ${JSON.stringify(r2.body).slice(0, 200)}`);
  }

  // 6. Verificar: existe tabela catalogo_protocolo_fresagem?
  console.log('\n--- 6. Tabela catalogo_protocolo_fresagem ---');
  const tbl = await q(`
    SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='catalogo_protocolo_fresagem') AS existe,
           (SELECT COUNT(*) FROM catalogo_protocolo_fresagem) AS total_rows;
  `);
  if (Array.isArray(tbl) && tbl[0]) console.log(`   existe=${tbl[0].existe} total=${tbl[0].total_rows}`);

  // 7. Dados da tabela protocolo_fresagem
  console.log('\n--- 7. Dados catalogo_protocolo_fresagem ---');
  const prot = await q(`SELECT * FROM catalogo_protocolo_fresagem LIMIT 3;`);
  if (Array.isArray(prot)) for (const p of prot) console.log(`   ${JSON.stringify(p).slice(0, 150)}`);
  else console.log(`   ${JSON.stringify(prot).slice(0, 200)}`);
}

main().catch(console.error);
