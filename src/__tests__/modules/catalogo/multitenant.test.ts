import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("~/core/supabase", () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "test-user" } }, error: null }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
  },
}))

const empresaA = "empresa-a-0000-0000-0000-000000000001"
const empresaB = "empresa-b-0000-0000-0000-000000000002"

function captureEqCalls(fn: ReturnType<typeof vi.fn>): string[] {
  const calls: string[] = []
  for (const call of fn.mock.calls) {
    if (call[0] === "empresa_id") calls.push(call[1] as string)
  }
  return calls
}

describe("Catalogo - Multi-tenant isolation", () => {
  beforeEach(() => vi.clearAllMocks())

  describe("Hierarquia services filtram por empresa_id", () => {
    async function testEmpresaFilter(
      serviceFn: () => Promise<unknown>,
      fromTable: string,
    ) {
      const { supabase } = await import("~/core/supabase")
      const mockEq = vi.fn().mockReturnThis()
      const mockThen = vi.fn((resolve: (v: unknown) => void) => resolve({ data: [], error: null }))
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        order: vi.fn().mockReturnThis(),
        then: mockThen,
      })
      supabase.from.mockClear()
      await serviceFn()
      expect(supabase.from).toHaveBeenCalledWith(fromTable)
      expect(mockEq).toHaveBeenCalledWith("empresa_id", empresaA)
    }

    it("listarCategorias filtra empresaA", async () => {
      const { listarCategorias } = await import("~/features/catalogo/services/hierarquia.service")
      await testEmpresaFilter(() => listarCategorias(empresaA), "catalogo_categorias")
    })

    it("listarConexoes filtra empresaA", async () => {
      const { listarConexoes } = await import("~/features/catalogo/services/hierarquia.service")
      await testEmpresaFilter(() => listarConexoes(empresaA), "catalogo_conexoes")
    })

    it("listarFamilias filtra empresaA", async () => {
      const { listarFamilias } = await import("~/features/catalogo/services/hierarquia.service")
      await testEmpresaFilter(() => listarFamilias(empresaA), "catalogo_familias")
    })

    it("listarLinhas filtra empresaA", async () => {
      const { listarLinhas } = await import("~/features/catalogo/services/hierarquia.service")
      await testEmpresaFilter(() => listarLinhas(empresaA), "catalogo_linhas")
    })
  })

  describe("Dados isolados entre empresas", () => {
    it("empresa A ve apenas seus implantes, empresa B ve apenas os seus", async () => {
      const { listarTodosImplantes } = await import("~/features/catalogo/services/implantes.service")
      const { supabase } = await import("~/core/supabase")

      const calls: string[] = []

      supabase.from.mockImplementation((table: string) => {
        const mockEq = vi.fn((col: string, val: unknown) => {
          if (col === "empresa_id") calls.push(val as string)
          return builder
        })
        const builder = {
          select: vi.fn().mockReturnThis(),
          eq: mockEq,
          order: vi.fn().mockReturnThis(),
          then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [], error: null })),
        }
        return builder
      })

      await listarTodosImplantes(empresaA)
      await listarTodosImplantes(empresaB)

      expect(calls).toEqual([empresaA, empresaB])
    })
  })

  describe("CRUD operations usam empresa_id nas constraints", () => {
    it("criarImplante insere com empresa_id correto", async () => {
      const { criarImplante } = await import("~/features/catalogo/services/implantes.service")
      const { supabase } = await import("~/core/supabase")
      const mockInsert = vi.fn().mockReturnThis()
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        insert: mockInsert,
        single: vi.fn().mockResolvedValue({ data: { sku: "IMP-001" }, error: null }),
      })
      await criarImplante(empresaA, { sku: "IMP-001", linha_id: "lin-1", diametro_mm: 4, comprimento_mm: 10 })
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ empresa_id: empresaA }))
    })

    it("criarCategoria insere com empresa_id correto", async () => {
      const { criarCategoria } = await import("~/features/catalogo/services/hierarquia.service")
      const { supabase } = await import("~/core/supabase")
      const mockInsert = vi.fn().mockReturnThis()
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        insert: mockInsert,
        single: vi.fn().mockResolvedValue({ data: { id: "cat-1" }, error: null }),
      })
      await criarCategoria(empresaB, "Categ B")
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ empresa_id: empresaB }))
    })

    it("atualizarImplante usa empresa_id e sku no update", async () => {
      const { atualizarImplante } = await import("~/features/catalogo/services/implantes.service")
      const { supabase } = await import("~/core/supabase")
      const calls: { col: string; val: unknown }[] = []
      const mockEq = vi.fn((col: string, val: unknown) => {
        calls.push({ col, val })
        return builder
      })
      const builder = {
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        update: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { sku: "IMP-001" }, error: null }),
      }
      supabase.from.mockReturnValue(builder)
      await atualizarImplante(empresaA, "IMP-001", { diametro_mm: 5 })
      const empresaCalls = calls.filter((c) => c.col === "empresa_id")
      const skuCalls = calls.filter((c) => c.col === "sku")
      expect(empresaCalls.length).toBeGreaterThanOrEqual(1)
      expect(empresaCalls[0].val).toBe(empresaA)
      expect(skuCalls.length).toBeGreaterThanOrEqual(1)
      expect(skuCalls[0].val).toBe("IMP-001")
    })

    it("removerImplante usa empresa_id e sku no delete", async () => {
      const { removerImplante } = await import("~/features/catalogo/services/implantes.service")
      const { supabase } = await import("~/core/supabase")
      const calls: { col: string; val: unknown }[] = []
      const mockEq = vi.fn((col: string, val: unknown) => {
        calls.push({ col, val })
        return builder
      })
      const builder = {
        delete: vi.fn().mockReturnThis(),
        eq: mockEq,
      }
      supabase.from.mockReturnValue(builder)
      await removerImplante(empresaB, "IMP-002")
      const empresaCalls = calls.filter((c) => c.col === "empresa_id")
      const skuCalls = calls.filter((c) => c.col === "sku")
      expect(empresaCalls).toHaveLength(1)
      expect(empresaCalls[0].val).toBe(empresaB)
      expect(skuCalls).toHaveLength(1)
      expect(skuCalls[0].val).toBe("IMP-002")
    })
  })

  describe("Empresa A nao pode ver dados da empresa B", () => {
    it("listarCategorias de empresaA nao retorna dados de empresaB", async () => {
      const { listarCategorias } = await import("~/features/catalogo/services/hierarquia.service")
      const { supabase } = await import("~/core/supabase")
      const mockEq = vi.fn().mockReturnThis()

      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        order: vi.fn().mockReturnThis(),
        then: vi.fn((resolve: (v: unknown) => void) => {
          const empresaUsed = captureEqCalls(mockEq).find((e) => e === empresaA ? empresaA : empresaB)
          return resolve({
            data: empresaUsed === empresaA
              ? [{ id: "1", nome: "Categ A", empresa_id: empresaA }]
              : [{ id: "2", nome: "Categ B", empresa_id: empresaB }],
            error: null,
          })
        }),
      })

      const resultA = await listarCategorias(empresaA)
      for (const item of resultA) {
        expect(item.empresa_id).toBe(empresaA)
      }
    })

    it("cada empresa tem seus proprios kits", async () => {
      const { listarTodosKits } = await import("~/features/catalogo/services/kits.service")
      const { supabase } = await import("~/core/supabase")

      let currentEmpresa = ""
      const ordemFn = vi.fn().mockReturnThis()
      supabase.from.mockImplementation(() => {
        const eqFn = vi.fn((col: string, val: unknown) => {
          if (col === "empresa_id") currentEmpresa = val as string
          return chained
        })
        const chained = {
          select: vi.fn().mockReturnThis(),
          eq: eqFn,
          order: ordemFn,
          then: vi.fn((resolve: (v: unknown) => void) => {
            const data = currentEmpresa === empresaA
              ? [{ sku: "KIT-A", nome: "Kit A", empresa_id: empresaA }]
              : currentEmpresa === empresaB
                ? [{ sku: "KIT-B", nome: "Kit B", empresa_id: empresaB }]
                : []
            return resolve({ data, error: null })
          }),
        }
        return chained
      })

      const resultA = await listarTodosKits(empresaA)
      expect(resultA).toHaveLength(1)
      expect(resultA[0].empresa_id).toBe(empresaA)

      const resultB = await listarTodosKits(empresaB)
      expect(resultB).toHaveLength(1)
      expect(resultB[0].empresa_id).toBe(empresaB)
    })
  })

  describe("useCatalogoEmpresaId resolve prioridades", () => {
    it("useCatalogoEmpresaId e importavel e tem a assinatura correta", async () => {
      // Teste estrutural: verifica que o hook existe e exporta string
      const mod = await import("~/features/catalogo/hooks/useCatalogoEmpresa")
      expect(mod.useCatalogoEmpresaId).toBeDefined()
      expect(typeof mod.useCatalogoEmpresaId).toBe("function")
    })
  })

  describe("EmpresaCrudContext existe", () => {
    it("EmpresaCrudContext e EmpresaCrudGuard sao exportados", async () => {
      const contextMod = await import("~/features/catalogo/contexts/EmpresaCrudContext")
      expect(contextMod.EmpresaCrudContext).toBeDefined()
      expect(contextMod.useEmpresaCrudId).toBeDefined()

      const guardMod = await import("~/features/catalogo/components/EmpresaCrudGuard")
      expect(guardMod.EmpresaCrudGuard).toBeDefined()
    })
  })
})
