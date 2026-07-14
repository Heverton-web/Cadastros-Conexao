import * as XLSX from "xlsx"
import type { ParsedFile, ParsedSheet, RawRow } from "../types"
import { IMPORT_FIELD_CONFIGS } from "../constants"
import type { ImportType } from "../types"

export async function parseImportFile(file: File): Promise<ParsedFile> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, {
    type: "array",
    cellDates: true,
    raw: false,
  })

  const sheets: ParsedSheet[] = workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name]
    const jsonData = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(sheet, {
      header: 1,
      blankrows: false,
    })

    if (jsonData.length === 0) {
      return { name, headers: [], rows: [], totalRows: 0 }
    }

    const rawHeaders = jsonData[0]
    const headers = rawHeaders.map((h, i) =>
      String(h ?? `col_${i}`).trim()
    )

    const rows: RawRow[] = jsonData.slice(1).map((row) => {
      const obj: RawRow = {}
      headers.forEach((h, i) => {
        const val = row[i]
        obj[h] = val === undefined ? null : (val as string | number | boolean | null)
      })
      return obj
    })

    return { name, headers, rows, totalRows: rows.length }
  })

  return {
    fileName: file.name,
    fileSize: file.size,
    sheets,
  }
}

export function generateTemplateXLSX(
  importType: ImportType
): void {
  const config = IMPORT_FIELD_CONFIGS[importType]
  if (!config) return

  const headerRow = config.templateHeaders.map((h) => h.label)
  const exampleRow = config.templateHeaders.map((h) => h.example)
  const ws = XLSX.utils.aoa_to_sheet([headerRow, exampleRow])

  ws["!cols"] = config.templateHeaders.map((h) => ({
    wch: Math.max(h.label.length, h.example.length, 15),
  }))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Dados")
  XLSX.writeFile(wb, `template_${importType}.xlsx`)
}

export function autoDetectImportType(headers: string[]): ImportType | null {
  const headerLower = headers.map((h) => h.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))

  if (headerLower.some((h) => ["categoria", "conexao", "familia", "linha"].includes(h))) {
    if (headerLower.some((h) => h === "sku" || h.includes("diametro") || h.includes("comprimento"))) {
      return "implantes"
    }
    if (headerLower.some((h) => h.includes("bom") || h.includes("kit"))) {
      return "kits"
    }
    if (headerLower.some((h) => h.includes("workflow") || h.includes("etapa"))) {
      return "workflows"
    }
    return "hierarquia"
  }

  if (headerLower.some((h) => h === "sku") && headerLower.some((h) => h.includes("diametro"))) {
    if (headerLower.some((h) => h.includes("comprimento"))) return "implantes"
    if (headerLower.some((h) => h.includes("fresa"))) return "fresas"
    if (headerLower.some((h) => h.includes("abutment") || h.includes("angulacao"))) return "abutments"
  }

  return null
}
