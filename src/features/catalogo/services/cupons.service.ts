import { supabase } from "~/core/supabase"
import { dispararEventoModulo } from "~/core/services/webhooks"
import type { CatalogoCupom } from "../types"

const MODULO_KEY = "catalogo"

export async function listarCupons(empresaId: string): Promise<CatalogoCupom[]> {
  const { data, error } = await supabase
    .from("catalogo_cupons")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data as CatalogoCupom[]
}

export async function criarCupom(empresaId: string, input: {
  codigo: string
  tipo: "percentual" | "fixo"
  valor: number
  validade?: string
}): Promise<CatalogoCupom> {
  const { data, error } = await supabase
    .from("catalogo_cupons")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoCupom
}

export async function atualizarCupom(id: string, input: Partial<{ codigo: string; tipo: string; valor: number; validade: string; ativo: boolean }>): Promise<CatalogoCupom> {
  const { data, error } = await supabase
    .from("catalogo_cupons")
    .update(input)
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data as CatalogoCupom
}

export async function removerCupom(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_cupons").delete().eq("id", id)
  if (error) throw error
}

export async function validarCupom(empresaId: string, codigo: string): Promise<CatalogoCupom | null> {
  const { data, error } = await supabase
    .from("catalogo_cupons")
    .select("*")
    .eq("empresa_id", empresaId)
    .eq("codigo", codigo.toUpperCase())
    .eq("ativo", true)
    .single()
  if (error || !data) return null
  if (data.validade && new Date(data.validade) < new Date()) return null
  dispararEventoModulo(MODULO_KEY, "cupom.utilizado", { cupom_id: data.id, codigo, empresa_id: empresaId }, empresaId).catch(() => {})
  return data as CatalogoCupom
}

export function aplicarCupom(subtotal: number, cupom: CatalogoCupom): number {
  if (cupom.tipo === "percentual") return subtotal * (1 - cupom.valor / 100)
  return Math.max(0, subtotal - cupom.valor)
}
