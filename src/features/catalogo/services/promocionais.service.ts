import { supabase } from "~/core/supabase"
import { dispararEventoModulo } from "~/core/services/webhooks"
import type { CatalogoPromocional } from "../types"

const MODULO_KEY = "catalogo"

export async function listarPromocionais(empresaId: string): Promise<CatalogoPromocional[]> {
  const { data, error } = await supabase
    .from("catalogo_promocionais")
    .select("*, itens:catalogo_promocional_itens(*)")
    .eq("empresa_id", empresaId)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data as CatalogoPromocional[]
}

export async function listarPromocionaisAtivos(empresaId: string): Promise<CatalogoPromocional[]> {
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from("catalogo_promocionais")
    .select("*, itens:catalogo_promocional_itens(*)")
    .eq("empresa_id", empresaId)
    .eq("ativo", true)
    .or(`expira_em.is.null,expira_em.gt.${now}`)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data as CatalogoPromocional[]
}

export async function getPromocionalDetalhe(empresaId: string, id: string): Promise<CatalogoPromocional | null> {
  const { data, error } = await supabase
    .from("catalogo_promocionais")
    .select("*, itens:catalogo_promocional_itens(*)")
    .eq("empresa_id", empresaId)
    .eq("id", id)
    .single()
  if (error) throw error
  return data as CatalogoPromocional
}

export async function criarPromocional(empresaId: string, input: {
  nome: string
  descricao?: string
  preco: number
  expira_em?: string
  itens?: { sku: string; tipo: string }[]
}): Promise<CatalogoPromocional> {
  const { itens, ...promoData } = input
  const { data, error } = await supabase
    .from("catalogo_promocionais")
    .insert({ empresa_id: empresaId, ...promoData })
    .select()
    .single()
  if (error) throw error

  if (itens?.length) {
    const rows = itens.map((item) => ({ empresa_id: empresaId, promocional_id: data.id, ...item }))
    await supabase.from("catalogo_promocional_itens").insert(rows)
  }

  dispararEventoModulo(MODULO_KEY, "promocional.criado", { promocional_id: data.id, nome: data.nome, empresa_id: empresaId }, empresaId).catch(() => {})
  return data as CatalogoPromocional
}

export async function atualizarPromocional(id: string, input: Partial<{
  nome: string
  descricao: string
  preco: number
  expira_em: string
  ativo: boolean
}>): Promise<CatalogoPromocional> {
  const { data, error } = await supabase
    .from("catalogo_promocionais")
    .update(input)
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data as CatalogoPromocional
}

export async function removerPromocional(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_promocionais").delete().eq("id", id)
  if (error) throw error
}
