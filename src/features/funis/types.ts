export type FunilPrioridade = 'low' | 'medium' | 'high' | 'urgent';
export type FunilPermissaoNivel = 'view' | 'edit';

export type Funil = {
  id: string;
  titulo: string;
  descricao: string | null;
  created_by: string;
  empresa_id: string | null;
  created_at: string;
  updated_at: string;
  colunas?: FunilColuna[];
  tarefas?: FunilTarefa[];
};

export type FunilColuna = {
  id: string;
  funil_id: string;
  titulo: string;
  posicao: number;
  created_at: string;
};

export type FunilTarefa = {
  id: string;
  funil_id: string;
  coluna_id: string;
  titulo: string;
  descricao: string | null;
  posicao: number;
  prioridade: FunilPrioridade;
  atribuido_para: string | null;
  tools: string[];
  data_inicio: string | null;
  data_fim: string | null;
  depende_tarefa_id: string | null;
  parent_task_id: string | null;
  completed_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type FunilPermissao = {
  id: string;
  funil_id: string;
  user_id: string;
  nivel: FunilPermissaoNivel;
  created_at: string;
};

export type FunilInput = {
  titulo: string;
  descricao?: string;
  colunas?: string[];
};

export type FunilTarefaInput = {
  funil_id: string;
  coluna_id: string;
  titulo: string;
  descricao?: string;
  prioridade?: FunilPrioridade;
  atribuido_para?: string | null;
  tools?: string[];
  data_inicio?: string | null;
  data_fim?: string | null;
  depende_tarefa_id?: string | null;
  parent_task_id?: string | null;
};

export type FunilColunaInput = {
  funil_id: string;
  titulo: string;
  posicao?: number;
};

export type TemplateColuna = {
  id: string;
  template_id: string;
  titulo: string;
  posicao: number;
};

export type TemplateTarefa = {
  id: string;
  template_id: string;
  template_col_idx: number;
  titulo: string;
  descricao: string | null;
  prioridade: string;
  posicao: number;
};

export type Template = {
  id: string;
  nome: string;
  descricao: string | null;
  is_public: boolean;
  created_by: string;
  empresa_id: string | null;
  created_at: string;
  colunas?: TemplateColuna[];
  tarefas?: TemplateTarefa[];
};

export type TemplateInput = {
  nome: string;
  descricao?: string;
  is_public?: boolean;
  colunas?: string[];
  tarefas?: { col_idx: number; titulo: string; descricao?: string; prioridade?: string }[];
};
