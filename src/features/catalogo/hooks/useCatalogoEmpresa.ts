import { useAuth } from "~/lib/auth"

const DEFAULT_EMPRESA_ID = "1a00d0fe-0d10-48b2-aff7-68e941967f0f"

export function useCatalogoEmpresaId(): string {
  const { profile } = useAuth()
  return profile?.empresa_id ?? DEFAULT_EMPRESA_ID
}
