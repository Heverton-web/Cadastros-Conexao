/**
 * EmpresaCrudContext — Single-Tenant
 *
 * Em modo single-tenant, a empresa é sempre a mesma (EMPRESA_ID fixo).
 * Este hook retorna a constante diretamente, sem precisar de React Context.
 */
import { EMPRESA_ID } from "~/config/empresa";

/**
 * Retorna o ID da empresa atual (fixo em single-tenant).
 * Mantido para compatibilidade com componentes existentes.
 */
export function useEmpresaCrudId(): string {
  return EMPRESA_ID;
}

/**
 * Contexto compatível — Provider é no-op em single-tenant.
 * Mantido para não quebrar imports existentes.
 */
export const EmpresaCrudContext = {
  Provider: ({ children }: { children: React.ReactNode }) => children,
  Consumer: ({ children }: { children: (value: string) => React.ReactNode }) =>
    children(EMPRESA_ID),
};
