import type {
  ImportType, RowValidation, ValidatedRow,
  ValidationResult, ValidationSummary
} from "../types"
import { IMPORT_FIELD_CONFIGS } from "../constants"
import { supabase } from "~/core/supabase"

export interface ExistingDataCache {
  categorias: Map<string, string>
  categoriasKit: Map<string, string>
  conexoes: Map<string, string>
  familias: Map<string, string>
  linhas: Map<string, string>
  skus: Set<string>
  tiposReabilitacao: Map<string, string>
  tiposAbutment: Map<string, string>
}

export async function loadExistingDataCache(empresaId: string): Promise<ExistingDataCache> {
  const [catRes, catKitRes, conRes, famRes, linRes, tipoReabRes, tipoAbtRes] = await Promise.all([
    supabase.from("catalogo_categorias").select("id, nome").eq("empresa_id", empresaId),
    supabase.from("catalogo_categorias_kit").select("id, nome").eq("empresa_id", empresaId),
    supabase.from("catalogo_conexoes").select("id, nome").eq("empresa_id", empresaId),
    supabase.from("catalogo_familias").select("id, nome").eq("empresa_id", empresaId),
    supabase.from("catalogo_linhas").select("id, nome").eq("empresa_id", empresaId),
    supabase.from("catalogo_tipos_reabilitacao").select("id, nome").eq("empresa_id", empresaId),
    supabase.from("catalogo_tipos_abutment").select("id, nome").eq("empresa_id", empresaId),
  ])

  const skuTables = [
    "catalogo_implantes", "catalogo_abutments", "catalogo_fresas",
    "catalogo_acessorios", "catalogo_chaves_ferramental",
    "catalogo_instrumentais_gerais", "catalogo_kits"
  ]
  const allSkus = new Set<string>()
  for (const table of skuTables) {
    const { data } = await supabase.from(table).select("sku").eq("empresa_id", empresaId)
    data?.forEach((r) => allSkus.add(r.sku))
  }

  return {
    categorias: toMap(catRes.data, "nome", "id"),
    categoriasKit: toMap(catKitRes.data, "nome", "id"),
    conexoes: toMap(conRes.data, "nome", "id"),
    familias: toMap(famRes.data, "nome", "id"),
    linhas: toMap(linRes.data, "nome", "id"),
    skus: allSkus,
    tiposReabilitacao: toMap(tipoReabRes.data, "nome", "id"),
    tiposAbutment: toMap(tipoAbtRes.data, "nome", "id"),
  }
}

function toMap(rows: { id: string; nome: string }[] | null, keyField: string, valueField: string): Map<string, string> {
  const map = new Map<string, string>()
  rows?.forEach((r) => {
    const key = r[keyField as keyof typeof r]
    if (typeof key === "string") {
      map.set(key.toLowerCase(), r[valueField as keyof typeof r] as string)
    }
  })
  return map
}

interface ValidateRowsParams {
  importType: ImportType
  rows: Record<string, unknown>[]
  empresaId: string
  existingData?: ExistingDataCache
}

export function validateRows(params: ValidateRowsParams): ValidationResult {
  const { importType, rows, existingData } = params
  const config = IMPORT_FIELD_CONFIGS[importType]
  const errors: RowValidation[] = []
  const warnings: RowValidation[] = []
  const validatedRows: ValidatedRow[] = []

  rows.forEach((row, index) => {
    const rowErrors: RowValidation[] = []
    const rowWarnings: RowValidation[] = []

    for (const field of config.targetFields.filter((f) => f.required)) {
      const value = row[field.key]
      if (value === null || value === undefined || value === "") {
        rowErrors.push({
          rowIndex: index,
          severity: "error",
          field: field.key,
          message: `Campo "${field.label}" e obrigatorio`,
        })
      }
    }

    for (const field of config.targetFields) {
      const value = row[field.key]
      if (value === null || value === undefined) continue

      if (field.type === "number" && isNaN(Number(value))) {
        rowErrors.push({
          rowIndex: index,
          severity: "error",
          field: field.key,
          message: `"${field.label}" deve ser numerico. Valor: "${value}"`,
          value,
        })
      }
    }

    if (existingData) {
      validateForeignKeys(importType, row, index, existingData, rowErrors, rowWarnings)
    }

    if (row.sku && existingData?.skus.has(String(row.sku))) {
      rowWarnings.push({
        rowIndex: index,
        severity: "warning",
        field: "sku",
        message: `SKU "${row.sku}" ja existe no sistema. Sera atualizado.`,
        suggestion: "Atualizar registro existente",
      })
    }

    validateByType(importType, row, index, rowErrors, rowWarnings)

    errors.push(...rowErrors)
    warnings.push(...rowWarnings)
    validatedRows.push({
      rowIndex: index,
      data: row,
      validations: [...rowErrors, ...rowWarnings],
      isValid: rowErrors.length === 0,
      isEditable: true,
    })
  })

  const summary: ValidationSummary = {
    totalRows: rows.length,
    validRows: validatedRows.filter((r) => r.isValid).length,
    rowsWithWarnings: validatedRows.filter((r) =>
      r.validations.some((v) => v.severity === "warning") && r.isValid
    ).length,
    rowsWithErrors: validatedRows.filter((r) => !r.isValid).length,
    errorsByField: countByField(errors),
    warningsByField: countByField(warnings),
  }

  return {
    validRows: validatedRows.filter((r) => r.isValid),
    errorRows: validatedRows.filter((r) => !r.isValid),
    warnings,
    errors,
    summary,
  }
}

function validateForeignKeys(
  importType: ImportType,
  row: Record<string, unknown>,
  index: number,
  cache: ExistingDataCache,
  errors: RowValidation[],
  warnings: RowValidation[]
): void {
  if (["implantes", "abutments"].includes(importType)) {
    if (row.familia_nome && !cache.familias.has(String(row.familia_nome).toLowerCase())) {
      warnings.push({
        rowIndex: index, severity: "warning", field: "familia_nome",
        message: `Familia "${row.familia_nome}" nao existe e sera criada`,
        suggestion: "Criar automaticamente",
      })
    }
  }

  if (importType === "abutments") {
    if (row.tipo_reabilitacao_nome && !cache.tiposReabilitacao.has(String(row.tipo_reabilitacao_nome).toLowerCase())) {
      warnings.push({
        rowIndex: index, severity: "warning", field: "tipo_reabilitacao_nome",
        message: `Tipo Reabilitacao "${row.tipo_reabilitacao_nome}" nao existe e sera criado`,
        suggestion: "Criar automaticamente",
      })
    }
    if (row.tipo_abutment_nome && !cache.tiposAbutment.has(String(row.tipo_abutment_nome).toLowerCase())) {
      warnings.push({
        rowIndex: index, severity: "warning", field: "tipo_abutment_nome",
        message: `Tipo Abutment "${row.tipo_abutment_nome}" nao existe e sera criado`,
        suggestion: "Criar automaticamente",
      })
    }
  }

  if (importType === "kits" && row.categoria_kit_nome && !cache.categoriasKit.has(String(row.categoria_kit_nome).toLowerCase())) {
    warnings.push({
      rowIndex: index, severity: "warning", field: "categoria_kit_nome",
      message: `Categoria Kit "${row.categoria_kit_nome}" nao existe e sera criada`,
      suggestion: "Criar automaticamente",
    })
  }

  if (importType === "kits" && row.bom_sku) {
    if (!cache.skus.has(String(row.bom_sku))) {
      errors.push({
        rowIndex: index, severity: "error", field: "bom_sku",
        message: `SKU "${row.bom_sku}" do BOM nao existe no catalogo`,
      })
    }
  }
}

function validateByType(
  importType: ImportType,
  row: Record<string, unknown>,
  index: number,
  errors: RowValidation[],
  warnings: RowValidation[]
): void {
  if (importType === "kits" && row.bom_tipo) {
    const validTipos = ["fresa", "chave", "acessorio", "instrumental", "implante"]
    if (!validTipos.includes(String(row.bom_tipo))) {
      errors.push({
        rowIndex: index, severity: "error", field: "bom_tipo",
        message: `Tipo BOM invalido: "${row.bom_tipo}". Use: ${validTipos.join(", ")}`,
      })
    }
  }

  if (importType === "implantes") {
    const d = Number(row.diametro_mm)
    const c = Number(row.comprimento_mm)
    if (d > 0 && c > 0 && d > c) {
      warnings.push({
        rowIndex: index, severity: "warning", field: "diametro_mm",
        message: "Diametro maior que comprimento — confirme os valores",
      })
    }
  }

  if (importType === "chaves" && row.tipo_ferramenta) {
    const validTipos = ["Aperto", "Medicao", "Cirurgica"]
    const normalized = String(row.tipo_ferramenta).trim()
    if (!validTipos.some((t) => t.toLowerCase() === normalized.toLowerCase())) {
      errors.push({
        rowIndex: index, severity: "error", field: "tipo_ferramenta",
        message: `Tipo Ferramenta invalido: "${row.tipo_ferramenta}". Use: ${validTipos.join(", ")}`,
      })
    }
  }
}

function countByField(items: RowValidation[]): Record<string, number> {
  return items.reduce((acc, item) => {
    acc[item.field] = (acc[item.field] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}
