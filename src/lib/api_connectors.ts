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
  ordem?: number;
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
 * Executa a chamada do conector de API diretamente via fetch local,
 * interpolando as variáveis fornecidas na URL, Headers, Query Params e Body.
 */
export async function executeApiConnector(connector_id: string, variables: Record<string, any> = {}) {
  const startTime = Date.now();
  try {
    const { data: conn, error: getErr } = await supabase
      .from("api_connectors")
      .select("*")
      .eq("id", connector_id)
      .single();

    if (getErr || !conn) {
      throw new Error(getErr?.message || "Conexão de API não encontrada no banco.");
    }

    const interpolar = (str: string | null | undefined) => {
      if (!str) return str || "";
      let res = str;
      for (const [chave, valor] of Object.entries(variables)) {
        const chaveEscapada = chave.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const placeholder = new RegExp(`{{${chaveEscapada}}}`, "g");
        res = res.replace(placeholder, valor !== undefined && valor !== null ? String(valor) : "");
      }
      return res;
    };

    let urlFinal = interpolar(conn.url);

    const headersFinais: Record<string, string> = {
      "Content-Type": "application/json"
    };
    if (conn.headers) {
      for (const [k, v] of Object.entries(conn.headers)) {
        headersFinais[interpolar(k)] = interpolar(v as any);
      }
    }

    const queryParamsFinais: Record<string, string> = {};
    if (conn.query_params) {
      for (const [k, v] of Object.entries(conn.query_params)) {
        queryParamsFinais[interpolar(k)] = interpolar(v as any);
      }
    }

    try {
      const isAbsolute = urlFinal.startsWith("http://") || urlFinal.startsWith("https://");
      const baseForUrl = isAbsolute ? undefined : (typeof window !== "undefined" ? window.location.origin : "http://localhost");
      const urlObj = new URL(urlFinal, baseForUrl);
      Object.entries(queryParamsFinais).forEach(([k, v]) => {
        urlObj.searchParams.set(k, v);
      });
      urlFinal = urlObj.toString();
    } catch (urlErr) {
      if (Object.keys(queryParamsFinais).length > 0) {
        const queryStr = new URLSearchParams(queryParamsFinais).toString();
        urlFinal += (urlFinal.includes("?") ? "&" : "?") + queryStr;
      }
    }

    let bodyFinal: string | undefined = undefined;
    if (conn.method !== "GET" && conn.body_template) {
      bodyFinal = interpolar(conn.body_template);
    }

    const res = await fetch(urlFinal, {
      method: conn.method || "POST",
      headers: headersFinais,
      body: bodyFinal
    });

    const duration = Date.now() - startTime;
    const text = await res.text();
    let responseData: any;
    try {
      responseData = JSON.parse(text);
    } catch {
      responseData = text;
    }

    return {
      status: res.status,
      duration,
      headers: Object.fromEntries(res.headers.entries()),
      data: responseData
    };
  } catch (err: any) {
    const duration = Date.now() - startTime;
    console.error("Erro na chamada direta do executeApiConnector:", err);
    return {
      status: 500,
      duration,
      headers: {},
      data: {
        error: "Falha na chamada da API local",
        message: err.message || String(err)
      }
    };
  }
}
