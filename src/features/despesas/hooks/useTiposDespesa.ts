import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import { listarTiposDespesa, listarTiposDespesaAtivos, criarTipoDespesa, atualizarTipoDespesa, excluirTipoDespesa } from "../services/tipos.service";
import type { DespesaTipo } from "../types";

export function useTiposDespesa() {
  const { profile } = useAuth();
  const empresa_id = profile?.empresa_id ?? "";

  return useQuery({
    queryKey: ["despesas-tipos", empresa_id],
    queryFn: () => listarTiposDespesa(empresa_id),
    enabled: !!empresa_id,
  });
}

export function useTiposDespesaAtivos() {
  const { profile } = useAuth();
  const empresa_id = profile?.empresa_id ?? "";

  return useQuery({
    queryKey: ["despesas-tipos-ativos", empresa_id],
    queryFn: () => listarTiposDespesaAtivos(empresa_id),
    enabled: !!empresa_id,
  });
}

export function useCriarTipoDespesa() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const empresa_id = profile?.empresa_id ?? "";

  return useMutation({
    mutationFn: (tipo: Partial<DespesaTipo>) => criarTipoDespesa({ ...tipo, empresa_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["despesas-tipos", empresa_id] });
      queryClient.invalidateQueries({ queryKey: ["despesas-tipos-ativos", empresa_id] });
    },
  });
}

export function useAtualizarTipoDespesa() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const empresa_id = profile?.empresa_id ?? "";

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<DespesaTipo> }) => atualizarTipoDespesa(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["despesas-tipos", empresa_id] });
      queryClient.invalidateQueries({ queryKey: ["despesas-tipos-ativos", empresa_id] });
    },
  });
}

export function useExcluirTipoDespesa() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const empresa_id = profile?.empresa_id ?? "";

  return useMutation({
    mutationFn: (id: string) => excluirTipoDespesa(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["despesas-tipos", empresa_id] });
      queryClient.invalidateQueries({ queryKey: ["despesas-tipos-ativos", empresa_id] });
    },
  });
}
