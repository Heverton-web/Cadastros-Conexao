import React, { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "~/lib/auth"

export type ClienteAtivo = { id: string; nomeDoutor: string; nomeClinica: string | null }

type ClienteAtivoContextValue = {
  /** true quando o usuário logado é colaborador com acesso ao catálogo interno (não cliente da loja) */
  isConsultor: boolean
  clienteAtivo: ClienteAtivo | null
  setClienteAtivo: (cliente: ClienteAtivo | null) => void
}

const ClienteAtivoContext = createContext<ClienteAtivoContextValue>({
  isConsultor: false,
  clienteAtivo: null,
  setClienteAtivo: () => {},
})

export const useClienteAtivo = () => useContext(ClienteAtivoContext)

function storageKey(consultorId: string) {
  return `catalogo:cliente-ativo:${consultorId}`
}

/**
 * Provider do "cliente ativo" — o cliente da carteira do consultor que ele
 * selecionou pra montar orçamento/pedido. Enquanto selecionado, os preços do
 * catálogo resolvem automaticamente pelo grupo de desconto desse cliente.
 */
export function ClienteAtivoProvider({ children }: { children: React.ReactNode }) {
  const { profile, permissoes } = useAuth()
  const isConsultor = Boolean(
    profile &&
      (permissoes?.catalogo_colab_ver_produtos ||
        permissoes?.catalogo_colab_criar_orcamento ||
        profile.is_super_admin),
  )
  const [clienteAtivo, setClienteAtivoState] = useState<ClienteAtivo | null>(null)

  // Restaura seleção salva (por consultor) ao montar / trocar de usuário
  useEffect(() => {
    if (!profile) {
      setClienteAtivoState(null)
      return
    }
    const raw = sessionStorage.getItem(storageKey(profile.id))
    setClienteAtivoState(raw ? (JSON.parse(raw) as ClienteAtivo) : null)
  }, [profile?.id])

  function setClienteAtivo(cliente: ClienteAtivo | null) {
    setClienteAtivoState(cliente)
    if (!profile) return
    if (cliente) sessionStorage.setItem(storageKey(profile.id), JSON.stringify(cliente))
    else sessionStorage.removeItem(storageKey(profile.id))
  }

  return (
    <ClienteAtivoContext.Provider value={{ isConsultor, clienteAtivo, setClienteAtivo }}>
      {children}
    </ClienteAtivoContext.Provider>
  )
}
