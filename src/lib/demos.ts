import { supabase } from "./supabase";

export type LinkTeste = {
  id: string;
  cadastro_id: string;
  token: string;
  descricao: string;
  created_at: string;
};

export type DemoCredential = {
  id: string;
  user_id: string;
  email_demo: string;
  senha_demo: string;
  role_escolhida: string;
  qtd_cadastros_mock: number;
  created_at: string;
};

export async function listarLinksTestes() {
  const { data, error } = await supabase.from("links_testes").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data as LinkTeste[];
}

export async function criarLinkTeste(descricao: string, tipo: "PF" | "PJ") {
  // Cria cadastro
  const { data: cad, error: errCad } = await supabase.from("cadastros").insert({
    tipo_pessoa: tipo,
    status: "link_gerado",
    nome_temporario: "Cliente Teste " + tipo,
    link_expiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    observacoes: "Cadastro de Teste gerado pelo Lab",
    is_demo: true,
    token_acesso: crypto.randomUUID()
  }).select("id, token_acesso").single();
  if (errCad) throw errCad;

  // Cria o link
  const { data, error } = await supabase.from("links_testes").insert({
    cadastro_id: cad.id,
    token: cad.token_acesso,
    descricao
  }).select().single();
  if (error) throw error;
  return data as LinkTeste;
}

export async function excluirLinkTeste(id: string) {
  const { error } = await supabase.from("links_testes").delete().eq("id", id);
  if (error) throw error;
}

export async function listarDemoCredentials() {
  const { data, error } = await supabase.from("demo_credentials").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data as DemoCredential[];
}

export async function criarDemoCredential(email: string, senha: string, role_escolhida: string, qtd_cadastros_mock: number) {
  // Chama a stored procedure q o Supabase executa p criar user e ignorar o email confirm
  const { data: uid, error: rpcError } = await supabase.rpc("create_demo_user", {
    demo_email: email,
    demo_password: senha,
    role_esc: role_escolhida
  });
  if (rpcError) throw rpcError;

  // Associa
  const { data, error } = await supabase.from("demo_credentials").insert({
    user_id: uid,
    email_demo: email,
    senha_demo: senha,
    role_escolhida,
    qtd_cadastros_mock
  }).select().single();
  if (error) throw error;

  // Gerar os Mocks
  for (let i = 0; i < qtd_cadastros_mock; i++) {
    const isPf = Math.random() > 0.5;
    const s = ["dados_enviados", "em_analise", "aprovado"][Math.floor(Math.random()*3)];
    await supabase.from("cadastros").insert({
      created_by: uid,
      tipo_pessoa: isPf ? "PF" : "PJ",
      status: s,
      nome_temporario: `Cliente Demo ${i+1}`,
      is_demo: true
    });
  }

  return data as DemoCredential;
}

export async function excluirDemoCredential(id: string, user_id: string) {
  const { error } = await supabase.rpc("excluir_usuario_demo", { uid: user_id });
  if (error) throw error;
  // o user sendo deletado causa on delete cascade e some com a demo_credential
}
