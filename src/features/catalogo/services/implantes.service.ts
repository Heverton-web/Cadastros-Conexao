import { supabase } from "~/core/supabase"
import { dispararEventoModulo } from "~/core/services/webhooks"
import type { CatalogoImplante, CatalogoProtocoloFresagem, CatalogoProtocoloFresaItem, CatalogoFresa, CatalogoChave, CatalogoCicatrizador, CatalogoAbutment, CatalogoKit } from "../types"

const MODULO_KEY = "catalogo"

/** Resolve SKU do implante → UUID id (catalogo_implantes.id) */
async function getImplanteId(empresaId: string, sku: string): Promise<string | null> {
  const { data } = await supabase.from("catalogo_implantes").select("id").eq("empresa_id", empresaId).eq("sku", sku).single()
  return data?.id ?? null
}

export async function listarImplantesAtivos(empresaId: string): Promise<CatalogoImplante[]> {
  const { data, error } = await supabase
    .from("catalogo_implantes")
    .select(`
      *,
      linha:catalogo_ips_linhas!inner(*, familia:catalogo_ips_familias(*, conexao:catalogo_ips_conexoes(*, categoria:catalogo_categorias(*))))
    `)
    .eq("empresa_id", empresaId)
    .eq("ativo", true)
    .order("sku")
  if (error) throw error
  return data as CatalogoImplante[]
}

export async function listarTodosImplantes(empresaId: string): Promise<CatalogoImplante[]> {
  const { data, error } = await supabase
    .from("catalogo_implantes")
    .select(`
      *,
      linha:catalogo_ips_linhas(*, familia:catalogo_ips_familias(*, conexao:catalogo_ips_conexoes(*, categoria:catalogo_categorias(*))))
    `)
    .eq("empresa_id", empresaId)
    .order("sku")
  if (error) throw error
  return data as CatalogoImplante[]
}

export async function getImplanteDetalhe(empresaId: string, sku: string): Promise<CatalogoImplante | null> {
  const { data, error } = await supabase
    .from("catalogo_implantes")
    .select(`
      *,
      linha:catalogo_ips_linhas(*, familia:catalogo_ips_familias(*, conexao:catalogo_ips_conexoes(*, categoria:catalogo_categorias(*))))
    `)
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
    .single()
  if (error) return null
  return data as CatalogoImplante
}

export async function listarImplantesPorLinha(empresaId: string, linhaId: string): Promise<CatalogoImplante[]> {
  const { data, error } = await supabase
    .from("catalogo_implantes")
    .select("*")
    .eq("empresa_id", empresaId)
    .eq("linha_id", linhaId)
    .eq("ativo", true)
    .order("diametro_mm")
  if (error) throw error
  return data as CatalogoImplante[]
}

export async function criarImplante(empresaId: string, input: {
  sku: string; nome: string; linha_id: string
  conexao_id?: string; familia_id?: string; categoria_id?: string
  osso_soft?: string; osso_hard?: string
  diametro_mm: number; comprimento_mm: number
  rosca_interna?: string; regiao_apical?: string; regiao_cervical?: string
  torque_insercao?: number; preco?: number
  sigla?: string; descricao?: string
  macrogeometria?: string; material?: string; superficie?: string
  diametro_plataforma_mm?: number; ativo?: boolean
}): Promise<CatalogoImplante> {
  const { data, error } = await supabase
    .from("catalogo_implantes")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  dispararEventoModulo(MODULO_KEY, "produto.criado", { sku: data.sku, tipo: "implante", empresa_id: empresaId }, empresaId).catch(() => {})
  return data as CatalogoImplante
}

export async function atualizarImplante(empresaId: string, sku: string, input: Partial<{
  nome: string; linha_id: string; conexao_id: string; familia_id: string
  osso_soft: string; osso_hard: string
  diametro_mm: number; comprimento_mm: number
  rosca_interna: string; regiao_apical: string; regiao_cervical: string
  torque_insercao: number; preco: number
  sigla: string; descricao: string
  macrogeometria: string; material: string; superficie: string
  diametro_plataforma_mm: number
  detalhes_extras: Record<string, unknown>; ativo: boolean
}>): Promise<CatalogoImplante> {
  const { data, error } = await supabase
    .from("catalogo_implantes")
    .update(input)
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
    .select()
    .single()
  if (error) throw error
  dispararEventoModulo(MODULO_KEY, "produto.atualizado", { sku, tipo: "implante", empresa_id: empresaId }, empresaId).catch(() => {})
  return data as CatalogoImplante
}

export async function toggleImplanteAtivo(empresaId: string, sku: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_implantes").update({ ativo }).eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}

export async function removerImplante(empresaId: string, sku: string): Promise<void> {
  const { error } = await supabase.from("catalogo_implantes").delete().eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
  dispararEventoModulo(MODULO_KEY, "produto.removido", { sku, tipo: "implante", empresa_id: empresaId }, empresaId).catch(() => {})
}

// ============================================================
// Protocolo de Fresagem (LEGADO - mantido para compatibilidade)
// ============================================================

export async function getProtocoloFresagem(empresaId: string, implanteSku: string): Promise<CatalogoProtocoloFresagem[]> {
  // 1. Busca osso_soft / osso_hard do implante
  const { data: impl } = await supabase
    .from("catalogo_implantes")
    .select("osso_soft, osso_hard")
    .eq("empresa_id", empresaId)
    .eq("sku", implanteSku)
    .single()
  if (!impl) return []

  const protoIds = [impl.osso_soft, impl.osso_hard].filter(Boolean)
  if (protoIds.length === 0) return []

  // 2. Busca definições dos protocolos
  const { data: protocolos } = await supabase
    .from("catalogo_protocolos_fresagens")
    .select("id, nome, tipo_osso, sigla")
    .in("id", protoIds)
    .eq("empresa_id", empresaId)
  if (!protocolos?.length) return []

  const protoMap = new Map(protocolos.map((p) => [p.id, p]))

  // 3. Busca fresas vinculadas aos protocolos
  const { data: itens } = await supabase
    .from("catalogo_protocolos_fresas_itens")
    .select("*, fresa:catalogo_fresas(*)")
    .in("protocolo_id", protoIds)
    .eq("empresa_id", empresaId)
    .order("ordem")
  if (!itens?.length) return []

  // 4. Achata no formato que FresagemTimeline espera
  return itens.map((item) => {
    const proto = protoMap.get(item.protocolo_id)
    return {
      id: item.id,
      empresa_id: empresaId,
      nome: proto?.nome ?? "",
      tipo_osso: proto?.tipo_osso ?? "",
      sigla: proto?.sigla ?? null,
      diametro_mm_aplicavel: null,
      ativo: true,
      created_at: item.created_at,
      updated_at: item.created_at,
      // campos flat usados pelo FresagemTimeline
      ordem_uso: item.ordem,
      fresa_sku: item.fresa_id,
      fresa: item.fresa ?? null,
    } as unknown as CatalogoProtocoloFresagem
  })
}

export async function salvarProtocoloFresagem(empresaId: string, implanteSku: string, protocolos: { fresa_sku: string; tipo_osso: string; ordem_uso: number }[]): Promise<void> {
  // Busca protocolos existentes deste implante
  const { data: existing } = await supabase
    .from("catalogo_protocolos_fresas_itens")
    .select("id")
    .eq("empresa_id", empresaId)
  if (existing?.length) {
    const ids = existing.map((e) => e.id)
    await supabase.from("catalogo_protocolos_fresas_itens").delete().in("id", ids)
  }
  if (protocolos.length === 0) return
  // Busca protocolo_id baseado no tipo_osso
  const { data: protos } = await supabase
    .from("catalogo_protocolos_fresagens")
    .select("id, tipo_osso")
    .eq("empresa_id", empresaId)
  const protoMap = new Map((protos ?? []).map((p) => [p.tipo_osso, p.id]))
  const rows = protocolos.map((p, i) => ({
    empresa_id: empresaId,
    protocolo_id: protoMap.get(p.tipo_osso) ?? "",
    fresa_id: p.fresa_sku,
    ordem: p.ordem_uso,
  })).filter((r) => r.protocolo_id)
  if (rows.length === 0) return
  const { error } = await supabase.from("catalogo_protocolos_fresas_itens").insert(rows)
  if (error) throw error
}

// ============================================================
// Chaves do Implante (N:M)
// ============================================================

/** Resolve SKUs de chaves → UUIDs (catalogo_chaves.id) */
async function getChaveIds(empresaId: string, skus: string[]): Promise<string[]> {
  if (skus.length === 0) return []
  const { data } = await supabase.from("catalogo_chaves").select("id").eq("empresa_id", empresaId).in("sku", skus)
  return (data as { id: string }[] | null)?.map((r) => r.id) ?? []
}

export async function salvarImplanteChaves(empresaId: string, implanteSku: string, chaveSkus: string[]): Promise<void> {
  await supabase.from("catalogo_implante_chaves").delete().eq("empresa_id", empresaId).eq("implante_sku", implanteSku)
  if (chaveSkus.length === 0) return
  const chaveUuids = await getChaveIds(empresaId, chaveSkus)
  if (chaveUuids.length === 0) return
  const rows = chaveUuids.map((chaveId) => ({ empresa_id: empresaId, implante_sku: implanteSku, chave_id: chaveId }))
  const { error } = await supabase.from("catalogo_implante_chaves").insert(rows)
  if (error) throw error
}

export async function listarImplanteChaves(empresaId: string, implanteSku: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("catalogo_implante_chaves")
    .select("chave:catalogo_chaves(sku)")
    .eq("empresa_id", empresaId)
    .eq("implante_sku", implanteSku)
  if (error) throw error
  return (data as { chave: { sku: string } | null }[] | null)?.map((r) => r.chave?.sku).filter(Boolean) as string[] ?? []
}
// ============================================================
// Kits do Implante (N:M)
// ============================================================

export async function salvarImplanteKits(empresaId: string, implanteSku: string, kitSkus: string[]): Promise<void> {
  await supabase.from("catalogo_implante_kit").delete().eq("empresa_id", empresaId).eq("implante_sku", implanteSku)
  if (kitSkus.length === 0) return
  const rows = kitSkus.map((kitSku) => ({ empresa_id: empresaId, implante_sku: implanteSku, kit_sku: kitSku }))
  const { error } = await supabase.from("catalogo_implante_kit").insert(rows)
  if (error) throw error
}

export async function listarImplanteKits(empresaId: string, implanteSku: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("catalogo_implante_kit")
    .select("kit_sku")
    .eq("empresa_id", empresaId)
    .eq("implante_sku", implanteSku)
  if (error) throw error
  return (data as { kit_sku: string }[]).map((r) => r.kit_sku)
}

// ============================================================
// Abutments do Implante (N:M)
// ============================================================

export async function salvarImplanteAbutments(empresaId: string, implanteSku: string, abutmentSkus: string[]): Promise<void> {
  await supabase.from("catalogo_implante_abutment").delete().eq("empresa_id", empresaId).eq("implante_sku", implanteSku)
  if (abutmentSkus.length === 0) return
  const rows = abutmentSkus.map((abutmentSku) => ({ empresa_id: empresaId, implante_sku: implanteSku, abutment_sku: abutmentSku }))
  const { error } = await supabase.from("catalogo_implante_abutment").insert(rows)
  if (error) throw error
}

export async function listarImplanteAbutments(empresaId: string, implanteSku: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("catalogo_implante_abutment")
    .select("abutment_sku")
    .eq("empresa_id", empresaId)
    .eq("implante_sku", implanteSku)
  if (error) throw error
  return (data as { abutment_sku: string }[]).map((r) => r.abutment_sku)
}

// ============================================================
// Cicatrizadores do Implante (via FK implante_id)
// ============================================================

export async function listarImplanteCicatrizadores(empresaId: string, implanteSku: string): Promise<string[]> {
  const implanteId = await getImplanteId(empresaId, implanteSku)
  if (!implanteId) return []
  const { data, error } = await supabase
    .from("catalogo_cicatrizadores")
    .select("sku")
    .eq("empresa_id", empresaId)
    .eq("implante_id", implanteId)
  if (error) throw error
  return (data as { sku: string }[]).map((r) => r.sku)
}

/** Desvincula todos os cicatrizadores deste implante e vincula os novos */
export async function salvarImplanteCicatrizadores(empresaId: string, implanteSku: string, cicatrizadorSkus: string[]): Promise<void> {
  const implanteId = await getImplanteId(empresaId, implanteSku)
  if (!implanteId) return
  // Desvincula os que estavam linkados a este implante
  await supabase.from("catalogo_cicatrizadores").update({ implante_id: null }).eq("empresa_id", empresaId).eq("implante_id", implanteId)
  if (cicatrizadorSkus.length === 0) return
  // Vincula os novos
  const { error } = await supabase.from("catalogo_cicatrizadores").update({ implante_id: implanteId }).eq("empresa_id", empresaId).in("sku", cicatrizadorSkus)
  if (error) throw error
}

// ============================================================
// Dados Relacionados ao Implante
// ============================================================

/** Lista chaves completas vinculadas ao implante (via pivot catalogo_implante_chaves) */
export async function listarChavesDoImplante(empresaId: string, implanteSku: string): Promise<CatalogoChave[]> {
  const { data, error } = await supabase
    .from("catalogo_implante_chaves")
    .select("chave_id, chave:catalogo_chaves(*, tipo_chave:catalogo_tipos_chaves(*))")
    .eq("empresa_id", empresaId)
    .eq("implante_sku", implanteSku)
  if (error) throw error
  return (data as { chave: CatalogoChave }[]).map((r) => r.chave).filter(Boolean)
}

/** Lista cicatrizadores que referenciam este implante (FK implante_id) */
export async function listarCicatrizadoresDoImplante(empresaId: string, implanteSku: string): Promise<CatalogoCicatrizador[]> {
  const implanteId = await getImplanteId(empresaId, implanteSku)
  if (!implanteId) return []
  const { data, error } = await supabase
    .from("catalogo_cicatrizadores")
    .select("*, implante:catalogo_implantes(*), chave:catalogo_chaves(*)")
    .eq("empresa_id", empresaId)
    .eq("implante_id", implanteId)
    .eq("ativo", true)
    .order("nome")
  if (error) throw error
  return data as CatalogoCicatrizador[]
}

/** Lista abutments da mesma família (familia_id) */
export async function listarAbutmentsDaFamilia(empresaId: string, familiaId: string): Promise<CatalogoAbutment[]> {
  const { data, error } = await supabase
    .from("catalogo_abutments")
    .select("*, tipo_abutment:catalogo_cps_tipos_abutments(*), familia:catalogo_ips_familias(*), parafuso:catalogo_parafusos(*), chave:catalogo_chaves(*)")
    .eq("empresa_id", empresaId)
    .eq("familia_id", familiaId)
    .order("sku")
  if (error) throw error
  return data as CatalogoAbutment[]
}

/** Lista kits que compartilham chaves com este implante */
export async function listarKitsComChavesEmComum(empresaId: string, implanteSku: string): Promise<CatalogoKit[]> {
  // 1. Busca UUIDs das chaves do implante via join
  const { data: kc } = await supabase
    .from("catalogo_implante_chaves")
    .select("chave:catalogo_chaves(id)")
    .eq("empresa_id", empresaId)
    .eq("implante_sku", implanteSku)
  const chaveIds = (kc as { chave: { id: string } | null }[] | null)?.map((r) => r.chave?.id).filter(Boolean) as string[] ?? []
  if (chaveIds.length === 0) return []

  // 2. Busca kits que têm pelo menos uma dessas chaves
  const { data: kk } = await supabase
    .from("catalogo_kit_chaves")
    .select("kit_sku")
    .eq("empresa_id", empresaId)
    .in("chave_id", chaveIds)
  const kitSkus = [...new Set((kk as { kit_sku: string }[] | null)?.map((r) => r.kit_sku) ?? [])]
  if (kitSkus.length === 0) return []

  // 3. Retorna kits completos
  const { data, error } = await supabase
    .from("catalogo_kits")
    .select("*, tipo_kit:catalogo_tipos_kits(*)")
    .eq("empresa_id", empresaId)
    .in("sku", kitSkus)
    .eq("ativo", true)
  if (error) throw error
  return data as CatalogoKit[]
}

// ============================================================
// Fresas
// ============================================================

export async function listarFresas(empresaId: string): Promise<CatalogoFresa[]> {
  const { data, error } = await supabase
    .from("catalogo_fresas")
    .select("*, tipo_fresa:catalogo_tipos_fresas(*)")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoFresa[]
}

export async function criarFresa(empresaId: string, input: { sku: string; nome: string; tipo_fresa_id?: string; diametro_mm?: number }): Promise<CatalogoFresa> {
  const { data, error } = await supabase
    .from("catalogo_fresas")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoFresa
}

export async function toggleFresaAtivo(empresaId: string, sku: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_fresas").update({ ativo }).eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}

export async function removerFresa(empresaId: string, sku: string): Promise<void> {
  const { error } = await supabase.from("catalogo_fresas").delete().eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}
