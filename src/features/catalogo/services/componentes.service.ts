import { supabase } from "~/core/supabase"
import { dispararEventoModulo } from "~/core/services/webhooks"
import type { CatalogoAbutment, CatalogoTipoReabilitacao, CatalogoTipoAbutment } from "../types"

const MODULO_KEY = "catalogo"

// Tipos de Reabilitação
export async function listarTiposReabilitacao(empresaId: string): Promise<CatalogoTipoReabilitacao[]> {
  const { data, error } = await supabase
    .from("catalogo_tipos_reabilitacao")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoTipoReabilitacao[]
}

export async function criarTipoReabilitacao(empresaId: string, nome: string): Promise<CatalogoTipoReabilitacao> {
  const { data, error } = await supabase
    .from("catalogo_tipos_reabilitacao")
    .insert({ empresa_id: empresaId, nome })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoTipoReabilitacao
}

export async function removerTipoReabilitacao(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_tipos_reabilitacao").delete().eq("id", id)
  if (error) throw error
}

// Tipos de Abutment
export async function listarTiposAbutment(empresaId: string): Promise<CatalogoTipoAbutment[]> {
  const { data, error } = await supabase
    .from("catalogo_tipos_abutment")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoTipoAbutment[]
}

export async function criarTipoAbutment(empresaId: string, nome: string, sigla?: string): Promise<CatalogoTipoAbutment> {
  const { data, error } = await supabase
    .from("catalogo_tipos_abutment")
    .insert({ empresa_id: empresaId, nome, sigla })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoTipoAbutment
}

export async function removerTipoAbutment(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_tipos_abutment").delete().eq("id", id)
  if (error) throw error
}

// Abutments
export async function listarAbutments(empresaId: string, familiaId?: string): Promise<CatalogoAbutment[]> {
  let query = supabase
    .from("catalogo_abutments")
    .select("*, familia:catalogo_familias(*), tipo_reabilitacao:catalogo_tipos_reabilitacao(*), tipo_abutment:catalogo_tipos_abutment(*)")
    .eq("empresa_id", empresaId)
    .order("sku")
  if (familiaId) query = query.eq("familia_id", familiaId)
  const { data, error } = await query
  if (error) throw error
  return data as CatalogoAbutment[]
}

export async function getAbutmentDetalhe(empresaId: string, sku: string): Promise<CatalogoAbutment | null> {
  const { data, error } = await supabase
    .from("catalogo_abutments")
    .select("*, familia:catalogo_familias(*, conexao:catalogo_conexoes(*)), tipo_reabilitacao:catalogo_tipos_reabilitacao(*), tipo_abutment:catalogo_tipos_abutment(*)")
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
    .single()
  if (error) throw error
  return data as CatalogoAbutment
}

export async function criarAbutment(empresaId: string, input: {
  sku: string
  familia_id: string
  tipo_reabilitacao_id: string
  tipo_abutment_id: string
  diametro_plataforma?: string
  angulacao_graus?: number
  altura_transmucoso?: number
  altura_corpo?: number
  torque_ncm?: number
}): Promise<CatalogoAbutment> {
  const { data, error } = await supabase
    .from("catalogo_abutments")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  dispararEventoModulo(MODULO_KEY, "produto.criado", { sku: data.sku, tipo: "abutment", empresa_id: empresaId }, empresaId).catch(() => {})
  return data as CatalogoAbutment
}

export async function atualizarAbutment(empresaId: string, sku: string, input: Partial<{
  familia_id: string
  tipo_reabilitacao_id: string
  tipo_abutment_id: string
  diametro_plataforma: string
  angulacao_graus: number
  altura_transmucoso: number
  altura_corpo: number
  torque_ncm: number
}>): Promise<CatalogoAbutment> {
  const { data, error } = await supabase
    .from("catalogo_abutments")
    .update(input)
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
    .select()
    .single()
  if (error) throw error
  dispararEventoModulo(MODULO_KEY, "produto.atualizado", { sku, tipo: "abutment", empresa_id: empresaId }, empresaId).catch(() => {})
  return data as CatalogoAbutment
}

export async function removerAbutment(empresaId: string, sku: string): Promise<void> {
  const { error } = await supabase.from("catalogo_abutments").delete().eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
  dispararEventoModulo(MODULO_KEY, "produto.removido", { sku, tipo: "abutment", empresa_id: empresaId }, empresaId).catch(() => {})
}
