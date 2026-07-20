import { supabase } from "~/lib/supabase"
import type { CatalogoSequenciaProtetica } from "../types"

export async function listarSequenciaProtetica(
  abutmentSku: string
): Promise<CatalogoSequenciaProtetica[]> {
  const { data, error } = await supabase
    .from("catalogo_sequencia_protetica")
    .select("*, acessorio:catalogo_acessorios(*)")
    .eq("abutment_sku", abutmentSku)
    .order("etapa_ordem")
  if (error) throw error
  return data as CatalogoSequenciaProtetica[]
}

export async function salvarSequenciaProtetica(
  abutmentSku: string,
  etapas: { tipo_workflow: string; etapa_ordem: number; etapa_nome: string; acessorio_sku: string }[]
): Promise<void> {
  await supabase
    .from("catalogo_sequencia_protetica")
    .delete()
    .eq("abutment_sku", abutmentSku)

  if (etapas.length === 0) return

  const rows = etapas.map((e) => ({
    abutment_sku: abutmentSku,
    ...e,
  }))

  const { error } = await supabase
    .from("catalogo_sequencia_protetica")
    .insert(rows)
  if (error) throw error
}
