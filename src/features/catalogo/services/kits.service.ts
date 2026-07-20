import { supabase } from "~/core/supabase"
import { dispararEventoModulo } from "~/core/services/webhooks"
import type { CatalogoKit, CatalogoTipoKit, CatalogoChave, CatalogoFresa, CatalogoComplementar, CatalogoOpcional } from "../types"

const MODULO_KEY = "catalogo"

// ============================================================
// Tipos de Kit
// ============================================================

export async function listarTiposKit(): Promise<CatalogoTipoKit[]> {
  const { data, error } = await supabase
    .from("catalogo_tipos_kits")
    .select("*")
    .order("nome")
  if (error) throw error
  return data as CatalogoTipoKit[]
}

export async function criarTipoKit(input: { nome: string; sigla?: string }): Promise<CatalogoTipoKit> {
  const { data, error } = await supabase
    .from("catalogo_tipos_kits")
    .insert({ ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoTipoKit
}

export async function toggleTipoKitAtivo(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_tipos_kits").update({ ativo }).eq("id", id)
  if (error) throw error
}

export async function removerTipoKit(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_tipos_kits").delete().eq("id", id)
  if (error) throw error
}

// ============================================================
// Kits
// ============================================================

export async function listarKitsAtivos(): Promise<CatalogoKit[]> {
  const { data, error } = await supabase
    .from("catalogo_kits")
    .select("*, tipo_kit:catalogo_tipos_kits(*)")
    .eq("ativo", true)
    .order("nome")
  if (error) throw error
  return data as CatalogoKit[]
}

export async function listarTodosKits(): Promise<CatalogoKit[]> {
  const { data, error } = await supabase
    .from("catalogo_kits")
    .select("*, tipo_kit:catalogo_tipos_kits(*)")
    .order("nome")
  if (error) throw error
  return data as CatalogoKit[]
}

export async function getKitDetalhe(sku: string): Promise<CatalogoKit | null> {
  const { data, error } = await supabase
    .from("catalogo_kits")
    .select("*, tipo_kit:catalogo_tipos_kits(*)")
    .eq("sku", sku)
    .single()
  if (error) throw error

  if (!data) return null

  // Carregar composição N:M
  const [chavesRes, fresasRes, compRes, opcRes] = await Promise.all([
  ])

  const kit = data as CatalogoKit
  kit.chaves = []
  kit.fresas = []
  kit.complementares = []
  kit.opcionais = []

  return kit
}

export async function criarKit(input: {
  sku: string; tipo_kit_id?: string; nome: string
  sigla?: string; descricao?: string; preco?: number
}): Promise<CatalogoKit> {
  const { data, error } = await supabase
    .from("catalogo_kits")
    .insert({ ...input })
    .select()
    .single()
  if (error) throw error
  dispararEventoModulo(MODULO_KEY, "produto.criado", { sku: data.sku, tipo: "kit" }).catch(() => {})
  return data as CatalogoKit
}

export async function atualizarKit(sku: string, input: Partial<{
  nome: string; tipo_kit_id: string; sigla: string; descricao: string; preco: number; ativo: boolean
}>): Promise<CatalogoKit> {
  const { data, error } = await supabase
    .from("catalogo_kits")
    .update(input)
    .eq("sku", sku)
    .select()
    .single()
  if (error) throw error
  dispararEventoModulo(MODULO_KEY, "produto.atualizado", { sku, tipo: "kit" }).catch(() => {})
  return data as CatalogoKit
}

export async function toggleKitAtivo(sku: string, ativo: boolean): Promise<void> {
  if (error) throw error
}

export async function removerKit(sku: string): Promise<void> {
  // Remover composição N:M
  await Promise.all([
  ])
  if (error) throw error
  dispararEventoModulo(MODULO_KEY, "produto.removido", { sku, tipo: "kit" }).catch(() => {})
}

// ============================================================
// Composição N:M do Kit
// ============================================================

export async function salvarKitChaves(kitSku: string, chaveIds: string[]): Promise<void> {
  if (chaveIds.length === 0) return
  const rows = chaveIds.map((id) => ({ kit_sku: kitSku, chave_id: id }))
  const { error } = await supabase.from("catalogo_kit_chaves").insert(rows)
  if (error) throw error
}

export async function salvarKitFresas(kitSku: string, fresaIds: string[]): Promise<void> {
  if (fresaIds.length === 0) return
  const rows = fresaIds.map((id) => ({ kit_sku: kitSku, fresa_id: id }))
  const { error } = await supabase.from("catalogo_kit_fresas").insert(rows)
  if (error) throw error
}

export async function salvarKitComplementares(kitSku: string, complementarIds: string[]): Promise<void> {
  if (complementarIds.length === 0) return
  const rows = complementarIds.map((id) => ({ kit_sku: kitSku, complementar_id: id }))
  const { error } = await supabase.from("catalogo_kit_complementares").insert(rows)
  if (error) throw error
}

export async function salvarKitOpcionais(kitSku: string, opcionalIds: string[]): Promise<void> {
  if (opcionalIds.length === 0) return
  const rows = opcionalIds.map((id) => ({ kit_sku: kitSku, opcional_id: id }))
  const { error } = await supabase.from("catalogo_kit_opcionais").insert(rows)
  if (error) throw error
}

// ============================================================
// Backward-compatible aliases
// ============================================================

/** @deprecated Use toggleTipoKitAtivo */
export const toggleCategoriaKitAtivo = toggleTipoKitAtivo
/** @deprecated Use listarTiposKit */
export const listarCategoriasKit = listarTiposKit
/** @deprecated Use criarTipoKit */
export const criarCategoriaKit = criarTipoKit

/** @deprecated BOM replaced by N:M pivot tables. Use salvarKitChaves/Fresas/Complementares/Opcionais */
export async function adicionarBOMItem(): Promise<void> {
  console.warn("adicionarBOMItem is deprecated. Use N:M pivot tables instead.")
}
