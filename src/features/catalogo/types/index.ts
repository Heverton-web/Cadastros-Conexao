export type TipoOsso = "Soft (III-IV)" | "Hard (I-II)"
export type TipoFerramenta = "Aperto" | "Medição" | "Cirúrgica"
export type ProductSheetTipo =
  | "implante"
  | "abutment"
  | "kit"
  | "fresa"
  | "chave"
  | "acessorio"
  | "instrumental"
  | "promocional"

export interface CatalogoCategoria {
  id: string
  empresa_id: string
  nome: string
  locked: boolean
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface CatalogoConexao {
  id: string
  empresa_id: string
  categoria_id: string
  nome: string
  sigla: string | null
  locked: boolean
  ativo: boolean
  created_at: string
  updated_at: string
  categoria?: CatalogoCategoria
}

export interface CatalogoFamilia {
  id: string
  empresa_id: string
  conexao_id: string
  nome: string
  cor_identificacao: string
  ativo: boolean
  created_at: string
  updated_at: string
  conexao?: CatalogoConexao
}

export interface CatalogoLinha {
  id: string
  empresa_id: string
  familia_id: string
  nome: string
  ativo: boolean
  created_at: string
  updated_at: string
  familia?: CatalogoFamilia
}

export interface CatalogoImplante {
  sku: string
  empresa_id: string
  linha_id: string
  diametro_mm: number
  comprimento_mm: number
  rosca_interna: string | null
  regiao_apical: string | null
  regiao_cervical: string | null
  torque_insercao: number | null
  detalhes_extras: Record<string, unknown>
  preco: number
  ativo: boolean
  created_at: string
  updated_at: string
  linha?: CatalogoLinha
  imagens?: CatalogoImagemImplante[]
  protocolos?: CatalogoProtocoloFresagem[]
}

export interface CatalogoImagemImplante {
  id: string
  empresa_id: string
  implante_sku: string
  url_imagem: string
  ordem_exibicao: number
  created_at: string
}

export interface CatalogoFresa {
  sku: string
  empresa_id: string
  nome: string
  diametro_mm: number | null
  venda_avulsa: boolean
  ativo: boolean
  preco: number
  created_at: string
  updated_at: string
}

export interface CatalogoProtocoloFresagem {
  id: string
  empresa_id: string
  implante_sku: string
  fresa_sku: string
  tipo_osso: TipoOsso
  ordem_uso: number
  created_at: string
  fresa?: CatalogoFresa
}

export interface CatalogoTipoReabilitacao {
  id: string
  empresa_id: string
  nome: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface CatalogoTipoAbutment {
  id: string
  empresa_id: string
  nome: string
  sigla: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface CatalogoAbutment {
  sku: string
  empresa_id: string
  familia_id: string
  tipo_reabilitacao_id: string
  tipo_abutment_id: string
  diametro_plataforma: string | null
  angulacao_graus: number | null
  altura_transmucoso: number | null
  altura_corpo: number | null
  torque_ncm: number | null
  preco: number
  ativo: boolean
  created_at: string
  updated_at: string
  familia?: CatalogoFamilia
  tipo_reabilitacao?: CatalogoTipoReabilitacao
  tipo_abutment?: CatalogoTipoAbutment
}

export interface CatalogoSequenciaProtetica {
  id: string
  empresa_id: string
  abutment_sku: string
  tipo_workflow: 'analógico' | 'digital'
  etapa_ordem: number
  etapa_nome: string
  acessorio_sku: string
  created_at: string
  acessorio?: CatalogoAcessorio
}

export interface CatalogoCategoriaAcessorio {
  id: string
  empresa_id: string
  nome: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface CatalogoAcessorio {
  sku: string
  empresa_id: string
  categoria_id: string
  nome: string
  diametro_mm: number | null
  altura_mm: number | null
  caracteristicas: Record<string, unknown>
  ativo: boolean
  preco: number
  created_at: string
  updated_at: string
  categoria?: CatalogoCategoriaAcessorio
}

export interface CatalogoChaveFerramental {
  sku: string
  empresa_id: string
  nome: string
  tipo_ferramenta: TipoFerramenta
  ativo: boolean
  preco: number
  created_at: string
  updated_at: string
}

export interface CatalogoAcessorioFerramental {
  empresa_id: string
  acessorio_sku: string
  ferramenta_sku: string
  obrigatorio: boolean
  created_at: string
  ferramenta?: CatalogoChaveFerramental
}

export interface CatalogoCategoriaInstrumental {
  id: string
  empresa_id: string
  nome: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface CatalogoInstrumentalGeral {
  sku: string
  empresa_id: string
  categoria_id: string
  nome: string
  preco: number
  created_at: string
  updated_at: string
  categoria?: CatalogoCategoriaInstrumental
}

export interface CatalogoWorkflow {
  id: string
  empresa_id: string
  nome: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface CatalogoEtapaWorkflow {
  id: string
  empresa_id: string
  ordem: number
  nome: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface CatalogoGuiaReabilitacao {
  id: string
  empresa_id: string
  familia_id: string
  tipo_abutment_id: string
  diametro_plataforma: string
  workflow_id: string
  etapa_id: string
  acessorio_sku: string
  created_at: string
  familia?: CatalogoFamilia
  tipo_abutment?: CatalogoTipoAbutment
  workflow?: CatalogoWorkflow
  etapa?: CatalogoEtapaWorkflow
  acessorio?: CatalogoAcessorio
}

export interface CatalogoCategoriaKit {
  id: string
  empresa_id: string
  nome: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface CatalogoKit {
  sku: string
  empresa_id: string
  categoria_id: string
  nome: string
  descricao: string | null
  ativo: boolean
  preco: number
  created_at: string
  updated_at: string
  categoria?: CatalogoCategoriaKit
  familias?: CatalogoKitFamilia[]
  composicao?: CatalogoKitComposicao[]
}

export interface CatalogoKitFamilia {
  empresa_id: string
  kit_sku: string
  familia_id: string
  familia?: CatalogoFamilia
}

export type BOMItemTipo = "fresa" | "chave" | "acessorio" | "instrumental" | "implante"

export interface CatalogoKitComposicao {
  id: string
  empresa_id: string
  kit_sku: string
  quantidade: number
  fresa_sku: string | null
  chave_sku: string | null
  acessorio_sku: string | null
  instrumental_sku: string | null
  implante_sku: string | null
  created_at: string
  fresa?: CatalogoFresa | null
  chave?: CatalogoChaveFerramental | null
  acessorio?: CatalogoAcessorio | null
  instrumental?: CatalogoInstrumentalGeral | null
  implante?: CatalogoImplante | null
}

export interface BOMItem {
  tipo: BOMItemTipo
  sku: string
  nome: string
  quantidade: number
}

export interface CatalogoCupom {
  id: string
  empresa_id: string
  codigo: string
  tipo: "percentual" | "fixo"
  valor: number
  validade: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface CatalogoFrete {
  id: string
  empresa_id: string
  cep_inicio: string
  cep_fim: string
  valor: number
  prazo_dias: number
  created_at: string
  updated_at: string
}

export interface CatalogoPromocional {
  id: string
  empresa_id: string
  nome: string
  descricao: string | null
  preco: number
  expira_em: string | null
  ativo: boolean
  created_at: string
  updated_at: string
  itens?: CatalogoPromocionalItem[]
}

export interface CatalogoPromocionalItem {
  id: string
  empresa_id: string
  promocional_id: string
  sku: string
  tipo: string
  created_at: string
}

export interface ProductSheetResult {
  tipo: ProductSheetTipo
  sku: string
  nome: string
  subtitulo: string
  cor: string
  specs: { label: string; value: string }[]
  imagens: string[]
  fullRoute: string
}

export interface CartItem {
  sku: string
  nome: string
  tipo: ProductSheetTipo
  cor: string
  preco: number
  quantidade: number
  meta?: Record<string, unknown>
}

export const CATALOGO_TIPO_LABEL: Record<ProductSheetTipo, string> = {
  implante: "Implante",
  abutment: "Abutment",
  kit: "Kit",
  fresa: "Fresa",
  chave: "Chave",
  acessorio: "Acessório",
  instrumental: "Instrumental",
  promocional: "Promocional",
}

export const TIPO_FERRAMENTA_LABEL: Record<TipoFerramenta, string> = {
  Aperto: "Aperto",
  Medição: "Medição",
  Cirúrgica: "Cirúrgica",
}
