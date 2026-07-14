import { useState, useEffect, useRef } from "react"
import type { ImportType, ValidationResult, ValidatedRow } from "../types"
import { validateRows, loadExistingDataCache, type ExistingDataCache } from "../engine/validator"

interface UseRowValidatorParams {
  importType: ImportType | null
  rows: Record<string, unknown>[]
  empresaId: string
  enabled: boolean
}

export function useRowValidator({ importType, rows, empresaId, enabled }: UseRowValidatorParams) {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [existingData, setExistingData] = useState<ExistingDataCache | null>(null)
  const cacheRef = useRef<ExistingDataCache | null>(null)

  useEffect(() => {
    if (!enabled || !importType || rows.length === 0) {
      setValidationResult(null)
      return
    }

    let cancelled = false

    async function validate() {
      setIsValidating(true)

      if (!cacheRef.current) {
        try {
          cacheRef.current = await loadExistingDataCache(empresaId)
          if (!cancelled) setExistingData(cacheRef.current)
        } catch {
          // proceed without cache
        }
      }

      if (cancelled) return

      const result = validateRows({
        importType: importType!,
        rows,
        empresaId,
        existingData: cacheRef.current ?? undefined,
      })

      if (!cancelled) {
        setValidationResult(result)
        setIsValidating(false)
      }
    }

    validate()

    return () => {
      cancelled = true
    }
  }, [importType, rows, empresaId, enabled])

  const revalidate = (editedRows: Map<number, Record<string, unknown>>) => {
    if (!importType || rows.length === 0) return

    const finalRows = rows.map((row, index) => {
      const edited = editedRows.get(index)
      return edited ?? row
    })

    const result = validateRows({
      importType,
      rows: finalRows,
      empresaId,
      existingData: cacheRef.current ?? undefined,
    })

    setValidationResult(result)
  }

  const getValidRows = (): ValidatedRow[] => {
    return validationResult?.validRows ?? []
  }

  const getErrorRows = (): ValidatedRow[] => {
    return validationResult?.errorRows ?? []
  }

  return {
    validationResult,
    isValidating,
    existingData,
    revalidate,
    getValidRows,
    getErrorRows,
  }
}
