import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const url = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const keyMatch = env.match(/VITE_SUPABASE_SERVICE_ROLE_KEY=(.*)/) || env.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
const key = keyMatch[1].trim();

const supabase = createClient(url, key);

async function run() {
  if (keyMatch[0].includes('SERVICE_ROLE')) {
    console.log("Achei SERVICE_ROLE, usando Supabase Admin Auth...");
    const mocks = [
      { email: 'ana.oliveira@conexao.com.br', password: 'mockpassword123', name: 'Ana Oliveira' },
      { email: 'joao.silva@conexao.com.br', password: 'mockpassword123', name: 'Joao Silva' }
    ];
    for (const m of mocks) {
      console.log('Criando', m.email);
      const { data, error } = await supabase.auth.admin.createUser({
        email: m.email,
        password: m.password,
        email_confirm: true,
        user_metadata: { nome: m.name }
      });
      if (error && !error.message.includes('already exists')) {
        console.error(error);
      } else {
        console.log("Sucesso para", m.email, data.user?.id);
        if (data.user) {
           await supabase.from('profiles').update({ nome: m.name, is_super_admin: false, ativo: true }).eq('id', data.user.id);
        }
      }
    }
  } else {
    console.error("Nao achei VITE_SUPABASE_SERVICE_ROLE_KEY no .env! Sem ela n posso usar admin.createUser no Node. O RPC seria necessario.");
  }
}
run();
