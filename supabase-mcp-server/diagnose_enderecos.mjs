import pg from 'pg';
const { Client } = pg;
const c = new Client({
  connectionString: 'postgresql://postgres:%40%23Khen741963%40%23@db.cluuqzhizeqvkgvfdisx.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});
await c.connect();
try {
  // 1. Mostrar colunas da tabela public.cadastros_enderecos
  const cols = await c.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'cadastros_enderecos'
  `);
  console.log("=== COLUNAS DE CADASTROS_ENDERECOS ===");
  console.log(cols.rows.map(r => r.column_name).join(', '));

  // 2. Mostrar dados atuais de public.cadastros_enderecos
  const res = await c.query("SELECT * FROM public.cadastros_enderecos");
  console.log("=== ENDERECOS ATUAIS ===");
  console.table(res.rows);

} catch (e) {
  console.error(e);
}
await c.end();
