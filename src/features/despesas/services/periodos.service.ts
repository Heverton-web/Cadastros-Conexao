import { supabase } from "~/core/supabase";
import type { DespesaPeriodo } from "../types";

export async function listarPeriodos(empresa_id: string): Promise<DespesaPeriodo[]> {
  const { data, error } = await supabase
    .from("despesas_periodos")
    .select("*")
    .eq("empresa_id", empresa_id)
    .order("data_inicio", { ascending: false });
  if (error) throw error;
  return data as DespesaPeriodo[];
}

export async function listarPeriodosAbertos(empresa_id: string): Promise<DespesaPeriodo[]> {
  const { data, error } = await supabase
    .from("despesas_periodos")
    .select("*")
    .eq("empresa_id", empresa_id)
    .eq("status", "aberto")
    .order("data_inicio", { ascending: false });
  if (error) throw error;
  return data as DespesaPeriodo[];
}

export async function buscarPeriodo(id: string): Promise<DespesaPeriodo> {
  const { data, error } = await supabase
    .from("despesas_periodos")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as DespesaPeriodo;
}

export async function criarPeriodo(periodo: Partial<DespesaPeriodo>): Promise<DespesaPeriodo> {
  const { data, error } = await supabase
    .from("despesas_periodos")
    .insert(periodo)
    .select()
    .single();
  if (error) throw error;
  return data as DespesaPeriodo;
}

export async function atualizarPeriodo(id: string, updates: Partial<DespesaPeriodo>): Promise<DespesaPeriodo> {
  const { data, error } = await supabase
    .from("despesas_periodos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as DespesaPeriodo;
}

export async function fecharPeriodo(id: string): Promise<DespesaPeriodo> {
  return atualizarPeriodo(id, { status: "fechado" });
}

export async function gerarPeriodos(empresa_id: string): Promise<void> {
  const { error } = await supabase.rpc("gerar_periodos_automaticos", { p_empresa_id: empresa_id });
  if (error) throw error;
}
