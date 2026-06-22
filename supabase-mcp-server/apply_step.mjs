import pg from 'pg';
import fs from 'fs';
const { Client } = pg;
const fullSql = fs.readFileSync('../supabase/migrations/00033_multi_enderecos.sql', 'utf8');

// Split by semicolons but keep DO blocks intact
const statements = [];
let current = '';
let inDO = 0;
for (const line of fullSql.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('DO $$') || trimmed.startsWith('DO $')) inDO++;
  if (trimmed.startsWith('END $$') || trimmed.startsWith('END $')) inDO--;
  current += line + '\n';
  if (inDO === 0 && trimmed.endsWith(';') && !trimmed.startsWith('--')) {
    statements.push(current.trim());
    current = '';
  }
}
if (current.trim()) statements.push(current.trim());

const c = new Client({
  connectionString: 'postgresql://postgres:%40%23Khen741963%40%23@db.cluuqzhizeqvkgvfdisx.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});
await c.connect();

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  if (!stmt) continue;
  try {
    await c.query(stmt);
    console.log(`✓ Step ${i}: OK`);
  } catch (e) {
    console.error(`✗ Step ${i}: ${e.message}`);
    console.error(`  SQL: ${stmt.substring(0, 120)}...`);
    break;
  }
}
await c.end();
