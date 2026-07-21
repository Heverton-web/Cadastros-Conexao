import { supabase } from "~/core/supabase"
import { dispararEventoModulo } from "~/core/services/webhooks"
import type { CatalogoAbutment, CatalogoCpsTipoReabilitacao, CatalogoCpsTipoAbutment, CatalogoComponente } from "../types"

const MODULO_KEY = "catalogo"

// ============================================================
// Tipos de Reabilitação
// ============================================================

export async function listarTiposReabilitacao(): Promise<CatalogoCpsTipoReabilitacao[]> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_reabilitacao")
    .select("*")
    .order("nome")
  if (error) throw error
  return data as CatalogoCpsTipoReabilitacao[]
}

export async function criarTipoReabilitacao(input: { nome: string; sigla?: string }): Promise<CatalogoCpsTipoReabilitacao> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_reabilitacao")
    .insert({ ...input })
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

export async function listarTiposAbutment(): Promise<CatalogoCpsTipoAbutment[]> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_abutments")
    .select("*, tipo_reabilitacao:catalogo_cps_tipos_reabilitacao(*)")
    .order("nome")
  if (error) throw error
  return data as CatalogoCpsTipoAbutment[]
}

export async function criarTipoAbutment(input: { nome: string; sigla?: string; tipo_reabilitacao_id?: string }): Promise<CatalogoCpsTipoAbutment> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_abutments")
    .insert({ ...input })
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

export async function listarTiposComponentes(): Promise<import("../types").CatalogoCpsTipoComponente[]> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_componentes")
    .select("*")
    .order("nome")
  if (error) throw error
  return data as import("../types").CatalogoCpsTipoComponente[]
}

export async function criarTipoComponente(input: { nome: string; sigla?: string; categoria_id?: string }): Promise<import("../types").CatalogoCpsTipoComponente> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_componentes")
    .insert({ ...input })
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

export async function listarTiposParafusos(): Promise<import("../types").CatalogoCpsTipoParafuso[]> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_parafusos")
    .select("*")
    .order("nome")
  if (error) throw error
  return data as import("../types").CatalogoCpsTipoParafuso[]
}

export async function criarTipoParafuso(input: { nome: string; sigla?: string }): Promise<import("../types").CatalogoCpsTipoParafuso> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_parafusos")
    .insert({ ...input })
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

export async function listarTiposCicatrizadores(): Promise<import("../types").CatalogoCpsTipoCicatrizador[]> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_cicatrizadores")
    .select("*")
    .order("nome")
  if (error) throw error
  return data as import("../types").CatalogoCpsTipoCicatrizador[]
}

export async function criarTipoCicatrizador(input: { nome: string; sigla?: string }): Promise<import("../types").CatalogoCpsTipoCicatrizador> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_cicatrizadores")
    .insert({ ...input })
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

export async function listarAbutments(): Promise<CatalogoAbutment[]> {
  const { data, error } = await supabase
    .from("catalogo_abutments")
    .select("*, tipo_abutment:catalogo_cps_tipos_abutments(*), parafuso:catalogo_parafusos(*), chave:catalogo_chaves(*)")
    .order("sku")
  if (error) throw error
  return data as CatalogoAbutment[]
}

export async function getAbutmentDetalhe(sku: string): Promise<CatalogoAbutment | null> {
  const { data, error } = await supabase
    .from("catalogo_abutments")
    .select("*, tipo_abutment:catalogo_cps_tipos_abutments(*, tipo_reabilitacao:catalogo_cps_tipos_reabilitacao(*)), parafuso:catalogo_parafusos(*), chave:catalogo_chaves(*)")
    .eq("sku", sku)
    .single()
  if (error) throw error
  return data as CatalogoAbutment
}

export async function criarAbutment(input: {
  sku: string; nome: string; tipo_abutment_id: string
  parafuso_id?: string; chave_id?: string
  sigla?: string; descricao?: string
  diametro_plataforma_mm?: number; altura_transmucoso_mm?: number
  altura_corpo_mm?: number; angulacao_graus?: number
  torque_ncm?: number; material?: string; preco?: number
}): Promise<CatalogoAbutment> {
  const { data, error } = await supabase
    .from("catalogo_abutments")
    .insert({ ...input })
    .select()
    .single()
  if (error) throw error
  dispararEventoModulo(MODULO_KEY, "produto.criado", { sku: data.sku, tipo: "abutment" }).catch(() => {})
  return data as CatalogoAbutment
}

export async function atualizarAbutment(sku: string, input: Partial<{
  nome: string; tipo_abutment_id: string; parafuso_id: string; chave_id: string
  sigla: string; descricao: string
  diametro_plataforma_mm: number; altura_transmucoso_mm: number
  altura_corpo_mm: number; angulacao_graus: number
  torque_ncm: number; material: string; preco: number; ativo: boolean
}>): Promise<CatalogoAbutment> {
  const { data, error } = await supabase
    .from("catalogo_abutments")
    .update(input)
    .eq("sku", sku)
    .select()
    .single()
  if (error) throw error
  dispararEventoModulo(MODULO_KEY, "produto.atualizado", { sku, tipo: "abutment" }).catch(() => {})
  return data as CatalogoAbutment
}

export async function toggleAbutmentAtivo(sku: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_abutments").update({ ativo }).eq("sku", sku)
  if (error) throw error
}

export async function removerAbutment(sku: string): Promise<void> {
  const { error } = await supabase.from("catalogo_abutments").delete().eq("sku", sku)
  if (error) throw error
  dispararEventoModulo(MODULO_KEY, "produto.removido", { sku, tipo: "abutment" }).catch(() => {})
}

// ============================================================
// Componentes (NOVO)
// ============================================================

export async function listarComponentes(): Promise<CatalogoComponente[]> {
  const { data, error } = await supabase
    .from("catalogo_componentes")
    .select("*, tipo_componente:catalogo_cps_tipos_componentes(*), tipo_abutment:catalogo_cps_tipos_abutments(*), parafuso:catalogo_parafusos(*), chave:catalogo_chaves(*)")
    .order("sku")
  if (error) throw error
  return data as CatalogoComponente[]
}

export async function getComponenteDetalhe(sku: string): Promise<CatalogoComponente | null> {
  const { data, error } = await supabase
    .from("catalogo_componentes")
    .select("*, tipo_componente:catalogo_cps_tipos_componentes(*), tipo_abutment:catalogo_cps_tipos_abutments(*), parafuso:catalogo_parafusos(*), chave:catalogo_chaves(*)")
    .eq("sku", sku)
    .single()
  if (error) throw error
  return data as CatalogoComponente
}

export async function criarComponente(input: {
  sku: string; nome: string; tipo_componente_id?: string; tipo_abutment_id?: string
  parafuso_id?: string; chave_id?: string
  sigla?: string; descricao?: string
  diametro_plataforma_mm?: number; altura_transmucoso_mm?: number
  altura_corpo_mm?: number; angulacao_graus?: number
  tipo?: string; tipo_travamento?: string; material?: string; preco?: number
}): Promise<CatalogoComponente> {
  const { data, error } = await supabase
    .from("catalogo_componentes")
    .insert({ ...input })
    .select()
    .single()
  if (error) throw error
  dispararEventoModulo(MODULO_KEY, "produto.criado", { sku: data.sku, tipo: "componente" }).catch(() => {})
  return data as CatalogoComponente
}

export async function atualizarComponente(sku: string, input: Partial<{
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
    .eq("sku", sku)
    .select()
    .single()
  if (error) throw error
  return data as CatalogoComponente
}

export async function toggleComponenteAtivo(sku: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_componentes").update({ ativo }).eq("sku", sku)
  if (error) throw error
}

export async function removerComponente(sku: string): Promise<void> {
  const { error } = await supabase.from("catalogo_componentes").delete().eq("sku", sku)
  if (error) throw error
}
