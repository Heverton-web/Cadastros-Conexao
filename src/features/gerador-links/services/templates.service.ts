import { supabase } from "~/core/supabase";
import type { TemplateMensagem, TipoTemplate } from "../types";

export async function listarTemplates(empresaId: string): Promise<TemplateMensagem[]> {
  const { data } = await supabase
    .from("gerador_templates")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("created_at", { ascending: false });
  return (data as TemplateMensagem[]) || [];
}

export async function criarTemplate(input: {
  empresa_id: string;
  tipo: TipoTemplate;
  nome: string;
  conteudo: Record<string, string>;
}): Promise<TemplateMensagem> {
  const { data } = await supabase
    .from("gerador_templates")
    .insert(input)
    .select()
    .single();
  return data as TemplateMensagem;
}

export async function atualizarTemplate(
  id: string,
  input: { nome?: string; conteudo?: Record<string, string> },
): Promise<void> {
  await supabase.from("gerador_templates").update(input).eq("id", id);
}

export async function deletarTemplate(id: string): Promise<void> {
  await supabase.from("gerador_templates").delete().eq("id", id);
}
