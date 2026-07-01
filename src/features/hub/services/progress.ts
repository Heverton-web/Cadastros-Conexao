import { supabase } from "~/core/supabase/client";
import type { HubUserProgress, HubCollectionProgress } from "../types";

export async function fetchHubUserProgress(userId: string, empresaId: string) {
  const { data, error } = await supabase
    .from("hub_user_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("empresa_id", empresaId);
  if (error) throw error;
  return data as HubUserProgress[];
}

export async function upsertHubUserProgress(
  progress: Partial<HubUserProgress>,
) {
  const { data, error } = await supabase
    .from("hub_user_progress")
    .upsert(progress, { onConflict: "user_id,material_id" })
    .select()
    .single();
  if (error) throw error;
  return data as HubUserProgress;
}

export async function completeHubMaterial(
  userId: string,
  materialId: string,
  empresaId: string,
) {
  const { data, error } = await supabase
    .from("hub_user_progress")
    .upsert(
      {
        user_id: userId,
        material_id: materialId,
        empresa_id: empresaId,
        status: "completed",
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,material_id" },
    )
    .select()
    .single();
  if (error) throw error;
  return data as HubUserProgress;
}

export async function fetchHubCollectionProgress(
  userId: string,
  empresaId: string,
) {
  const { data, error } = await supabase
    .from("hub_collection_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("empresa_id", empresaId);
  if (error) throw error;
  return data as HubCollectionProgress[];
}

export async function upsertHubCollectionProgress(
  progress: Partial<HubCollectionProgress>,
) {
  const { data, error } = await supabase
    .from("hub_collection_progress")
    .upsert(progress, { onConflict: "user_id,collection_id" })
    .select()
    .single();
  if (error) throw error;
  return data as HubCollectionProgress;
}

export async function completeHubCollection(
  userId: string,
  collectionId: string,
  empresaId: string,
) {
  const { data, error } = await supabase
    .from("hub_collection_progress")
    .upsert(
      {
        user_id: userId,
        collection_id: collectionId,
        empresa_id: empresaId,
        status: "completed",
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,collection_id" },
    )
    .select()
    .single();
  if (error) throw error;
  return data as HubCollectionProgress;
}
