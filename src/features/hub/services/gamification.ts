import { supabase } from "~/core/supabase/client";
import type { HubGamificationLevel, HubBadge, HubUserBadge } from "../types";

export async function fetchHubLevels(empresaId: string) {
  const { data, error } = await supabase
    .from("hub_gamification_levels")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("order_index");
  if (error) throw error;
  return data as HubGamificationLevel[];
}

export async function upsertHubLevel(level: Partial<HubGamificationLevel>) {
  const { data, error } = await supabase
    .from("hub_gamification_levels")
    .upsert(level, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data as HubGamificationLevel;
}

export async function fetchHubBadges(empresaId: string) {
  const { data, error } = await supabase
    .from("hub_badges")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as HubBadge[];
}

export async function createHubBadge(badge: Partial<HubBadge>) {
  const { data, error } = await supabase
    .from("hub_badges")
    .insert(badge)
    .select()
    .single();
  if (error) throw error;
  return data as HubBadge;
}

export async function updateHubBadge(id: string, updates: Partial<HubBadge>) {
  const { data, error } = await supabase
    .from("hub_badges")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as HubBadge;
}

export async function deleteHubBadge(id: string) {
  const { error } = await supabase.from("hub_badges").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchHubUserBadges(userId: string, empresaId: string) {
  const { data, error } = await supabase
    .from("hub_user_badges")
    .select("*, hub_badges(*)")
    .eq("user_id", userId)
    .eq("empresa_id", empresaId);
  if (error) throw error;
  return data as (HubUserBadge & { hub_badges: HubBadge })[];
}

export async function awardHubBadge(
  userId: string,
  badgeId: string,
  empresaId: string,
) {
  const { data, error } = await supabase
    .from("hub_user_badges")
    .insert({ user_id: userId, badge_id: badgeId, empresa_id: empresaId })
    .select()
    .single();
  if (error) throw error;
  return data as HubUserBadge;
}

export async function fetchHubRanking(empresaId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, nome, hub_points, hub_status, avatar_url")
    .eq("empresa_id", empresaId)
    .gt("hub_points", 0)
    .order("hub_points", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data;
}

export async function addHubPoints(userId: string, points: number) {
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("hub_points")
    .eq("id", userId)
    .single();
  if (fetchError) throw fetchError;

  const newPoints = (profile.hub_points || 0) + points;
  const { data, error } = await supabase
    .from("profiles")
    .update({ hub_points: newPoints })
    .eq("id", userId)
    .select("hub_points")
    .single();
  if (error) throw error;
  return data.hub_points;
}
