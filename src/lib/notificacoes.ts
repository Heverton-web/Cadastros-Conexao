import { supabase } from "./supabase";

export type Notificacao = {
  id: string;
  usuario_id: string;
  titulo: string;
  mensagem: string;
  lida: boolean;
  dados: { cadastro_id?: string } | null;
  created_at: string;
};

export type NotificacaoTemplate = {
  id: string;
  evento: string;
  titulo: string;
  corpo_template: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

export async function listarNotificacoes(usuarioId: string) {
  const { data, error } = await supabase
    .from("notificacoes")
    .select("*")
    .eq("usuario_id", usuarioId)
    .eq("lida", false)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Notificacao[];
}

export async function marcarComoLida(notificacaoId: string) {
  const { error } = await supabase
    .from("notificacoes")
    .update({ lida: true })
    .eq("id", notificacaoId);
  if (error) throw error;
}

export async function marcarTodasComoLidas(usuarioId: string) {
  const { error } = await supabase
    .from("notificacoes")
    .update({ lida: true })
    .eq("usuario_id", usuarioId)
    .eq("lida", false);
  if (error) throw error;
}

export async function listarTemplates() {
  const { data, error } = await supabase
    .from("notificacoes_templates")
    .select("*")
    .order("evento");
  if (error) throw error;
  return data as NotificacaoTemplate[];
}

export async function atualizarTemplate(evento: string, titulo: string, corpo: string, ativo: boolean) {
  const { data, error } = await supabase
    .from("notificacoes_templates")
    .update({
      titulo,
      corpo_template: corpo,
      ativo,
      updated_at: new Date().toISOString()
    })
    .eq("evento", evento)
    .select()
    .single();
  if (error) throw error;
  return data as NotificacaoTemplate;
}

export async function enviarNotificacaoComTemplate(
  evento: string,
  cadastroId: string,
  destinatarioId: string,
  variaveis: Record<string, string>
) {
  try {
    // 1. Busca o template correspondente ao evento
    const { data: temp, error } = await supabase
      .from("notificacoes_templates")
      .select("*")
      .eq("evento", evento)
      .eq("ativo", true)
      .maybeSingle();

    if (error || !temp) return;

    // 2. Resolve variáveis no título e corpo
    let tituloFinal = temp.titulo;
    let mensagemFinal = temp.corpo_template;

    for (const [chave, valor] of Object.entries(variaveis)) {
      const placeholder = new RegExp(`{{${chave}}}`, "g");
      tituloFinal = tituloFinal.replace(placeholder, valor || "");
      mensagemFinal = mensagemFinal.replace(placeholder, valor || "");
    }

    // 3. Insere a notificação individual no banco
    const { error: insertError } = await supabase
      .from("notificacoes")
      .insert({
        usuario_id: destinatarioId,
        titulo: tituloFinal,
        mensagem: mensagemFinal,
        dados: { cadastro_id: cadastroId }
      });

    if (insertError) throw insertError;
  } catch (e) {
    console.error("Erro ao enviar notificacao com template:", e);
  }
}
