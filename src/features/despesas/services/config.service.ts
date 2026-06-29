import { supabase } from "~/core/supabase";
import type { DespesaConfig } from "../types";

export async function buscarConfig(empresa_id: string): Promise<DespesaConfig | null> {
  const { data, error } = await supabase
    .from("despesas_config")
    .select("*")
    .eq("empresa_id", empresa_id)
    .maybeSingle();
  if (error) throw error;
  return data as DespesaConfig | null;
}

export async function criarOuAtualizarConfig(empresa_id: string, config: Partial<DespesaConfig>): Promise<DespesaConfig> {
  const existente = await buscarConfig(empresa_id);

  if (existente) {
    const { data, error } = await supabase
      .from("despesas_config")
      .update(config)
      .eq("empresa_id", empresa_id)
      .select()
      .single();
    if (error) throw error;
    return data as DespesaConfig;
  }

  const { data, error } = await supabase
    .from("despesas_config")
    .insert({ empresa_id, ...config })
    .select()
    .single();
  if (error) throw error;
  return data as DespesaConfig;
}
