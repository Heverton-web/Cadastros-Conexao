import { supabase } from "~/core/supabase";
import type { DespesaTipo } from "../types";

export async function listarTiposDespesa(empresa_id: string): Promise<DespesaTipo[]> {
  const { data, error } = await supabase
    .from("despesas_tipos")
    .select("*")
    .eq("empresa_id", empresa_id)
    .order("nome");
  if (error) throw error;
  return data as DespesaTipo[];
}

export async function listarTiposDespesaAtivos(empresa_id: string): Promise<DespesaTipo[]> {
  const { data, error } = await supabase
    .from("despesas_tipos")
    .select("*")
    .eq("empresa_id", empresa_id)
    .eq("ativo", true)
    .order("nome");
  if (error) throw error;
  return data as DespesaTipo[];
}

export async function buscarTipoDespesa(id: string): Promise<DespesaTipo> {
  const { data, error } = await supabase
    .from("despesas_tipos")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as DespesaTipo;
}

export async function criarTipoDespesa(tipo: Partial<DespesaTipo>): Promise<DespesaTipo> {
  const { data, error } = await supabase
    .from("despesas_tipos")
    .insert(tipo)
    .select()
    .single();
  if (error) throw error;
  return data as DespesaTipo;
}

export async function atualizarTipoDespesa(id: string, updates: Partial<DespesaTipo>): Promise<DespesaTipo> {
  const { data, error } = await supabase
    .from("despesas_tipos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as DespesaTipo;
}

export async function excluirTipoDespesa(id: string): Promise<void> {
  const { error } = await supabase
    .from("despesas_tipos")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
