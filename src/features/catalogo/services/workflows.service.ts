import { supabase } from "~/core/supabase"
import type { CatalogoWorkflow, CatalogoEtapaWorkflow, CatalogoGuiaReabilitacao } from "../types"

// Workflows
export async function listarWorkflows(empresaId: string): Promise<CatalogoWorkflow[]> {
  try {
    const { data, error } = await supabase
      .from("catalogo_workflows")
      .select("*")
      .eq("empresa_id", empresaId)
      .order("nome")
    if (error) throw error
    return (data as CatalogoWorkflow[]) ?? []
  } catch {
    // Tabela pode não existir — retornar vazio (mocks removidos para evitar toggles em IDs falsos)
    return []
  }
}

export async function criarWorkflow(empresaId: string, nome: string): Promise<CatalogoWorkflow> {
  const { data, error } = await supabase
    .from("catalogo_workflows")
    .insert({ empresa_id: empresaId, nome })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoWorkflow
}

export async function toggleWorkflowAtivo(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_workflows").update({ ativo }).eq("id", id)
  if (error) throw error
}

export async function removerWorkflow(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_workflows").delete().eq("id", id)
  if (error) throw error
}

// Etapas
export async function listarEtapas(empresaId: string): Promise<CatalogoEtapaWorkflow[]> {
  try {
    const { data, error } = await supabase
      .from("catalogo_etapas_workflow")
      .select("*")
      .eq("empresa_id", empresaId)
      .order("ordem")
    if (error) throw error
    return (data as CatalogoEtapaWorkflow[]) ?? []
  } catch {
    // Tabela pode não existir — retornar vazio
    return []
  }
}

export async function criarEtapa(empresaId: string, input: { ordem: number; nome: string }): Promise<CatalogoEtapaWorkflow> {
  const { data, error } = await supabase
    .from("catalogo_etapas_workflow")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoEtapaWorkflow
}

export async function toggleEtapaAtivo(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_etapas_workflow").update({ ativo }).eq("id", id)
  if (error) throw error
}

export async function removerEtapa(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_etapas_workflow").delete().eq("id", id)
  if (error) throw error
}

// Guias de Reabilitação
export async function listarGuias(empresaId: string, filters?: { familia_id?: string; workflow_id?: string }): Promise<CatalogoGuiaReabilitacao[]> {
  try {
    let query = supabase
      .from("catalogo_guias_reabilitacao")
      .select(`
        *,
        familia:catalogo_familias(*),
        tipo_abutment:catalogo_tipos_abutment(*),
        workflow:catalogo_workflows(*),
        etapa:catalogo_etapas_workflow(*),
        acessorio:catalogo_acessorios(*, categoria:catalogo_categorias_acessorio(*))
      `)
      .eq("empresa_id", empresaId)
      .order("etapa:catalogo_etapas_workflow(ordem)")
    if (filters?.familia_id) query = query.eq("familia_id", filters.familia_id)
    if (filters?.workflow_id) query = query.eq("workflow_id", filters.workflow_id)
    const { data, error } = await query
    if (error) throw error
    return (data as CatalogoGuiaReabilitacao[]) ?? []
  } catch {
    // Tabela pode não existir — retornar vazio
    return []
  }
}

export async function criarGuia(empresaId: string, input: {
  familia_id: string
  tipo_abutment_id: string
  diametro_plataforma: string
  workflow_id: string
  etapa_id: string
  acessorio_sku: string
}): Promise<CatalogoGuiaReabilitacao> {
  const { data, error } = await supabase
    .from("catalogo_guias_reabilitacao")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoGuiaReabilitacao
}

export async function removerGuia(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_guias_reabilitacao").delete().eq("id", id)
  if (error) throw error
}

export async function getWorkflowDetalhe(empresaId: string, workflowId: string): Promise<{
  workflow: CatalogoWorkflow
  etapas: (CatalogoEtapaWorkflow & { guias: CatalogoGuiaReabilitacao[] })[]
} | null> {
  const { data: workflow, error: wErr } = await supabase
    .from("catalogo_workflows")
    .select("*")
    .eq("id", workflowId)
    .single()
  if (wErr) throw wErr

  const etapas = await listarEtapas(empresaId)
  const guias = await listarGuias(empresaId, { workflow_id: workflowId })

  const etapasComGuias = etapas.map((etapa) => ({
    ...etapa,
    guias: guias.filter((g) => g.etapa_id === etapa.id),
  }))

  return { workflow: workflow as CatalogoWorkflow, etapas: etapasComGuias }
}
