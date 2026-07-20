import { useSyncExternalStore } from "react"
import type { CartItem, ProductSheetTipo } from "../types"

const STORAGE_PREFIX = "conexao_cart_v1"

let scopeUserId: string | null = null
let items: CartItem[] = []
let listeners: Array<() => void> = []

function scopeKey(userId: string | null): string {
  const u = userId ?? "anon"
  return `${STORAGE_PREFIX}_${u}`
}

function storageKey(): string {
  return scopeKey(scopeUserId)
}

function loadFromStorage(): void {
  if (typeof window === "undefined") return
  try {
    const raw = localStorage.getItem(storageKey())
    items = raw ? JSON.parse(raw) : []
  } catch {
    items = []
  }
}

function persist(): void {
  if (typeof window === "undefined") return
  items = [...items]
  try {
    localStorage.setItem(storageKey(), JSON.stringify(items))
  } catch {
    // ignora falhas de escrita (quota/modo privado)
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void): () => void {
  listeners.push(listener)
  return () => { listeners = listeners.filter((l) => l !== listener) }
}

function getSnapshot(): CartItem[] {
  return items
}

/**
 * Define o escopo do carrinho (usuário) e carrega o carrinho
 * persistido para esse escopo..
 */
export function setCarrinhoScope(userId: string | null): void {
  if (scopeUserId === userId) return

  // Persiste o carrinho atual no escopo antigo antes de trocar
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(storageKey(), JSON.stringify(items))
    } catch {
      // ignora
    }
  }

  scopeUserId = userId
  loadFromStorage()
  listeners.forEach((l) => l())
}

export function useCarrinho(): CartItem[] {
  return useSyncExternalStore(subscribe, getSnapshot)
}

export function addToCart(item: Omit<CartItem, "quantidade"> & { quantidade?: number }): void {
  const existing = items.find((i) => i.sku === item.sku)
  if (existing) {
    existing.quantidade += item.quantidade ?? 1
  } else {
    items.push({ ...item, quantidade: item.quantidade ?? 1 })
  }
  persist()
}

export function removeFromCart(sku: string): void {
  items = items.filter((i) => i.sku !== sku)
  persist()
}

export function setQuantidade(sku: string, quantidade: number): void {
  if (quantidade <= 0) {
    removeFromCart(sku)
    return
  }
  const item = items.find((i) => i.sku === sku)
  if (item) {
    item.quantidade = quantidade
    persist()
  }
}

export function clearCart(): void {
  items = []
  persist()
}

export function cartTotais(list: CartItem[]): { qtd: number; total: number } {
  return list.reduce(
    (acc, item) => ({ qtd: acc.qtd + item.quantidade, total: acc.total + item.preco * item.quantidade }),
    { qtd: 0, total: 0 },
  )
}

export function resolveBOMItem(row: { fresa_sku?: string | null; chave_sku?: string | null; acessorio_sku?: string | null; instrumental_sku?: string | null; implante_sku?: string | null; fresa?: { nome?: string; preco?: number } | null; chave?: { nome?: string; preco?: number } | null; acessorio?: { nome?: string; preco?: number } | null; instrumental?: { nome?: string; preco?: number } | null; implante?: { diametro_mm?: number; comprimento_mm?: number; preco?: number } | null; quantidade?: number }): { tipo: string; sku: string; nome: string; quantidade: number; preco?: number } | null {
  const checks: [string, string | null | undefined, string | undefined, number | undefined][] = [
    ["fresa", row.fresa_sku, row.fresa?.nome, row.fresa?.preco],
    ["chave", row.chave_sku, row.chave?.nome, row.chave?.preco],
    ["acessorio", row.acessorio_sku, row.acessorio?.nome, row.acessorio?.preco],
    ["instrumental", row.instrumental_sku, row.instrumental?.nome, row.instrumental?.preco],
    ["implante", row.implante_sku, row.implante ? `${row.implante.diametro_mm}×${row.implante.comprimento_mm}mm` : undefined, row.implante?.preco],
  ]
  for (const [tipo, sku, nome, preco] of checks) {
    if (sku) return { tipo, sku, nome: nome ?? sku, quantidade: row.quantidade ?? 1, preco }
  }
  return null
}

export function formatBRL(v: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
}

const PRECO_BASE: Record<ProductSheetTipo, number> = {
  implante: 480,
  abutment: 220,
  kit: 3200,
  fresa: 85,
  chave: 120,
  acessorio: 95,
  instrumental: 150,
  promocional: 0,
}

function hashSku(sku: string): number {
  let h = 0
  for (let i = 0; i < sku.length; i++) h = ((h << 5) - h + sku.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function mockPreco(tipo: ProductSheetTipo, sku: string): number {
  const base = PRECO_BASE[tipo]
  if (tipo === "promocional") return 0
  const variation = ((hashSku(sku) % 41) - 20) / 100
  return Math.round(base * (1 + variation) * 100) / 100
}

export function getPrecoFromDB(preco: number | null | undefined, tipo: ProductSheetTipo, sku: string): number {
  if (preco && preco > 0) return preco
  return mockPreco(tipo, sku)
}
