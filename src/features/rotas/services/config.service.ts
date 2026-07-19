import { supabase } from "~/core/supabase";
import { EMPRESA_ID } from "~/config/empresa"
import type { RotasConfig } from "../types";

export async function getConfig(
  EMPRESA_ID: string,
): Promise<RotasConfig | null> {
  const { data, error } = await supabase
    .from("rotas_config")
    .select("*")
    .eq("empresa_id", EMPRESA_ID)
    .maybeSingle();
  if (error) throw error;
  return data as RotasConfig | null;
}

export async function upsertConfig(
  EMPRESA_ID: string,
  config: Partial<RotasConfig>,
): Promise<RotasConfig> {
  const { data, error } = await supabase
    .from("rotas_config")
    .upsert({ empresa_id: EMPRESA_ID, ...config }, { onConflict: "empresa_id" })
    .select()
    .single();
  if (error) throw error;
  return data as RotasConfig;
}
