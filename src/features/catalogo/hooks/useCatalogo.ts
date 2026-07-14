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
import * as clientesService from "../services/clientes.service"
import * as gruposService from "../services/grupos.service"
import * as pedidosService from "../services/pedidos.service"
import * as orcamentosService from "../services/orcamentos.service"
import toast from "react-hot-toast"
import type { CatalogoImplante, CatalogoKit, CatalogoAbutment, CatalogoCategoria, CatalogoConexao, CatalogoLinha, CatalogoFamilia, CatalogoFresa, CatalogoTipoReabilitacao, CatalogoTipoAbutment, CatalogoCategoriaAcessorio, CatalogoAcessorio, CatalogoChaveFerramental, CatalogoCategoriaInstrumental, CatalogoCategoriaKit, CatalogoWorkflow, CatalogoEtapaWorkflow } from "../types"

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

export function useToggleCategoriaAtivo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => hierarquia.toggleCategoriaAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "categorias", empresaId] })
      const prev = qc.getQueryData<CatalogoCategoria[]>(["catalogo", "categorias", empresaId])
      qc.setQueryData<CatalogoCategoria[]>(["catalogo", "categorias", empresaId], (old) =>
        old?.map((c) => (c.id === id ? { ...c, ativo } : c)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "categorias", empresaId], ctx.prev)
      toast.error("Erro ao alterar categoria: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "categorias"] })
    },
  })
}

export function useToggleConexaoAtivo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => hierarquia.toggleConexaoAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "conexoes", empresaId] })
      const prev = qc.getQueryData<CatalogoConexao[]>(["catalogo", "conexoes", empresaId])
      qc.setQueryData<CatalogoConexao[]>(["catalogo", "conexoes", empresaId], (old) =>
        old?.map((c) => (c.id === id ? { ...c, ativo } : c)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "conexoes", empresaId], ctx.prev)
      toast.error("Erro ao alterar conexão: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "conexoes"] })
    },
  })
}

export function useFamilias(conexaoId?: string) {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "familias", empresaId, conexaoId], queryFn: () => hierarquia.listarFamilias(empresaId, conexaoId), enabled: !!empresaId })
}

export function useLinhas(familiaId?: string) {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "linhas", empresaId, familiaId], queryFn: () => hierarquia.listarLinhas(empresaId, familiaId), enabled: !!empresaId })
}

export function useToggleLinhaAtivo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => hierarquia.toggleLinhaAtiva(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "linhas", empresaId] })
      const prev = qc.getQueryData<CatalogoLinha[]>(["catalogo", "linhas", empresaId])
      qc.setQueryData<CatalogoLinha[]>(["catalogo", "linhas", empresaId], (old) =>
        old?.map((l) => (l.id === id ? { ...l, ativo } : l)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "linhas", empresaId], ctx.prev)
      toast.error("Erro ao alterar linha: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "linhas"] })
    },
  })
}

export function useToggleFamiliaAtivo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => hierarquia.toggleFamiliaAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "familias", empresaId] })
      const prev = qc.getQueryData<CatalogoFamilia[]>(["catalogo", "familias", empresaId])
      qc.setQueryData<CatalogoFamilia[]>(["catalogo", "familias", empresaId], (old) =>
        old?.map((f) => (f.id === id ? { ...f, ativo } : f)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "familias", empresaId], ctx.prev)
      toast.error("Erro ao alterar família: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "familias"] })
    },
  })
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

export function useAtualizarImplante() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, input }: { sku: string; input: Parameters<typeof implantes.atualizarImplante>[2] }) => implantes.atualizarImplante(empresaId, sku, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "implantes", empresaId] }),
  })
}

export function useToggleImplanteAtivo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, ativo }: { sku: string; ativo: boolean }) => implantes.toggleImplanteAtivo(empresaId, sku, ativo),
    onMutate: async ({ sku, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "implantes", "todos", empresaId] })
      const prev = qc.getQueryData<CatalogoImplante[]>(["catalogo", "implantes", "todos", empresaId])
      qc.setQueryData<CatalogoImplante[]>(["catalogo", "implantes", "todos", empresaId], (old) =>
        old?.map((i) => (i.sku === sku ? { ...i, ativo } : i)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "implantes", "todos", empresaId], ctx.prev)
      toast.error("Erro ao alterar implante: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "implantes"] })
    },
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

export function useAtualizarAbutment() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, input }: { sku: string; input: Parameters<typeof componentes.atualizarAbutment>[2] }) => componentes.atualizarAbutment(empresaId, sku, input),
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

export function useToggleAbutmentAtivo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, ativo }: { sku: string; ativo: boolean }) => componentes.toggleAbutmentAtivo(empresaId, sku, ativo),
    onMutate: async ({ sku, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "abutments", empresaId, undefined] })
      const prev = qc.getQueryData<CatalogoAbutment[]>(["catalogo", "abutments", empresaId, undefined])
      qc.setQueryData<CatalogoAbutment[]>(["catalogo", "abutments", empresaId, undefined], (old) =>
        old?.map((a) => (a.sku === sku ? { ...a, ativo } : a)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "abutments", empresaId, undefined], ctx.prev)
      toast.error("Erro ao alterar componente: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "abutments"] })
    },
  })
}

// --- Fresas ---
export function useToggleFresaAtivo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, ativo }: { sku: string; ativo: boolean }) => implantes.toggleFresaAtivo(empresaId, sku, ativo),
    onMutate: async ({ sku, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "fresas", empresaId] })
      const prev = qc.getQueryData<CatalogoFresa[]>(["catalogo", "fresas", empresaId])
      qc.setQueryData<CatalogoFresa[]>(["catalogo", "fresas", empresaId], (old) =>
        old?.map((f) => (f.sku === sku ? { ...f, ativo } : f)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "fresas", empresaId], ctx.prev)
      toast.error("Erro ao alterar fresa: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "fresas"] })
    },
  })
}

// --- Tipos Protéticos ---
export function useToggleTipoReabilitacaoAtivo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => componentes.toggleTipoReabilitacaoAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "tipos-reabilitacao", empresaId] })
      const prev = qc.getQueryData<CatalogoTipoReabilitacao[]>(["catalogo", "tipos-reabilitacao", empresaId])
      qc.setQueryData<CatalogoTipoReabilitacao[]>(["catalogo", "tipos-reabilitacao", empresaId], (old) =>
        old?.map((t) => (t.id === id ? { ...t, ativo } : t)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "tipos-reabilitacao", empresaId], ctx.prev)
      toast.error("Erro ao alterar tipo de reabilitação: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "tipos-reabilitacao"] })
    },
  })
}

export function useToggleTipoAbutmentAtivo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => componentes.toggleTipoAbutmentAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "tipos-abutment", empresaId] })
      const prev = qc.getQueryData<CatalogoTipoAbutment[]>(["catalogo", "tipos-abutment", empresaId])
      qc.setQueryData<CatalogoTipoAbutment[]>(["catalogo", "tipos-abutment", empresaId], (old) =>
        old?.map((t) => (t.id === id ? { ...t, ativo } : t)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "tipos-abutment", empresaId], ctx.prev)
      toast.error("Erro ao alterar tipo de abutment: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "tipos-abutment"] })
    },
  })
}

// --- Acessórios ---
export function useToggleCategoriaAcessorioAtivo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => acessorios.toggleCategoriaAcessorioAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "cats-acessorio", empresaId] })
      const prev = qc.getQueryData<CatalogoCategoriaAcessorio[]>(["catalogo", "cats-acessorio", empresaId])
      qc.setQueryData<CatalogoCategoriaAcessorio[]>(["catalogo", "cats-acessorio", empresaId], (old) =>
        old?.map((c) => (c.id === id ? { ...c, ativo } : c)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "cats-acessorio", empresaId], ctx.prev)
      toast.error("Erro ao alterar categoria de acessório: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "cats-acessorio"] })
    },
  })
}

export function useAcessorios(categoriaId?: string) {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "acessorios", empresaId, categoriaId], queryFn: () => acessorios.listarAcessorios(empresaId, categoriaId), enabled: !!empresaId })
}

export function useToggleAcessorioAtivo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, ativo }: { sku: string; ativo: boolean }) => acessorios.toggleAcessorioAtivo(empresaId, sku, ativo),
    onMutate: async ({ sku, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "acessorios", empresaId] })
      const prev = qc.getQueryData<CatalogoAcessorio[]>(["catalogo", "acessorios", empresaId])
      qc.setQueryData<CatalogoAcessorio[]>(["catalogo", "acessorios", empresaId], (old) =>
        old?.map((a) => (a.sku === sku ? { ...a, ativo } : a)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "acessorios", empresaId], ctx.prev)
      toast.error("Erro ao alterar acessório: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "acessorios"] })
    },
  })
}

export function useChavesFerramental() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "chaves", empresaId], queryFn: () => acessorios.listarChavesFerramental(empresaId), enabled: !!empresaId })
}

export function useFerramentasObrigatorias(acessorioSku: string) {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "ferramentas-obr", empresaId, acessorioSku], queryFn: () => acessorios.getFerramentasObrigatorias(empresaId, acessorioSku), enabled: !!empresaId && !!acessorioSku })
}

export function useToggleChaveFerramentalAtivo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, ativo }: { sku: string; ativo: boolean }) => acessorios.toggleChaveFerramentalAtivo(empresaId, sku, ativo),
    onMutate: async ({ sku, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "chaves", empresaId] })
      const prev = qc.getQueryData<CatalogoChaveFerramental[]>(["catalogo", "chaves", empresaId])
      qc.setQueryData<CatalogoChaveFerramental[]>(["catalogo", "chaves", empresaId], (old) =>
        old?.map((c) => (c.sku === sku ? { ...c, ativo } : c)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "chaves", empresaId], ctx.prev)
      toast.error("Erro ao alterar chave/ferramental: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "chaves"] })
    },
  })
}

export function useCategoriasAcessorio() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "cats-acessorio", empresaId], queryFn: () => acessorios.listarCategoriasAcessorio(empresaId), enabled: !!empresaId })
}

export function useToggleCategoriaInstrumentalAtivo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => acessorios.toggleCategoriaInstrumentalAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "cats-instrumental", empresaId] })
      const prev = qc.getQueryData<CatalogoCategoriaInstrumental[]>(["catalogo", "cats-instrumental", empresaId])
      qc.setQueryData<CatalogoCategoriaInstrumental[]>(["catalogo", "cats-instrumental", empresaId], (old) =>
        old?.map((c) => (c.id === id ? { ...c, ativo } : c)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "cats-instrumental", empresaId], ctx.prev)
      toast.error("Erro ao alterar categoria de instrumental: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "cats-instrumental"] })
    },
  })
}

export function useCategoriasInstrumental() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "cats-instrumental", empresaId], queryFn: () => acessorios.listarCategoriasInstrumental(empresaId), enabled: !!empresaId })
}

export function useInstrumentais(categoriaId?: string) {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "instrumentais", empresaId, categoriaId], queryFn: () => acessorios.listarInstrumentais(empresaId, categoriaId), enabled: !!empresaId })
}

// --- Kits ---
export function useToggleCategoriaKitAtivo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => kits.toggleCategoriaKitAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "cats-kit", empresaId] })
      const prev = qc.getQueryData<CatalogoCategoriaKit[]>(["catalogo", "cats-kit", empresaId])
      qc.setQueryData<CatalogoCategoriaKit[]>(["catalogo", "cats-kit", empresaId], (old) =>
        old?.map((c) => (c.id === id ? { ...c, ativo } : c)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "cats-kit", empresaId], ctx.prev)
      toast.error("Erro ao alterar categoria de kit: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "cats-kit"] })
    },
  })
}

// --- Workflows ---
export function useWorkflows() {
  const empresaId = useEmpresaId()
  return useQuery({ queryKey: ["catalogo", "workflows", empresaId], queryFn: () => workflows.listarWorkflows(empresaId), enabled: !!empresaId })
}

export function useToggleWorkflowAtivo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => workflows.toggleWorkflowAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "workflows", empresaId] })
      const prev = qc.getQueryData<CatalogoWorkflow[]>(["catalogo", "workflows", empresaId])
      qc.setQueryData<CatalogoWorkflow[]>(["catalogo", "workflows", empresaId], (old) =>
        old?.map((w) => (w.id === id ? { ...w, ativo } : w)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "workflows", empresaId], ctx.prev)
      toast.error("Erro ao alterar workflow: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "workflows"] })
    },
  })
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

export function useToggleEtapaAtivo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => workflows.toggleEtapaAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "etapas", empresaId] })
      const prev = qc.getQueryData<CatalogoEtapaWorkflow[]>(["catalogo", "etapas", empresaId])
      qc.setQueryData<CatalogoEtapaWorkflow[]>(["catalogo", "etapas", empresaId], (old) =>
        old?.map((e) => (e.id === id ? { ...e, ativo } : e)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "etapas", empresaId], ctx.prev)
      toast.error("Erro ao alterar etapa: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "etapas"] })
    },
  })
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

export function useAtualizarKit() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, input }: { sku: string; input: Parameters<typeof kits.atualizarKit>[2] }) => kits.atualizarKit(empresaId, sku, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "kits", empresaId] }),
  })
}

export function useToggleKitAtivo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, ativo }: { sku: string; ativo: boolean }) => kits.toggleKitAtivo(empresaId, sku, ativo),
    onMutate: async ({ sku, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "kits", "todos", empresaId] })
      const prev = qc.getQueryData<CatalogoKit[]>(["catalogo", "kits", "todos", empresaId])
      qc.setQueryData<CatalogoKit[]>(["catalogo", "kits", "todos", empresaId], (old) =>
        old?.map((k) => (k.sku === sku ? { ...k, ativo } : k)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "kits", "todos", empresaId], ctx.prev)
      toast.error("Erro ao alterar kit: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "kits"] })
    },
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

export function useAtualizarCupom() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof cupons.atualizarCupom>[1] }) => cupons.atualizarCupom(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "cupons"] }),
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

export function useAtualizarFrete() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof frete.atualizarFrete>[1] }) => frete.atualizarFrete(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "fretes"] }),
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

export function useAtualizarPromocional() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof promocionais.atualizarPromocional>[1] }) => promocionais.atualizarPromocional(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "promocionais"] }),
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

// --- Clientes ---
export function useClientesCatalogo(filters?: { tipo?: string; ativo?: boolean; search?: string; grupo_id?: string }) {
  const empresaId = useEmpresaId()
  return useQuery({
    queryKey: ["catalogo", "clientes", empresaId, filters],
    queryFn: () => clientesService.listarClientes(empresaId, filters),
    enabled: !!empresaId,
  })
}

export function useCriarClienteCatalogo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof clientesService.criarCliente>[1]) =>
      clientesService.criarCliente(empresaId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "clientes", empresaId] }),
  })
}

export function useDeletarClienteCatalogo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => clientesService.deletarCliente(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "clientes", empresaId] }),
  })
}

// --- Grupos ---
export function useGruposClientes() {
  const empresaId = useEmpresaId()
  return useQuery({
    queryKey: ["catalogo", "grupos", empresaId],
    queryFn: () => gruposService.listarGrupos(empresaId),
    enabled: !!empresaId,
  })
}

export function useCriarGrupoCliente() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof gruposService.criarGrupo>[1]) =>
      gruposService.criarGrupo(empresaId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "grupos", empresaId] }),
  })
}

// --- Pedidos ---
export function usePedidosCatalogo(filters?: { status?: string; cliente_id?: string; search?: string }) {
  const empresaId = useEmpresaId()
  return useQuery({
    queryKey: ["catalogo", "pedidos", empresaId, filters],
    queryFn: () => pedidosService.listarPedidos(empresaId, filters as any),
    enabled: !!empresaId,
  })
}

export function useCriarPedidoCatalogo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof pedidosService.criarPedido>[1]) =>
      pedidosService.criarPedido(empresaId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "pedidos", empresaId] }),
  })
}

export function useAtualizarStatusPedido() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      pedidosService.atualizarStatusPedido(id, status as any),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "pedidos", empresaId] }),
  })
}

// --- Orcamentos ---
export function useOrcamentosCatalogo(filters?: { status?: string; colaborador_id?: string; search?: string }) {
  const empresaId = useEmpresaId()
  return useQuery({
    queryKey: ["catalogo", "orcamentos", empresaId, filters],
    queryFn: () => orcamentosService.listarOrcamentos(empresaId, filters as any),
    enabled: !!empresaId,
  })
}

export function useCriarOrcamentoCatalogo() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof orcamentosService.criarOrcamento>[1]) =>
      orcamentosService.criarOrcamento(empresaId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "orcamentos", empresaId] }),
  })
}

export function useConverterOrcamentoPedido() {
  const empresaId = useEmpresaId()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => orcamentosService.converterEmPedido(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "orcamentos", empresaId] })
      qc.invalidateQueries({ queryKey: ["catalogo", "pedidos", empresaId] })
    },
  })
}
