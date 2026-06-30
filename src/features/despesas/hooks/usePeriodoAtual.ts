import { useQuery } from "@tanstack/react-query";
import { supabase } from "~/core/supabase";
import { useAuth } from "~/lib/auth";
import type { DespesaPeriodo } from "../types";

export function usePeriodoAtual(overrideEmpresaId?: string) {
  const { profile } = useAuth();
  const empresa_id = overrideEmpresaId || (profile?.empresa_id ?? "");

  return useQuery({
    queryKey: ["despesa-periodo-atual", empresa_id],
    queryFn: async () => {
      const hoje = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("despesas_periodos")
        .select("*")
        .eq("empresa_id", empresa_id)
        .eq("status", "aberto")
        .lte("data_inicio", hoje)
        .gte("data_fim", hoje)
        .maybeSingle();
      if (error) throw error;
      return data as DespesaPeriodo | null;
    },
    enabled: !!empresa_id,
  });
}
