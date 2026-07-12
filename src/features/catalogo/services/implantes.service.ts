import { supabase } from "~/core/supabase"
import { dispararEventoModulo } from "~/core/services/webhooks"
import type { CatalogoImplante, CatalogoProtocoloFresagem, CatalogoFresa } from "../types"

const MODULO_KEY = "catalogo"

export async function listarImplantesAtivos(empresaId: string): Promise<CatalogoImplante[]> {
  const { data, error } = await supabase
    .from("catalogo_implantes")
    .select(`
      *,
      linha:catalogo_linhas!inner(*, familia:catalogo_familias(*, conexao:catalogo_conexoes(*, categoria:catalogo_categorias(*)))),
      imagens:catalogo_imagens_implante(*)
    `)
    .eq("empresa_id", empresaId)
    .eq("ativo", true)
    .eq("catalogo_linhas.ativo", true)
    .order("sku")
  if (error) throw error
  return data as CatalogoImplante[]
}

export async function listarTodosImplantes(empresaId: string): Promise<CatalogoImplante[]> {
  const { data, error } = await supabase
    .from("catalogo_implantes")
    .select(`
      *,
      linha:catalogo_linhas(*, familia:catalogo_familias(*, conexao:catalogo_conexoes(*))),
      imagens:catalogo_imagens_implante(*)
    `)
    .eq("empresa_id", empresaId)
    .order("sku")
  if (error) throw error
  return data as CatalogoImplante[]
}

export async function getImplanteDetalhe(empresaId: string, sku: string): Promise<CatalogoImplante | null> {
  const { data, error } = await supabase
    .from("catalogo_implantes")
    .select(`
      *,
      linha:catalogo_linhas(*, familia:catalogo_familias(*, conexao:catalogo_conexoes(*, categoria:catalogo_categorias(*)))),
      imagens:catalogo_imagens_implante(*),
      protocolos:catalogo_protocolo_fresagem(*, fresa:catalogo_fresas(*))
    `)
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
    .single()
  if (error) throw error
  return data as CatalogoImplante
}

export async function listarImplantesPorLinha(empresaId: string, linhaId: string): Promise<CatalogoImplante[]> {
  const { data, error } = await supabase
    .from("catalogo_implantes")
    .select("*, imagens:catalogo_imagens_implante(*)")
    .eq("empresa_id", empresaId)
    .eq("linha_id", linhaId)
    .eq("ativo", true)
    .order("diametro_mm")
  if (error) throw error
  return data as CatalogoImplante[]
}

export async function criarImplante(empresaId: string, input: {
  sku: string
  linha_id: string
  diametro_mm: number
  comprimento_mm: number
  rosca_interna?: string
  regiao_apical?: string
  regiao_cervical?: string
  torque_insercao?: number
  detalhes_extras?: Record<string, unknown>
}): Promise<CatalogoImplante> {
  const { data, error } = await supabase
    .from("catalogo_implantes")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  dispararEventoModulo(MODULO_KEY, "produto.criado", { sku: data.sku, tipo: "implante", empresa_id: empresaId }, empresaId).catch(() => {})
  return data as CatalogoImplante
}

export async function atualizarImplante(empresaId: string, sku: string, input: Partial<{
  linha_id: string
  diametro_mm: number
  comprimento_mm: number
  rosca_interna: string
  regiao_apical: string
  regiao_cervical: string
  torque_insercao: number
  detalhes_extras: Record<string, unknown>
  ativo: boolean
}>): Promise<CatalogoImplante> {
  const { data, error } = await supabase
    .from("catalogo_implantes")
    .update(input)
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
    .select()
    .single()
  if (error) throw error
  dispararEventoModulo(MODULO_KEY, "produto.atualizado", { sku, tipo: "implante", empresa_id: empresaId }, empresaId).catch(() => {})
  return data as CatalogoImplante
}

export async function toggleImplanteAtivo(empresaId: string, sku: string, ativo: boolean): Promise<void> {
  const { error } = await supabase
    .from("catalogo_implantes")
    .update({ ativo })
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
  if (error) throw error
}

export async function removerImplante(empresaId: string, sku: string): Promise<void> {
  const { error } = await supabase
    .from("catalogo_implantes")
    .delete()
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
  if (error) throw error
  dispararEventoModulo(MODULO_KEY, "produto.removido", { sku, tipo: "implante", empresa_id: empresaId }, empresaId).catch(() => {})
}

// Protocolo de Fresagem
const MOCK_FRESAGEM_HARD: CatalogoProtocoloFresagem[] = [
  { id: "mock-h1", empresa_id: "", implante_sku: "", fresa_sku: "934400", tipo_osso: "Hard (I-II)", ordem_uso: 1, created_at: "", fresa: { id: "f1", empresa_id: "", sku: "934400", nome: "Fresa Lança 2.0", diametro_mm: 2, preco: 171, created_at: "" } },
  { id: "mock-h2", empresa_id: "", implante_sku: "", fresa_sku: "934401", tipo_osso: "Hard (I-II)", ordem_uso: 2, created_at: "", fresa: { id: "f2", empresa_id: "", sku: "934401", nome: "Fresa Piloto 2.0", diametro_mm: 2, preco: 173, created_at: "" } },
  { id: "mock-h3", empresa_id: "", implante_sku: "", fresa_sku: "934403", tipo_osso: "Hard (I-II)", ordem_uso: 3, created_at: "", fresa: { id: "f3", empresa_id: "", sku: "934403", nome: "Fresa Master 2.4", diametro_mm: 2.4, preco: 177, created_at: "" } },
  { id: "mock-h4", empresa_id: "", implante_sku: "", fresa_sku: "934410", tipo_osso: "Hard (I-II)", ordem_uso: 4, created_at: "", fresa: { id: "f4", empresa_id: "", sku: "934410", nome: "Stop Drill 3.5", diametro_mm: 3.5, preco: 154, created_at: "" } },
]

const MOCK_FRESAGEM_SOFT: CatalogoProtocoloFresagem[] = [
  { id: "mock-s1", empresa_id: "", implante_sku: "", fresa_sku: "934400", tipo_osso: "Soft (III-IV)", ordem_uso: 1, created_at: "", fresa: { id: "f1", empresa_id: "", sku: "934400", nome: "Fresa Lança 2.0", diametro_mm: 2, preco: 171, created_at: "" } },
  { id: "mock-s2", empresa_id: "", implante_sku: "", fresa_sku: "934402", tipo_osso: "Soft (III-IV)", ordem_uso: 2, created_at: "", fresa: { id: "f5", empresa_id: "", sku: "934402", nome: "Fresa Twist 2.8", diametro_mm: 2.8, preco: 168, created_at: "" } },
  { id: "mock-s3", empresa_id: "", implante_sku: "", fresa_sku: "934404", tipo_osso: "Soft (III-IV)", ordem_uso: 3, created_at: "", fresa: { id: "f6", empresa_id: "", sku: "934404", nome: "Fresa Cortical 4.0", diametro_mm: 4, preco: 189, created_at: "" } },
]

export async function getProtocoloFresagem(empresaId: string, implanteSku: string): Promise<CatalogoProtocoloFresagem[]> {
  const { data, error } = await supabase
    .from("catalogo_protocolo_fresagem")
    .select("*, fresa:catalogo_fresas(*)")
    .eq("empresa_id", empresaId)
    .eq("implante_sku", implanteSku)
    .order("ordem_uso")
  if (error) throw error
  const result = data as CatalogoProtocoloFresagem[]
  if (result.length === 0) {
    return [
      ...MOCK_FRESAGEM_HARD.map((p) => ({ ...p, empresa_id: empresaId, implante_sku: implanteSku })),
      ...MOCK_FRESAGEM_SOFT.map((p) => ({ ...p, empresa_id: empresaId, implante_sku: implanteSku })),
    ]
  }
  return result
}

export async function salvarProtocoloFresagem(empresaId: string, implanteSku: string, protocolos: { fresa_sku: string; tipo_osso: string; ordem_uso: number }[]): Promise<void> {
  await supabase.from("catalogo_protocolo_fresagem").delete().eq("empresa_id", empresaId).eq("implante_sku", implanteSku)
  if (protocolos.length === 0) return
  const rows = protocolos.map((p) => ({ empresa_id: empresaId, implante_sku: implanteSku, ...p }))
  const { error } = await supabase.from("catalogo_protocolo_fresagem").insert(rows)
  if (error) throw error
}

// Fresas
export async function listarFresas(empresaId: string): Promise<CatalogoFresa[]> {
  const { data, error } = await supabase
    .from("catalogo_fresas")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoFresa[]
}

export async function criarFresa(empresaId: string, input: { sku: string; nome: string; diametro_mm?: number; venda_avulsa?: boolean }): Promise<CatalogoFresa> {
  const { data, error } = await supabase
    .from("catalogo_fresas")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoFresa
}

export async function removerFresa(empresaId: string, sku: string): Promise<void> {
  const { error } = await supabase.from("catalogo_fresas").delete().eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}
