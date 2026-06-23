import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "~/core/supabase";
import { useAuth } from "~/lib/auth";
import type { MapasDistributor, MapasConsultant } from "../types";

export function useMapasDistributors() {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ["mapas", "distributors", profile?.empresa_id],
    queryFn: async () => {
      const { data } = await supabase
        .from("mapas_distributors")
        .select("*")
        .order("name");
      return (data ?? []) as MapasDistributor[];
    },
    staleTime: 60_000,
  });
}

export function useMapasConsultants() {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ["mapas", "consultants", profile?.empresa_id],
    queryFn: async () => {
      const { data } = await supabase
        .from("mapas_consultants")
        .select("*")
        .order("name");
      return (data ?? []) as MapasConsultant[];
    },
    staleTime: 60_000,
  });
}

export function useUpsertDistributor(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<MapasDistributor>) => {
      if (payload.id) {
        const { data } = await supabase
          .from("mapas_distributors")
          .update(payload)
          .eq("id", payload.id)
          .select()
          .single();
        return data as MapasDistributor;
      }
      const { data } = await supabase
        .from("mapas_distributors")
        .insert(payload)
        .select()
        .single();
      return data as MapasDistributor;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mapas", "distributors"] });
      onSuccess?.();
    },
  });
}

export function useDeleteDistributor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("mapas_distributors").delete().eq("id", id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mapas", "distributors"] });
    },
  });
}

export function useUpsertConsultant(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<MapasConsultant>) => {
      if (payload.id) {
        const { data } = await supabase
          .from("mapas_consultants")
          .update(payload)
          .eq("id", payload.id)
          .select()
          .single();
        return data as MapasConsultant;
      }
      const { data } = await supabase
        .from("mapas_consultants")
        .insert(payload)
        .select()
        .single();
      return data as MapasConsultant;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mapas", "consultants"] });
      onSuccess?.();
    },
  });
}

export function useDeleteConsultant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("mapas_consultants").delete().eq("id", id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mapas", "consultants"] });
    },
  });
}
