import { EMPRESA_ID } from "~/config/empresa"

/**
 * Retorna o empresa_id fixo (single-tenant).
 *
 * Mantido como hook para compatibilidade com código existente.
 * Em single-tenant, a empresa é sempre a mesma.
 */
export function useCatalogoEmpresaId(): string {
  return EMPRESA_ID
}
