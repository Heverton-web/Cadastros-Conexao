export type CalendarioEventoTipo = "post" | "reuniao" | "deadline" | "evento" | "lancamento";
export type CalendarioEventoStatus = "pendente" | "em_andamento" | "concluido" | "cancelado";

export type CalendarioEvento = {
  id: string;
  empresa_id: string;
  titulo: string;
  descricao: string | null;
  data: string;
  hora: string | null;
  tipo: CalendarioEventoTipo;
  plataforma: string | null;
  status: CalendarioEventoStatus;
  responsavel: string | null;
  created_at: string;
  updated_at: string;
};
