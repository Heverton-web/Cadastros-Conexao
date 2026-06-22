import pg from 'pg';
const { Client } = pg;
const c = new Client({
  connectionString: 'postgresql://postgres:%40%23Khen741963%40%23@db.cluuqzhizeqvkgvfdisx.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});
await c.connect();

// Check view definition
const r = await c.query(`
  SELECT view_definition FROM information_schema.views 
  WHERE table_name = 'clientes' AND table_schema = 'public'
`);
console.log('View definition:');
console.log(r.rows[0]?.view_definition?.substring(0, 500));

// Also check column names of the view
const cols = await c.query(`
  SELECT column_name FROM information_schema.columns 
  WHERE table_name = 'clientes' AND table_schema = 'public'
  ORDER BY ordinal_position
`);
console.log('\nView columns:', cols.rows.map(x => x.column_name).join(', '));

await c.end();
