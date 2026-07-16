import { supabase } from "~/core/supabase"
import type { CatalogoCicatrizador } from "../types"

export async function listarCicatrizadores(empresaId: string): Promise<CatalogoCicatrizador[]> {
  const { data, error } = await supabase
    .from("catalogo_cicatrizadores")
    .select("*, familia:catalogo_familias(*), chave:catalogo_chaves_ferramental(*)")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoCicatrizador[]
}

export async function criarCicatrizador(empresaId: string, input: {
  sku: string
  nome: string
  altura_transmucoso?: number
  diametro_plataforma?: string
  torque_ncm?: number
  familia_id?: string
  chave_sku?: string
  preco?: number
}): Promise<CatalogoCicatrizador> {
  const { data, error } = await supabase
    .from("catalogo_cicatrizadores")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoCicatrizador
}

export async function atualizarCicatrizador(empresaId: string, sku: string, input: Partial<{
  nome: string
  altura_transmucoso: number
  diametro_plataforma: string
  torque_ncm: number
  familia_id: string
  chave_sku: string
  preco: number
}>): Promise<CatalogoCicatrizador> {
  const { data, error } = await supabase
    .from("catalogo_cicatrizadores")
    .update(input)
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
    .select()
    .single()
  if (error) throw error
  return data as CatalogoCicatrizador
}

export async function toggleCicatrizadorAtivo(empresaId: string, sku: string, ativo: boolean): Promise<void> {
  const { error } = await supabase
    .from("catalogo_cicatrizadores")
    .update({ ativo })
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
  if (error) throw error
}

export async function removerCicatrizador(empresaId: string, sku: string): Promise<void> {
  const { error } = await supabase
    .from("catalogo_cicatrizadores")
    .delete()
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
  if (error) throw error
}
