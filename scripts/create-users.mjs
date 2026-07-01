import pg from "pg";

const PASSWORD = process.env.SUPABASE_DB_PASSWORD;
if (!PASSWORD) {
  console.error("Falta SUPABASE_DB_PASSWORD");
  process.exit(1);
}

const ENC = encodeURIComponent(PASSWORD);
const pool = new pg.Pool({
  connectionString: `postgresql://postgres:${ENC}@db.cluuqzhizeqvkgvfdisx.supabase.co:5432/postgres`,
});

const users = [
  {
    email: "hevertoneduardoperes@gmail.com",
    password: "@#Khen741963",
    nome: "Heverton Peres",
    role: "admin",
  },
  {
    email: "cadastro@conexao.com.br",
    password: "Conexao@2026",
    nome: "Cadastro Conexão",
    role: "editor",
  },
  {
    email: "consultor@conexao.com.br",
    password: "Conexao@2026",
    nome: "Consultor Conexão",
    role: "viewer",
  },
  {
    email: "ti@conexao.com.br",
    password: "Conexao@2026",
    nome: "TI Conexão",
    role: "admin",
  },
];

for (const u of users) {
  const { rows: existing } = await pool.query(
    "SELECT id, email FROM auth.users WHERE email = $1",
    [u.email],
  );
  if (existing.length > 0) {
    console.log(`✓ ${u.email} — já existe (role atual: via trigger)`);
    // Garante que o role está correto
    await pool.query(
      "UPDATE public.profiles SET role = $1, nome = $2 WHERE id = $3",
      [u.role, u.nome, existing[0].id],
    );
    console.log(`  → role atualizado para ${u.role}`);
    continue;
  }

  // Cria auth user + deixa o trigger criar o profile, depois atualiza role
  const { rows: created } = await pool.query(
    `
    INSERT INTO auth.users (
      instance_id, id, aud, role,
      email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token,
      is_super_admin
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(), 'authenticated', 'authenticated',
      $1, crypt($2, gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('nome', $3::text),
      now(), now(), '',
      false
    )
    RETURNING id
  `,
    [u.email, u.password, u.nome],
  );

  const userId = created[0].id;
  // Trigger cria profile com role='viewer', agora atualizamos
  await pool.query(
    "UPDATE public.profiles SET role = $1, nome = $2 WHERE id = $3",
    [u.role, u.nome, userId],
  );

  console.log(`+ ${u.email} — ${u.role} (${u.nome})`);
}

await pool.end();
