import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import {
  listarTemplates,
  criarTemplate,
  atualizarTemplate,
  deletarTemplate,
  aplicarTemplate,
} from "../services/templates";
import type { TemplateInput } from "../types";

export function useTemplates() {
  const { profile } = useAuth();
  const empresa_id = profile?.empresa_id;
  return useQuery({
    queryKey: ["funis-templates", empresa_id],
    queryFn: () => listarTemplates(empresa_id ?? undefined),
  });
}

export function useCriarTemplate() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const empresa_id = profile?.empresa_id;
  return useMutation({
    mutationFn: (input: TemplateInput) => criarTemplate(input, empresa_id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["funis-templates"] }),
  });
}

export function useAtualizarTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<TemplateInput>;
    }) => atualizarTemplate(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["funis-templates"] }),
  });
}

export function useDeletarTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletarTemplate(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["funis-templates"] }),
  });
}

export function useAplicarTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      templateId,
      funilId,
    }: {
      templateId: string;
      funilId: string;
    }) => aplicarTemplate(templateId, funilId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["funis"] }),
  });
}
