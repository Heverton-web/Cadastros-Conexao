import { createContext, useContext } from "react"

const EmpresaCrudContext = createContext<string>("")

export function useEmpresaCrudId(): string {
  return useContext(EmpresaCrudContext)
}

export { EmpresaCrudContext }
