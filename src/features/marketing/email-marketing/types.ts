export type CampanhaEmail = {
  id: string;
  empresa_id: string;
  nome: string;
  assunto: string;
  remetente: string;
  conteudo_html: string | null;
  status: "rascunho" | "agendado" | "enviado" | "pausado";
  agendado_para: string | null;
  enviado_em: string | null;
  total_enviados: number;
  total_abertos: number;
  total_cliques: number;
  created_at: string;
  updated_at: string;
};

export type DisparoEmail = {
  id: string;
  empresa_id: string;
  campanha_id: string;
  email: string;
  enviado_em: string | null;
  aberto_em: string | null;
  clicado_em: string | null;
  status: "pendente" | "enviado" | "aberto" | "clicado" | "falhou";
};
