import { supabase } from "~/lib/supabase"
import { EMPRESA_ID } from "~/config/empresa"
import type {
  CatalogoOrcamento,
  CatalogoOrcamentoInput,
  StatusOrcamento,
} from "../types/orcamentos"
import { dispararEventoModulo } from "~/core/services/webhooks"

const MODULO_KEY = "catalogo"

// ============================================================
// CRUD Orçamentos
// ============================================================

export async function listarOrcamentos(
  EMPRESA_ID: string,
  filters?: { status?: StatusOrcamento; colaborador_id?: string; search?: string },
): Promise<CatalogoOrcamento[]> {
  let query = supabase
    .from("catalogo_orcamentos")
    .select("*, itens:catalogo_orcamento_itens(*), colaborador:profiles(id, nome, email)")
    .eq("empresa_id", EMPRESA_ID)
    .order("created_at", { ascending: false })

  if (filters?.status) query = query.eq("status", filters.status)
  if (filters?.colaborador_id) query = query.eq("colaborador_id", filters.colaborador_id)
  if (filters?.search) {
    query = query.or(
      `cliente_nome.ilike.%${filters.search}%,cliente_email.ilike.%${filters.search}%`,
    )
  }

  const { data, error } = await query
  if (error) throw error
  return data as CatalogoOrcamento[]
}

export async function listarOrcamentosColaborador(
  EMPRESA_ID: string,
  colaboradorId: string,
): Promise<CatalogoOrcamento[]> {
  const { data, error } = await supabase
    .from("catalogo_orcamentos")
    .select("*, itens:catalogo_orcamento_itens(*)")
    .eq("empresa_id", EMPRESA_ID)
    .eq("colaborador_id", colaboradorId)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data as CatalogoOrcamento[]
}

export async function buscarOrcamento(id: string): Promise<CatalogoOrcamento | null> {
  const { data, error } = await supabase
    .from("catalogo_orcamentos")
    .select("*, itens:catalogo_orcamento_itens(*), colaborador:profiles(id, nome, email)")
    .eq("id", id)
    .single()
  if (error) return null
  return data as CatalogoOrcamento
}

export async function buscarOrcamentoPorToken(token: string): Promise<CatalogoOrcamento | null> {
  const { data, error } = await supabase
    .from("catalogo_orcamentos")
    .select("*, itens:catalogo_orcamento_itens(*)")
    .eq("token_acesso", token)
    .single()
  if (error) return null
  return data as CatalogoOrcamento
}

export async function criarOrcamento(
  EMPRESA_ID: string,
  colaboradorId: string,
  input: CatalogoOrcamentoInput,
): Promise<CatalogoOrcamento> {
  // Calcula totais
  const valorSubtotal = input.itens.reduce(
    (acc, item) => acc + item.preco_unitario * item.quantidade,
    0,
  )

  // Busca dados do cliente se tem cliente_id
  let clienteNome = input.cliente_nome ?? null
  let clienteEmail = input.cliente_email ?? null
  let clienteTelefone = input.cliente_telefone ?? null

  if (input.cliente_id && !clienteNome) {
    const { data: cliente } = await supabase
      .from("catalogo_clientes")
      .select("nome, email, telefone")
      .eq("id", input.cliente_id)
      .single()
    if (cliente) {
      clienteNome = cliente.nome
      clienteEmail = cliente.email
      clienteTelefone = cliente.telefone
    }
  }

  const { data: orcamento, error: orcError } = await supabase
    .from("catalogo_orcamentos")
    .insert({
      empresa_id: EMPRESA_ID,
      colaborador_id: colaboradorId,
      cliente_id: input.cliente_id ?? null,
      cliente_nome: clienteNome,
      cliente_email: clienteEmail,
      cliente_telefone: clienteTelefone,
      validade_dias: input.validade_dias ?? 7,
      observacoes: input.observacoes ?? null,
      valor_subtotal: valorSubtotal,
      valor_desconto: 0,
      valor_total: valorSubtotal,
    })
    .select()
    .single()
  if (orcError) throw orcError

  // Insere itens
  if (input.itens.length > 0) {
    const itensRows = input.itens.map((item) => ({
      empresa_id: EMPRESA_ID,
      orcamento_id: orcamento.id,
      produto_sku: item.produto_sku,
      produto_tipo: item.produto_tipo,
      produto_nome: item.produto_nome,
      quantidade: item.quantidade,
      preco_unitario: item.preco_unitario,
    }))
    const { error: itensError } = await supabase
      .from("catalogo_orcamento_itens")
      .insert(itensRows)
    if (itensError) throw itensError
  }

  dispararEventoModulo(MODULO_KEY, "orcamento.criado", {
    orcamento_id: orcamento.id,
    empresa_id: EMPRESA_ID,
    colaborador_id: colaboradorId,
  }).catch(() => {})

  return buscarOrcamento(orcamento.id) as Promise<CatalogoOrcamento>
}

export async function atualizarStatusOrcamento(
  id: string,
  status: StatusOrcamento,
  EMPRESA_ID?: string,
): Promise<CatalogoOrcamento> {
  const updates: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  }
  if (status === "aprovado") {
    updates.aprovado_em = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from("catalogo_orcamentos")
    .update(updates)
    .eq("id", id)
    .select()
    .single()
  if (error) throw error

  const eventoKey = `orcamento.${status}` as const
  dispararEventoModulo(MODULO_KEY, eventoKey, {
    orcamento_id: id,
    empresa_id: EMPRESA_ID ?? data.empresa_id,
  }).catch(() => {})

  return data as CatalogoOrcamento
}

export async function deletarOrcamento(id: string): Promise<void> {
  const { error } = await supabase
    .from("catalogo_orcamentos")
    .delete()
    .eq("id", id)
  if (error) throw error
}

// ============================================================
// Conversão de Orçamento em Pedido
// ============================================================

export async function converterEmPedido(
  orcamentoId: string,
): Promise<string> {
  const orcamento = await buscarOrcamento(orcamentoId)
  if (!orcamento || !orcamento.itens) throw new Error("Orçamento não encontrado")

  if (orcamento.status !== "aprovado") {
    throw new Error("Apenas orçamentos aprovados podem ser convertidos em pedido")
  }

  // Cria pedido
  const { data: pedido, error: pedError } = await supabase
    .from("catalogo_pedidos")
    .insert({
      empresa_id: orcamento.empresa_id,
      cliente_id: orcamento.cliente_id,
      orcamento_id: orcamento.id,
      colaborador_id: orcamento.colaborador_id,
      status: "pendente",
      valor_subtotal: orcamento.valor_subtotal,
      valor_desconto: orcamento.valor_desconto,
      valor_total: orcamento.valor_total,
      cliente_nome: orcamento.cliente_nome,
      cliente_email: orcamento.cliente_email,
      cliente_telefone: orcamento.cliente_telefone,
    })
    .select()
    .single()
  if (pedError) throw pedError

  // Copia itens
  const itensRows = orcamento.itens.map((item) => ({
    empresa_id: orcamento.empresa_id,
    pedido_id: pedido.id,
    produto_sku: item.produto_sku,
    produto_tipo: item.produto_tipo,
    produto_nome: item.produto_nome,
    quantidade: item.quantidade,
    preco_unitario: item.preco_unitario,
  }))
  const { error: itensError } = await supabase
    .from("catalogo_pedido_itens")
    .insert(itensRows)
  if (itensError) throw itensError

  // Atualiza status do orçamento
  await atualizarStatusOrcamento(orcamentoId, "pedido", orcamento.empresa_id)

  dispararEventoModulo(MODULO_KEY, "orcamento.pedido_criado", {
    orcamento_id: orcamentoId,
    pedido_id: pedido.id,
    empresa_id: orcamento.empresa_id,
  }).catch(() => {})

  return pedido.id
}
