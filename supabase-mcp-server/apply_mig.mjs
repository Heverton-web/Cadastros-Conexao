import pg from 'pg';
import fs from 'fs';
const { Client } = pg;
const sql = fs.readFileSync('../supabase/migrations/00033_multi_enderecos.sql', 'utf8');
const c = new Client({
  connectionString: 'postgresql://postgres:%40%23Khen741963%40%23@db.cluuqzhizeqvkgvfdisx.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});
await c.connect();
try {
  await c.query(sql);
  console.log('Migration applied successfully');
} catch (e) {
  console.error('Error:', e.message);
  // Print which part failed by running line by line
  const lines = sql.split(';').filter(l => l.trim());
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    console.log(`Step ${i}:`, lines[i].trim().substring(0, 80) + '...');
  }
}
await c.end();
