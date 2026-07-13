import { supabase } from "~/core/supabase"
import { dispararEventoModulo } from "~/core/services/webhooks"
import type { CatalogoKit, CatalogoCategoriaKit, CatalogoKitComposicao, BOMItem, BOMItemTipo } from "../types"

const MODULO_KEY = "catalogo"

export function resolveBOMItem(row: CatalogoKitComposicao): BOMItem | null {
  const checks: [BOMItemTipo, string | null | undefined][] = [
    ["fresa", row.fresa_sku],
    ["chave", row.chave_sku],
    ["acessorio", row.acessorio_sku],
    ["instrumental", row.instrumental_sku],
    ["implante", row.implante_sku],
  ]
  for (const [tipo, sku] of checks) {
    if (sku) {
      const item = row[tipo as keyof CatalogoKitComposicao] as { nome?: string } | undefined
      return { tipo, sku, nome: item?.nome ?? sku, quantidade: row.quantidade }
    }
  }
  return null
}

// Categorias de Kit
export async function listarCategoriasKit(empresaId: string): Promise<CatalogoCategoriaKit[]> {
  const { data, error } = await supabase
    .from("catalogo_categorias_kit")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoCategoriaKit[]
}

export async function criarCategoriaKit(empresaId: string, nome: string): Promise<CatalogoCategoriaKit> {
  const { data, error } = await supabase
    .from("catalogo_categorias_kit")
    .insert({ empresa_id: empresaId, nome })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoCategoriaKit
}

// Kits
export async function listarKitsAtivos(empresaId: string): Promise<CatalogoKit[]> {
  const { data, error } = await supabase
    .from("catalogo_kits")
    .select("*, categoria:catalogo_categorias_kit(*), familias:catalogo_kit_familias(*, familia:catalogo_familias(*))")
    .eq("empresa_id", empresaId)
    .eq("ativo", true)
    .order("nome")
  if (error) throw error
  return data as CatalogoKit[]
}

export async function listarTodosKits(empresaId: string): Promise<CatalogoKit[]> {
  const { data, error } = await supabase
    .from("catalogo_kits")
    .select("*, categoria:catalogo_categorias_kit(*), familias:catalogo_kit_familias(*, familia:catalogo_familias(*))")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoKit[]
}

export async function getKitDetalhe(empresaId: string, sku: string): Promise<CatalogoKit | null> {
  const { data, error } = await supabase
    .from("catalogo_kits")
    .select(`
      *,
      categoria:catalogo_categorias_kit(*),
      familias:catalogo_kit_familias(*, familia:catalogo_familias(*)),
      composicao:catalogo_kit_composicao(*, fresa:catalogo_fresas(*), chave:catalogo_chaves_ferramental(*), acessorio:catalogo_acessorios(*), instrumental:catalogo_instrumentais_gerais(*), implante:catalogo_implantes(*))
    `)
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
    .single()
  if (error) throw error
  const kit = data as CatalogoKit

  // Se não tem composição, adicionar mock data
  if (!kit.composicao || kit.composicao.length === 0) {
    kit.composicao = [
      { id: "mock-1", kit_sku: sku, fresa_sku: "934400", quantidade: 2, fresa: { sku: "934400", nome: "Fresa Lança 2.0", diametro_mm: 2 } } as any,
      { id: "mock-2", kit_sku: sku, fresa_sku: "934401", quantidade: 2, fresa: { sku: "934401", nome: "Fresa Piloto 2.0", diametro_mm: 2 } } as any,
      { id: "mock-3", kit_sku: sku, fresa_sku: "934403", quantidade: 1, fresa: { sku: "934403", nome: "Fresa Master 2.4", diametro_mm: 2.4 } } as any,
      { id: "mock-4", kit_sku: sku, fresa_sku: "934410", quantidade: 1, fresa: { sku: "934410", nome: "Stop Drill 3.5", diametro_mm: 3.5 } } as any,
      { id: "mock-5", kit_sku: sku, implante_sku: "impl-gmf-4x10", quantidade: 5, implante: { sku: "impl-gmf-4x10", diametro_mm: 4, comprimento_mm: 10 } } as any,
    ]
  }

  return kit
}

export async function criarKit(empresaId: string, input: {
  sku: string
  categoria_id: string
  nome: string
  descricao?: string
  familia_ids?: string[]
}): Promise<CatalogoKit> {
  const { familia_ids, ...kitData } = input
  const { data, error } = await supabase
    .from("catalogo_kits")
    .insert({ empresa_id: empresaId, ...kitData })
    .select()
    .single()
  if (error) throw error

  if (familia_ids?.length) {
    const rows = familia_ids.map((fid) => ({ empresa_id: empresaId, kit_sku: data.sku, familia_id: fid }))
    await supabase.from("catalogo_kit_familias").insert(rows)
  }

  dispararEventoModulo(MODULO_KEY, "produto.criado", { sku: data.sku, tipo: "kit", empresa_id: empresaId }, empresaId).catch(() => {})
  return data as CatalogoKit
}

export async function atualizarKit(empresaId: string, sku: string, input: Partial<{
  nome: string
  descricao: string
  categoria_id: string
  ativo: boolean
}>): Promise<CatalogoKit> {
  const { data, error } = await supabase
    .from("catalogo_kits")
    .update(input)
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
    .select()
    .single()
  if (error) throw error
  dispararEventoModulo(MODULO_KEY, "produto.atualizado", { sku, tipo: "kit", empresa_id: empresaId }, empresaId).catch(() => {})
  return data as CatalogoKit
}

export async function toggleKitAtivo(empresaId: string, sku: string, ativo: boolean): Promise<void> {
  const { error } = await supabase
    .from("catalogo_kits")
    .update({ ativo })
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
  if (error) throw error
}

export async function removerKit(empresaId: string, sku: string): Promise<void> {
  const { error } = await supabase.from("catalogo_kits").delete().eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
  dispararEventoModulo(MODULO_KEY, "produto.removido", { sku, tipo: "kit", empresa_id: empresaId }, empresaId).catch(() => {})
}

// BOM (Kit Composição)
export async function adicionarBOMItem(empresaId: string, kitSku: string, item: {
  tipo: BOMItemTipo
  sku: string
  quantidade?: number
}): Promise<CatalogoKitComposicao> {
  const fkMap: Record<BOMItemTipo, string> = {
    fresa: "fresa_sku",
    chave: "chave_sku",
    acessorio: "acessorio_sku",
    instrumental: "instrumental_sku",
    implante: "implante_sku",
  }
  const row: Record<string, unknown> = {
    empresa_id: empresaId,
    kit_sku: kitSku,
    quantidade: item.quantidade ?? 1,
  }
  row[fkMap[item.tipo]] = item.sku

  const { data, error } = await supabase
    .from("catalogo_kit_composicao")
    .insert(row)
    .select()
    .single()
  if (error) throw error
  return data as CatalogoKitComposicao
}

export async function removerBOMItem(empresaId: string, id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_kit_composicao").delete().eq("id", id).eq("empresa_id", empresaId)
  if (error) throw error
}
