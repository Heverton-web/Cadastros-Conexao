import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "~/core/supabase";
import { useAuth } from "~/lib/auth";
import type { DespesaConfig } from "../types";

export function useDespesasConfig(overrideEmpresaId?: string) {
  const { profile } = useAuth();
  const empresa_id = overrideEmpresaId || (profile?.empresa_id ?? "");

  return useQuery({
    queryKey: ["despesa-config", empresa_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("despesas_config")
        .select("*")
        .eq("empresa_id", empresa_id)
        .maybeSingle();
      if (error) throw error;
      return data as DespesaConfig | null;
    },
    enabled: !!empresa_id,
  });
}

export function useSalvarConfig() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const empresa_id = profile?.empresa_id ?? "";

  return useMutation({
    mutationFn: async (config: { frequencia: string; dia_envio: number; dias_aviso: number }) => {
      const existente = await supabase
        .from("despesas_config")
        .select("id")
        .eq("empresa_id", empresa_id)
        .maybeSingle();

      if (existente.data) {
        const { data, error } = await supabase
          .from("despesas_config")
          .update(config)
          .eq("empresa_id", empresa_id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }

      const { data, error } = await supabase
        .from("despesas_config")
        .insert({ empresa_id, ...config })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["despesa-config", empresa_id] });
    },
  });
}
