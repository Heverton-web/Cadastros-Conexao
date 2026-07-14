import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import { buscarConfig, criarOuAtualizarConfig } from "../services/config.service";

export function useDespesasConfig(overrideEmpresaId?: string) {
  const { profile } = useAuth();
  const empresa_id = overrideEmpresaId || (profile?.empresa_id ?? "");

  return useQuery({
    queryKey: ["despesa-config", empresa_id],
    queryFn: () => buscarConfig(empresa_id),
    enabled: !!empresa_id,
  });
}

export function useSalvarConfig() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const empresa_id = profile?.empresa_id ?? "";

  return useMutation({
    mutationFn: async (config: {
      frequencia: string;
      dia_envio: number;
      dias_aviso: number;
    }) => criarOuAtualizarConfig(empresa_id, config),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["despesa-config", empresa_id],
      });
    },
  });
}
