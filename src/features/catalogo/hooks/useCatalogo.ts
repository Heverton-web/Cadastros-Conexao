import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCatalogoEmpresaId } from "./useCatalogoEmpresa"
import * as hierarquia from "../services/hierarquia.service"
import * as implantes from "../services/implantes.service"
import * as componentes from "../services/componentes.service"
import * as acessorios from "../services/acessorios.service"
import * as workflows from "../services/workflows.service"
import * as kits from "../services/kits.service"
import * as cupons from "../services/cupons.service"
import * as frete from "../services/frete.service"
import * as promocionais from "../services/promocionais.service"

function useEmpresaId(): string {
  return useCatalogoEmpresaId()
}

// --- Hierarquia ---
export function useCategorias() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "categorias", empresaId], queryFn: () => hierarquia.listarCategorias(empresaId), enabled: !!empresaId })
}

export function useConexoes(categoriaId?: string) {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "conexoes", empresaId, categoriaId], queryFn: () => hierarquia.listarConexoes(empresaId, categoriaId), enabled: !!empresaId })
}

export function useFamilias(conexaoId?: string) {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "familias", empresaId, conexaoId], queryFn: () => hierarquia.listarFamilias(empresaId, conexaoId), enabled: !!empresaId })
}

export function useLinhas(familiaId?: string) {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "linhas", empresaId, familiaId], queryFn: () => hierarquia.listarLinhas(empresaId, familiaId), enabled: !!empresaId })
}

// --- Implantes ---
export function useImplantesAtivos() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "implantes", "ativos", empresaId], queryFn: () => implantes.listarImplantesAtivos(empresaId), enabled: !!empresaId })
}

export function useTodosImplantes() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "implantes", "todos", empresaId], queryFn: () => implantes.listarTodosImplantes(empresaId), enabled: !!empresaId })
}

export function useImplanteDetalhe(sku: string) {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "implante", empresaId, sku], queryFn: () => implantes.getImplanteDetalhe(empresaId, sku), enabled: !!empresaId && !!sku })
}

export function useImplantesPorLinha(linhaId: string) {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "implantes-linha", empresaId, linhaId], queryFn: () => implantes.listarImplantesPorLinha(empresaId, linhaId), enabled: !!empresaId && !!linhaId })
}

export function useProtocoloFresagem(implanteSku: string) {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "fresagem", empresaId, implanteSku], queryFn: () => implantes.getProtocoloFresagem(empresaId, implanteSku), enabled: !!empresaId && !!implanteSku })
}

export function useFresas() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "fresas", empresaId], queryFn: () => implantes.listarFresas(empresaId), enabled: !!empresaId })
}

export function useCriarImplante() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof implantes.criarImplante>[1]) => implantes.criarImplante(empresaId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "implantes", empresaId] }),
  })
}

export function useToggleImplanteAtivo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, ativo }: { sku: string; ativo: boolean }) => implantes.toggleImplanteAtivo(empresaId, sku, ativo),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "implantes", empresaId] }),
  })
}

export function useRemoverImplante() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (sku: string) => implantes.removerImplante(empresaId, sku),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "implantes", empresaId] }),
  })
}

// --- Componentes ---
export function useTiposReabilitacao() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "tipos-reabilitacao", empresaId], queryFn: () => componentes.listarTiposReabilitacao(empresaId), enabled: !!empresaId })
}

export function useTiposAbutment() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "tipos-abutment", empresaId], queryFn: () => componentes.listarTiposAbutment(empresaId), enabled: !!empresaId })
}

export function useAbutments(familiaId?: string) {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "abutments", empresaId, familiaId], queryFn: () => componentes.listarAbutments(empresaId, familiaId), enabled: !!empresaId })
}

export function useAbutmentDetalhe(sku: string) {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "abutment", empresaId, sku], queryFn: () => componentes.getAbutmentDetalhe(empresaId, sku), enabled: !!empresaId && !!sku })
}

export function useCriarAbutment() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof componentes.criarAbutment>[1]) => componentes.criarAbutment(empresaId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "abutments", empresaId] }),
  })
}

export function useRemoverAbutment() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (sku: string) => componentes.removerAbutment(empresaId, sku),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "abutments", empresaId] }),
  })
}

// --- Acessórios ---
export function useAcessorios(categoriaId?: string) {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "acessorios", empresaId, categoriaId], queryFn: () => acessorios.listarAcessorios(empresaId, categoriaId), enabled: !!empresaId })
}

export function useChavesFerramental() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "chaves", empresaId], queryFn: () => acessorios.listarChavesFerramental(empresaId), enabled: !!empresaId })
}

export function useFerramentasObrigatorias(acessorioSku: string) {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "ferramentas-obr", empresaId, acessorioSku], queryFn: () => acessorios.getFerramentasObrigatorias(empresaId, acessorioSku), enabled: !!empresaId && !!acessorioSku })
}

export function useCategoriasAcessorio() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "cats-acessorio", empresaId], queryFn: () => acessorios.listarCategoriasAcessorio(empresaId), enabled: !!empresaId })
}

export function useCategoriasInstrumental() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "cats-instrumental", empresaId], queryFn: () => acessorios.listarCategoriasInstrumental(empresaId), enabled: !!empresaId })
}

export function useInstrumentais(categoriaId?: string) {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "instrumentais", empresaId, categoriaId], queryFn: () => acessorios.listarInstrumentais(empresaId, categoriaId), enabled: !!empresaId })
}

// --- Workflows ---
export function useWorkflows() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "workflows", empresaId], queryFn: () => workflows.listarWorkflows(empresaId), enabled: !!empresaId })
}

export function useEtapas() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "etapas", empresaId], queryFn: () => workflows.listarEtapas(empresaId), enabled: !!empresaId })
}

export function useGuias(filters?: { familia_id?: string; workflow_id?: string }) {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "guias", empresaId, filters], queryFn: () => workflows.listarGuias(empresaId, filters), enabled: !!empresaId })
}

export function useWorkflowDetalhe(workflowId: string) {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "workflow-detalhe", empresaId, workflowId], queryFn: () => workflows.getWorkflowDetalhe(empresaId, workflowId), enabled: !!empresaId && !!workflowId })
}

// --- Kits ---
export function useKitsAtivos() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "kits", "ativos", empresaId], queryFn: () => kits.listarKitsAtivos(empresaId), enabled: !!empresaId })
}

export function useTodosKits() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "kits", "todos", empresaId], queryFn: () => kits.listarTodosKits(empresaId), enabled: !!empresaId })
}

export function useKitDetalhe(sku: string) {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "kit", empresaId, sku], queryFn: () => kits.getKitDetalhe(empresaId, sku), enabled: !!empresaId && !!sku })
}

export function useCategoriasKit() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "cats-kit", empresaId], queryFn: () => kits.listarCategoriasKit(empresaId), enabled: !!empresaId })
}

export function useCriarKit() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof kits.criarKit>[1]) => kits.criarKit(empresaId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "kits", empresaId] }),
  })
}

export function useToggleKitAtivo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, ativo }: { sku: string; ativo: boolean }) => kits.toggleKitAtivo(empresaId, sku, ativo),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "kits", empresaId] }),
  })
}

export function useRemoverKit() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (sku: string) => kits.removerKit(empresaId, sku),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "kits", empresaId] }),
  })
}

// --- Cupons ---
export function useCupons() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "cupons", empresaId], queryFn: () => cupons.listarCupons(empresaId), enabled: !!empresaId })
}

export function useCriarCupom() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof cupons.criarCupom>[1]) => cupons.criarCupom(empresaId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "cupons", empresaId] }),
  })
}

export function useRemoverCupom() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cupons.removerCupom(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "cupons", empresaId] }),
  })
}

// --- Frete ---
export function useFretes() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "fretes", empresaId], queryFn: () => frete.listarFretes(empresaId), enabled: !!empresaId })
}

export function useCriarFrete() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof frete.criarFrete>[1]) => frete.criarFrete(empresaId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "fretes", empresaId] }),
  })
}

export function useRemoverFrete() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => frete.removerFrete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "fretes", empresaId] }),
  })
}

// --- Promocionais ---
export function usePromocionais() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "promocionais", empresaId], queryFn: () => promocionais.listarPromocionais(empresaId), enabled: !!empresaId })
}

export function usePromocionaisAtivos() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "promocionais-ativos", empresaId], queryFn: () => promocionais.listarPromocionaisAtivos(empresaId), enabled: !!empresaId })
}

export function usePromocionalDetalhe(id: string) {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "promocional", empresaId, id], queryFn: () => promocionais.getPromocionalDetalhe(empresaId, id), enabled: !!empresaId && !!id })
}

export function useCriarPromocional() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof promocionais.criarPromocional>[1]) => promocionais.criarPromocional(empresaId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "promocionais", empresaId] }),
  })
}

export function useRemoverPromocional() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => promocionais.removerPromocional(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "promocionais", empresaId] }),
  })
}
