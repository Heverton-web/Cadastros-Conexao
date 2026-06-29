import { supabase } from "~/core/supabase";
import type { Despesa, DespesaFormData, DespesaFiltros } from "../types";

export async function listarDespesas(empresa_id: string, filtros?: DespesaFiltros): Promise<Despesa[]> {
  let query = supabase
    .from("despesas")
    .select("*, tipo:despesas_tipos(*), periodo:despesas_periodos(*)")
    .eq("empresa_id", empresa_id)
    .order("data_despesa", { ascending: false });

  if (filtros?.periodo_id) query = query.eq("periodo_id", filtros.periodo_id);
  if (filtros?.status) query = query.eq("status", filtros.status);
  if (filtros?.tipo_id) query = query.eq("tipo_id", filtros.tipo_id);
  if (filtros?.data_inicio) query = query.gte("data_despesa", filtros.data_inicio);
  if (filtros?.data_fim) query = query.lte("data_despesa", filtros.data_fim);

  const { data, error } = await query;
  if (error) throw error;
  return data as Despesa[];
}

export async function listarMinhasDespesas(empresa_id: string, usuario_id: string, filtros?: DespesaFiltros): Promise<Despesa[]> {
  let query = supabase
    .from("despesas")
    .select("*, tipo:despesas_tipos(*), periodo:despesas_periodos(*)")
    .eq("empresa_id", empresa_id)
    .eq("usuario_id", usuario_id)
    .order("data_despesa", { ascending: false });

  if (filtros?.periodo_id) query = query.eq("periodo_id", filtros.periodo_id);
  if (filtros?.status) query = query.eq("status", filtros.status);
  if (filtros?.tipo_id) query = query.eq("tipo_id", filtros.tipo_id);

  const { data, error } = await query;
  if (error) throw error;
  return data as Despesa[];
}

export async function buscarDespesa(id: string): Promise<Despesa> {
  const { data, error } = await supabase
    .from("despesas")
    .select("*, tipo:despesas_tipos(*), periodo:despesas_periodos(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Despesa;
}

export async function criarDespesa(empresa_id: string, usuario_id: string, despesa: DespesaFormData): Promise<Despesa> {
  const { data, error } = await supabase
    .from("despesas")
    .insert({
      empresa_id,
      usuario_id,
      ...despesa,
      status: "rascunho",
    })
    .select("*, tipo:despesas_tipos(*), periodo:despesas_periodos(*)")
    .single();
  if (error) throw error;
  return data as Despesa;
}

export async function atualizarDespesa(id: string, updates: Partial<Despesa>): Promise<Despesa> {
  const { data, error } = await supabase
    .from("despesas")
    .update(updates)
    .eq("id", id)
    .select("*, tipo:despesas_tipos(*), periodo:despesas_periodos(*)")
    .single();
  if (error) throw error;
  return data as Despesa;
}

export async function excluirDespesa(id: string): Promise<void> {
  const { error } = await supabase
    .from("despesas")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function enviarDespesas(periodo_id: string, usuario_id: string): Promise<void> {
  const { error } = await supabase
    .from("despesas")
    .update({ status: "pendente" })
    .eq("periodo_id", periodo_id)
    .eq("usuario_id", usuario_id)
    .eq("status", "rascunho");
  if (error) throw error;
}

export async function aprovarDespesa(id: string): Promise<Despesa> {
  return atualizarDespesa(id, { status: "aprovada", comentario_reprovacao: "" });
}

export async function reprovarDespesa(id: string, comentario: string): Promise<Despesa> {
  return atualizarDespesa(id, { status: "reprovada", comentario_reprovacao: comentario });
}

export async function marcarComoPaga(id: string): Promise<Despesa> {
  return atualizarDespesa(id, { status: "paga" });
}

export async function uploadComprovante(empresa_id: string, usuario_id: string, despesa_id: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${empresa_id}/${usuario_id}/${despesa_id}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("comprovantes")
    .upload(fileName, file, { upsert: true });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from("comprovantes")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}
