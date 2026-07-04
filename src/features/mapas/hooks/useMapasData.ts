import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "~/core/supabase";
import { useAuth } from "~/lib/auth";
import { dispararWebhooks } from "~/core/services/webhooks";
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
  const { profile } = useAuth();
  return useMutation({
    mutationFn: async (payload: Partial<MapasDistributor>) => {
      if (payload.id) {
        const { data } = await supabase
          .from("mapas_distributors")
          .update(payload)
          .eq("id", payload.id)
          .select()
          .single();
        dispararWebhooks("mapas.distribuidor.atualizado", { distribuidor_id: data.id, nome: data.name, empresa_id: data.empresa_id }, data.empresa_id);
        return data as MapasDistributor;
      }
      const { data } = await supabase
        .from("mapas_distributors")
        .insert(payload)
        .select()
        .single();
      dispararWebhooks("mapas.distribuidor.criado", { distribuidor_id: data.id, nome: data.name, empresa_id: data.empresa_id }, data.empresa_id);
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
      // Buscar dados antes de deletar para ter info no evento
      const { data: dist } = await supabase
        .from("mapas_distributors")
        .select("name, empresa_id")
        .eq("id", id)
        .single();
      await supabase.from("mapas_distributors").delete().eq("id", id);
      if (dist) {
        dispararWebhooks("mapas.distribuidor.excluido", { distribuidor_id: id, nome: dist.name, empresa_id: dist.empresa_id }, dist.empresa_id);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mapas", "distributors"] });
    },
  });
}

export function useUpsertConsultant(onSuccess?: () => void) {
  const qc = useQueryClient();
  const { profile } = useAuth();
  return useMutation({
    mutationFn: async (payload: Partial<MapasConsultant>) => {
      if (payload.id) {
        const { data } = await supabase
          .from("mapas_consultants")
          .update(payload)
          .eq("id", payload.id)
          .select()
          .single();
        dispararWebhooks("mapas.consultor.atualizado", { consultor_id: data.id, nome: data.name, empresa_id: data.empresa_id }, data.empresa_id);
        return data as MapasConsultant;
      }
      const { data } = await supabase
        .from("mapas_consultants")
        .insert(payload)
        .select()
        .single();
      dispararWebhooks("mapas.consultor.criado", { consultor_id: data.id, nome: data.name, empresa_id: data.empresa_id }, data.empresa_id);
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
      const { data: cons } = await supabase
        .from("mapas_consultants")
        .select("name, empresa_id")
        .eq("id", id)
        .single();
      await supabase.from("mapas_consultants").delete().eq("id", id);
      if (cons) {
        dispararWebhooks("mapas.consultor.excluido", { consultor_id: id, nome: cons.name, empresa_id: cons.empresa_id }, cons.empresa_id);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mapas", "consultants"] });
    },
  });
}
