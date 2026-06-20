import { supabase } from "./supabase";

export type ApiConnectorType = "api_call" | "webhook";

export type ApiConnector = {
  id: string;
  name: string;
  type: ApiConnectorType;
  method: string;
  url: string;
  headers: Record<string, string>;
  query_params: Record<string, string>;
  body_template: string | null;
  response_schema: any | null;
  evento: string | null;
  tipo_evento: "status_change" | "button_action" | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ApiConnectorInput = Omit<ApiConnector, "id" | "created_at" | "updated_at">;

export async function listApiConnectors(type?: ApiConnectorType) {
  let query = supabase.from("api_connectors").select("*").order("name", { ascending: true });
  if (type) {
    query = query.eq("type", type);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data as ApiConnector[];
}

export async function createApiConnector(input: ApiConnectorInput) {
  const { data, error } = await supabase
    .from("api_connectors")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as ApiConnector;
}

export async function updateApiConnector(id: string, input: Partial<ApiConnectorInput>) {
  const { data, error } = await supabase
    .from("api_connectors")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as ApiConnector;
}

export async function deleteApiConnector(id: string) {
  const { error } = await supabase.from("api_connectors").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Invoca a Edge Function "api_runner" para disparar o webhook ou api_call
 * com as variáveis para interpolação.
 */
export async function executeApiConnector(connector_id: string, variables: Record<string, any> = {}) {
  const { data, error } = await supabase.functions.invoke("api_runner", {
    body: { connector_id, variables }
  });

  if (error) {
    console.error("Erro na chamada da Edge Function:", error);
    throw error;
  }

  return data; // O data já virá formatado pelo nosso edge function { status, duration, headers, data }
}
