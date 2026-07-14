import { describe, it, expect, beforeEach, vi } from "vitest"

async function loadCarrinho() {
  vi.resetModules()
  return await import("~/features/catalogo/services/carrinho.service")
}

function item(sku: string, preco = 100) {
  return { sku, nome: `Prod ${sku}`, tipo: "implante" as const, cor: "#ffffff", preco }
}

const key = (e: string | null, u: string | null) =>
  `conexao_cart_v1_${e ?? "anon"}_${u ?? "anon"}`

describe("carrinho multi-tenant: isolamento por empresa e usuário", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("não escreve mais na chave fixa antiga (conexao_cart_v1)", async () => {
    const m = await loadCarrinho()
    m.setCarrinhoScope("empresaA", "user1")
    m.addToCart(item("SKU1"))
    expect(localStorage.getItem("conexao_cart_v1")).toBeNull()
  })

  it("empresas diferentes com mesmo usuário mantêm carrinhos isolados", async () => {
    const m = await loadCarrinho()

    m.setCarrinhoScope("empresaA", "user1")
    m.addToCart(item("SKU1"))
    expect(JSON.parse(localStorage.getItem(key("empresaA", "user1"))!)[0].sku).toBe("SKU1")

    // troca de empresa: a da empresa B deve estar vazia
    m.setCarrinhoScope("empresaB", "user1")
    expect(localStorage.getItem(key("empresaB", "user1"))).toBeNull()

    // volta para A: o item persiste e é recarregado
    m.setCarrinhoScope("empresaA", "user1")
    expect(JSON.parse(localStorage.getItem(key("empresaA", "user1"))!)[0].sku).toBe("SKU1")
  })

  it("usuários diferentes na mesma empresa têm carrinhos distintos", async () => {
    const m = await loadCarrinho()

    m.setCarrinhoScope("empresaA", "user1")
    m.addToCart(item("SKU1"))

    m.setCarrinhoScope("empresaA", "user2")
    m.addToCart(item("SKU2"))

    expect(JSON.parse(localStorage.getItem(key("empresaA", "user1"))!)[0].sku).toBe("SKU1")
    expect(JSON.parse(localStorage.getItem(key("empresaA", "user2"))!)[0].sku).toBe("SKU2")

    // volta para user1: item dele continua isolado
    m.setCarrinhoScope("empresaA", "user1")
    expect(JSON.parse(localStorage.getItem(key("empresaA", "user1"))!)[0].sku).toBe("SKU1")
  })

  it("add/remove/quantidade afetam apenas o escopo atual", async () => {
    const m = await loadCarrinho()

    m.setCarrinhoScope("empresaA", "user1")
    m.addToCart(item("SKU1", 100))
    m.addToCart(item("SKU1", 100)) // soma -> quantidade 2
    m.setQuantidade("SKU1", 5)
    let itens = JSON.parse(localStorage.getItem(key("empresaA", "user1"))!)
    expect(itens[0].quantidade).toBe(5)

    const { qtd, total } = m.cartTotais(itens)
    expect(qtd).toBe(5)
    expect(total).toBe(500)

    m.removeFromCart("SKU1")
    expect(localStorage.getItem(key("empresaA", "user1"))).toBe("[]")
  })

  it("escopo com usuário não logado (anon) não vaza para usuário logado", async () => {
    const m = await loadCarrinho()

    m.setCarrinhoScope("empresaA", null)
    m.addToCart(item("SKU_GUEST"))

    m.setCarrinhoScope("empresaA", "user1")
    expect(localStorage.getItem(key("empresaA", "user1"))).toBeNull()

    m.setCarrinhoScope("empresaA", null)
    expect(JSON.parse(localStorage.getItem(key("empresaA", null))!)[0].sku).toBe("SKU_GUEST")
  })
})
