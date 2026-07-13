import { useAuth } from "~/lib/auth"
import { useState, useEffect } from "react"
import { listarEmpresas, type Empresa } from "~/shared/empresas"
import { Loader2 } from "lucide-react"
import { EmpresaCrudContext } from "../contexts/EmpresaCrudContext"

interface EmpresaCrudGuardProps {
  children: React.ReactNode
}

export function EmpresaCrudGuard({ children }: EmpresaCrudGuardProps) {
  const { profile } = useAuth()
  const isSuperAdmin = profile?.is_super_admin === true
  const minhaEmpresaId = profile?.empresa_id as string | undefined

  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [selectedId, setSelectedId] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSuperAdmin) {
      if (minhaEmpresaId) {
        setSelectedId(minhaEmpresaId)
        setLoading(false)
      }
      return
    }
    listarEmpresas().then((emps) => {
      const ativas = emps.filter((e) => e.ativo !== false)
      setEmpresas(ativas)
      if (ativas.length > 0) setSelectedId(ativas[0].id)
      setLoading(false)
    })
  }, [isSuperAdmin, minhaEmpresaId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={20} className="animate-spin text-text-muted" />
      </div>
    )
  }

  if (!selectedId) {
    return (
      <div className="text-center py-12 text-text-muted text-sm">
        Nenhuma empresa vinculada.
      </div>
    )
  }

  return (
    <EmpresaCrudContext.Provider value={selectedId}>
      {isSuperAdmin && empresas.length > 1 && (
        <div className="mb-4">
          <label className="text-xs text-text-muted block mb-1">Empresa</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="px-3 py-2 rounded-lg bg-input-bg border border-input-border text-text-main text-sm w-full sm:w-auto"
          >
            {empresas.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.nome}
              </option>
            ))}
          </select>
        </div>
      )}
      {children}
    </EmpresaCrudContext.Provider>
  )
}
