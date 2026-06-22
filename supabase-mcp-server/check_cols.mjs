import pg from 'pg';
const { Client } = pg;
const c = new Client({
  connectionString: 'postgresql://postgres:%40%23Khen741963%40%23@db.cluuqzhizeqvkgvfdisx.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});
await c.connect();
try {
  const empId = '6687e2f0-1ff6-406d-b621-7927764f121a';

  // 1. Verificar se a credencial cadastro@conexao.com.br já existe
  const exist = await c.query("SELECT id FROM public.credenciais WHERE email_corporativo = 'cadastro@conexao.com.br'");
  if (exist.rows.length === 0) {
    await c.query(`
      INSERT INTO public.credenciais (nome_completo, email_corporativo, departamento, ativo, empresa_id, escopos)
      VALUES ('Cadastro Conexão', 'cadastro@conexao.com.br', 'Administrativo', true, $1, '[]'::jsonb)
    `, [empId]);
    console.log('Credencial cadastro@conexao.com.br inserida');
  } else {
    await c.query(`
      UPDATE public.credenciais 
      SET empresa_id = $1 
      WHERE email_corporativo = 'cadastro@conexao.com.br'
    `, [empId]);
    console.log('Credencial cadastro@conexao.com.br atualizada');
  }

  // 2. Atualizar as demais credenciais (exceto o superadmin)
  const res = await c.query(`
    UPDATE public.credenciais 
    SET empresa_id = $1 
    WHERE email_corporativo != 'hevertoneduardoperes@gmail.com'
  `, [empId]);
  console.log('Credenciais atualizadas no banco:', res.rowCount);

} catch (e) {
  console.error('Erro ao atualizar credenciais:', e.message);
}
await c.end();
