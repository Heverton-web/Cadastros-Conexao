import pg from 'pg';
const { Client } = pg;

const statements = [
  // 1. Drop old CHECK constraint first
  `ALTER TABLE public.form_schema DROP CONSTRAINT IF EXISTS form_schema_etapa_check;`,

  // 2. Update existing rows
  `UPDATE public.form_schema SET etapa = 'endereco_empresa' WHERE etapa = 'endereco';`,

  // 3. Add new CHECK constraint
  `ALTER TABLE public.form_schema ADD CONSTRAINT form_schema_etapa_check
  CHECK (etapa IN ('dados','endereco_empresa','endereco_entrega','endereco_cobranca','documentos'));`,

  // 4. Update UNIQUE constraint
  `ALTER TABLE public.form_schema DROP CONSTRAINT IF EXISTS form_schema_tipo_pessoa_campo_key_key;
ALTER TABLE public.form_schema ADD UNIQUE (tipo_pessoa, etapa, campo_key);`,

  // 5. Clone para entrega
  `INSERT INTO public.form_schema (tipo_pessoa, etapa, campo_key, label, tipo_input, opcoes, obrigatorio, visivel, ordem, is_custom)
SELECT tipo_pessoa, 'endereco_entrega', campo_key, label, tipo_input, opcoes, obrigatorio, visivel, ordem, is_custom
FROM public.form_schema WHERE etapa = 'endereco_empresa'
ON CONFLICT (tipo_pessoa, etapa, campo_key) DO NOTHING;`,

  // 6. Clone para cobranca
  `INSERT INTO public.form_schema (tipo_pessoa, etapa, campo_key, label, tipo_input, opcoes, obrigatorio, visivel, ordem, is_custom)
SELECT tipo_pessoa, 'endereco_cobranca', campo_key, label, tipo_input, opcoes, obrigatorio, visivel, ordem, is_custom
FROM public.form_schema WHERE etapa = 'endereco_empresa'
ON CONFLICT (tipo_pessoa, etapa, campo_key) DO NOTHING;`,
];

const c = new Client({
  connectionString: 'postgresql://postgres:%40%23Khen741963%40%23@db.cluuqzhizeqvkgvfdisx.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});
await c.connect();
for (let i = 0; i < statements.length; i++) {
  try {
    await c.query(statements[i]);
    console.log(`✓ Step ${i}: OK`);
  } catch (e) {
    console.error(`✗ Step ${i}: ${e.message}`);
    await c.end();
    process.exit(1);
  }
}
await c.end();
console.log('Form schema migration applied successfully');
