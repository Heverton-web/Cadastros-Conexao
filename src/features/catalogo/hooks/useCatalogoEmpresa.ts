import { useAuth } from "~/lib/auth"
import { useLocation } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { supabase } from "~/lib/supabase"
import { useEmpresaCrudId } from "../contexts/EmpresaCrudContext"

const DEFAULT_EMPRESA_ID = "1a00d0fe-0d10-48b2-aff7-68e941967f0f"

/**
 * Resolve empresa_id considerando:
 * 0. EmpresaCrudContext (selecionada pelo Super Admin no guard)
 * 1. Search param ?empresa={id} → usa direto
 * 2. Slug na URL (/catalogo/{slug}/... ou /loja/{slug}/...) → busca empresa pelo slug
 * 3. Auth logado (ERP) → usa empresa_id do profile
 * 4. Fallback → DEFAULT_EMPRESA_ID
 */
export function useCatalogoEmpresaId(): string {
  const contextId = useEmpresaCrudId()
  const { profile } = useAuth()
  const location = useLocation()
  const [slugEmpresaId, setSlugEmpresaId] = useState<string | null>(null)
  const [resolved, setResolved] = useState(false)

  // Prioridade: context > search param > slug > auth ERP > default
  if (contextId) return contextId

  // Check search param ?empresa=
  let searchEmpresaId: string | null = null
  try {
    const searchParams = new URLSearchParams(location.search)
    searchEmpresaId = searchParams.get("empresa")
  } catch {}

  // Extrai slug da URL: /catalogo/{slug} ou /loja/{slug}
  const matchCatalogo = location.pathname.match(/^\/catalogo\/([^/]+)/)
  const matchLoja = location.pathname.match(/^\/loja\/([^/]+)/)
  const slug = matchCatalogo?.[1] ?? matchLoja?.[1] ?? null

  useEffect(() => {
    // Se já tem empresa no search param, não precisa resolver por slug
    if (searchEmpresaId) {
      setResolved(true)
      return
    }

    if (!slug) {
      setResolved(true)
      return
    }

    // Não resolve se for uma rota interna
    const skipSlugs = ['admin', 'produto', 'carrinho', 'checkout', 'login', 'pedidos', 'favoritos', 'orcamento']
    if (skipSlugs.includes(slug)) {
      setResolved(true)
      return
    }

    async function resolveBySlug() {
      const { data } = await supabase
        .from("empresas")
        .select("id")
        .eq("slug", slug)
        .eq("ativo", true)
        .single()

      if (data?.id) {
        setSlugEmpresaId(data.id)
      }
      setResolved(true)
    }
    resolveBySlug()
  }, [slug, searchEmpresaId])

  // Só retorna fallback se resolução por slug já completou
  if (searchEmpresaId) return searchEmpresaId
  if (resolved && slugEmpresaId) return slugEmpresaId
  if (resolved && profile?.empresa_id) return profile.empresa_id
  if (resolved) {
    if (typeof window !== "undefined") {
      console.warn(`[Catalogo] Fallback para empresa_id padrao ${DEFAULT_EMPRESA_ID}. Nenhum contexto de empresa foi resolvido.`)
    }
    return DEFAULT_EMPRESA_ID
  }
  return ""
}
