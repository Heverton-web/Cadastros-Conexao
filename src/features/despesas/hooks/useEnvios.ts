import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import {
  listarEnviosEmpresa,
  listarEnviosPendentes,
  listarMeusEnvios,
  buscarEnvio,
  criarOuAtualizarEnvio,
  aprovarEnvio,
  reprovarEnvio,
  aprovarEnvioParcial,
} from "../services/envios.service";
import type { EnvioFiltros } from "../types";

export function useEnviosEmpresa(
  filtros?: EnvioFiltros,
  overrideEmpresaId?: string,
) {
  const { profile } = useAuth();
  const empresa_id = overrideEmpresaId || (profile?.empresa_id ?? "");

  return useQuery({
    queryKey: ["despesas-envios", empresa_id, filtros],
    queryFn: () => listarEnviosEmpresa(empresa_id, filtros),
    enabled: !!empresa_id,
  });
}

export function useEnviosPendentes(overrideEmpresaId?: string) {
  const { profile } = useAuth();
  const empresa_id = overrideEmpresaId || (profile?.empresa_id ?? "");

  return useQuery({
    queryKey: ["despesas-envios-pendentes", empresa_id],
    queryFn: () => listarEnviosPendentes(empresa_id),
    enabled: !!empresa_id,
  });
}

export function useMeusEnvios(overrideEmpresaId?: string) {
  const { profile } = useAuth();
  const empresa_id = overrideEmpresaId || (profile?.empresa_id ?? "");
  const usuario_id = profile?.id ?? "";

  return useQuery({
    queryKey: ["despesas-meus-envios", empresa_id, usuario_id],
    queryFn: () => listarMeusEnvios(empresa_id, usuario_id),
    enabled: !!empresa_id && !!usuario_id,
  });
}

export function useEnvio(id: string) {
  return useQuery({
    queryKey: ["despesas-envio", id],
    queryFn: () => buscarEnvio(id),
    enabled: !!id,
  });
}

export function useCriarOuAtualizarEnvio() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const empresa_id = profile?.empresa_id ?? "";
  const usuario_id = profile?.id ?? "";

  return useMutation({
    mutationFn: (periodo_id: string) =>
      criarOuAtualizarEnvio(empresa_id, usuario_id, periodo_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["despesas-envios", empresa_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["despesas-meus-envios", empresa_id],
      });
    },
  });
}

export function useAprovarEnvio() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const empresa_id = profile?.empresa_id ?? "";
  const aprovador_id = profile?.id ?? "";

  return useMutation({
    mutationFn: (id: string) => aprovarEnvio(id, aprovador_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["despesas-envios", empresa_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["despesas-envios-pendentes", empresa_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["despesas-empresa", empresa_id],
      });
    },
  });
}

export function useReprovarEnvio() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const empresa_id = profile?.empresa_id ?? "";
  const aprovador_id = profile?.id ?? "";

  return useMutation({
    mutationFn: ({ id, comentario }: { id: string; comentario: string }) =>
      reprovarEnvio(id, aprovador_id, comentario),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["despesas-envios", empresa_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["despesas-envios-pendentes", empresa_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["despesas-empresa", empresa_id],
      });
    },
  });
}

export function useAprovarEnvioParcial() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const empresa_id = profile?.empresa_id ?? "";
  const aprovador_id = profile?.id ?? "";

  return useMutation({
    mutationFn: ({
      id,
      aprovadas,
      reprovadas,
      comentario,
    }: {
      id: string;
      aprovadas: string[];
      reprovadas: string[];
      comentario: string;
    }) =>
      aprovarEnvioParcial(id, aprovador_id, aprovadas, reprovadas, comentario),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["despesas-envios", empresa_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["despesas-envios-pendentes", empresa_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["despesas-empresa", empresa_id],
      });
    },
  });
}
