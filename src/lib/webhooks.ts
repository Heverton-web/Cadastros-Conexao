import { supabase } from "./supabase";

export type Webhook = {
  id: string;
  nome: string;
  evento: string;
  tipo_evento: "status_change" | "button_action";
  url: string;
  metodo: string;
  headers: Record<string, string>;
  body_template: Record<string, any>;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

export type WebhookInput = {
  nome: string;
  evento: string;
  tipo_evento?: "status_change" | "button_action";
  url: string;
  metodo?: string;
  headers?: Record<string, string>;
  body_template?: Record<string, any>;
  ativo?: boolean;
};

export type WebhookLog = {
  id: string;
  webhook_id: string | null;
  evento: string | null;
  url: string | null;
  status_code: number | null;
  resposta: string | null;
  sucesso: boolean | null;
  payload_enviado: any;
  created_at: string;
};

export async function listarWebhooks() {
  const { data, error } = await supabase
    .from("webhooks")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Webhook[];
}

export async function criarWebhook(input: WebhookInput) {
  const { data, error } = await supabase
    .from("webhooks")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as Webhook;
}

export async function atualizarWebhook(id: string, input: Partial<WebhookInput>) {
  const { data, error } = await supabase
    .from("webhooks")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Webhook;
}

export async function toggleWebhook(id: string, ativo: boolean) {
  return atualizarWebhook(id, { ativo });
}

export async function deletarWebhook(id: string) {
  const { error } = await supabase
    .from("webhooks")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function listarWebhookLogs(webhookId?: string) {
  let query = supabase
    .from("webhook_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (webhookId) query = query.eq("webhook_id", webhookId);
  const { data, error } = await query;
  if (error) throw error;
  return data as WebhookLog[];
}

export async function dispararWebhooks(evento: string, payload: Record<string, any>) {
  try {
    const { data: webhooks, error } = await supabase
      .from("webhooks")
      .select("*")
      .eq("evento", evento)
      .eq("ativo", true);
    if (error || !webhooks?.length) return;

    for (const wh of webhooks as Webhook[]) {
      const body = { ...wh.body_template, ...payload, evento };
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(wh.headers || {}),
      };

      try {
        const res = await fetch(wh.url, {
          method: wh.metodo || "POST",
          headers,
          body: JSON.stringify(body),
        });
        const text = await res.text();
        await supabase.from("webhook_logs").insert({
          webhook_id: wh.id,
          evento,
          url: wh.url,
          status_code: res.status,
          resposta: text.slice(0, 2000),
          sucesso: res.ok,
          payload_enviado: body,
        });
      } catch (e: any) {
        await supabase.from("webhook_logs").insert({
          webhook_id: wh.id,
          evento,
          url: wh.url,
          status_code: null,
          resposta: e.message?.slice(0, 2000) || "Erro de rede",
          sucesso: false,
          payload_enviado: body,
        });
      }
    }
  } catch (e) {
    console.error("Erro ao disparar webhooks:", e);
  }
}

export const EVENTOS_STATUS_CHANGE = [
  { value: "link_gerado", label: "Link Gerado" },
  { value: "dados_enviados", label: "Dados Enviados" },
  { value: "em_analise", label: "Em Análise" },
  { value: "em_correcao", label: "Em Correção" },
  { value: "aprovado", label: "Aprovado" },
  { value: "reprovado", label: "Reprovado" },
];

export const EVENTOS_BUTTON_ACTION = [
  { value: "botao_compartilhar_link", label: "Compartilhar Link" },
  { value: "botao_aprovar", label: "Aprovar Cadastro" },
  { value: "botao_reprovar", label: "Reprovar Cadastro" },
  { value: "botao_corrigir", label: "Solicitar Correção" },
  { value: "criacao_credencial", label: "Criação de Credencial" },
];
