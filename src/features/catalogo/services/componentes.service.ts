import { supabase } from "~/core/supabase"
import { dispararEventoModulo } from "~/core/services/webhooks"
import type { CatalogoAbutment, CatalogoCpsTipoReabilitacao, CatalogoCpsTipoAbutment, CatalogoComponente } from "../types"

const MODULO_KEY = "catalogo"

// ============================================================
// Tipos de Reabilitação
// ============================================================

export async function listarTiposReabilitacao(empresaId: string): Promise<CatalogoCpsTipoReabilitacao[]> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_reabilitacao")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoCpsTipoReabilitacao[]
}

export async function criarTipoReabilitacao(empresaId: string, input: { nome: string; sigla?: string }): Promise<CatalogoCpsTipoReabilitacao> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_reabilitacao")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoCpsTipoReabilitacao
}

export async function toggleTipoReabilitacaoAtivo(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_cps_tipos_reabilitacao").update({ ativo }).eq("id", id)
  if (error) throw error
}

export async function removerTipoReabilitacao(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_cps_tipos_reabilitacao").delete().eq("id", id)
  if (error) throw error
}

// ============================================================
// Tipos de Abutment
// ============================================================

export async function listarTiposAbutment(empresaId: string): Promise<CatalogoCpsTipoAbutment[]> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_abutments")
    .select("*, tipo_reabilitacao:catalogo_cps_tipos_reabilitacao(*)")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoCpsTipoAbutment[]
}

export async function criarTipoAbutment(empresaId: string, input: { nome: string; sigla?: string; tipo_reabilitacao_id?: string }): Promise<CatalogoCpsTipoAbutment> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_abutments")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoCpsTipoAbutment
}

export async function toggleTipoAbutmentAtivo(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_cps_tipos_abutments").update({ ativo }).eq("id", id)
  if (error) throw error
}

export async function removerTipoAbutment(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_cps_tipos_abutments").delete().eq("id", id)
  if (error) throw error
}

// ============================================================
// Tipos de Componentes (NOVO)
// ============================================================

export async function listarTiposComponentes(empresaId: string): Promise<import("../types").CatalogoCpsTipoComponente[]> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_componentes")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as import("../types").CatalogoCpsTipoComponente[]
}

export async function criarTipoComponente(empresaId: string, input: { nome: string; sigla?: string; categoria_id?: string }): Promise<import("../types").CatalogoCpsTipoComponente> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_componentes")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as import("../types").CatalogoCpsTipoComponente
}

export async function toggleTipoComponenteAtivo(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_cps_tipos_componentes").update({ ativo }).eq("id", id)
  if (error) throw error
}

export async function removerTipoComponente(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_cps_tipos_componentes").delete().eq("id", id)
  if (error) throw error
}

// ============================================================
// Tipos de Parafusos (NOVO)
// ============================================================

export async function listarTiposParafusos(empresaId: string): Promise<import("../types").CatalogoCpsTipoParafuso[]> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_parafusos")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as import("../types").CatalogoCpsTipoParafuso[]
}

export async function criarTipoParafuso(empresaId: string, input: { nome: string; sigla?: string }): Promise<import("../types").CatalogoCpsTipoParafuso> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_parafusos")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as import("../types").CatalogoCpsTipoParafuso
}

export async function toggleTipoParafusoAtivo(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_cps_tipos_parafusos").update({ ativo }).eq("id", id)
  if (error) throw error
}

export async function removerTipoParafuso(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_cps_tipos_parafusos").delete().eq("id", id)
  if (error) throw error
}

// ============================================================
// Tipos de Cicatrizadores (NOVO)
// ============================================================

export async function listarTiposCicatrizadores(empresaId: string): Promise<import("../types").CatalogoCpsTipoCicatrizador[]> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_cicatrizadores")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as import("../types").CatalogoCpsTipoCicatrizador[]
}

export async function criarTipoCicatrizador(empresaId: string, input: { nome: string; sigla?: string }): Promise<import("../types").CatalogoCpsTipoCicatrizador> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_cicatrizadores")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as import("../types").CatalogoCpsTipoCicatrizador
}

export async function toggleTipoCicatrizadorAtivo(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_cps_tipos_cicatrizadores").update({ ativo }).eq("id", id)
  if (error) throw error
}

export async function removerTipoCicatrizador(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_cps_tipos_cicatrizadores").delete().eq("id", id)
  if (error) throw error
}

// ============================================================
// Abutments (REESCRITO)
// ============================================================

export async function listarAbutments(empresaId: string): Promise<CatalogoAbutment[]> {
  const { data, error } = await supabase
    .from("catalogo_abutments")
    .select("*, tipo_abutment:catalogo_cps_tipos_abutments(*), parafuso:catalogo_parafusos(*), chave:catalogo_chaves(*)")
    .eq("empresa_id", empresaId)
    .order("sku")
  if (error) throw error
  return data as CatalogoAbutment[]
}

export async function getAbutmentDetalhe(empresaId: string, sku: string): Promise<CatalogoAbutment | null> {
  const { data, error } = await supabase
    .from("catalogo_abutments")
    .select("*, tipo_abutment:catalogo_cps_tipos_abutments(*, tipo_reabilitacao:catalogo_cps_tipos_reabilitacao(*)), parafuso:catalogo_parafusos(*), chave:catalogo_chaves(*)")
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
    .single()
  if (error) throw error
  return data as CatalogoAbutment
}

export async function criarAbutment(empresaId: string, input: {
  sku: string; nome: string; tipo_abutment_id: string
  parafuso_id?: string; chave_id?: string
  sigla?: string; descricao?: string
  diametro_plataforma_mm?: number; altura_transmucoso_mm?: number
  altura_corpo_mm?: number; angulacao_graus?: number
  torque_ncm?: number; material?: string; preco?: number
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
  nome: string; tipo_abutment_id: string; parafuso_id: string; chave_id: string
  sigla: string; descricao: string
  diametro_plataforma_mm: number; altura_transmucoso_mm: number
  altura_corpo_mm: number; angulacao_graus: number
  torque_ncm: number; material: string; preco: number; ativo: boolean
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

export async function toggleAbutmentAtivo(empresaId: string, sku: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_abutments").update({ ativo }).eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}

export async function removerAbutment(empresaId: string, sku: string): Promise<void> {
  const { error } = await supabase.from("catalogo_abutments").delete().eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
  dispararEventoModulo(MODULO_KEY, "produto.removido", { sku, tipo: "abutment", empresa_id: empresaId }, empresaId).catch(() => {})
}

// ============================================================
// Componentes (NOVO)
// ============================================================

export async function listarComponentes(empresaId: string): Promise<CatalogoComponente[]> {
  const { data, error } = await supabase
    .from("catalogo_componentes")
    .select("*, tipo_componente:catalogo_cps_tipos_componentes(*), tipo_abutment:catalogo_cps_tipos_abutments(*), parafuso:catalogo_parafusos(*), chave:catalogo_chaves(*)")
    .eq("empresa_id", empresaId)
    .order("sku")
  if (error) throw error
  return data as CatalogoComponente[]
}

export async function getComponenteDetalhe(empresaId: string, sku: string): Promise<CatalogoComponente | null> {
  const { data, error } = await supabase
    .from("catalogo_componentes")
    .select("*, tipo_componente:catalogo_cps_tipos_componentes(*), tipo_abutment:catalogo_cps_tipos_abutments(*), parafuso:catalogo_parafusos(*), chave:catalogo_chaves(*)")
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
    .single()
  if (error) throw error
  return data as CatalogoComponente
}

export async function criarComponente(empresaId: string, input: {
  sku: string; nome: string; tipo_componente_id?: string; tipo_abutment_id?: string
  parafuso_id?: string; chave_id?: string
  sigla?: string; descricao?: string
  diametro_plataforma_mm?: number; altura_transmucoso_mm?: number
  altura_corpo_mm?: number; angulacao_graus?: number
  tipo?: string; tipo_travamento?: string; material?: string; preco?: number
}): Promise<CatalogoComponente> {
  const { data, error } = await supabase
    .from("catalogo_componentes")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  dispararEventoModulo(MODULO_KEY, "produto.criado", { sku: data.sku, tipo: "componente", empresa_id: empresaId }, empresaId).catch(() => {})
  return data as CatalogoComponente
}

export async function atualizarComponente(empresaId: string, sku: string, input: Partial<{
  nome: string; tipo_componente_id: string; tipo_abutment_id: string
  parafuso_id: string; chave_id: string
  sigla: string; descricao: string
  diametro_plataforma_mm: number; altura_transmucoso_mm: number
  altura_corpo_mm: number; angulacao_graus: number
  tipo: string; tipo_travamento: string; material: string; preco: number; ativo: boolean
}>): Promise<CatalogoComponente> {
  const { data, error } = await supabase
    .from("catalogo_componentes")
    .update(input)
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
    .select()
    .single()
  if (error) throw error
  return data as CatalogoComponente
}

export async function toggleComponenteAtivo(empresaId: string, sku: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_componentes").update({ ativo }).eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}

export async function removerComponente(empresaId: string, sku: string): Promise<void> {
  const { error } = await supabase.from("catalogo_componentes").delete().eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}
