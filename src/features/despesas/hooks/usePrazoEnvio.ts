import { useQuery } from "@tanstack/react-query";
import { supabase } from "~/core/supabase";
import { useAuth } from "~/lib/auth";
import type { DespesaPeriodo } from "../types";

interface PrazoEnvio {
  dentroDoPrazo: boolean;
  prazoExpirado: boolean;
  deadline: Date | null;
  diasRestantes: number;
  isLoading: boolean;
}

export function usePrazoEnvio(periodo_id?: string, overrideEmpresaId?: string): PrazoEnvio {
  const { profile } = useAuth();
  const empresa_id = overrideEmpresaId || (profile?.empresa_id ?? "");

  const { data: periodo } = useQuery({
    queryKey: ["despesa-periodo", periodo_id],
    queryFn: async () => {
      if (!periodo_id) return null;
      const { data, error } = await supabase
        .from("despesas_periodos")
        .select("*")
        .eq("id", periodo_id)
        .single();
      if (error) throw error;
      return data as DespesaPeriodo;
    },
    enabled: !!periodo_id,
  });

  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ["despesa-config", empresa_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("despesas_config")
        .select("*")
        .eq("empresa_id", empresa_id)
        .maybeSingle();
      if (error) throw error;
      return data as { dia_envio: number } | null;
    },
    enabled: !!empresa_id,
  });

  if (!periodo_id || !periodo || !config) {
    return { dentroDoPrazo: true, prazoExpirado: false, deadline: null, diasRestantes: 0, isLoading: configLoading };
  }

  const dataFim = new Date(periodo.data_fim + "T23:59:59");
  const deadline = new Date(dataFim);
  deadline.setDate(deadline.getDate() + config.dia_envio);

  const hoje = new Date();
  const diff = deadline.getTime() - hoje.getTime();
  const diasRestantes = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return {
    dentroDoPrazo: diff > 0,
    prazoExpirado: diff <= 0,
    deadline,
    diasRestantes: Math.max(0, diasRestantes),
    isLoading: configLoading,
  };
}
