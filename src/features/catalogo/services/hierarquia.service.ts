import { supabase } from "~/core/supabase"
import type {
  CatalogoCategoria, CatalogoConexao, CatalogoFamilia, CatalogoLinha,
} from "../types"

const TABLE = "catalogo_categorias"

export async function listarCategorias(empresaId: string): Promise<CatalogoCategoria[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoCategoria[]
}

export async function criarCategoria(empresaId: string, nome: string, locked = false): Promise<CatalogoCategoria> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ empresa_id: empresaId, nome, locked })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoCategoria
}

export async function atualizarCategoria(id: string, nome: string): Promise<CatalogoCategoria> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ nome })
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data as CatalogoCategoria
}

export async function removerCategoria(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id)
  if (error) throw error
}

// Conexões
export async function listarConexoes(empresaId: string, categoriaId?: string): Promise<CatalogoConexao[]> {
  let query = supabase
    .from("catalogo_conexoes")
    .select("*, categoria:catalogo_categorias(*)")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (categoriaId) query = query.eq("categoria_id", categoriaId)
  const { data, error } = await query
  if (error) throw error
  return data as CatalogoConexao[]
}

export async function criarConexao(empresaId: string, input: { categoria_id: string; nome: string; sigla?: string }): Promise<CatalogoConexao> {
  const { data, error } = await supabase
    .from("catalogo_conexoes")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoConexao
}

export async function removerConexao(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_conexoes").delete().eq("id", id)
  if (error) throw error
}

// Famílias
export async function listarFamilias(empresaId: string, conexaoId?: string): Promise<CatalogoFamilia[]> {
  let query = supabase
    .from("catalogo_familias")
    .select("*, conexao:catalogo_conexoes(*, categoria:catalogo_categorias(*))")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (conexaoId) query = query.eq("conexao_id", conexaoId)
  const { data, error } = await query
  if (error) throw error
  return data as CatalogoFamilia[]
}

export async function criarFamilia(empresaId: string, input: { conexao_id: string; nome: string; cor_identificacao?: string }): Promise<CatalogoFamilia> {
  const { data, error } = await supabase
    .from("catalogo_familias")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoFamilia
}

export async function atualizarFamilia(id: string, input: Partial<{ nome: string; cor_identificacao: string }>): Promise<CatalogoFamilia> {
  const { data, error } = await supabase
    .from("catalogo_familias")
    .update(input)
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data as CatalogoFamilia
}

export async function removerFamilia(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_familias").delete().eq("id", id)
  if (error) throw error
}

// Linhas
export async function listarLinhas(empresaId: string, familiaId?: string): Promise<CatalogoLinha[]> {
  let query = supabase
    .from("catalogo_linhas")
    .select("*, familia:catalogo_familias(*)")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (familiaId) query = query.eq("familia_id", familiaId)
  const { data, error } = await query
  if (error) throw error
  return data as CatalogoLinha[]
}

export async function criarLinha(empresaId: string, input: { familia_id: string; nome: string }): Promise<CatalogoLinha> {
  const { data, error } = await supabase
    .from("catalogo_linhas")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoLinha
}

export async function toggleLinhaAtiva(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase
    .from("catalogo_linhas")
    .update({ ativo })
    .eq("id", id)
  if (error) throw error
}

export async function removerLinha(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_linhas").delete().eq("id", id)
  if (error) throw error
}
