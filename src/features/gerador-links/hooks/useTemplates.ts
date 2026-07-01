import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import {
  listarTemplates,
  criarTemplate,
  atualizarTemplate,
  deletarTemplate,
} from "../services/templates.service";
import type { TipoTemplate } from "../types";

export function useTemplates() {
  const { profile } = useAuth();
  const empresaId = profile?.empresa_id;

  return useQuery({
    queryKey: ["gerador-templates", empresaId],
    queryFn: () => listarTemplates(empresaId!),
    enabled: !!empresaId,
    staleTime: 30_000,
  });
}

export function useCriarTemplate() {
  const qc = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: (input: {
      tipo: TipoTemplate;
      nome: string;
      conteudo: Record<string, string>;
    }) =>
      criarTemplate({
        empresa_id: profile!.empresa_id!,
        ...input,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gerador-templates"] }),
  });
}

export function useAtualizarTemplate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...input }: { id: string; nome?: string; conteudo?: Record<string, string> }) =>
      atualizarTemplate(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gerador-templates"] }),
  });
}

export function useDeletarTemplate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletarTemplate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gerador-templates"] }),
  });
}
