import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as hierarquia from "../services/hierarquia.service"
import * as implantes from "../services/implantes.service"
import * as componentes from "../services/componentes.service"
import * as acessorios from "../services/acessorios.service"
import * as workflows from "../services/workflows.service"
import * as kits from "../services/kits.service"
import * as cupons from "../services/cupons.service"
import * as frete from "../services/frete.service"
import * as parafusosRetensao from "../services/parafusos-retensao.service"
import * as cicatrizadores from "../services/cicatrizadores.service"
import * as promocionais from "../services/promocionais.service"
import * as clientesService from "../services/clientes.service"
import * as gruposService from "../services/grupos.service"
import * as pedidosService from "../services/pedidos.service"
import * as orcamentosService from "../services/orcamentos.service"
import * as imagensService from "../services/imagens.service"
import * as chavesService from "../services/chaves.service"
import * as fresasTiposService from "../services/fresas-tipos.service"
import * as fresagensService from "../services/fresagens.service"
import * as complementaresService from "../services/complementares.service"
import * as opcionaisService from "../services/opcionais.service"
import toast from "react-hot-toast"
import type { CatalogoImplante, CatalogoKit, CatalogoAbutment, CatalogoCategoria, CatalogoConexao, CatalogoLinha, CatalogoFamilia, CatalogoFresa, CatalogoTipoReabilitacao, CatalogoTipoAbutment, CatalogoCategoriaAcessorio, CatalogoAcessorio, CatalogoChaveFerramental, CatalogoCategoriaInstrumental, CatalogoInstrumentalGeral, CatalogoCategoriaKit, CatalogoWorkflow, CatalogoEtapaWorkflow, CatalogoParafusoRetencao, CatalogoCicatrizador, CatalogoTipoChave, CatalogoTipoFresa, CatalogoTipoComplementar, CatalogoTipoOpcional, ProdutoTipoImagem, CatalogoImagemProduto } from "../types"


// --- Hierarquia ---
export function useCategorias() {
  return useQuery({ queryKey: ["catalogo", "categorias"], queryFn: () => hierarquia.listarCategorias() })
}

export function useConexoes(categoriaId?: string) {
  return useQuery({ queryKey: ["catalogo", "conexoes", categoriaId], queryFn: () => hierarquia.listarConexoes(categoriaId) })
}

export function useToggleCategoriaAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => hierarquia.toggleCategoriaAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "categorias"] })
      const prev = qc.getQueryData<CatalogoCategoria[]>(["catalogo", "categorias"])
      qc.setQueryData<CatalogoCategoria[]>(["catalogo", "categorias"], (old) =>
        old?.map((c) => (c.id === id ? { ...c, ativo } : c)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "categorias"], ctx.prev)
      toast.error("Erro ao alterar categoria: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "categorias"] })
    },
  })
}

export function useToggleConexaoAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => hierarquia.toggleConexaoAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "conexoes"] })
      const prev = qc.getQueryData<CatalogoConexao[]>(["catalogo", "conexoes"])
      qc.setQueryData<CatalogoConexao[]>(["catalogo", "conexoes"], (old) =>
        old?.map((c) => (c.id === id ? { ...c, ativo } : c)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "conexoes"], ctx.prev)
      toast.error("Erro ao alterar conexão: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "conexoes"] })
    },
  })
}

export function useFamilias(conexaoId?: string) {
  return useQuery({ queryKey: ["catalogo", "familias", conexaoId], queryFn: () => hierarquia.listarFamilias(conexaoId) })
}

export function useLinhas(familiaId?: string) {
  return useQuery({ queryKey: ["catalogo", "linhas", familiaId], queryFn: () => hierarquia.listarLinhas(familiaId) })
}

export function useToggleLinhaAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => hierarquia.toggleLinhaAtiva(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "linhas"] })
      const prev = qc.getQueryData<CatalogoLinha[]>(["catalogo", "linhas"])
      qc.setQueryData<CatalogoLinha[]>(["catalogo", "linhas"], (old) =>
        old?.map((l) => (l.id === id ? { ...l, ativo } : l)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "linhas"], ctx.prev)
      toast.error("Erro ao alterar linha: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "linhas"] })
    },
  })
}

export function useToggleFamiliaAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => hierarquia.toggleFamiliaAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "familias"] })
      const prev = qc.getQueryData<CatalogoFamilia[]>(["catalogo", "familias"])
      qc.setQueryData<CatalogoFamilia[]>(["catalogo", "familias"], (old) =>
        old?.map((f) => (f.id === id ? { ...f, ativo } : f)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "familias"], ctx.prev)
      toast.error("Erro ao alterar família: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "familias"] })
    },
  })
}

// --- Implantes ---
export function useImplantesAtivos() {
  return useQuery({ queryKey: ["catalogo", "implantes", "ativos"], queryFn: () => implantes.listarImplantesAtivos() })
}

export function useTodosImplantes() {
  return useQuery({ queryKey: ["catalogo", "implantes", "todos"], queryFn: () => implantes.listarTodosImplantes() })
}

export function useImplanteDetalhe(sku: string) {
  return useQuery({ queryKey: ["catalogo", "implante", sku], queryFn: () => implantes.getImplanteDetalhe(sku), enabled: !!sku })
}

export function useImplantesPorLinha(linhaId: string) {
  return useQuery({ queryKey: ["catalogo", "implantes-linha", linhaId], queryFn: () => implantes.listarImplantesPorLinha(linhaId), enabled: !!linhaId })
}

export function useProtocoloFresagem(implanteSku: string) {
  return useQuery({ queryKey: ["catalogo", "fresagem", implanteSku], queryFn: () => implantes.getProtocoloFresagem(implanteSku), enabled: !!implanteSku })
}
export function useProtocolos() {
  return useQuery({ queryKey: ["catalogo", "protocolos-fresagens"], queryFn: () => fresagensService.listarProtocolos() })
}

export function useFresas() {
  return useQuery({ queryKey: ["catalogo", "fresas"], queryFn: () => implantes.listarFresas() })
}

export function useCriarImplante() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof implantes.criarImplante>[1]) => implantes.criarImplante(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "implantes"] }),
  })
}

export function useAtualizarImplante() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, input }: { sku: string; input: Parameters<typeof implantes.atualizarImplante>[2] }) => implantes.atualizarImplante(sku, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "implantes"] }),
  })
}

export function useToggleImplanteAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, ativo }: { sku: string; ativo: boolean }) => implantes.toggleImplanteAtivo(sku, ativo),
    onMutate: async ({ sku, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "implantes", "todos"] })
      const prev = qc.getQueryData<CatalogoImplante[]>(["catalogo", "implantes", "todos"])
      qc.setQueryData<CatalogoImplante[]>(["catalogo", "implantes", "todos"], (old) =>
        old?.map((i) => (i.sku === sku ? { ...i, ativo } : i)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "implantes", "todos"], ctx.prev)
      toast.error("Erro ao alterar implante: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "implantes"] })
    },
  })
}

export function useRemoverImplante() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (sku: string) => implantes.removerImplante(sku),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "implantes"] }),
  })
}

// --- Componentes ---
export function useTiposReabilitacao() {
  return useQuery({ queryKey: ["catalogo", "tipos-reabilitacao"], queryFn: () => componentes.listarTiposReabilitacao() })
}

export function useTiposAbutment() {
  return useQuery({ queryKey: ["catalogo", "tipos-abutment"], queryFn: () => componentes.listarTiposAbutment() })
}

export function useAbutments(familiaId?: string) {
  return useQuery({ queryKey: ["catalogo", "abutments", familiaId], queryFn: () => componentes.listarAbutments(familiaId) })
}

export function useAbutmentDetalhe(sku: string) {
  return useQuery({ queryKey: ["catalogo", "abutment", sku], queryFn: () => componentes.getAbutmentDetalhe(sku), enabled: !!sku })
}

export function useCriarAbutment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof componentes.criarAbutment>[1]) => componentes.criarAbutment(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "abutments"] }),
  })
}

export function useAtualizarAbutment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, input }: { sku: string; input: Parameters<typeof componentes.atualizarAbutment>[2] }) => componentes.atualizarAbutment(sku, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "abutments"] }),
  })
}

export function useRemoverAbutment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (sku: string) => componentes.removerAbutment(sku),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "abutments"] }),
  })
}

export function useToggleAbutmentAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, ativo }: { sku: string; ativo: boolean }) => componentes.toggleAbutmentAtivo(sku, ativo),
    onMutate: async ({ sku, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "abutments", undefined] })
      const prev = qc.getQueryData<CatalogoAbutment[]>(["catalogo", "abutments", undefined])
      qc.setQueryData<CatalogoAbutment[]>(["catalogo", "abutments", undefined], (old) =>
        old?.map((a) => (a.sku === sku ? { ...a, ativo } : a)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "abutments", undefined], ctx.prev)
      toast.error("Erro ao alterar componente: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "abutments"] })
    },
  })
}

// --- Fresas ---
export function useToggleFresaAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, ativo }: { sku: string; ativo: boolean }) => implantes.toggleFresaAtivo(sku, ativo),
    onMutate: async ({ sku, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "fresas"] })
      const prev = qc.getQueryData<CatalogoFresa[]>(["catalogo", "fresas"])
      qc.setQueryData<CatalogoFresa[]>(["catalogo", "fresas"], (old) =>
        old?.map((f) => (f.sku === sku ? { ...f, ativo } : f)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "fresas"], ctx.prev)
      toast.error("Erro ao alterar fresa: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "fresas"] })
    },
  })
}

// --- Tipos Protéticos ---
export function useToggleTipoReabilitacaoAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => componentes.toggleTipoReabilitacaoAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "tipos-reabilitacao"] })
      const prev = qc.getQueryData<CatalogoTipoReabilitacao[]>(["catalogo", "tipos-reabilitacao"])
      qc.setQueryData<CatalogoTipoReabilitacao[]>(["catalogo", "tipos-reabilitacao"], (old) =>
        old?.map((t) => (t.id === id ? { ...t, ativo } : t)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "tipos-reabilitacao"], ctx.prev)
      toast.error("Erro ao alterar tipo de reabilitação: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "tipos-reabilitacao"] })
    },
  })
}

export function useToggleTipoAbutmentAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => componentes.toggleTipoAbutmentAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "tipos-abutment"] })
      const prev = qc.getQueryData<CatalogoTipoAbutment[]>(["catalogo", "tipos-abutment"])
      qc.setQueryData<CatalogoTipoAbutment[]>(["catalogo", "tipos-abutment"], (old) =>
        old?.map((t) => (t.id === id ? { ...t, ativo } : t)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "tipos-abutment"], ctx.prev)
      toast.error("Erro ao alterar tipo de abutment: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "tipos-abutment"] })
    },
  })
}

// --- Acessórios ---
export function useToggleCategoriaAcessorioAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => acessorios.toggleCategoriaAcessorioAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "cats-acessorio"] })
      const prev = qc.getQueryData<CatalogoCategoriaAcessorio[]>(["catalogo", "cats-acessorio"])
      qc.setQueryData<CatalogoCategoriaAcessorio[]>(["catalogo", "cats-acessorio"], (old) =>
        old?.map((c) => (c.id === id ? { ...c, ativo } : c)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "cats-acessorio"], ctx.prev)
      toast.error("Erro ao alterar categoria de acessório: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "cats-acessorio"] })
    },
  })
}

export function useAcessorios(categoriaId?: string) {
  return useQuery({ queryKey: ["catalogo", "acessorios", categoriaId], queryFn: () => acessorios.listarAcessorios(categoriaId) })
}

export function useToggleAcessorioAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, ativo }: { sku: string; ativo: boolean }) => acessorios.toggleAcessorioAtivo(sku, ativo),
    onMutate: async ({ sku, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "acessorios"] })
      const prev = qc.getQueryData<CatalogoAcessorio[]>(["catalogo", "acessorios"])
      qc.setQueryData<CatalogoAcessorio[]>(["catalogo", "acessorios"], (old) =>
        old?.map((a) => (a.sku === sku ? { ...a, ativo } : a)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "acessorios"], ctx.prev)
      toast.error("Erro ao alterar acessório: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "acessorios"] })
    },
  })
}

export function useChavesFerramental() {
  return useQuery({ queryKey: ["catalogo", "chaves"], queryFn: () => acessorios.listarChavesFerramental() })
}

export function useFerramentasObrigatorias(acessorioSku: string) {
  return useQuery({ queryKey: ["catalogo", "ferramentas-obr", acessorioSku], queryFn: () => acessorios.getFerramentasObrigatorias(acessorioSku), enabled: !!acessorioSku })
}

export function useToggleChaveFerramentalAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, ativo }: { sku: string; ativo: boolean }) => acessorios.toggleChaveFerramentalAtivo(sku, ativo),
    onMutate: async ({ sku, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "chaves"] })
      const prev = qc.getQueryData<CatalogoChaveFerramental[]>(["catalogo", "chaves"])
      qc.setQueryData<CatalogoChaveFerramental[]>(["catalogo", "chaves"], (old) =>
        old?.map((c) => (c.sku === sku ? { ...c, ativo } : c)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "chaves"], ctx.prev)
      toast.error("Erro ao alterar chave/ferramental: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "chaves"] })
    },
  })
}

// --- Tipos de Instrumentais ---
export function useTiposChaves() {
  return useQuery({ queryKey: ["catalogo", "tipos-chaves"], queryFn: () => chavesService.listarTiposChaves() })
}

export function useToggleTipoChaveAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => chavesService.toggleTipoChaveAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "tipos-chaves"] })
      const prev = qc.getQueryData<CatalogoTipoChave[]>(["catalogo", "tipos-chaves"])
      qc.setQueryData<CatalogoTipoChave[]>(["catalogo", "tipos-chaves"], (old) =>
        old?.map((c) => (c.id === id ? { ...c, ativo } : c)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "tipos-chaves"], ctx.prev)
      toast.error("Erro ao alterar tipo de chave: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "tipos-chaves"] })
    },
  })
}

export function useTiposFresas() {
  return useQuery({ queryKey: ["catalogo", "tipos-fresas"], queryFn: () => fresasTiposService.listarTiposFresas() })
}

export function useToggleTipoFresaAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => fresasTiposService.toggleTipoFresaAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "tipos-fresas"] })
      const prev = qc.getQueryData<CatalogoTipoFresa[]>(["catalogo", "tipos-fresas"])
      qc.setQueryData<CatalogoTipoFresa[]>(["catalogo", "tipos-fresas"], (old) =>
        old?.map((c) => (c.id === id ? { ...c, ativo } : c)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "tipos-fresas"], ctx.prev)
      toast.error("Erro ao alterar tipo de fresa: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "tipos-fresas"] })
    },
  })
}

export function useTiposComplementares() {
  return useQuery({ queryKey: ["catalogo", "tipos-complementares"], queryFn: () => complementaresService.listarTiposComplementares() })
}

export function useToggleTipoComplementarAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => complementaresService.toggleTipoComplementarAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "tipos-complementares"] })
      const prev = qc.getQueryData<CatalogoTipoComplementar[]>(["catalogo", "tipos-complementares"])
      qc.setQueryData<CatalogoTipoComplementar[]>(["catalogo", "tipos-complementares"], (old) =>
        old?.map((c) => (c.id === id ? { ...c, ativo } : c)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "tipos-complementares"], ctx.prev)
      toast.error("Erro ao alterar tipo complementar: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "tipos-complementares"] })
    },
  })
}

export function useTiposOpcionais() {
  return useQuery({ queryKey: ["catalogo", "tipos-opcionais"], queryFn: () => opcionaisService.listarTiposOpcionais() })
}

export function useToggleTipoOpcionalAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => opcionaisService.toggleTipoOpcionalAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "tipos-opcionais"] })
      const prev = qc.getQueryData<CatalogoTipoOpcional[]>(["catalogo", "tipos-opcionais"])
      qc.setQueryData<CatalogoTipoOpcional[]>(["catalogo", "tipos-opcionais"], (old) =>
        old?.map((c) => (c.id === id ? { ...c, ativo } : c)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "tipos-opcionais"], ctx.prev)
      toast.error("Erro ao alterar tipo opcional: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "tipos-opcionais"] })
    },
  })
}

export function useCategoriasAcessorio() {
  return useQuery({ queryKey: ["catalogo", "cats-acessorio"], queryFn: () => acessorios.listarCategoriasAcessorio() })
}

export function useToggleCategoriaInstrumentalAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => acessorios.toggleCategoriaInstrumentalAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "cats-instrumental"] })
      const prev = qc.getQueryData<CatalogoCategoriaInstrumental[]>(["catalogo", "cats-instrumental"])
      qc.setQueryData<CatalogoCategoriaInstrumental[]>(["catalogo", "cats-instrumental"], (old) =>
        old?.map((c) => (c.id === id ? { ...c, ativo } : c)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "cats-instrumental"], ctx.prev)
      toast.error("Erro ao alterar categoria de instrumental: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "cats-instrumental"] })
    },
  })
}

export function useCategoriasInstrumental() {
  return useQuery({ queryKey: ["catalogo", "cats-instrumental"], queryFn: () => acessorios.listarCategoriasInstrumental() })
}

export function useInstrumentais(categoriaId?: string) {
  return useQuery({ queryKey: ["catalogo", "instrumentais", categoriaId], queryFn: () => acessorios.listarInstrumentais(categoriaId) })
}

export function useToggleInstrumentalAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, ativo }: { sku: string; ativo: boolean }) => acessorios.toggleInstrumentalAtivo(sku, ativo),
    onMutate: async ({ sku, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "instrumentais"] })
      const prev = qc.getQueryData<CatalogoInstrumentalGeral[]>(["catalogo", "instrumentais"])
      qc.setQueryData<CatalogoInstrumentalGeral[]>(["catalogo", "instrumentais"], (old) =>
        old?.map((i) => (i.sku === sku ? { ...i, ativo } : i)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "instrumentais"], ctx.prev)
      toast.error("Erro ao alterar instrumental: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "instrumentais"] })
    },
  })
}

// --- Kits ---
export function useToggleCategoriaKitAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => kits.toggleCategoriaKitAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "cats-kit"] })
      const prev = qc.getQueryData<CatalogoCategoriaKit[]>(["catalogo", "cats-kit"])
      qc.setQueryData<CatalogoCategoriaKit[]>(["catalogo", "cats-kit"], (old) =>
        old?.map((c) => (c.id === id ? { ...c, ativo } : c)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "cats-kit"], ctx.prev)
      toast.error("Erro ao alterar categoria de kit: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "cats-kit"] })
    },
  })
}

// --- Workflows ---
export function useWorkflows() {
  return useQuery({ queryKey: ["catalogo", "workflows"], queryFn: () => workflows.listarWorkflows() })
}

export function useToggleWorkflowAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => workflows.toggleWorkflowAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "workflows"] })
      const prev = qc.getQueryData<CatalogoWorkflow[]>(["catalogo", "workflows"])
      qc.setQueryData<CatalogoWorkflow[]>(["catalogo", "workflows"], (old) =>
        old?.map((w) => (w.id === id ? { ...w, ativo } : w)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "workflows"], ctx.prev)
      toast.error("Erro ao alterar workflow: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "workflows"] })
    },
  })
}

export function useEtapas() {
  return useQuery({ queryKey: ["catalogo", "etapas"], queryFn: () => workflows.listarEtapas() })
}

export function useGuias(filters?: { familia_id?: string; workflow_id?: string }) {
  return useQuery({ queryKey: ["catalogo", "guias", filters], queryFn: () => workflows.listarGuias(filters) })
}

export function useWorkflowDetalhe(workflowId: string) {
  return useQuery({ queryKey: ["catalogo", "workflow-detalhe", workflowId], queryFn: () => workflows.getWorkflowDetalhe(workflowId), enabled: !!workflowId })
}

// --- Kits ---
export function useTiposKit() {
  return useQuery({ queryKey: ["catalogo", "tipos-kit"], queryFn: () => kits.listarTiposKit() })
}

export function useKitsAtivos() {
  return useQuery({ queryKey: ["catalogo", "kits", "ativos"], queryFn: () => kits.listarKitsAtivos() })
}

export function useTodosKits() {
  return useQuery({ queryKey: ["catalogo", "kits", "todos"], queryFn: () => kits.listarTodosKits() })
}

export function useKitDetalhe(sku: string) {
  return useQuery({ queryKey: ["catalogo", "kit", sku], queryFn: () => kits.getKitDetalhe(sku), enabled: !!sku })
}

export function useToggleEtapaAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => workflows.toggleEtapaAtivo(id, ativo),
    onMutate: async ({ id, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "etapas"] })
      const prev = qc.getQueryData<CatalogoEtapaWorkflow[]>(["catalogo", "etapas"])
      qc.setQueryData<CatalogoEtapaWorkflow[]>(["catalogo", "etapas"], (old) =>
        old?.map((e) => (e.id === id ? { ...e, ativo } : e)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "etapas"], ctx.prev)
      toast.error("Erro ao alterar etapa: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "etapas"] })
    },
  })
}

export function useCategoriasKit() {
  return useQuery({ queryKey: ["catalogo", "cats-kit"], queryFn: () => kits.listarCategoriasKit() })
}

export function useCriarKit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof kits.criarKit>[1]) => kits.criarKit(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "kits"] }),
  })
}

export function useAtualizarKit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, input }: { sku: string; input: Parameters<typeof kits.atualizarKit>[2] }) => kits.atualizarKit(sku, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "kits"] }),
  })
}

export function useToggleKitAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, ativo }: { sku: string; ativo: boolean }) => kits.toggleKitAtivo(sku, ativo),
    onMutate: async ({ sku, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "kits", "todos"] })
      const prev = qc.getQueryData<CatalogoKit[]>(["catalogo", "kits", "todos"])
      qc.setQueryData<CatalogoKit[]>(["catalogo", "kits", "todos"], (old) =>
        old?.map((k) => (k.sku === sku ? { ...k, ativo } : k)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "kits", "todos"], ctx.prev)
      toast.error("Erro ao alterar kit: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "kits"] })
    },
  })
}

export function useRemoverKit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (sku: string) => kits.removerKit(sku),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "kits"] }),
  })
}

// --- Cupons ---
export function useCupons() {
  return useQuery({ queryKey: ["catalogo", "cupons"], queryFn: () => cupons.listarCupons() })
}

export function useCriarCupom() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof cupons.criarCupom>[1]) => cupons.criarCupom(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "cupons"] }),
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
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cupons.removerCupom(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "cupons"] }),
  })
}

// --- Frete ---
export function useFretes() {
  return useQuery({ queryKey: ["catalogo", "fretes"], queryFn: () => frete.listarFretes() })
}

export function useCriarFrete() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof frete.criarFrete>[1]) => frete.criarFrete(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "fretes"] }),
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
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => frete.removerFrete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "fretes"] }),
  })
}

// --- Promocionais ---
export function usePromocionais() {
  return useQuery({ queryKey: ["catalogo", "promocionais"], queryFn: () => promocionais.listarPromocionais() })
}

export function usePromocionaisAtivos() {
  return useQuery({ queryKey: ["catalogo", "promocionais-ativos"], queryFn: () => promocionais.listarPromocionaisAtivos() })
}

export function usePromocionalDetalhe(id: string) {
  return useQuery({ queryKey: ["catalogo", "promocional", id], queryFn: () => promocionais.getPromocionalDetalhe(id), enabled: !!id })
}

export function useCriarPromocional() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof promocionais.criarPromocional>[1]) => promocionais.criarPromocional(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "promocionais"] }),
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
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => promocionais.removerPromocional(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "promocionais"] }),
  })
}

// --- Clientes ---
export function useClientesCatalogo(filters?: { tipo?: string; ativo?: boolean; search?: string; grupo_id?: string }) {
  return useQuery({
    queryKey: ["catalogo", "clientes", filters],
    queryFn: () => clientesService.listarClientes(filters),
  })
}

export function useCriarClienteCatalogo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof clientesService.criarCliente>[0]) =>
      clientesService.criarCliente(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "clientes"] }),
  })
}

export function useDeletarClienteCatalogo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => clientesService.deletarCliente(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "clientes"] }),
  })
}

// --- Grupos ---
export function useGruposClientes() {
  return useQuery({
    queryKey: ["catalogo", "grupos"],
    queryFn: () => gruposService.listarGrupos(),
  })
}

export function useCriarGrupoCliente() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof gruposService.criarGrupo>[0]) =>
      gruposService.criarGrupo(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "grupos"] }),
  })
}

// --- Pedidos ---
export function usePedidosCatalogo(filters?: { status?: string; cliente_id?: string; search?: string }) {
  return useQuery({
    queryKey: ["catalogo", "pedidos", filters],
    queryFn: () => pedidosService.listarPedidos(filters as any),
  })
}

export function useCriarPedidoCatalogo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof pedidosService.criarPedido>[0]) =>
      pedidosService.criarPedido(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "pedidos"] }),
  })
}

export function useAtualizarStatusPedido() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      pedidosService.atualizarStatusPedido(id, status as any),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "pedidos"] }),
  })
}

// --- Orcamentos ---
export function useOrcamentosCatalogo(filters?: { status?: string; colaborador_id?: string; search?: string }) {
  return useQuery({
    queryKey: ["catalogo", "orcamentos", filters],
    queryFn: () => orcamentosService.listarOrcamentos(filters as any),
  })
}

export function useCriarOrcamentoCatalogo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof orcamentosService.criarOrcamento>[1]) =>
      orcamentosService.criarOrcamento(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "orcamentos"] }),
  })
}

export function useConverterOrcamentoPedido() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => orcamentosService.converterEmPedido(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "orcamentos"] })
      qc.invalidateQueries({ queryKey: ["catalogo", "pedidos"] })
    },
  })
}

// --- Parafusos de Retenção ---
export function useParafusosRetensao() {
  return useQuery({ queryKey: ["catalogo", "parafusos-retensao"], queryFn: () => parafusosRetensao.listarParafusosRetensao() })
}

export function useCriarParafusoRetencao() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof parafusosRetensao.criarParafusoRetencao>[1]) =>
      parafusosRetensao.criarParafusoRetencao(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "parafusos-retensao"] }),
  })
}

export function useAtualizarParafusoRetencao() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, input }: { sku: string; input: Parameters<typeof parafusosRetensao.atualizarParafusoRetencao>[2] }) =>
      parafusosRetensao.atualizarParafusoRetencao(sku, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "parafusos-retensao"] }),
  })
}

export function useToggleParafusoRetencaoAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, ativo }: { sku: string; ativo: boolean }) => parafusosRetensao.toggleParafusoRetencaoAtivo(sku, ativo),
    onMutate: async ({ sku, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "parafusos-retensao"] })
      const prev = qc.getQueryData<CatalogoParafusoRetencao[]>(["catalogo", "parafusos-retensao"])
      qc.setQueryData<CatalogoParafusoRetencao[]>(["catalogo", "parafusos-retensao"], (old) =>
        old?.map((p) => (p.sku === sku ? { ...p, ativo } : p)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "parafusos-retensao"], ctx.prev)
      toast.error("Erro ao alterar parafuso de retenção: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "parafusos-retensao"] })
    },
  })
}

// --- Cicatrizadores ---
export function useCicatrizadores() {
  return useQuery({ queryKey: ["catalogo", "cicatrizadores"], queryFn: () => cicatrizadores.listarCicatrizadores() })
}

export function useCriarCicatrizador() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof cicatrizadores.criarCicatrizador>[1]) =>
      cicatrizadores.criarCicatrizador(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "cicatrizadores"] }),
  })
}

export function useAtualizarCicatrizador() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, input }: { sku: string; input: Parameters<typeof cicatrizadores.atualizarCicatrizador>[2] }) =>
      cicatrizadores.atualizarCicatrizador(sku, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogo", "cicatrizadores"] }),
  })
}

export function useToggleCicatrizadorAtivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sku, ativo }: { sku: string; ativo: boolean }) => cicatrizadores.toggleCicatrizadorAtivo(sku, ativo),
    onMutate: async ({ sku, ativo }) => {
      await qc.cancelQueries({ queryKey: ["catalogo", "cicatrizadores"] })
      const prev = qc.getQueryData<CatalogoCicatrizador[]>(["catalogo", "cicatrizadores"])
      qc.setQueryData<CatalogoCicatrizador[]>(["catalogo", "cicatrizadores"], (old) =>
        old?.map((c) => (c.sku === sku ? { ...c, ativo } : c)) ?? []
      )
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["catalogo", "cicatrizadores"], ctx.prev)
      toast.error("Erro ao alterar cicatrizador: " + (err as Error).message)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["catalogo", "cicatrizadores"] })
    },
  })
}

// --- Imagens ---
export function useImagensProduto(tipo: ProdutoTipoImagem | undefined, sku: string | undefined) {
  return useQuery({
    queryKey: ["catalogo", "imagens", tipo, sku],
    queryFn: () => imagensService.listarImagens(tipo!, sku!),
    enabled: !!tipo && !!sku,
  })
}

export function useImagensBatch(tipo: ProdutoTipoImagem | undefined, skus: string[]) {
  return useQuery({
    queryKey: ["catalogo", "imagens-batch", tipo, skus.sort().join(",")],
    queryFn: () => imagensService.listarImagensBatch(tipo!, skus),
    enabled: !!tipo && skus.length > 0,
  })
}

// --- Dados Relacionados ao Implante ---
export function useChavesDoImplante(implanteSku: string) {
  return useQuery({
    queryKey: ["catalogo", "implante-chaves", implanteSku],
    queryFn: () => implantes.listarChavesDoImplante(implanteSku),
    enabled: !!implanteSku,
  })
}

export function useCicatrizadoresDoImplante(implanteSku: string) {
  return useQuery({
    queryKey: ["catalogo", "implante-cicatrizadores", implanteSku],
    queryFn: () => implantes.listarCicatrizadoresDoImplante(implanteSku),
    enabled: !!implanteSku,
  })
}

export function useAbutmentsDaFamilia(familiaId: string | null | undefined) {
  return useQuery({
    queryKey: ["catalogo", "familia-abutments", familiaId],
    queryFn: () => implantes.listarAbutmentsDaFamilia(familiaId!),
    enabled: !!familiaId,
  })
}

export function useKitsComChavesEmComum(implanteSku: string) {
  return useQuery({
    queryKey: ["catalogo", "implante-kits", implanteSku],
    queryFn: () => implantes.listarKitsComChavesEmComum(implanteSku),
    enabled: !!implanteSku,
  })
}

export function useAbutmentsDoImplante(implanteSku: string) {
  return useQuery({
    queryKey: ["catalogo", "implante-abutments", implanteSku],
    queryFn: () => implantes.listarAbutmentsDoImplante(implanteSku),
    enabled: !!implanteSku,
  })
}

export function useKitsDoImplante(implanteSku: string) {
  return useQuery({
    queryKey: ["catalogo", "implante-kits-pivot", implanteSku],
    queryFn: () => implantes.listarKitsDoImplante(implanteSku),
    enabled: !!implanteSku,
  })
}
