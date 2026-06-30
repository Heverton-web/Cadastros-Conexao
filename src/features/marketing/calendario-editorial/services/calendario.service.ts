import { supabase } from "~/core/supabase";
import type { CalendarioEvento } from "../types";

export async function listarEventos(empresaId: string): Promise<CalendarioEvento[]> {
  const { data } = await supabase
    .from("mktg_calendario")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("data", { ascending: true });

  return (data as CalendarioEvento[]) || [];
}

export async function criarEvento(
  evento: Omit<CalendarioEvento, "id" | "created_at" | "updated_at">
): Promise<CalendarioEvento | null> {
  const { data } = await supabase
    .from("mktg_calendario")
    .insert(evento)
    .select()
    .single();

  return data as CalendarioEvento | null;
}

export async function deletarEvento(id: string): Promise<void> {
  await supabase.from("mktg_calendario").delete().eq("id", id);
}
