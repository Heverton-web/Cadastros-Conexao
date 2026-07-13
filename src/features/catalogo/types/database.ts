// MÓDULO 1: HIERARQUIA
export interface Categoria {
  id: number;
  nome: string;
}
export interface Conexao {
  id: number;
  categoria_id: number;
  nome: string;
  sigla: string;
}
export interface Familia {
  id: number;
  conexao_id: number;
  nome: string;
  cor_identificacao: string;
}
export interface Linha {
  id: number;
  familia_id: number;
  nome: string;
  ativo: boolean;
}

// MÓDULO 2: IMPLANTES E CIRURGIA
export interface Implante {
  sku: string;
  linha_id: number;
  diametro_mm: number;
  comprimento_mm: number;
  rosca_interna: string;
  regiao_apical: string;
  regiao_cervical: string;
  torque_insercao: number;
  detalhes_extras: any;
  ativo: boolean;
}
export interface ImagemImplante {
  id: number;
  implante_sku: string;
  url_imagem: string;
  ordem_exibicao: number;
}
export interface Fresa {
  sku: string;
  nome: string;
  diametro_mm: number;
  venda_avulsa: boolean;
}
export interface ProtocoloFresagem {
  id: number;
  implante_sku: string;
  fresa_sku: string;
  tipo_osso: string;
  ordem_uso: number;
}

// MÓDULO 3: COMPONENTES PROTÉTICOS
export interface TipoReabilitacao {
  id: number;
  nome: string;
}
export interface TipoAbutment {
  id: number;
  nome: string;
  sigla: string;
}
export interface Abutment {
  sku: string;
  familia_id: number;
  tipo_reabilitacao_id: number;
  tipo_abutment_id: number;
  diametro_plataforma_mm: number;
  angulacao_graus: number;
  tipo_peca: string;
  altura_transmucoso_mm: number;
  altura_corpo_mm: number;
  torque_ncm: number;
  url_imagem: string;
}

// MÓDULO 4: ACESSÓRIOS E FERRAMENTAS
export interface CategoriaAcessorio {
  id: number;
  nome: string;
}
export interface Acessorio {
  sku: string;
  categoria_id: number;
  nome: string;
  diametro_mm: number;
  altura_mm: number;
  material: string;
  torque_ncm: number;
  caracteristicas_tecnicas: any;
  url_imagem: string;
}
export interface ChaveFerramental {
  sku: string;
  nome: string;
  tipo_ferramenta: string;
  comprimento_mm: number;
  venda_avulsa: boolean;
  url_imagem: string;
}
export interface AcessorioFerramental {
  acessorio_sku: string;
  ferramenta_sku: string;
  obrigatorio: boolean;
}
export interface CategoriaInstrumental {
  id: number;
  nome: string;
}
export interface InstrumentalGeral {
  sku: string;
  categoria_id: number;
  nome: string;
  detalhes_tecnicos: any;
  venda_avulsa: boolean;
  url_imagem: string;
}

// MÓDULO 5: MOTOR DE WORKFLOWS
export interface Workflow {
  id: number;
  nome: string;
}
export interface EtapaWorkflow {
  id: number;
  ordem: number;
  nome: string;
}
export interface GuiaReabilitacao {
  id: number;
  familia_id: number;
  tipo_abutment_id: number | null;
  diametro_plataforma_ref: number;
  workflow_id: number;
  etapa_id: number;
  acessorio_sku: string;
}

// MÓDULO 6: KITS E BOM
export interface CategoriaKit {
  id: number;
  nome: string;
}
export interface Kit {
  sku: string;
  categoria_id: number;
  nome: string;
  descricao: string;
  url_imagem: string;
  ativo: boolean;
}
export interface KitFamilia {
  kit_sku: string;
  familia_id: number;
}
export interface KitComposicao {
  id: number;
  kit_sku: string;
  quantidade: number;
  fresa_sku?: string;
  chave_sku?: string;
  acessorio_sku?: string;
  instrumental_sku?: string;
  implante_sku?: string;
}
