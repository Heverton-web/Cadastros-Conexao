export type MktgEnvioEmail = {
  id: string;
  empresa_id: string;
  campanha_id: string;
  email: string;
  enviado_em: string | null;
  aberto_em: string | null;
  clicado_em: string | null;
  status: "pendente" | "enviado" | "aberto" | "clicado" | "falhou";
};

export type MktgLead = {
  id: string;
  empresa_id: string;
  nome: string;
  email: string;
  telefone: string | null;
  origem: string | null;
  fonte: string | null;
  score: number;
  status: "novo" | "qualificado" | "convertido" | "perdido";
  tags: string[];
  created_at: string;
};
