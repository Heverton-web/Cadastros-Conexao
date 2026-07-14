import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import {
  listarManutencoes,
  listarManutencoesAtivas,
  salvarManutencao,
  desativarManutencao,
} from "./services/manutencao.service";
import type { ManutencaoInput } from "./types";

export function useManutencoes(empresaId?: string | null) {
  return useQuery({
    queryKey: ["manutencoes", empresaId ?? "global"],
    queryFn: () => listarManutencoes(empresaId),
    enabled: empresaId !== undefined,
  });
}

export function useManutencoesAtivas(empresaId?: string | null) {
  return useQuery({
    queryKey: ["manutencoes-ativas", empresaId ?? "global"],
    queryFn: () => listarManutencoesAtivas(empresaId),
    enabled: empresaId !== undefined,
  });
}

export function useSalvarManutencao(empresaId?: string | null) {
  const queryClient = useQueryClient();
  const key = empresaId ?? "global";

  return useMutation({
    mutationFn: (input: ManutencaoInput) =>
      salvarManutencao(empresaId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manutencoes", key] });
      queryClient.invalidateQueries({ queryKey: ["manutencoes-ativas", key] });
    },
  });
}

export function useDesativarManutencao(empresaId?: string | null) {
  const queryClient = useQueryClient();
  const key = empresaId ?? "global";

  return useMutation({
    mutationFn: (id: string) => desativarManutencao(id, empresaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manutencoes", key] });
      queryClient.invalidateQueries({ queryKey: ["manutencoes-ativas", key] });
    },
  });
}
