import { supabase } from "./supabase";

export type CadastroStatus = "link_gerado" | "dados_enviados" | "em_analise" | "em_correcao" | "aprovado" | "reprovado";

export type Cadastro = {
  id: string;
  codigo_cliente: string | null;
  tipo_pessoa: "PF" | "PJ" | null;
  status: CadastroStatus;
  token_acesso: string | null;
  nome_temporario: string | null;
  tipo_acao: "solicitar_cadastro" | "atualizar_cadastro" | null;
  forma_compartilhamento: "whatsapp" | "email" | "copiar" | null;
  link_expiracao: string | null;
  data_criacao_link: string | null;
  data_finalizacao: string | null;
  comentario_reprovacao: string | null;
  revisado: boolean;
  colaborador: string | null;
  observacoes: string;
  lead_nome: string | null;
  lead_email: string | null;
  lead_whatsapp: string | null;
  data_consulta: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  profiles?: { nome: string } | null;
};

export type CadastroInput = {
  tipo_acao?: "solicitar_cadastro" | "atualizar_cadastro";
  forma_compartilhamento?: "whatsapp" | "email" | "copiar";
  nome_temporario?: string | null;
  lead_nome?: string | null;
  lead_email?: string | null;
  lead_whatsapp?: string | null;
  link_expiracao?: string | null;
};

export async function listarCadastros(filters?: {
  status?: CadastroStatus;
  tipo_acao?: string;
  created_by?: string;
  search?: string;
}) {
  let query = supabase
    .from("cadastros")
    .select("*, profiles!created_by(nome)")
    .order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.tipo_acao) query = query.eq("tipo_acao", filters.tipo_acao);
  if (filters?.created_by) query = query.eq("created_by", filters.created_by);
  if (filters?.search) {
    query = query.or(
      `nome_temporario.ilike.%${filters.search}%,lead_nome.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as (Cadastro & { profiles: { nome: string } | null })[];
}

export async function buscarCadastro(id: string) {
  const { data, error } = await supabase
    .from("cadastros")
    .select("*, profiles!created_by(nome)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Cadastro & { profiles: { nome: string } | null };
}

export async function buscarCadastroCompleto(id: string) {
    const { data: cad, error } = await supabase
    .from("cadastros")
    .select("*, profiles!created_by(nome, email)")
    .eq("id", id)
    .single();
  if (error) throw error;

  const { data: pf } = await supabase.from("cadastros_pf").select("*").eq("cadastro_id", id).maybeSingle();
  const { data: pj } = await supabase.from("cadastros_pj").select("*").eq("cadastro_id", id).maybeSingle();
  const { data: end } = await supabase.from("cadastros_enderecos").select("*").eq("cadastro_id", id).maybeSingle();

  return { cadastro: cad, pf, pj, endereco: end };
}

export async function deletarCadastro(id: string) {
  const { error } = await supabase.from("cadastros").delete().eq("id", id);
  if (error) throw error;
}

export async function criarCadastro(input: CadastroInput) {
  const token = crypto.randomUUID();
  const { data, error } = await supabase
    .from("cadastros")
    .insert({
      ...input,
      token_acesso: token,
      status: "link_gerado",
      data_criacao_link: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data as Cadastro;
}

export async function atualizarCadastro(id: string, input: Partial<Cadastro>) {
  const { data, error } = await supabase
    .from("cadastros")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Cadastro;
}

export async function aprovarCadastro(id: string, codigo_cliente: string) {
  return atualizarCadastro(id, {
    status: "aprovado",
    codigo_cliente,
    data_finalizacao: new Date().toISOString(),
    revisado: true,
  });
}

export async function reprovarCadastro(id: string, motivo: string) {
  return atualizarCadastro(id, {
    status: "reprovado",
    comentario_reprovacao: motivo,
    data_finalizacao: new Date().toISOString(),
  });
}

export async function solicitarCorrecao(id: string, comentario: string) {
  return atualizarCadastro(id, {
    status: "em_correcao",
    comentario_reprovacao: comentario,
  });
}

export const STATUS_LABEL: Record<CadastroStatus, string> = {
  link_gerado: "Link Gerado",
  dados_enviados: "Dados Enviados",
  em_analise: "Em Análise",
  em_correcao: "Em Correção",
  aprovado: "Aprovado",
  reprovado: "Reprovado",
};

export const STATUS_COLOR: Record<CadastroStatus, string> = {
  link_gerado: "bg-blue-500/10 text-blue-400",
  dados_enviados: "bg-cyan-500/10 text-cyan-400",
  em_analise: "bg-yellow-500/10 text-yellow-400",
  em_correcao: "bg-orange-500/10 text-orange-400",
  aprovado: "bg-green-500/10 text-green-400",
  reprovado: "bg-red-500/10 text-red-400",
};

const STATUS_ORDER: Record<CadastroStatus, number> = {
  link_gerado: 0,
  dados_enviados: 1,
  em_analise: 2,
  em_correcao: 3,
  aprovado: 4,
  reprovado: 5,
};

export function getStatusOrder(s: CadastroStatus): number {
  return STATUS_ORDER[s];
}
