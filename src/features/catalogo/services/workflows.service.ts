import { supabase } from "~/core/supabase"
import type { CatalogoWorkflow, CatalogoEtapaWorkflow, CatalogoGuiaReabilitacao } from "../types"

const MOCK_WORKFLOWS: CatalogoWorkflow[] = [
  { id: "wf-analogico", empresa_id: "", nome: "Analógico Gesso", created_at: "", updated_at: "" },
  { id: "wf-digital", empresa_id: "", nome: "Scan Digital inLego", created_at: "", updated_at: "" },
]

const MOCK_ETAPAS: CatalogoEtapaWorkflow[] = [
  { id: "et-1", empresa_id: "", ordem: 1, nome: "Cicatrização", created_at: "", updated_at: "" },
  { id: "et-2", empresa_id: "", ordem: 2, nome: "Transferência", created_at: "", updated_at: "" },
  { id: "et-4", empresa_id: "", ordem: 4, nome: "Parafusamento", created_at: "", updated_at: "" },
]

const MOCK_GUIAS: CatalogoGuiaReabilitacao[] = [
  // Analógico Gesso
  { id: "g1", empresa_id: "", familia_id: "", tipo_abutment_id: "", diametro_plataforma: "", workflow_id: "wf-analogico", etapa_id: "et-1", acessorio_sku: "124220", created_at: "", acessorio: { sku: "124220", nome: "Healing Cap NP 4.5x4.0", created_at: "" } as any },
  { id: "g2", empresa_id: "", familia_id: "", tipo_abutment_id: "", diametro_plataforma: "", workflow_id: "wf-analogico", etapa_id: "et-2", acessorio_sku: "820011", created_at: "", acessorio: { sku: "820011", nome: "Transfer NP Fechado", created_at: "" } as any },
  { id: "g3", empresa_id: "", familia_id: "", tipo_abutment_id: "", diametro_plataforma: "", workflow_id: "wf-analogico", etapa_id: "et-4", acessorio_sku: "710055", created_at: "", acessorio: { sku: "710055", nome: "Parafuso Protético NP", created_at: "" } as any },
  // Scan Digital inLego
  { id: "g4", empresa_id: "", familia_id: "", tipo_abutment_id: "", diametro_plataforma: "", workflow_id: "wf-digital", etapa_id: "et-1", acessorio_sku: "124215", created_at: "", acessorio: { sku: "124215", nome: "Healing Cap NP 4.5x2.5", created_at: "" } as any },
  { id: "g5", empresa_id: "", familia_id: "", tipo_abutment_id: "", diametro_plataforma: "", workflow_id: "wf-digital", etapa_id: "et-2", acessorio_sku: "957310", created_at: "", acessorio: { sku: "957310", nome: "Scan Body inLego NP", created_at: "" } as any },
  { id: "g6", empresa_id: "", familia_id: "", tipo_abutment_id: "", diametro_plataforma: "", workflow_id: "wf-digital", etapa_id: "et-4", acessorio_sku: "710055", created_at: "", acessorio: { sku: "710055", nome: "Parafuso Protético NP", created_at: "" } as any },
]

// Workflows
export async function listarWorkflows(empresaId: string): Promise<CatalogoWorkflow[]> {
  try {
    const { data, error } = await supabase
      .from("catalogo_workflows")
      .select("*")
      .eq("empresa_id", empresaId)
      .order("nome")
    if (error) throw error
    const result = data as CatalogoWorkflow[]
    if (result.length > 0) return result
  } catch {
    // Tabela pode não existir — usar mock
  }
  return MOCK_WORKFLOWS.map((w) => ({ ...w, empresa_id: empresaId }))
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
    const result = data as CatalogoEtapaWorkflow[]
    if (result.length > 0) return result
  } catch {
    // Tabela pode não existir — usar mock
  }
  return MOCK_ETAPAS.map((e) => ({ ...e, empresa_id: empresaId }))
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

export async function removerEtapa(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_etapas_workflow").delete().eq("id", id)
  if (error) throw error
}

// Guias de Reabilitação
export async function listarGuias(empresaId: string, filters?: { familia_id?: string; workflow_id?: string }): Promise<CatalogoGuiaReabilitacao[]> {
  const buildMock = (familiaId?: string) =>
    MOCK_GUIAS.map((g) => ({
      ...g,
      empresa_id: empresaId,
      familia_id: familiaId ?? "",
      tipo_abutment_id: familiaId ?? "",
      etapa: MOCK_ETAPAS.find((e) => e.id === g.etapa_id),
      workflow: MOCK_WORKFLOWS.find((w) => w.id === g.workflow_id),
    }))

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
    const result = data as CatalogoGuiaReabilitacao[]
    if (result.length > 0) return result
  } catch {
    // Tabela pode não existir — usar mock
  }

  // Sempre retorna mock quando não há dados reais
  return buildMock(filters?.familia_id)
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
