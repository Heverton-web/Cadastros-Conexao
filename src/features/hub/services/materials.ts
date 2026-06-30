import { supabase } from "~/core/supabase/client";
import type { HubMaterial, HubMaterialAsset, HubLanguage } from "../types";

export async function fetchHubMaterials(empresaId?: string) {
  let query = supabase.from("hub_materials").select("*");
  if (empresaId) query = query.eq("empresa_id", empresaId);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data as HubMaterial[];
}

export async function fetchHubMaterialById(id: string) {
  const { data, error } = await supabase
    .from("hub_materials")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as HubMaterial;
}

export async function createHubMaterial(material: Partial<HubMaterial>) {
  const { data, error } = await supabase
    .from("hub_materials")
    .insert(material)
    .select()
    .single();
  if (error) throw error;
  return data as HubMaterial;
}

export async function updateHubMaterial(
  id: string,
  updates: Partial<HubMaterial>,
) {
  const { data, error } = await supabase
    .from("hub_materials")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as HubMaterial;
}

export async function deleteHubMaterial(id: string) {
  const { error } = await supabase.from("hub_materials").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchHubMaterialAssets(materialId: string) {
  const { data, error } = await supabase
    .from("hub_material_assets")
    .select("*")
    .eq("material_id", materialId)
    .order("language");
  if (error) throw error;
  return data as HubMaterialAsset[];
}

export async function upsertHubMaterialAsset(asset: Partial<HubMaterialAsset>) {
  const { data, error } = await supabase
    .from("hub_material_assets")
    .upsert(asset, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data as HubMaterialAsset;
}

export async function deleteHubMaterialAsset(id: string) {
  const { error } = await supabase
    .from("hub_material_assets")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function logHubAccess(log: {
  material_id: string;
  material_title?: string;
  user_id: string;
  user_name?: string;
  user_role?: string;
  language: HubLanguage;
  empresa_id?: string;
}) {
  const { error } = await supabase.from("hub_access_logs").insert(log);
  if (error) throw error;
}

export async function fetchHubAccessLogs(
  materialId: string,
  empresaId: string,
) {
  const { data, error } = await supabase
    .from("hub_access_logs")
    .select("*")
    .eq("material_id", materialId)
    .eq("empresa_id", empresaId)
    .order("timestamp", { ascending: false });
  if (error) throw error;
  return data as import("../types").HubAccessLog[];
}
