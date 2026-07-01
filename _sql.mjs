import pg from "pg";
const c = new pg.Client({
  connectionString:
    "postgresql://postgres:%40%23Khen741963%40%23@db.cluuqzhizeqvkgvfdisx.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});
await c.connect();
await c.query(
  "ALTER TABLE cadastros ADD COLUMN IF NOT EXISTS revisoes jsonb DEFAULT '{}'::jsonb",
);
console.log("revisoes column added");
const r = await c.query(
  "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='cadastros' AND column_name='revisoes'",
);
for (const x of r.rows) console.log(x.column_name, x.data_type);
await c.end();
