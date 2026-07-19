import { supabase } from "~/core/supabase/client";
import { EMPRESA_ID } from "~/config/empresa"
import type { HubSystemIntegrations } from "../types";

export async function fetchHubIntegrations() {
  const { data, error } = await supabase
    .from("hub_integracoes_sistema")
    .select("*")
    .eq("empresa_id", EMPRESA_ID)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data as HubSystemIntegrations | null;
}

export async function upsertHubIntegrations(
  integrations: Partial<HubSystemIntegrations>,
) {
  const { data, error } = await supabase
    .from("hub_integracoes_sistema")
    .upsert(integrations, { onConflict: "empresa_id" })
    .select()
    .single();
  if (error) throw error;
  return data as HubSystemIntegrations;
}

export async function toggleHubProvider(
  EMPRESA_ID: string,
  provider: string,
  active: boolean,
) {
  const updates: Record<string, unknown> = {};
  updates[`${provider}_active`] = active;
  updates.empresa_id = EMPRESA_ID;
  const { data, error } = await supabase
    .from("hub_integracoes_sistema")
    .upsert(updates, { onConflict: "empresa_id" })
    .select()
    .single();
  if (error) throw error;
  return data as HubSystemIntegrations;
}
