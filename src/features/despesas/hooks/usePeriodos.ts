import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import {
  listarPeriodos,
  listarPeriodosAbertos,
  criarPeriodo,
  atualizarPeriodo,
  fecharPeriodo,
  reabrirPeriodo,
  excluirPeriodo,
  gerarPeriodos,
} from "../services/periodos.service";
import type { DespesaPeriodo, Frequencia } from "../types";

export function usePeriodos(overrideEmpresaId?: string) {
  const { profile } = useAuth();
  const empresa_id = overrideEmpresaId || profile?.empresa_id || "";

  return useQuery({
    queryKey: ["despesas-periodos", empresa_id],
    queryFn: () => listarPeriodos(empresa_id),
    enabled: !!empresa_id,
  });
}

export function usePeriodosAbertos(overrideEmpresaId?: string) {
  const { profile } = useAuth();
  const empresa_id = overrideEmpresaId || profile?.empresa_id || "";

  return useQuery({
    queryKey: ["despesas-periodos-abertos", empresa_id],
    queryFn: () => listarPeriodosAbertos(empresa_id),
    enabled: !!empresa_id,
  });
}

export function useCriarPeriodo(overrideEmpresaId?: string) {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const empresa_id = overrideEmpresaId || profile?.empresa_id || "";

  return useMutation({
    mutationFn: (periodo: Partial<DespesaPeriodo>) =>
      criarPeriodo({ ...periodo, empresa_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["despesas-periodos", empresa_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["despesas-periodos-abertos", empresa_id],
      });
    },
  });
}

export function useAtualizarPeriodo(overrideEmpresaId?: string) {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const empresa_id = overrideEmpresaId || profile?.empresa_id || "";

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<DespesaPeriodo>;
    }) => atualizarPeriodo(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["despesas-periodos", empresa_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["despesas-periodos-abertos", empresa_id],
      });
    },
  });
}

export function useFecharPeriodo(overrideEmpresaId?: string) {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const empresa_id = overrideEmpresaId || profile?.empresa_id || "";

  return useMutation({
    mutationFn: (id: string) => fecharPeriodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["despesas-periodos", empresa_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["despesas-periodos-abertos", empresa_id],
      });
    },
  });
}

export function useReabrirPeriodo(overrideEmpresaId?: string) {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const empresa_id = overrideEmpresaId || profile?.empresa_id || "";

  return useMutation({
    mutationFn: (id: string) => reabrirPeriodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["despesas-periodos", empresa_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["despesas-periodos-abertos", empresa_id],
      });
    },
  });
}

export function useExcluirPeriodo(overrideEmpresaId?: string) {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const empresa_id = overrideEmpresaId || profile?.empresa_id || "";

  return useMutation({
    mutationFn: (id: string) => excluirPeriodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["despesas-periodos", empresa_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["despesas-periodos-abertos", empresa_id],
      });
    },
  });
}

export function useGerarPeriodos(overrideEmpresaId?: string) {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const empresa_id = overrideEmpresaId || profile?.empresa_id || "";

  return useMutation({
    mutationFn: ({
      frequencia,
      meses,
    }: {
      frequencia: Frequencia;
      meses: string[];
    }) => gerarPeriodos(empresa_id, frequencia, meses),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["despesas-periodos", empresa_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["despesas-periodos-abertos", empresa_id],
      });
    },
  });
}
