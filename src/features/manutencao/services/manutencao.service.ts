import { supabase } from "~/core/supabase";
import { EMPRESA_ID } from "~/config/empresa"
import { dispararEventoModulo } from "~/core/services/webhooks";
import type { Manutencao, ManutencaoInput } from "../types";

const MODULO_KEY = "manutencao";

const MENSAGEM_PADRAO =
  "Estamos em manutenção. Voltamos em breve. Agradecemos a compreensão.";

export async function listarManutencoes(
  EMPRESA_ID: string | null | undefined,
): Promise<Manutencao[]> {
  const target = EMPRESA_ID ?? null;
  let query = supabase
    .from("modulos_manutencao")
    .select("*")
    .or(`empresa_id.is.null,empresa_id.eq.${target}`)
    .order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data as Manutencao[]) ?? [];
}

export async function listarManutencoesAtivas(
  EMPRESA_ID: string | null | undefined,
): Promise<Manutencao[]> {
  const todas = await listarManutencoes(EMPRESA_ID);
  const agora = Date.now();
  return todas.filter((m) => {
    if (!m.ativo) return false;
    if (m.data_fim && new Date(m.data_fim).getTime() <= agora) return false;
    return true;
  });
}

export async function salvarManutencao(
  EMPRESA_ID: string | null | undefined,
  input: ManutencaoInput,
): Promise<Manutencao> {
  const target = EMPRESA_ID ?? null;
  const mensagem = input.mensagem?.trim() || MENSAGEM_PADRAO;

  const { data: authData } = await supabase.auth.getUser();
  const criadoPor = authData.user?.id ?? null;

  const desativaQuery = supabase
    .from("modulos_manutencao")
    .update({ ativo: false })
    .eq("modulo_key", input.modulo_key)
    .is("rota", input.rota as any);

  if (target === null) {
    desativaQuery.is("empresa_id", null);
  } else {
    desativaQuery.eq("empresa_id", target);
  }

  const { error: desativaErr } = await desativaQuery;

  if (desativaErr) throw desativaErr;

  const { data, error } = await supabase
    .from("modulos_manutencao")
    .insert({
      empresa_id: target,
      modulo_key: input.modulo_key,
      rota: input.rota,
      ativo: true,
      mensagem,
      data_fim: input.data_fim,
      criado_por: criadoPor,
    })
    .select("*")
    .single();

  if (error) throw error;

  dispararEventoModulo(
    MODULO_KEY,
    "manutencao.ativada",
    {
      modulo_key: input.modulo_key,
      rota: input.rota,
      empresa_id: target,
      tem_fim: !!input.data_fim,
    },
    target,
  ).catch(() => {});

  return data as Manutencao;
}

export async function desativarManutencao(
  id: string,
  EMPRESA_ID: string | null | undefined,
): Promise<void> {
  const target = EMPRESA_ID ?? null;

  const { data: atual, error: buscaErr } = await supabase
    .from("modulos_manutencao")
    .select("*")
    .eq("id", id)
    .single();
  if (buscaErr) throw buscaErr;

  const manutencao = atual as Manutencao | null;
  if (manutencao && manutencao.empresa_id !== target) {
    throw new Error("Registro de manutenção não pertence à empresa informada.");
  }

  const { error } = await supabase
    .from("modulos_manutencao")
    .update({ ativo: false })
    .eq("id", id);
  if (error) throw error;

  dispararEventoModulo(
    MODULO_KEY,
    "manutencao.desativada",
    {
      modulo_key: (atual as Manutencao)?.modulo_key,
      rota: (atual as Manutencao)?.rota,
      empresa_id: target,
    },
    target,
  ).catch(() => {});
}

export async function atualizarManutencao(
  id: string,
  input: Partial<ManutencaoInput>,
  EMPRESA_ID: string | null | undefined,
): Promise<Manutencao> {
  const target = EMPRESA_ID ?? null;

  const { data: atual, error: buscaErr } = await supabase
    .from("modulos_manutencao")
    .select("*")
    .eq("id", id)
    .single();
  if (buscaErr) throw buscaErr;

  const manutencao = atual as Manutencao | null;
  if (manutencao && manutencao.empresa_id !== target) {
    throw new Error("Registro de manutenção não pertence à empresa informada.");
  }

  const { data, error } = await supabase
    .from("modulos_manutencao")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Manutencao;
}
