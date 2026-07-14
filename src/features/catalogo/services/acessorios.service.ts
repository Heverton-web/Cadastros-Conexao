import { supabase } from "~/core/supabase"
import type {
  CatalogoAcessorio, CatalogoCategoriaAcessorio, CatalogoChaveFerramental,
  CatalogoAcessorioFerramental, CatalogoCategoriaInstrumental, CatalogoInstrumentalGeral,
} from "../types"

// Categorias de Acessório
export async function listarCategoriasAcessorio(empresaId: string): Promise<CatalogoCategoriaAcessorio[]> {
  const { data, error } = await supabase
    .from("catalogo_categorias_acessorio")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoCategoriaAcessorio[]
}

export async function criarCategoriaAcessorio(empresaId: string, nome: string): Promise<CatalogoCategoriaAcessorio> {
  const { data, error } = await supabase
    .from("catalogo_categorias_acessorio")
    .insert({ empresa_id: empresaId, nome })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoCategoriaAcessorio
}

export async function toggleCategoriaAcessorioAtivo(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_categorias_acessorio").update({ ativo }).eq("id", id)
  if (error) throw error
}

export async function removerCategoriaAcessorio(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_categorias_acessorio").delete().eq("id", id)
  if (error) throw error
}

// Acessórios
export async function listarAcessorios(empresaId: string, categoriaId?: string): Promise<CatalogoAcessorio[]> {
  let query = supabase
    .from("catalogo_acessorios")
    .select("*, categoria:catalogo_categorias_acessorio(*)")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (categoriaId) query = query.eq("categoria_id", categoriaId)
  const { data, error } = await query
  if (error) throw error
  return data as CatalogoAcessorio[]
}

export async function getAcessorioDetalhe(empresaId: string, sku: string): Promise<CatalogoAcessorio | null> {
  const { data, error } = await supabase
    .from("catalogo_acessorios")
    .select("*, categoria:catalogo_categorias_acessorio(*)")
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
    .single()
  if (error) throw error
  return data as CatalogoAcessorio
}

export async function criarAcessorio(empresaId: string, input: {
  sku: string
  categoria_id: string
  nome: string
  diametro_mm?: number
  altura_mm?: number
  caracteristicas?: Record<string, unknown>
}): Promise<CatalogoAcessorio> {
  const { data, error } = await supabase
    .from("catalogo_acessorios")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoAcessorio
}

export async function toggleAcessorioAtivo(empresaId: string, sku: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_acessorios").update({ ativo }).eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}

export async function removerAcessorio(empresaId: string, sku: string): Promise<void> {
  const { error } = await supabase.from("catalogo_acessorios").delete().eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}

// Chaves Ferramentais
export async function listarChavesFerramental(empresaId: string): Promise<CatalogoChaveFerramental[]> {
  const { data, error } = await supabase
    .from("catalogo_chaves_ferramental")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoChaveFerramental[]
}

export async function criarChaveFerramental(empresaId: string, input: { sku: string; nome: string; tipo_ferramenta: string }): Promise<CatalogoChaveFerramental> {
  const { data, error } = await supabase
    .from("catalogo_chaves_ferramental")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoChaveFerramental
}

export async function toggleChaveFerramentalAtivo(empresaId: string, sku: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_chaves_ferramental").update({ ativo }).eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}

export async function removerChaveFerramental(empresaId: string, sku: string): Promise<void> {
  const { error } = await supabase.from("catalogo_chaves_ferramental").delete().eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}

// Acessório × Ferramental
export async function getFerramentasObrigatorias(empresaId: string, acessorioSku: string): Promise<CatalogoAcessorioFerramental[]> {
  const { data, error } = await supabase
    .from("catalogo_acessorio_ferramental")
    .select("*, ferramenta:catalogo_chaves_ferramental(*)")
    .eq("empresa_id", empresaId)
    .eq("acessorio_sku", acessorioSku)
    .eq("obrigatorio", true)
  if (error) throw error
  return data as CatalogoAcessorioFerramental[]
}

export async function vincularFerramenta(empresaId: string, acessorioSku: string, ferramentaSku: string, obrigatorio = true): Promise<void> {
  const { error } = await supabase
    .from("catalogo_acessorio_ferramental")
    .insert({ empresa_id: empresaId, acessorio_sku: acessorioSku, ferramenta_sku: ferramentaSku, obrigatorio })
  if (error) throw error
}

export async function desvincularFerramenta(empresaId: string, acessorioSku: string, ferramentaSku: string): Promise<void> {
  const { error } = await supabase
    .from("catalogo_acessorio_ferramental")
    .delete()
    .eq("empresa_id", empresaId)
    .eq("acessorio_sku", acessorioSku)
    .eq("ferramenta_sku", ferramentaSku)
  if (error) throw error
}

// Categorias de Instrumental
export async function listarCategoriasInstrumental(empresaId: string): Promise<CatalogoCategoriaInstrumental[]> {
  const { data, error } = await supabase
    .from("catalogo_categorias_instrumental")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoCategoriaInstrumental[]
}

export async function criarCategoriaInstrumental(empresaId: string, nome: string): Promise<CatalogoCategoriaInstrumental> {
  const { data, error } = await supabase
    .from("catalogo_categorias_instrumental")
    .insert({ empresa_id: empresaId, nome })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoCategoriaInstrumental
}

// Instrumentais Gerais
export async function listarInstrumentais(empresaId: string, categoriaId?: string): Promise<CatalogoInstrumentalGeral[]> {
  let query = supabase
    .from("catalogo_instrumentais_gerais")
    .select("*, categoria:catalogo_categorias_instrumental(*)")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (categoriaId) query = query.eq("categoria_id", categoriaId)
  const { data, error } = await query
  if (error) throw error
  return data as CatalogoInstrumentalGeral[]
}

export async function criarInstrumental(empresaId: string, input: { sku: string; categoria_id: string; nome: string }): Promise<CatalogoInstrumentalGeral> {
  const { data, error } = await supabase
    .from("catalogo_instrumentais_gerais")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoInstrumentalGeral
}

export async function toggleCategoriaInstrumentalAtivo(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_categorias_instrumental").update({ ativo }).eq("id", id)
  if (error) throw error
}

export async function removerInstrumental(empresaId: string, sku: string): Promise<void> {
  const { error } = await supabase.from("catalogo_instrumentais_gerais").delete().eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}
