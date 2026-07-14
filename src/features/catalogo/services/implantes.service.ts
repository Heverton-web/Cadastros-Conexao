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
  preco?: number
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
  preco: number
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

export async function getProtocoloFresagem(empresaId: string, implanteSku: string): Promise<CatalogoProtocoloFresagem[]> {
  const { data, error } = await supabase
    .from("catalogo_protocolo_fresagem")
    .select("*, fresa:catalogo_fresas(*)")
    .eq("empresa_id", empresaId)
    .eq("implante_sku", implanteSku)
    .order("ordem_uso")
  if (error) throw error
  const result = data as CatalogoProtocoloFresagem[]
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

export async function toggleFresaAtivo(empresaId: string, sku: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_fresas").update({ ativo }).eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}

export async function removerFresa(empresaId: string, sku: string): Promise<void> {
  const { error } = await supabase.from("catalogo_fresas").delete().eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}
