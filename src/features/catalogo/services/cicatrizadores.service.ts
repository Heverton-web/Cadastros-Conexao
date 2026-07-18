import { supabase } from "~/core/supabase"
import type { CatalogoCicatrizador } from "../types"

export async function listarCicatrizadores(empresaId: string): Promise<CatalogoCicatrizador[]> {
  const { data, error } = await supabase
    .from("catalogo_cicatrizadores")
    .select("*, implante:catalogo_implantes(*), chave:catalogo_chaves(*)")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoCicatrizador[]
}

export async function criarCicatrizador(empresaId: string, input: {
  sku: string; nome: string
  implante_id?: string; chave_id?: string
  sigla?: string; descricao?: string
  diametro_plataforma_mm?: number; altura_transmucoso_mm?: number
  altura_corpo_mm?: number; torque_ncm?: number; material?: string
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
  nome: string; implante_id: string; chave_id: string
  sigla: string; descricao: string
  diametro_plataforma_mm: number; altura_transmucoso_mm: number
  altura_corpo_mm: number; torque_ncm: number; material: string
  preco: number; ativo: boolean
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
  const { error } = await supabase.from("catalogo_cicatrizadores").update({ ativo }).eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}

export async function removerCicatrizador(empresaId: string, sku: string): Promise<void> {
  const { error } = await supabase.from("catalogo_cicatrizadores").delete().eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}
