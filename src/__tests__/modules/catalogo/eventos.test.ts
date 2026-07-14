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

function mockSingleResolve(data: unknown) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data, error: null }),
    then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [], error: null })),
  }
}

describe("Catalogo - Eventos da Central de Acoes", () => {
  beforeEach(() => vi.clearAllMocks())

  describe("Implantes", () => {
    it("criarImplante dispara 'produto.criado'", async () => {
      const { criarImplante } = await import("~/features/catalogo/services/implantes.service")
      const { supabase } = await import("~/core/supabase")
      const { dispararEventoModulo } = await import("~/core/services/webhooks")
      supabase.from.mockReturnValue(mockSingleResolve({ sku: "IMP-001", linha_id: "lin-1", diametro_mm: 4, comprimento_mm: 10 }))
      await criarImplante(empresaId, { sku: "IMP-001", linha_id: "lin-1", diametro_mm: 4, comprimento_mm: 10 })
      expect(dispararEventoModulo).toHaveBeenCalledWith(
        "catalogo", "produto.criado",
        { sku: "IMP-001", tipo: "implante", empresa_id: empresaId },
        empresaId,
      )
    })

    it("atualizarImplante dispara 'produto.atualizado'", async () => {
      const { atualizarImplante } = await import("~/features/catalogo/services/implantes.service")
      const { supabase } = await import("~/core/supabase")
      const { dispararEventoModulo } = await import("~/core/services/webhooks")
      supabase.from.mockReturnValue(mockSingleResolve({ sku: "IMP-001" }))
      await atualizarImplante(empresaId, "IMP-001", { diametro_mm: 5 })
      expect(dispararEventoModulo).toHaveBeenCalledWith(
        "catalogo", "produto.atualizado",
        { sku: "IMP-001", tipo: "implante", empresa_id: empresaId },
        empresaId,
      )
    })

    it("removerImplante dispara 'produto.removido'", async () => {
      const { removerImplante } = await import("~/features/catalogo/services/implantes.service")
      const { supabase } = await import("~/core/supabase")
      const { dispararEventoModulo } = await import("~/core/services/webhooks")
      supabase.from.mockReturnValue({ delete: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() })
      await removerImplante(empresaId, "IMP-001")
      expect(dispararEventoModulo).toHaveBeenCalledWith(
        "catalogo", "produto.removido",
        { sku: "IMP-001", tipo: "implante", empresa_id: empresaId },
        empresaId,
      )
    })
  })

  describe("Abutments (Componentes)", () => {
    it("criarAbutment dispara 'produto.criado'", async () => {
      const { criarAbutment } = await import("~/features/catalogo/services/componentes.service")
      const { supabase } = await import("~/core/supabase")
      const { dispararEventoModulo } = await import("~/core/services/webhooks")
      supabase.from.mockReturnValue(mockSingleResolve({ sku: "ABT-001" }))
      await criarAbutment(empresaId, { sku: "ABT-001", familia_id: "fam-1", tipo_reabilitacao_id: "tr-1", tipo_abutment_id: "ta-1" })
      expect(dispararEventoModulo).toHaveBeenCalledWith(
        "catalogo", "produto.criado",
        { sku: "ABT-001", tipo: "abutment", empresa_id: empresaId },
        empresaId,
      )
    })

    it("atualizarAbutment dispara 'produto.atualizado'", async () => {
      const { atualizarAbutment } = await import("~/features/catalogo/services/componentes.service")
      const { supabase } = await import("~/core/supabase")
      const { dispararEventoModulo } = await import("~/core/services/webhooks")
      supabase.from.mockReturnValue(mockSingleResolve({ sku: "ABT-001" }))
      await atualizarAbutment(empresaId, "ABT-001", { altura_corpo: 5 })
      expect(dispararEventoModulo).toHaveBeenCalledWith(
        "catalogo", "produto.atualizado",
        { sku: "ABT-001", tipo: "abutment", empresa_id: empresaId },
        empresaId,
      )
    })

    it("removerAbutment dispara 'produto.removido'", async () => {
      const { removerAbutment } = await import("~/features/catalogo/services/componentes.service")
      const { supabase } = await import("~/core/supabase")
      const { dispararEventoModulo } = await import("~/core/services/webhooks")
      supabase.from.mockReturnValue({ delete: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() })
      await removerAbutment(empresaId, "ABT-001")
      expect(dispararEventoModulo).toHaveBeenCalledWith(
        "catalogo", "produto.removido",
        { sku: "ABT-001", tipo: "abutment", empresa_id: empresaId },
        empresaId,
      )
    })
  })

  describe("Kits", () => {
    it("criarKit dispara 'produto.criado'", async () => {
      const { criarKit } = await import("~/features/catalogo/services/kits.service")
      const { supabase } = await import("~/core/supabase")
      const { dispararEventoModulo } = await import("~/core/services/webhooks")
      supabase.from.mockReturnValue(mockSingleResolve({ sku: "KIT-001" }))
      await criarKit(empresaId, { sku: "KIT-001", categoria_id: "cat-1", nome: "Kit Teste" })
      expect(dispararEventoModulo).toHaveBeenCalledWith(
        "catalogo", "produto.criado",
        { sku: "KIT-001", tipo: "kit", empresa_id: empresaId },
        empresaId,
      )
    })

    it("atualizarKit dispara 'produto.atualizado'", async () => {
      const { atualizarKit } = await import("~/features/catalogo/services/kits.service")
      const { supabase } = await import("~/core/supabase")
      const { dispararEventoModulo } = await import("~/core/services/webhooks")
      supabase.from.mockReturnValue(mockSingleResolve({ sku: "KIT-001" }))
      await atualizarKit(empresaId, "KIT-001", { nome: "Atualizado" })
      expect(dispararEventoModulo).toHaveBeenCalledWith(
        "catalogo", "produto.atualizado",
        { sku: "KIT-001", tipo: "kit", empresa_id: empresaId },
        empresaId,
      )
    })

    it("removerKit dispara 'produto.removido'", async () => {
      const { removerKit } = await import("~/features/catalogo/services/kits.service")
      const { supabase } = await import("~/core/supabase")
      const { dispararEventoModulo } = await import("~/core/services/webhooks")
      supabase.from.mockReturnValue({ delete: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() })
      await removerKit(empresaId, "KIT-001")
      expect(dispararEventoModulo).toHaveBeenCalledWith(
        "catalogo", "produto.removido",
        { sku: "KIT-001", tipo: "kit", empresa_id: empresaId },
        empresaId,
      )
    })
  })

  describe("Payload dos eventos inclui empresa_id", () => {
    it("payload do evento produto.criado contem empresa_id", async () => {
      const { criarImplante } = await import("~/features/catalogo/services/implantes.service")
      const { supabase } = await import("~/core/supabase")
      const { dispararEventoModulo } = await import("~/core/services/webhooks")
      supabase.from.mockReturnValue(mockSingleResolve({ sku: "IMP-001" }))
      await criarImplante(empresaId, { sku: "IMP-001", linha_id: "lin-1", diametro_mm: 4, comprimento_mm: 10 })
      const payload = dispararEventoModulo.mock.calls[0][2]
      expect(payload).toHaveProperty("empresa_id", empresaId)
    })

    it("payload do evento produto.removido contem empresa_id", async () => {
      const { removerImplante } = await import("~/features/catalogo/services/implantes.service")
      const { supabase } = await import("~/core/supabase")
      const { dispararEventoModulo } = await import("~/core/services/webhooks")
      supabase.from.mockReturnValue({ delete: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() })
      await removerImplante(empresaId, "IMP-001")
      const payload = dispararEventoModulo.mock.calls[0][2]
      expect(payload).toHaveProperty("empresa_id", empresaId)
    })
  })

  describe("Eventos sao fire-and-forget (.catch(() => {}))", () => {
    it("erro no disparo do evento nao propaga para o chamador", async () => {
      const { removerImplante } = await import("~/features/catalogo/services/implantes.service")
      const { supabase } = await import("~/core/supabase")
      const { dispararEventoModulo } = await import("~/core/services/webhooks")
      dispararEventoModulo.mockRejectedValue(new Error("Webhook error"))
      supabase.from.mockReturnValue({ delete: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() })
      await expect(removerImplante(empresaId, "IMP-001")).resolves.not.toThrow()
    })
  })
})
