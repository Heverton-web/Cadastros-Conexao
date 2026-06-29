import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import {
  listarEmpresaConfig,
  salvarEmpresaConfig,
  verificarSlugDisponivel,
  listarSecoes,
  criarSecao,
  atualizarSecao,
  deletarSecao,
  listarLinks,
  criarLink,
  atualizarLink,
  deletarLink,
  reordenarLinks,
  reordenarSecoes,
  listarAnalytics,
} from "../services/empresa";
import type { EmpresaLinkInput, EmpresaSectionInput, AnalyticsPeriodo } from "../types-empresa";

export function useEmpresaConfig() {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ["empresa-linktree-config", profile?.empresa_id],
    queryFn: () => listarEmpresaConfig(profile!.empresa_id!),
    enabled: !!profile?.empresa_id,
    staleTime: 30_000,
  });
}

export function useSalvarEmpresaConfig() {
  const { profile } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (config: Parameters<typeof salvarEmpresaConfig>[1]) =>
      salvarEmpresaConfig(profile!.empresa_id!, config),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["empresa-linktree-config"] }),
  });
}

export function useSlugDisponivel(slug: string, empresaId?: string) {
  return useQuery({
    queryKey: ["slug-disponivel", slug],
    queryFn: () => verificarSlugDisponivel(slug, empresaId),
    enabled: slug.length >= 3,
    staleTime: 5_000,
  });
}

export function useSecoes() {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ["empresa-linktree-secoes", profile?.empresa_id],
    queryFn: () => listarSecoes(profile!.empresa_id!),
    enabled: !!profile?.empresa_id,
  });
}

export function useCriarSecao() {
  const { profile } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: EmpresaSectionInput) => criarSecao(profile!.empresa_id!, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["empresa-linktree-secoes"] }),
  });
}

export function useAtualizarSecao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<EmpresaSectionInput> }) => atualizarSecao(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["empresa-linktree-secoes"] }),
  });
}

export function useDeletarSecao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletarSecao(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["empresa-linktree-secoes"] }),
  });
}

export function useLinks() {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ["empresa-linktree-links", profile?.empresa_id],
    queryFn: () => listarLinks(profile!.empresa_id!),
    enabled: !!profile?.empresa_id,
  });
}

export function useCriarLink() {
  const { profile } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sectionId, input }: { sectionId: string; input: EmpresaLinkInput }) =>
      criarLink(profile!.empresa_id!, sectionId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["empresa-linktree-links"] }),
  });
}

export function useAtualizarLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<EmpresaLinkInput> }) => atualizarLink(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["empresa-linktree-links"] }),
  });
}

export function useDeletarLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletarLink(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["empresa-linktree-links"] }),
  });
}

export function useReordenarLinks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ordens: { id: string; ordem: number }[]) => reordenarLinks(ordens),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["empresa-linktree-links"] }),
  });
}

export function useReordenarSecoes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ordens: { id: string; ordem: number }[]) => reordenarSecoes(ordens),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["empresa-linktree-secoes"] }),
  });
}

export function useAnalytics(periodo: AnalyticsPeriodo) {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ["empresa-linktree-analytics", profile?.empresa_id, periodo],
    queryFn: () => listarAnalytics(profile!.empresa_id!, periodo),
    enabled: !!profile?.empresa_id,
    staleTime: 60_000,
  });
}
