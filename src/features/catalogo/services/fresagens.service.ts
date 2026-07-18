import { supabase } from "~/core/supabase"
import type { CatalogoTipoFresagem, CatalogoProtocoloFresagem, CatalogoProtocoloFresaItem } from "../types"

// ============================================================
// Tipos de Fresagens
// ============================================================

export async function listarTiposFresagens(empresaId: string): Promise<CatalogoTipoFresagem[]> {
  const { data, error } = await supabase
    .from("catalogo_tipos_fresagens")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoTipoFresagem[]
}

export async function criarTipoFresagem(empresaId: string, input: { nome: string; sigla?: string }): Promise<CatalogoTipoFresagem> {
  const { data, error } = await supabase
    .from("catalogo_tipos_fresagens")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoTipoFresagem
}

export async function toggleTipoFresagemAtivo(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_tipos_fresagens").update({ ativo }).eq("id", id)
  if (error) throw error
}

export async function removerTipoFresagem(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_tipos_fresagens").delete().eq("id", id)
  if (error) throw error
}

// ============================================================
// Protocolos de Fresagens
// ============================================================

export async function listarProtocolos(empresaId: string): Promise<CatalogoProtocoloFresagem[]> {
  const { data, error } = await supabase
    .from("catalogo_protocolos_fresagens")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoProtocoloFresagem[]
}

export async function getProtocoloDetalhe(empresaId: string, id: string): Promise<CatalogoProtocoloFresagem | null> {
  const { data, error } = await supabase
    .from("catalogo_protocolos_fresagens")
    .select("*, fresas:catalogo_protocolos_fresas_itens(*, fresa:catalogo_fresas(*))")
    .eq("empresa_id", empresaId)
    .eq("id", id)
    .single()
  if (error) throw error
  return data as CatalogoProtocoloFresagem
}

export async function criarProtocolo(empresaId: string, input: {
  nome: string; tipo_osso: string; sigla?: string; diametro_mm_aplicavel?: number
}): Promise<CatalogoProtocoloFresagem> {
  const { data, error } = await supabase
    .from("catalogo_protocolos_fresagens")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoProtocoloFresagem
}

export async function atualizarProtocolo(empresaId: string, id: string, input: Partial<{
  nome: string; tipo_osso: string; sigla: string; diametro_mm_aplicavel: number; ativo: boolean
}>): Promise<CatalogoProtocoloFresagem> {
  const { data, error } = await supabase
    .from("catalogo_protocolos_fresagens")
    .update(input)
    .eq("empresa_id", empresaId)
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data as CatalogoProtocoloFresagem
}

export async function toggleProtocoloAtivo(empresaId: string, id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_protocolos_fresagens").update({ ativo }).eq("empresa_id", empresaId).eq("id", id)
  if (error) throw error
}

export async function removerProtocolo(empresaId: string, id: string): Promise<void> {
  await supabase.from("catalogo_protocolos_fresas_itens").delete().eq("empresa_id", empresaId).eq("protocolo_id", id)
  const { error } = await supabase.from("catalogo_protocolos_fresagens").delete().eq("empresa_id", empresaId).eq("id", id)
  if (error) throw error
}

// ============================================================
// Fresas do Protocolo (PIVOT com ordenação)
// ============================================================

export async function salvarProtocoloFresas(empresaId: string, protocoloId: string, items: { fresa_id: string; ordem: number }[]): Promise<void> {
  await supabase.from("catalogo_protocolos_fresas_itens").delete().eq("empresa_id", empresaId).eq("protocolo_id", protocoloId)
  if (items.length === 0) return
  const rows = items.map((item) => ({ empresa_id: empresaId, protocolo_id: protocoloId, ...item }))
  const { error } = await supabase.from("catalogo_protocolos_fresas_itens").insert(rows)
  if (error) throw error
}

export async function listarProtocoloFresas(empresaId: string, protocoloId: string): Promise<CatalogoProtocoloFresaItem[]> {
  const { data, error } = await supabase
    .from("catalogo_protocolos_fresas_itens")
    .select("*, fresa:catalogo_fresas(*)")
    .eq("empresa_id", empresaId)
    .eq("protocolo_id", protocoloId)
    .order("ordem")
  if (error) throw error
  return data as CatalogoProtocoloFresaItem[]
}
