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

vi.mock("~/core/services/webhooks", () => ({
  dispararEventoModulo: vi.fn().mockResolvedValue(undefined),
}))

const empresaId = "emp-123"
const empresaId2 = "emp-456"

function mockQueryBuilder(overrides: Record<string, unknown> = {}) {
  const builder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    or: vi.fn().mockReturnThis(),
    then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [], error: null })),
    ...overrides,
  }
  return builder
}

// ========================
// HIERARQUIA (Categorias, Conexoes, Familias, Linhas)
// ========================
describe("Catalogo Services - Hierarquia", () => {
  beforeEach(() => vi.clearAllMocks())

  describe("Categorias", () => {
    it("listarCategorias retorna array", async () => {
      const { listarCategorias } = await import("~/features/catalogo/services/hierarquia.service")
      const { supabase } = await import("~/core/supabase")
      const mockData = [{ id: "1", nome: "Categoria A", empresa_id: empresaId, ativo: true }]
      supabase.from.mockReturnValue(mockQueryBuilder({
        then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: mockData, error: null })),
      }))
      const result = await listarCategorias(empresaId)
      expect(result).toHaveLength(1)
      expect(result[0].nome).toBe("Categoria A")
      expect(supabase.from).toHaveBeenCalledWith("catalogo_categorias")
    })

    it("listarCategorias filtra por empresa_id", async () => {
      const { listarCategorias } = await import("~/features/catalogo/services/hierarquia.service")
      const { supabase } = await import("~/core/supabase")
      const mockEq = vi.fn().mockReturnThis()
      supabase.from.mockReturnValue(mockQueryBuilder({ eq: mockEq }))
      await listarCategorias(empresaId)
      expect(mockEq).toHaveBeenCalledWith("empresa_id", empresaId)
    })

    it("listarCategorias retorna vazio quando sem dados", async () => {
      const { listarCategorias } = await import("~/features/catalogo/services/hierarquia.service")
      const { supabase } = await import("~/core/supabase")
      supabase.from.mockReturnValue(mockQueryBuilder())
      const result = await listarCategorias(empresaId)
      expect(result).toHaveLength(0)
    })

    it("listarCategorias lanca erro quando Supabase falha", async () => {
      const { listarCategorias } = await import("~/features/catalogo/services/hierarquia.service")
      const { supabase } = await import("~/core/supabase")
      supabase.from.mockReturnValue(mockQueryBuilder({
        then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: null, error: new Error("DB Error") })),
      }))
      await expect(listarCategorias(empresaId)).rejects.toThrow("DB Error")
    })

    it("criarCategoria insere com empresa_id", async () => {
      const { criarCategoria } = await import("~/features/catalogo/services/hierarquia.service")
      const { supabase } = await import("~/core/supabase")
      const mockInsert = vi.fn().mockReturnThis()
      supabase.from.mockReturnValue(mockQueryBuilder({
        single: vi.fn().mockResolvedValue({ data: { id: "cat-1", nome: "Nova Categoria", empresa_id: empresaId }, error: null }),
        select: vi.fn().mockReturnThis(),
        insert: mockInsert,
      }))
      const result = await criarCategoria(empresaId, "Nova Categoria")
      expect(result.nome).toBe("Nova Categoria")
      expect(mockInsert).toHaveBeenCalledWith({ empresa_id: empresaId, nome: "Nova Categoria", locked: false })
    })

    it("atualizarCategoria atualiza nome", async () => {
      const { atualizarCategoria } = await import("~/features/catalogo/services/hierarquia.service")
      const { supabase } = await import("~/core/supabase")
      supabase.from.mockReturnValue(mockQueryBuilder({
        single: vi.fn().mockResolvedValue({ data: { id: "cat-1", nome: "Atualizada" }, error: null }),
      }))
      const { supabase: sb } = await import("~/core/supabase")
      const result = await atualizarCategoria("cat-1", "Atualizada")
      expect(result.nome).toBe("Atualizada")
      expect(sb.from).toHaveBeenCalledWith("catalogo_categorias")
    })

    it("toggleCategoriaAtivo alterna ativo", async () => {
      const { toggleCategoriaAtivo } = await import("~/features/catalogo/services/hierarquia.service")
      const { supabase } = await import("~/core/supabase")
      supabase.from.mockReturnValue(mockQueryBuilder())
      await expect(toggleCategoriaAtivo("cat-1", false)).resolves.toBeUndefined()
    })

    it("removerCategoria executa delete", async () => {
      const { removerCategoria } = await import("~/features/catalogo/services/hierarquia.service")
      const { supabase } = await import("~/core/supabase")
      const mockDelete = vi.fn().mockReturnThis()
      supabase.from.mockReturnValue(mockQueryBuilder({ delete: mockDelete }))
      await removerCategoria("cat-1")
      expect(mockDelete).toHaveBeenCalled()
    })
  })

  describe("Conexoes", () => {
    it("listarConexoes retorna com relacao categoria", async () => {
      const { listarConexoes } = await import("~/features/catalogo/services/hierarquia.service")
      const { supabase } = await import("~/core/supabase")
      const mockData = [{ id: "1", nome: "Conexao Hex", categoria: { nome: "Hexágono Interno" } }]
      supabase.from.mockReturnValue(mockQueryBuilder({
        then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: mockData, error: null })),
      }))
      const result = await listarConexoes(empresaId)
      expect(result).toHaveLength(1)
      expect(result[0].categoria.nome).toBe("Hexágono Interno")
    })

    it("listarConexoes filtra por categoria se passado", async () => {
      const { listarConexoes } = await import("~/features/catalogo/services/hierarquia.service")
      const { supabase } = await import("~/core/supabase")
      const mockEq = vi.fn().mockReturnThis()
      supabase.from.mockReturnValue(mockQueryBuilder({ eq: mockEq }))
      await listarConexoes(empresaId, "cat-1")
      expect(mockEq).toHaveBeenCalledWith("categoria_id", "cat-1")
    })
  })

  describe("Familias", () => {
    it("listarFamilias retorna com relacao conexao", async () => {
      const { listarFamilias } = await import("~/features/catalogo/services/hierarquia.service")
      const { supabase } = await import("~/core/supabase")
      supabase.from.mockReturnValue(mockQueryBuilder({
        then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [{ id: "1", nome: "GMF", conexao: { nome: "Hex" } }], error: null })),
      }))
      const result = await listarFamilias(empresaId)
      expect(result[0].conexao.nome).toBe("Hex")
    })

    it("criarFamilia insere com empresa_id", async () => {
      const { criarFamilia } = await import("~/features/catalogo/services/hierarquia.service")
      const { supabase } = await import("~/core/supabase")
      const mockInsert = vi.fn().mockReturnThis()
      supabase.from.mockReturnValue(mockQueryBuilder({ insert: mockInsert, single: vi.fn().mockResolvedValue({ data: [{ id: "fam-1", nome: "GMF" }], error: null }) }))
      await criarFamilia(empresaId, { conexao_id: "con-1", nome: "GMF", cor_identificacao: "#FF0000" })
      expect(mockInsert).toHaveBeenCalledWith({ empresa_id: empresaId, conexao_id: "con-1", nome: "GMF", cor_identificacao: "#FF0000" })
    })

    it("atualizarFamilia atualiza parcial", async () => {
      const { atualizarFamilia } = await import("~/features/catalogo/services/hierarquia.service")
      const { supabase } = await import("~/core/supabase")
      const mockUpdate = vi.fn().mockReturnThis()
      supabase.from.mockReturnValue(mockQueryBuilder({ update: mockUpdate, single: vi.fn().mockResolvedValue({ data: { id: "fam-1", nome: "GMF Atualizado" }, error: null }) }))
      await atualizarFamilia("fam-1", { nome: "GMF Atualizado" })
      expect(mockUpdate).toHaveBeenCalledWith({ nome: "GMF Atualizado" })
    })
  })

  describe("Linhas", () => {
    it("listarLinhas retorna dados", async () => {
      const { listarLinhas } = await import("~/features/catalogo/services/hierarquia.service")
      const { supabase } = await import("~/core/supabase")
      supabase.from.mockReturnValue(mockQueryBuilder({
        then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [{ id: "1", nome: "Standard", familia: { nome: "GMF" } }], error: null })),
      }))
      const result = await listarLinhas(empresaId)
      expect(result[0].nome).toBe("Standard")
    })

    it("criarLinha insere com empresa_id", async () => {
      const { criarLinha } = await import("~/features/catalogo/services/hierarquia.service")
      const { supabase } = await import("~/core/supabase")
      const mockInsert = vi.fn().mockReturnThis()
      supabase.from.mockReturnValue(mockQueryBuilder({ insert: mockInsert, single: vi.fn().mockResolvedValue({ data: { id: "lin-1", nome: "Standard" }, error: null }) }))
      await criarLinha(empresaId, { familia_id: "fam-1", nome: "Standard" })
      expect(mockInsert).toHaveBeenCalledWith({ empresa_id: empresaId, familia_id: "fam-1", nome: "Standard" })
    })

    it("toggleLinhaAtiva alterna estado", async () => {
      const { toggleLinhaAtiva } = await import("~/features/catalogo/services/hierarquia.service")
      const { supabase } = await import("~/core/supabase")
      const mockUpdate = vi.fn().mockReturnThis()
      supabase.from.mockReturnValue(mockQueryBuilder({ update: mockUpdate }))
      await toggleLinhaAtiva("lin-1", false)
      expect(mockUpdate).toHaveBeenCalledWith({ ativo: false })
    })
  })
})

// ========================
// IMPLANTES
// ========================
describe("Catalogo Services - Implantes", () => {
  beforeEach(() => vi.clearAllMocks())

  it("listarImplantesAtivos retorna apenas ativos", async () => {
    const { listarImplantesAtivos } = await import("~/features/catalogo/services/implantes.service")
    const { supabase } = await import("~/core/supabase")
    const mockEq = vi.fn().mockReturnThis()
    supabase.from.mockReturnValue(mockQueryBuilder({
      eq: mockEq,
      then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [{ sku: "IMP-001", ativo: true }], error: null })),
    }))
    const result = await listarImplantesAtivos(empresaId)
    expect(result).toHaveLength(1)
    expect(mockEq).toHaveBeenCalledWith("ativo", true)
  })

  it("listarTodosImplantes retorna todos sem filtro ativo", async () => {
    const { listarTodosImplantes } = await import("~/features/catalogo/services/implantes.service")
    const { supabase } = await import("~/core/supabase")
    supabase.from.mockReturnValue(mockQueryBuilder({
      then: vi.fn((resolve: (v: unknown) => void) => resolve({
        data: [{ sku: "IMP-001", ativo: true }, { sku: "IMP-002", ativo: false }], error: null,
      })),
    }))
    const result = await listarTodosImplantes(empresaId)
    expect(result).toHaveLength(2)
  })

  it("getImplanteDetalhe busca com single", async () => {
    const { getImplanteDetalhe } = await import("~/features/catalogo/services/implantes.service")
    const { supabase } = await import("~/core/supabase")
    supabase.from.mockReturnValue(mockQueryBuilder({
      single: vi.fn().mockResolvedValue({ data: { sku: "IMP-001", diametro_mm: 4 }, error: null }),
    }))
    const result = await getImplanteDetalhe(empresaId, "IMP-001")
    expect(result?.sku).toBe("IMP-001")
    expect(result?.diametro_mm).toBe(4)
  })

  it("criarImplante insere e dispara evento", async () => {
    const { criarImplante } = await import("~/features/catalogo/services/implantes.service")
    const { supabase } = await import("~/core/supabase")
    const { dispararEventoModulo } = await import("~/core/services/webhooks")
    const mockInsert = vi.fn().mockReturnThis()
    supabase.from.mockReturnValue(mockQueryBuilder({
      insert: mockInsert,
      single: vi.fn().mockResolvedValue({ data: { sku: "IMP-NOVO", linha_id: "lin-1", diametro_mm: 4, comprimento_mm: 10 }, error: null }),
    }))
    const result = await criarImplante(empresaId, { sku: "IMP-NOVO", linha_id: "lin-1", diametro_mm: 4, comprimento_mm: 10 })
    expect(result.sku).toBe("IMP-NOVO")
    expect(mockInsert).toHaveBeenCalledWith({ empresa_id: empresaId, sku: "IMP-NOVO", linha_id: "lin-1", diametro_mm: 4, comprimento_mm: 10 })
    expect(dispararEventoModulo).toHaveBeenCalledWith("catalogo", "produto.criado", { sku: "IMP-NOVO", tipo: "implante", empresa_id: empresaId }, empresaId)
  })

  it("atualizarImplante dispara evento produto.atualizado", async () => {
    const { atualizarImplante } = await import("~/features/catalogo/services/implantes.service")
    const { supabase } = await import("~/core/supabase")
    const { dispararEventoModulo } = await import("~/core/services/webhooks")
    supabase.from.mockReturnValue(mockQueryBuilder({
      single: vi.fn().mockResolvedValue({ data: { sku: "IMP-001", diametro_mm: 4.5 }, error: null }),
    }))
    await atualizarImplante(empresaId, "IMP-001", { diametro_mm: 4.5 })
    expect(dispararEventoModulo).toHaveBeenCalledWith("catalogo", "produto.atualizado", { sku: "IMP-001", tipo: "implante", empresa_id: empresaId }, empresaId)
  })

  it("toggleImplanteAtivo chama update", async () => {
    const { toggleImplanteAtivo } = await import("~/features/catalogo/services/implantes.service")
    const { supabase } = await import("~/core/supabase")
    const mockUpdate = vi.fn().mockReturnThis()
    supabase.from.mockReturnValue(mockQueryBuilder({ update: mockUpdate }))
    await toggleImplanteAtivo(empresaId, "IMP-001", false)
    expect(mockUpdate).toHaveBeenCalledWith({ ativo: false })
  })

  it("removerImplante deleta e dispara evento", async () => {
    const { removerImplante } = await import("~/features/catalogo/services/implantes.service")
    const { supabase } = await import("~/core/supabase")
    const { dispararEventoModulo } = await import("~/core/services/webhooks")
    const mockDelete = vi.fn().mockReturnThis()
    supabase.from.mockReturnValue(mockQueryBuilder({ delete: mockDelete }))
    await removerImplante(empresaId, "IMP-001")
    expect(mockDelete).toHaveBeenCalled()
    expect(dispararEventoModulo).toHaveBeenCalledWith("catalogo", "produto.removido", { sku: "IMP-001", tipo: "implante", empresa_id: empresaId }, empresaId)
  })

  it("listarImplantesPorLinha filtra por linha", async () => {
    const { listarImplantesPorLinha } = await import("~/features/catalogo/services/implantes.service")
    const { supabase } = await import("~/core/supabase")
    const mockEq = vi.fn().mockReturnThis()
    supabase.from.mockReturnValue(mockQueryBuilder({ eq: mockEq }))
    await listarImplantesPorLinha(empresaId, "lin-1")
    expect(mockEq).toHaveBeenCalledWith("linha_id", "lin-1")
  })

  describe("Fresas", () => {
    it("listarFresas retorna array", async () => {
      const { listarFresas } = await import("~/features/catalogo/services/implantes.service")
      const { supabase } = await import("~/core/supabase")
      supabase.from.mockReturnValue(mockQueryBuilder({
        then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [{ sku: "FRE-001", nome: "Fresa Lança" }], error: null })),
      }))
      const result = await listarFresas(empresaId)
      expect(result).toHaveLength(1)
    })

    it("criarFresa insere com empresa_id", async () => {
      const { criarFresa } = await import("~/features/catalogo/services/implantes.service")
      const { supabase } = await import("~/core/supabase")
      const mockInsert = vi.fn().mockReturnThis()
      supabase.from.mockReturnValue(mockQueryBuilder({ insert: mockInsert, single: vi.fn().mockResolvedValue({ data: { sku: "FRE-001", nome: "Fresa" }, error: null }) }))
      await criarFresa(empresaId, { sku: "FRE-001", nome: "Fresa" })
      expect(mockInsert).toHaveBeenCalledWith({ empresa_id: empresaId, sku: "FRE-001", nome: "Fresa" })
    })
  })
})

// ========================
// COMPONENTES
// ========================
describe("Catalogo Services - Componentes", () => {
  beforeEach(() => vi.clearAllMocks())

  it("listarTiposReabilitacao retorna dados", async () => {
    const { listarTiposReabilitacao } = await import("~/features/catalogo/services/componentes.service")
    const { supabase } = await import("~/core/supabase")
    supabase.from.mockReturnValue(mockQueryBuilder({
      then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [{ id: "1", nome: "Carga Imediata" }], error: null })),
    }))
    const result = await listarTiposReabilitacao(empresaId)
    expect(result[0].nome).toBe("Carga Imediata")
  })

  it("criarTipoReabilitacao insere", async () => {
    const { criarTipoReabilitacao } = await import("~/features/catalogo/services/componentes.service")
    const { supabase } = await import("~/core/supabase")
    const mockInsert = vi.fn().mockReturnThis()
    supabase.from.mockReturnValue(mockQueryBuilder({ insert: mockInsert, single: vi.fn().mockResolvedValue({ data: { id: "tr-1", nome: "Carga Imediata" }, error: null }) }))
    await criarTipoReabilitacao(empresaId, "Carga Imediata")
    expect(mockInsert).toHaveBeenCalledWith({ empresa_id: empresaId, nome: "Carga Imediata" })
  })

  it("listarTiposAbutment retorna dados", async () => {
    const { listarTiposAbutment } = await import("~/features/catalogo/services/componentes.service")
    const { supabase } = await import("~/core/supabase")
    supabase.from.mockReturnValue(mockQueryBuilder({
      then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [{ id: "1", nome: "Cônico" }], error: null })),
    }))
    const result = await listarTiposAbutment(empresaId)
    expect(result[0].nome).toBe("Cônico")
  })

  it("listarAbutments retorna com relacoes", async () => {
    const { listarAbutments } = await import("~/features/catalogo/services/componentes.service")
    const { supabase } = await import("~/core/supabase")
    const mockData = [{ sku: "ABT-001", familia: { nome: "GMF" }, tipo_abutment: { nome: "Cônico" } }]
    supabase.from.mockReturnValue(mockQueryBuilder({
      then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: mockData, error: null })),
    }))
    const result = await listarAbutments(empresaId)
    expect(result[0].familia.nome).toBe("GMF")
  })

  it("criarAbutment dispara evento", async () => {
    const { criarAbutment } = await import("~/features/catalogo/services/componentes.service")
    const { supabase } = await import("~/core/supabase")
    const { dispararEventoModulo } = await import("~/core/services/webhooks")
    supabase.from.mockReturnValue(mockQueryBuilder({
      single: vi.fn().mockResolvedValue({ data: { sku: "ABT-001", familia_id: "fam-1" }, error: null }),
    }))
    await criarAbutment(empresaId, { sku: "ABT-001", familia_id: "fam-1", tipo_reabilitacao_id: "tr-1", tipo_abutment_id: "ta-1" })
    expect(dispararEventoModulo).toHaveBeenCalledWith("catalogo", "produto.criado", { sku: "ABT-001", tipo: "abutment", empresa_id: empresaId }, empresaId)
  })
})

// ========================
// KITS
// ========================
describe("Catalogo Services - Kits", () => {
  beforeEach(() => vi.clearAllMocks())

  it("listarKitsAtivos retorna apenas ativos", async () => {
    const { listarKitsAtivos } = await import("~/features/catalogo/services/kits.service")
    const { supabase } = await import("~/core/supabase")
    const mockEq = vi.fn().mockReturnThis()
    supabase.from.mockReturnValue(mockQueryBuilder({ eq: mockEq }))
    await listarKitsAtivos(empresaId)
    expect(mockEq).toHaveBeenCalledWith("ativo", true)
  })

  it("listarTodosKits retorna todos", async () => {
    const { listarTodosKits } = await import("~/features/catalogo/services/kits.service")
    const { supabase } = await import("~/core/supabase")
    supabase.from.mockReturnValue(mockQueryBuilder({
      then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [{ sku: "KIT-001", nome: "Kit Instalação" }], error: null })),
    }))
    const result = await listarTodosKits(empresaId)
    expect(result[0].nome).toBe("Kit Instalação")
  })

  it("criarKit insere com empresa_id e familias", async () => {
    const { criarKit } = await import("~/features/catalogo/services/kits.service")
    const { supabase } = await import("~/core/supabase")
    const mockInsert = vi.fn().mockReturnThis()
    supabase.from.mockReturnValue(mockQueryBuilder({
      insert: mockInsert,
      single: vi.fn().mockResolvedValue({ data: { sku: "KIT-001", nome: "Kit Teste" }, error: null }),
    }))
    await criarKit(empresaId, { sku: "KIT-001", categoria_id: "cat-1", nome: "Kit Teste", familia_ids: ["fam-1"] })
    expect(mockInsert).toHaveBeenCalledWith({ empresa_id: empresaId, sku: "KIT-001", categoria_id: "cat-1", nome: "Kit Teste" })
  })

  it("criarKit dispara evento", async () => {
    const { criarKit } = await import("~/features/catalogo/services/kits.service")
    const { supabase } = await import("~/core/supabase")
    const { dispararEventoModulo } = await import("~/core/services/webhooks")
    supabase.from.mockReturnValue(mockQueryBuilder({
      single: vi.fn().mockResolvedValue({ data: { sku: "KIT-001", nome: "Kit Teste" }, error: null }),
    }))
    await criarKit(empresaId, { sku: "KIT-001", categoria_id: "cat-1", nome: "Kit Teste" })
    expect(dispararEventoModulo).toHaveBeenCalledWith("catalogo", "produto.criado", { sku: "KIT-001", tipo: "kit", empresa_id: empresaId }, empresaId)
  })

  it("atualizarKit dispara evento", async () => {
    const { atualizarKit } = await import("~/features/catalogo/services/kits.service")
    const { supabase } = await import("~/core/supabase")
    const { dispararEventoModulo } = await import("~/core/services/webhooks")
    supabase.from.mockReturnValue(mockQueryBuilder({
      single: vi.fn().mockResolvedValue({ data: { sku: "KIT-001", nome: "Atualizado" }, error: null }),
    }))
    await atualizarKit(empresaId, "KIT-001", { nome: "Atualizado" })
    expect(dispararEventoModulo).toHaveBeenCalledWith("catalogo", "produto.atualizado", { sku: "KIT-001", tipo: "kit", empresa_id: empresaId }, empresaId)
  })

  it("removerKit deleta e dispara evento", async () => {
    const { removerKit } = await import("~/features/catalogo/services/kits.service")
    const { supabase } = await import("~/core/supabase")
    const { dispararEventoModulo } = await import("~/core/services/webhooks")
    supabase.from.mockReturnValue(mockQueryBuilder())
    await removerKit(empresaId, "KIT-001")
    expect(dispararEventoModulo).toHaveBeenCalledWith("catalogo", "produto.removido", { sku: "KIT-001", tipo: "kit", empresa_id: empresaId }, empresaId)
  })

  it("resolveBOMItem retorna item valido", async () => {
    const { resolveBOMItem } = await import("~/features/catalogo/services/kits.service")
    const row = { fresa_sku: "FRE-001", quantidade: 2, fresa: { nome: "Fresa Lança" } } as any
    const result = resolveBOMItem(row)
    expect(result).toEqual({ tipo: "fresa", sku: "FRE-001", nome: "Fresa Lança", quantidade: 2 })
  })

  it("resolveBOMItem retorna null para linha vazia", async () => {
    const { resolveBOMItem } = await import("~/features/catalogo/services/kits.service")
    const result = resolveBOMItem({} as any)
    expect(result).toBeNull()
  })
})

// ========================
// ACESSORIOS
// ========================
describe("Catalogo Services - Acessorios", () => {
  beforeEach(() => vi.clearAllMocks())

  it("listarCategoriasAcessorio retorna dados", async () => {
    const { listarCategoriasAcessorio } = await import("~/features/catalogo/services/acessorios.service")
    const { supabase } = await import("~/core/supabase")
    supabase.from.mockReturnValue(mockQueryBuilder({
      then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [{ id: "1", nome: "Parafusos" }], error: null })),
    }))
    const result = await listarCategoriasAcessorio(empresaId)
    expect(result[0].nome).toBe("Parafusos")
  })

  it("listarAcessorios retorna dados", async () => {
    const { listarAcessorios } = await import("~/features/catalogo/services/acessorios.service")
    const { supabase } = await import("~/core/supabase")
    supabase.from.mockReturnValue(mockQueryBuilder({
      then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [{ sku: "ACE-001", nome: "Parafuso Cobertura" }], error: null })),
    }))
    const result = await listarAcessorios(empresaId)
    expect(result[0].nome).toBe("Parafuso Cobertura")
  })

  it("listarChavesFerramental retorna dados", async () => {
    const { listarChavesFerramental } = await import("~/features/catalogo/services/acessorios.service")
    const { supabase } = await import("~/core/supabase")
    supabase.from.mockReturnValue(mockQueryBuilder({
      then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [{ sku: "CH-001", nome: "Chave Hex" }], error: null })),
    }))
    const result = await listarChavesFerramental(empresaId)
    expect(result[0].nome).toBe("Chave Hex")
  })
})

// ========================
// WORKFLOWS
// ========================
describe("Catalogo Services - Workflows", () => {
  beforeEach(() => vi.clearAllMocks())

  it("listarWorkflows retorna dados", async () => {
    const { listarWorkflows } = await import("~/features/catalogo/services/workflows.service")
    const { supabase } = await import("~/core/supabase")
    supabase.from.mockReturnValue(mockQueryBuilder({
      then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [{ id: "1", nome: "Protocolo Convencional" }], error: null })),
    }))
    const result = await listarWorkflows(empresaId)
    expect(result[0].nome).toBe("Protocolo Convencional")
  })

  it("listarEtapas retorna ordenadas", async () => {
    const { listarEtapas } = await import("~/features/catalogo/services/workflows.service")
    const { supabase } = await import("~/core/supabase")
    supabase.from.mockReturnValue(mockQueryBuilder({
      then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [{ id: "1", nome: "Etapa 1", ordem: 1 }], error: null })),
    }))
    const result = await listarEtapas(empresaId)
    expect(result[0].ordem).toBe(1)
  })

  it("listarGuias retorna filtradas", async () => {
    const { listarGuias } = await import("~/features/catalogo/services/workflows.service")
    const { supabase } = await import("~/core/supabase")
    supabase.from.mockReturnValue(mockQueryBuilder({
      then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [{ id: "1", nome: "Guia Reab" }], error: null })),
    }))
    const result = await listarGuias(empresaId)
    expect(result[0].nome).toBe("Guia Reab")
  })
})

// ========================
// CUPONS
// ========================
describe("Catalogo Services - Cupons", () => {
  beforeEach(() => vi.clearAllMocks())

  it("listarCupons retorna dados", async () => {
    const { listarCupons } = await import("~/features/catalogo/services/cupons.service")
    const { supabase } = await import("~/core/supabase")
    supabase.from.mockReturnValue(mockQueryBuilder({
      then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [{ id: "1", codigo: "DESC10" }], error: null })),
    }))
    const result = await listarCupons(empresaId)
    expect(result[0].codigo).toBe("DESC10")
  })
})

// ========================
// FRETE
// ========================
describe("Catalogo Services - Frete", () => {
  beforeEach(() => vi.clearAllMocks())

  it("listarFretes retorna dados", async () => {
    const { listarFretes } = await import("~/features/catalogo/services/frete.service")
    const { supabase } = await import("~/core/supabase")
    supabase.from.mockReturnValue(mockQueryBuilder({
      then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [{ id: "1", cep_inicio: "01000" }], error: null })),
    }))
    const result = await listarFretes(empresaId)
    expect(result[0].cep_inicio).toBe("01000")
  })
})

// ========================
// PROMOCIONAIS
// ========================
describe("Catalogo Services - Promocionais", () => {
  beforeEach(() => vi.clearAllMocks())

  it("listarPromocionais retorna dados", async () => {
    const { listarPromocionais } = await import("~/features/catalogo/services/promocionais.service")
    const { supabase } = await import("~/core/supabase")
    supabase.from.mockReturnValue(mockQueryBuilder({
      then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [{ id: "1", nome: "Promoção Verão" }], error: null })),
    }))
    const result = await listarPromocionais(empresaId)
    expect(result[0].nome).toBe("Promoção Verão")
  })

  it("listarPromocionaisAtivos filtra ativos", async () => {
    const { listarPromocionaisAtivos } = await import("~/features/catalogo/services/promocionais.service")
    const { supabase } = await import("~/core/supabase")
    const mockEq = vi.fn().mockReturnThis()
    supabase.from.mockReturnValue(mockQueryBuilder({ eq: mockEq }))
    await listarPromocionaisAtivos(empresaId)
    expect(mockEq).toHaveBeenCalledWith("ativo", true)
  })
})
