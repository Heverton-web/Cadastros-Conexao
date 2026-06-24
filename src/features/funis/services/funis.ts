import { supabase } from "~/core/supabase";
import { dispararEventoModulo } from "~/core/services/webhooks";
import type { Funil, FunilInput } from "../types";

const MODULO_KEY = "funis-conexao";

export async function listarFunis(empresaId?: string): Promise<Funil[]> {
  let query = supabase
    .from("funis")
    .select("*")
    .order("created_at", { ascending: false });
  if (empresaId) {
    query = query.eq("empresa_id", empresaId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Funil[];
}

export async function buscarFunil(id: string): Promise<Funil> {
  const { data, error } = await supabase
    .from("funis")
    .select("*, colunas:funis_colunas(*), tarefas:funis_tarefas(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  const funil = data as Funil;
  if (funil.colunas) {
    funil.colunas.sort((a, b) => a.posicao - b.posicao);
  }
  if (funil.tarefas) {
    funil.tarefas.sort((a, b) => a.posicao - b.posicao);
  }
  return funil;
}

export async function criarFunil(input: FunilInput, empresaId?: string | null): Promise<Funil> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data, error } = await supabase
    .from("funis")
    .insert({
      titulo: input.titulo,
      descricao: input.descricao ?? null,
      created_by: user.id,
      empresa_id: empresaId ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  const funil = data as Funil;

  const colunasParaCriar = input.colunas && input.colunas.length > 0
    ? input.colunas
    : ["Backlog", "Em andamento", "Revisão", "Concluído"];

  const colunasData = colunasParaCriar.map((titulo, index) => ({
    funil_id: funil.id,
    titulo,
    posicao: index
  }));

  const { error: colunasError } = await supabase
    .from("funis_colunas")
    .insert(colunasData);
  if (colunasError) throw colunasError;

  dispararEventoModulo(MODULO_KEY, "funil.criado", { funil }, funil.empresa_id).catch(() => {});
  return funil;
}

export async function atualizarFunil(id: string, input: Partial<FunilInput>): Promise<Funil> {
  const { data, error } = await supabase
    .from("funis")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  const funil = data as Funil;
  dispararEventoModulo(MODULO_KEY, "funil.atualizado", { funil }, funil.empresa_id).catch(() => {});
  return funil;
}

export async function deletarFunil(id: string): Promise<void> {
  const { data: before } = await supabase.from("funis").select("empresa_id").eq("id", id).single();
  const { error } = await supabase
    .from("funis")
    .delete()
    .eq("id", id);
  if (error) throw error;
  dispararEventoModulo(MODULO_KEY, "funil.excluido", { funilId: id }, before?.empresa_id).catch(() => {});
}
