import { supabase } from "~/core/supabase"

export interface CatalogoSeqProtetica {
  id: string
  nome: string
  sigla?: string | null
}

export async function listarSeqProteticas(): Promise<CatalogoSeqProtetica[]> {
  const { data, error } = await supabase
    .from("catalogo_seq_proteticas")
    .select("id, nome, sigla")
    .eq("ativo", true)
    .order("nome")
  if (error) throw error
  return data as CatalogoSeqProtetica[]
}

export async function listarSeqProteticasAbutment(abutmentSku: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("catalogo_seq_protetica_abutments")
    .select("seq_id")
    .eq("abutment_sku", abutmentSku)
  if (error) throw error
  return (data as { seq_id: string }[]).map((r) => r.seq_id)
}

export async function salvarSeqProteticasAbutment(abutmentSku: string, seqIds: string[]): Promise<void> {
  await supabase.from("catalogo_seq_protetica_abutments").delete().eq("abutment_sku", abutmentSku)
  if (seqIds.length === 0) return
  const rows = seqIds.map((seqId) => ({ abutment_sku: abutmentSku, seq_id: seqId }))
  const { error } = await supabase.from("catalogo_seq_protetica_abutments").insert(rows)
  if (error) throw error
}
