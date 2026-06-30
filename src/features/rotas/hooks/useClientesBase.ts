import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEmpresa } from "~/core/empresa/useEmpresa";
import { useAuth } from "~/core/auth";
import {
  listarClientesBase,
  criarClienteBase,
  criarClientesBaseEmLote,
  atualizarClienteBase,
  excluirClienteBase,
  contarClientesBase,
} from "../services/clientes-base.service";
import type { ClienteBaseFilters } from "../types";

export function useClientesBase(filters?: ClienteBaseFilters) {
  const { empresa } = useEmpresa();
  const { user } = useAuth();

  return useQuery({
    queryKey: ["clientes-base", empresa?.id, user?.id, filters],
    queryFn: () => listarClientesBase(empresa!.id, user!.id, filters),
    enabled: !!empresa?.id && !!user?.id,
  });
}

export function useContarClientesBase() {
  const { empresa } = useEmpresa();
  const { user } = useAuth();

  return useQuery({
    queryKey: ["clientes-base-count", empresa?.id, user?.id],
    queryFn: () => contarClientesBase(empresa!.id, user!.id),
    enabled: !!empresa?.id && !!user?.id,
  });
}

export function useCriarClienteBase() {
  const qc = useQueryClient();
  const { empresa } = useEmpresa();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (cliente: Parameters<typeof criarClienteBase>[0]) =>
      criarClienteBase({ ...cliente, empresa_id: empresa!.id, usuario_id: user!.id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clientes-base"] });
      qc.invalidateQueries({ queryKey: ["clientes-base-count"] });
    },
  });
}

export function useCriarClientesBaseEmLote() {
  const qc = useQueryClient();
  const { empresa } = useEmpresa();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (clientes: Parameters<typeof criarClientesBaseEmLote>[0]) =>
      criarClientesBaseEmLote(
        clientes.map((c) => ({ ...c, empresa_id: empresa!.id, usuario_id: user!.id }))
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clientes-base"] });
      qc.invalidateQueries({ queryKey: ["clientes-base-count"] });
    },
  });
}

export function useAtualizarClienteBase() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof atualizarClienteBase>[1] }) =>
      atualizarClienteBase(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clientes-base"] });
    },
  });
}

export function useExcluirClienteBase() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: excluirClienteBase,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clientes-base"] });
      qc.invalidateQueries({ queryKey: ["clientes-base-count"] });
    },
  });
}
