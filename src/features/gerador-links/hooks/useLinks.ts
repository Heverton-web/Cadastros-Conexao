import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import { listarLinks, criarLink, atualizarLink, deletarLink } from "../services/links.service";
import type { TipoLink } from "../types";

export function useLinks(empresaIdOverride?: string) {
  const { profile } = useAuth();
  const empresaId = empresaIdOverride ?? profile?.empresa_id;

  return useQuery({
    queryKey: ["gerador-links", empresaId],
    queryFn: () => listarLinks(empresaId!),
    enabled: !!empresaId,
    staleTime: 30_000,
  });
}

export function useCriarLink() {
  const qc = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: (input: {
      tipo: TipoLink;
      titulo: string;
      url_gerada: string;
      params: Record<string, string>;
      empresa_id?: string;
    }) =>
      criarLink({
        empresa_id: input.empresa_id ?? profile!.empresa_id!,
        ...input,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gerador-links"] }),
  });
}

export function useEditarLink() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...input }: { id: string; titulo?: string; url_gerada?: string; params?: Record<string, string> }) =>
      atualizarLink(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gerador-links"] }),
  });
}

export function useDeletarLink() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletarLink(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gerador-links"] }),
  });
}
