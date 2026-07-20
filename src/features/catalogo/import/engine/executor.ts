import { supabase } from "~/core/supabase"
import type {
  ImportType, ImportProgress, ImportResult,
  ImportResultDetail, ImportError, ValidatedRow
} from "../types"
import { BOM_FK_MAP } from "../constants"
import type { BOMItemTipo } from "../../types"
import { loadExistingDataCache, type ExistingDataCache } from "./validator"

const BATCH_SIZE = 50

interface ExecuteImportParams {
  importType: ImportType
  validRows: ValidatedRow[]
  editedRows: Map<number, Record<string, unknown>>
  onProgress: (progress: ImportProgress) => void
}

export async function executeImport(params: ExecuteImportParams): Promise<ImportResult> {
  const { importType, validRows, editedRows, onProgress } = params
  const startTime = Date.now()

  const progress: ImportProgress = {
    status: "executing",
    currentStep: 4,
    totalSteps: 5,
    currentBatch: 0,
    totalBatches: Math.ceil(validRows.length / BATCH_SIZE),
    processedRows: 0,
    totalRows: validRows.length,
    insertedCount: 0,
    updatedCount: 0,
    skippedCount: 0,
    errorCount: 0,
    errors: [],
    startTime,
  }

  const details: ImportResultDetail[] = []

  if (importType === "hierarquia") {
    const allRows = validRows.map((row) => {
      const edited = editedRows.get(row.rowIndex)
      return { ...(edited ?? row.data), }
    })
    const result = await insertHierarquiaBatch(allRows)
    progress.insertedCount = result.inserted
    progress.errorCount = result.errors.length
    progress.errors = result.errors
    progress.processedRows = allRows.length
    progress.currentBatch = 1
    progress.totalBatches = 1
    details.push(...result.details)
    onProgress({ ...progress })
  } else if (importType === "kits") {
    const allRows = validRows.map((row) => {
      const edited = editedRows.get(row.rowIndex)
      return { ...(edited ?? row.data), }
    })
    const result = await insertKitsBatch(allRows)
    progress.insertedCount = result.inserted
    progress.errorCount = result.errors.length
    progress.errors = result.errors
    progress.processedRows = allRows.length
    progress.currentBatch = 1
    progress.totalBatches = 1
    details.push(...result.details)
    onProgress({ ...progress })
  } else if (importType === "workflows") {
    const allRows = validRows.map((row) => {
      const edited = editedRows.get(row.rowIndex)
      return { ...(edited ?? row.data), }
    })
    const result = await insertWorkflowsBatch(allRows)
    progress.insertedCount = result.inserted
    progress.errorCount = result.errors.length
    progress.errors = result.errors
    progress.processedRows = allRows.length
    progress.currentBatch = 1
    progress.totalBatches = 1
    details.push(...result.details)
    onProgress({ ...progress })
  } else {
    const batches = chunk(validRows, BATCH_SIZE)
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      const rowsToInsert = batch.map((row) => {
        const edited = editedRows.get(row.rowIndex)
        return { ...(edited ?? row.data), }
      })

      try {
        const result = await insertSimpleBatch(importType, rowsToInsert)
        progress.currentBatch = i + 1
        progress.processedRows += batch.length
        progress.insertedCount += result.inserted
        progress.updatedCount += result.updated
        progress.errorCount += result.errors.length
        if (result.errors.length > 0) progress.errors.push(...result.errors)

        const elapsed = Date.now() - startTime
        const avgTimePerBatch = elapsed / (i + 1)
        progress.estimatedTimeRemaining = Math.round(
          avgTimePerBatch * (batches.length - i - 1) / 1000
        )

        details.push(...result.details)
      } catch (err) {
        progress.errorCount += batch.length
        batch.forEach((row) => {
          progress.errors.push({
            rowIndex: row.rowIndex,
            data: row.data,
            error: String(err),
            errorCode: "BATCH_FAILED",
            recoverable: false,
          })
        })
      }

      onProgress({ ...progress })
    }
  }

  await fireImportEvents(importType, details)

  return {
    success: progress.errorCount === 0,
    inserted: progress.insertedCount,
    updated: progress.updatedCount,
    skipped: progress.skippedCount,
    errors: progress.errors,
    duration: Date.now() - startTime,
    details,
  }
}

async function insertSimpleBatch(
  importType: ImportType,
  rows: Record<string, unknown>[],
): Promise<{ inserted: number; updated: number; errors: ImportError[]; details: ImportResultDetail[] }> {
  const table = getTableForImportType(importType)
  if (!table) return { inserted: 0, updated: 0, errors: [], details: [] }

  const errors: ImportError[] = []
  const details: ImportResultDetail[] = []
  let inserted = 0
  let updated = 0

  const toUpsert: Record<string, unknown>[] = []

  for (const row of rows) {
    const { categoria_nome, conexao_nome, familia_nome, linha_nome, tipo_reabilitacao_nome, tipo_abutment_nome, ...rest } = row

    const finalRow: Record<string, unknown> = { ...rest }

    if (importType === "implantes" || importType === "abutments") {
      const linhaId = await resolveLinhaId(familia_nome as string, linha_nome as string)
      if (linhaId) finalRow.linha_id = linhaId
      else if (linha_nome) {
        errors.push({
          rowIndex: -1, data: row, error: `Linha "${linha_nome}" nao encontrada`, errorCode: "FK_NOT_FOUND", recoverable: false
        })
        continue
      }
    }

    if (importType === "abutments") {
      const familiaId = await resolveFamiliaId(familia_nome as string)
      if (familiaId) finalRow.familia_id = familiaId
      else {
        errors.push({
          rowIndex: -1, data: row, error: `Familia "${familia_nome}" nao encontrada`, errorCode: "FK_NOT_FOUND", recoverable: false
        })
        continue
      }

      const tipoReabId = await resolveTipoReabilitacaoId(tipo_reabilitacao_nome as string)
      if (tipoReabId) finalRow.tipo_reabilitacao_id = tipoReabId
      else {
        const newId = await createTipoReabilitacao(tipo_reabilitacao_nome as string)
        if (newId) finalRow.tipo_reabilitacao_id = newId
        else {
          errors.push({
            rowIndex: -1, data: row, error: `Tipo Reabilitacao "${tipo_reabilitacao_nome}" nao encontrado`, errorCode: "FK_NOT_FOUND", recoverable: false
          })
          continue
        }
      }

      const tipoAbtId = await resolveTipoAbutmentId(tipo_abutment_nome as string)
      if (tipoAbtId) finalRow.tipo_abutment_id = tipoAbtId
      else {
        const newId = await createTipoAbutment(tipo_abutment_nome as string)
        if (newId) finalRow.tipo_abutment_id = newId
        else {
          errors.push({
            rowIndex: -1, data: row, error: `Tipo Abutment "${tipo_abutment_nome}" nao encontrado`, errorCode: "FK_NOT_FOUND", recoverable: false
          })
          continue
        }
      }
    }

    if (importType === "acessorios" || importType === "instrumentais") {
      const catId = await resolveCategoriaId(importType, categoria_nome as string)
      if (catId) finalRow.categoria_id = catId
      else {
        const newId = await createCategoria(importType, categoria_nome as string)
        if (newId) finalRow.categoria_id = newId
        else {
          errors.push({
            rowIndex: -1, data: row, error: `Categoria "${categoria_nome}" nao encontrada`, errorCode: "FK_NOT_FOUND", recoverable: false
          })
          continue
        }
      }
    }

    toUpsert.push(finalRow)
  }

  if (toUpsert.length > 0) {
    const { error } = await supabase
      .from(table)
      .upsert(toUpsert, { onConflict: "sku" })

    if (error) {
      for (const row of toUpsert) {
        try {
          const { error: singleErr } = await supabase
            .from(table)
            .upsert([row], { onConflict: "sku" })
          if (singleErr) {
            errors.push({
              rowIndex: -1, data: row, error: singleErr.message,
              errorCode: singleErr.code ?? "INSERT_FAILED", recoverable: true,
            })
          } else {
            inserted++
            details.push({ entity: table, action: "inserted", identifier: String(row.sku ?? row.nome) })
          }
        } catch (e) {
          errors.push({
            rowIndex: -1, data: row, error: String(e),
            errorCode: "UNKNOWN", recoverable: false,
          })
        }
      }
    } else {
      inserted = toUpsert.length
      toUpsert.forEach((r) =>
        details.push({ entity: table, action: "inserted", identifier: String(r.sku ?? r.nome) })
      )
    }
  }

  return { inserted, updated, errors, details }
}

async function insertHierarquiaBatch(
  rows: Record<string, unknown>[],
): Promise<{ inserted: number; updated: number; errors: ImportError[]; details: ImportResultDetail[] }> {
  const categorias = new Map<string, { nome: string }>()
  const conexoes = new Map<string, { nome: string; sigla?: string; categoria_nome: string }>()
  const familias = new Map<string, { nome: string; cor?: string; conexao_nome: string }>()
  const linhas = new Map<string, { nome: string; familia_nome: string }>()

  for (const row of rows) {
    const catNome = String(row.categoria_nome).trim()
    if (catNome) categorias.set(catNome.toLowerCase(), { nome: catNome })

    const conNome = String(row.conexao_nome).trim()
    const conKey = `${catNome}::${conNome}`.toLowerCase()
    if (catNome && conNome) {
      conexoes.set(conKey, {
        nome: conNome,
        sigla: row.conexao_sigla ? String(row.conexao_sigla) : undefined,
        categoria_nome: catNome,
      })
    }

    const famNome = String(row.familia_nome).trim()
    const famKey = `${conNome}::${famNome}`.toLowerCase()
    if (conNome && famNome) {
      familias.set(famKey, {
        nome: famNome,
        cor: row.familia_cor ? String(row.familia_cor) : undefined,
        conexao_nome: conNome,
      })
    }

    const linNome = String(row.linha_nome).trim()
    const linKey = `${famNome}::${linNome}`.toLowerCase()
    if (famNome && linNome) {
      linhas.set(linKey, { nome: linNome, familia_nome: famNome })
    }
  }

  let inserted = 0
  const errors: ImportError[] = []
  const details: ImportResultDetail[] = []

  for (const [, cat] of categorias) {
    const { error } = await supabase
      .from("catalogo_categorias")
      .upsert({ nome: cat.nome }, { onConflict: "nome" })
    if (error) {
      errors.push({ rowIndex: -1, data: cat, error: error.message, errorCode: error.code ?? "INSERT_FAILED", recoverable: true })
    } else {
      inserted++
      details.push({ entity: "catalogo_categorias", action: "inserted", identifier: cat.nome })
    }
  }

  const { data: catRows } = await supabase
  const catIdMap = new Map(catRows?.map((r) => [r.nome.toLowerCase(), r.id]) ?? [])

  for (const [, con] of conexoes) {
    const catId = catIdMap.get(con.categoria_nome.toLowerCase())
    if (!catId) {
      errors.push({ rowIndex: -1, data: con, error: `Categoria "${con.categoria_nome}" nao encontrada`, errorCode: "FK_NOT_FOUND", recoverable: false })
      continue
    }
    const { error } = await supabase
      .from("catalogo_conexoes")
      .upsert({ categoria_id: catId, nome: con.nome, sigla: con.sigla ?? null }, { onConflict: "categoria_id,nome" })
    if (error) {
      errors.push({ rowIndex: -1, data: con, error: error.message, errorCode: error.code ?? "INSERT_FAILED", recoverable: true })
    } else {
      inserted++
      details.push({ entity: "catalogo_conexoes", action: "inserted", identifier: con.nome })
    }
  }

  const { data: conRows } = await supabase
  const conIdMap = new Map(conRows?.map((r) => [r.nome.toLowerCase(), r.id]) ?? [])

  for (const [, fam] of familias) {
    const conId = conIdMap.get(fam.conexao_nome.toLowerCase())
    if (!conId) {
      errors.push({ rowIndex: -1, data: fam, error: `Conexao "${fam.conexao_nome}" nao encontrada`, errorCode: "FK_NOT_FOUND", recoverable: false })
      continue
    }
    const { error } = await supabase
      .from("catalogo_familias")
      .upsert({ conexao_id: conId, nome: fam.nome, cor_identificacao: fam.cor ?? null }, { onConflict: "conexao_id,nome" })
    if (error) {
      errors.push({ rowIndex: -1, data: fam, error: error.message, errorCode: error.code ?? "INSERT_FAILED", recoverable: true })
    } else {
      inserted++
      details.push({ entity: "catalogo_familias", action: "inserted", identifier: fam.nome })
    }
  }

  const { data: famRows } = await supabase
  const famIdMap = new Map(famRows?.map((r) => [r.nome.toLowerCase(), r.id]) ?? [])

  for (const [, lin] of linhas) {
    const famId = famIdMap.get(lin.familia_nome.toLowerCase())
    if (!famId) {
      errors.push({ rowIndex: -1, data: lin, error: `Familia "${lin.familia_nome}" nao encontrada`, errorCode: "FK_NOT_FOUND", recoverable: false })
      continue
    }
    const { error } = await supabase
      .from("catalogo_linhas")
      .upsert({ familia_id: famId, nome: lin.nome }, { onConflict: "familia_id,nome" })
    if (error) {
      errors.push({ rowIndex: -1, data: lin, error: error.message, errorCode: error.code ?? "INSERT_FAILED", recoverable: true })
    } else {
      inserted++
      details.push({ entity: "catalogo_linhas", action: "inserted", identifier: lin.nome })
    }
  }

  return { inserted, updated: 0, errors, details }
}

async function insertKitsBatch(
  rows: Record<string, unknown>[],
): Promise<{ inserted: number; updated: number; errors: ImportError[]; details: ImportResultDetail[] }> {
  const errors: ImportError[] = []
  const details: ImportResultDetail[] = []
  let inserted = 0

  const kitMap = new Map<string, {
    mainData: Record<string, unknown>
    bomItems: { tipo: string; sku: string; quantidade: number }[]
    familiaNomes: string[]
  }>()

  for (const row of rows) {
    const sku = String(row.sku)
    if (!kitMap.has(sku)) {
      kitMap.set(sku, {
        mainData: row,
        bomItems: [],
        familiaNomes: row.familias ? String(row.familias).split(";").map((s) => s.trim()) : [],
      })
    }
    const kit = kitMap.get(sku)!
    if (row.bom_tipo && row.bom_sku) {
      kit.bomItems.push({
        tipo: String(row.bom_tipo),
        sku: String(row.bom_sku),
        quantidade: Number(row.bom_quantidade) || 1,
      })
    }
  }

  const cache = await loadExistingDataCache()

  for (const [sku, kit] of kitMap) {
    try {
      const catKitId = await resolveOrCreateCategoriaKit(kit.mainData.categoria_kit_nome as string, cache)

      const kitData = {
        sku,
        nome: kit.mainData.nome,
        descricao: kit.mainData.descricao ?? null,
        categoria_id: catKitId ?? null,
        preco: Number(kit.mainData.preco) || 0,
        ativo: kit.mainData.ativo !== false,
      }

      const { error: kitErr } = await supabase
        .from("catalogo_kits")
        .upsert(kitData, { onConflict: "sku" })

      if (kitErr) {
        errors.push({ rowIndex: -1, data: kitData, error: kitErr.message, errorCode: kitErr.code ?? "INSERT_FAILED", recoverable: false })
        continue
      }

      inserted++
      details.push({ entity: "catalogo_kits", action: "inserted", identifier: sku })

      if (kit.familiaNomes.length > 0) {
        const { data: allFam } = await supabase
        const famMap = new Map(allFam?.map((f) => [f.nome.toLowerCase(), f.id]) ?? [])

        const kitFamiliaRows = kit.familiaNomes
          .map((fn) => famMap.get(fn.toLowerCase()))
          .filter((f): f is string => !!f)
          .map((familiaId) => ({ kit_sku: sku, familia_id: familiaId }))

        if (kitFamiliaRows.length > 0) {
          await supabase.from("catalogo_kit_familias").delete()
          await supabase.from("catalogo_kit_familias").insert(kitFamiliaRows)
        }
      }

      if (kit.bomItems.length > 0) {
        await supabase.from("catalogo_kit_composicao").delete()

        for (const bom of kit.bomItems) {
          const fkColumn = BOM_FK_MAP[bom.tipo as BOMItemTipo]
          if (!fkColumn) {
            errors.push({ rowIndex: -1, data: bom, error: `Tipo BOM invalido: ${bom.tipo}`, errorCode: "INVALID_BOM_TYPE", recoverable: false })
            continue
          }

          const bomRow: Record<string, unknown> = {
            kit_sku: sku,
            quantidade: bom.quantidade,
          }
          bomRow[fkColumn] = bom.sku

          const { error: bomErr } = await supabase
            .from("catalogo_kit_composicao")
            .insert(bomRow)

          if (bomErr) {
            errors.push({ rowIndex: -1, data: bom, error: bomErr.message, errorCode: bomErr.code ?? "BOM_INSERT_FAILED", recoverable: true })
          }
        }
      }
    } catch (err) {
      errors.push({ rowIndex: -1, data: kit.mainData, error: String(err), errorCode: "UNKNOWN", recoverable: false })
    }
  }

  return { inserted, updated: 0, errors, details }
}

async function insertWorkflowsBatch(
  rows: Record<string, unknown>[],
): Promise<{ inserted: number; updated: number; errors: ImportError[]; details: ImportResultDetail[] }> {
  const errors: ImportError[] = []
  const details: ImportResultDetail[] = []
  let inserted = 0

  const workflowMap = new Map<string, {
    nome: string
    descricao?: string
    etapas: Map<string, {
      nome: string
      ordem: number
      guias: { familia_nome: string; tipo_abutment_nome: string; diametro: number; acessorio_sku: string }[]
    }>
  }>()

  for (const row of rows) {
    const wfNome = String(row.workflow_nome).trim()
    if (!workflowMap.has(wfNome)) {
      workflowMap.set(wfNome, {
        nome: wfNome,
        descricao: row.workflow_descricao ? String(row.workflow_descricao) : undefined,
        etapas: new Map(),
      })
    }
    const wf = workflowMap.get(wfNome)!

    const etapaNome = String(row.etapa_nome).trim()
    if (!wf.etapas.has(etapaNome)) {
      wf.etapas.set(etapaNome, {
        nome: etapaNome,
        ordem: Number(row.etapa_ordem) || 0,
        guias: [],
      })
    }
    const etapa = wf.etapas.get(etapaNome)!

    if (row.guia_familia_nome || row.guia_acessorio_sku) {
      etapa.guias.push({
        familia_nome: row.guia_familia_nome ? String(row.guia_familia_nome) : "",
        tipo_abutment_nome: row.guia_tipo_abutment_nome ? String(row.guia_tipo_abutment_nome) : "",
        diametro: Number(row.guia_diametro) || 0,
        acessorio_sku: row.guia_acessorio_sku ? String(row.guia_acessorio_sku) : "",
      })
    }
  }

  for (const [, wf] of workflowMap) {
    try {
      const { data: wfData, error: wfErr } = await supabase
        .from("catalogo_workflows")
        .upsert({ nome: wf.nome }, { onConflict: "nome" })
        .select("id")
        .single()

      if (wfErr) {
        errors.push({ rowIndex: -1, data: wf, error: wfErr.message, errorCode: wfErr.code ?? "INSERT_FAILED", recoverable: false })
        continue
      }

      inserted++
      details.push({ entity: "catalogo_workflows", action: "inserted", identifier: wf.nome })

      for (const [, etapa] of wf.etapas) {
        const { data: etapaData, error: etapaErr } = await supabase
          .from("catalogo_etapas_workflow")
          .upsert({
            workflow_id: wfData.id,
            nome: etapa.nome,
            ordem: etapa.ordem,
          }, { onConflict: "workflow_id,nome" })
          .select("id")
          .single()

        if (etapaErr) {
          errors.push({ rowIndex: -1, data: etapa, error: etapaErr.message, errorCode: etapaErr.code ?? "INSERT_FAILED", recoverable: true })
          continue
        }

        for (const guia of etapa.guias) {
          let familiaId: string | null = null
          if (guia.familia_nome) {
            const { data: fam } = await supabase
              .from("catalogo_familias").select("id")
            familiaId = fam?.id ?? null
          }

          const { error: guiaErr } = await supabase
            .from("catalogo_guias_reabilitacao")
            .insert({
              etapa_id: etapaData.id,
              familia_id: familiaId,
              diametro_plataforma: guia.diametro ? String(guia.diametro) : null,
              acessorio_sku: guia.acessorio_sku || null,
            })

          if (guiaErr) {
            errors.push({ rowIndex: -1, data: guia, error: guiaErr.message, errorCode: guiaErr.code ?? "INSERT_FAILED", recoverable: true })
          }
        }
      }
    } catch (err) {
      errors.push({ rowIndex: -1, data: wf, error: String(err), errorCode: "UNKNOWN", recoverable: false })
    }
  }

  return { inserted, updated: 0, errors, details }
}

// Helpers
function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

function getTableForImportType(importType: ImportType): string {
  const tableMap: Record<string, string> = {
    implantes: "catalogo_implantes",
    abutments: "catalogo_abutments",
    fresas: "catalogo_fresas",
    acessorios: "catalogo_acessorios",
    chaves: "catalogo_chaves_ferramental",
    instrumentais: "catalogo_instrumentais_gerais",
  }
  return tableMap[importType] ?? ""
}

async function resolveLinhaId(familiaNome?: string, linhaNome?: string): Promise<string | null> {
  if (!familiaNome || !linhaNome) return null
  const { data: familia } = await supabase
    .from("catalogo_familias").select("id")
  if (!familia) return null
  const { data: linha } = await supabase
    .from("catalogo_linhas").select("id")
  return linha?.id ?? null
}

async function resolveFamiliaId(familiaNome?: string): Promise<string | null> {
  if (!familiaNome) return null
  const { data } = await supabase
    .from("catalogo_familias").select("id")
  return data?.id ?? null
}

async function resolveTipoReabilitacaoId(nome: string): Promise<string | null> {
  if (!nome) return null
  const { data } = await supabase
    .from("catalogo_tipos_reabilitacao").select("id")
  return data?.id ?? null
}

async function createTipoReabilitacao(nome: string): Promise<string | null> {
  if (!nome) return null
  const { data } = await supabase
    .from("catalogo_tipos_reabilitacao")
    .insert({ nome })
    .select("id")
    .single()
  return data?.id ?? null
}

async function resolveTipoAbutmentId(nome: string): Promise<string | null> {
  if (!nome) return null
  const { data } = await supabase
    .from("catalogo_tipos_abutment").select("id")
  return data?.id ?? null
}

async function createTipoAbutment(nome: string): Promise<string | null> {
  if (!nome) return null
  const { data } = await supabase
    .from("catalogo_tipos_abutment")
    .insert({ nome })
    .select("id")
    .single()
  return data?.id ?? null
}

async function resolveCategoriaId(importType: ImportType, nome: string): Promise<string | null> {
  if (!nome) return null
  const table = importType === "acessorios" ? "catalogo_categorias_acessorio" : "catalogo_categorias_instrumental"
  const { data } = await supabase
    .from(table).select("id")
  return data?.id ?? null
}

async function createCategoria(importType: ImportType, nome: string): Promise<string | null> {
  if (!nome) return null
  const table = importType === "acessorios" ? "catalogo_categorias_acessorio" : "catalogo_categorias_instrumental"
  const { data } = await supabase
    .from(table)
    .insert({ nome })
    .select("id")
    .single()
  return data?.id ?? null
}

async function resolveOrCreateCategoriaKit(nome: string, cache: ExistingDataCache): Promise<string | null> {
  if (!nome) return null
  const existing = cache.categoriasKit.get(nome.toLowerCase())
  if (existing) return existing
  const { data } = await supabase
    .from("catalogo_categorias_kit")
    .insert({ nome })
    .select("id")
    .single()
  return data?.id ?? null
}

async function fireImportEvents(
  importType: ImportType,
  details: ImportResultDetail[]
): Promise<void> {
  try {
    const { dispararEventoModulo } = await import("~/core/services/webhooks")
    const inserts = details.filter((d) => d.action === "inserted")
    if (inserts.length > 0) {
      dispararEventoModulo("catalogo", "importacao.concluida", {
        import_type: importType,
        count: inserts.length,
      }).catch(() => {})
    }
  } catch {
    // webhook import failed — non-critical
  }
}
