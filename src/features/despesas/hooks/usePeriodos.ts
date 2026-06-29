import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import { listarPeriodos, listarPeriodosAbertos, criarPeriodo, atualizarPeriodo, fecharPeriodo, gerarPeriodos } from "../services/periodos.service";
import type { DespesaPeriodo } from "../types";

export function usePeriodos() {
  const { profile } = useAuth();
  const empresa_id = profile?.empresa_id ?? "";

  return useQuery({
    queryKey: ["despesas-periodos", empresa_id],
    queryFn: () => listarPeriodos(empresa_id),
    enabled: !!empresa_id,
  });
}

export function usePeriodosAbertos() {
  const { profile } = useAuth();
  const empresa_id = profile?.empresa_id ?? "";

  return useQuery({
    queryKey: ["despesas-periodos-abertos", empresa_id],
    queryFn: () => listarPeriodosAbertos(empresa_id),
    enabled: !!empresa_id,
  });
}

export function useCriarPeriodo() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const empresa_id = profile?.empresa_id ?? "";

  return useMutation({
    mutationFn: (periodo: Partial<DespesaPeriodo>) => criarPeriodo({ ...periodo, empresa_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["despesas-periodos", empresa_id] });
      queryClient.invalidateQueries({ queryKey: ["despesas-periodos-abertos", empresa_id] });
    },
  });
}

export function useAtualizarPeriodo() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const empresa_id = profile?.empresa_id ?? "";

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<DespesaPeriodo> }) => atualizarPeriodo(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["despesas-periodos", empresa_id] });
      queryClient.invalidateQueries({ queryKey: ["despesas-periodos-abertos", empresa_id] });
    },
  });
}

export function useFecharPeriodo() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const empresa_id = profile?.empresa_id ?? "";

  return useMutation({
    mutationFn: (id: string) => fecharPeriodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["despesas-periodos", empresa_id] });
      queryClient.invalidateQueries({ queryKey: ["despesas-periodos-abertos", empresa_id] });
    },
  });
}

export function useGerarPeriodos() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const empresa_id = profile?.empresa_id ?? "";

  return useMutation({
    mutationFn: () => gerarPeriodos(empresa_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["despesas-periodos", empresa_id] });
      queryClient.invalidateQueries({ queryKey: ["despesas-periodos-abertos", empresa_id] });
    },
  });
}
