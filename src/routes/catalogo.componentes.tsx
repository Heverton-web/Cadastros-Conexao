import { createRoute, Link, useNavigate, useParams, useSearch } from "@tanstack/react-router"
import { rootRoute } from "./__root"
import { StoreLayout } from "~/features/catalogo/components/StoreLayout"
import { DrillDown } from "~/features/catalogo/components/DrillDown"
import { ProductCard } from "~/features/catalogo/components/ProductCard"
import { useTiposReabilitacao, useFamilias, useTiposAbutment, useAbutments } from "~/features/catalogo/hooks/useCatalogo"
import { useMemo } from "react"
import { ArrowLeft, PackageOpen } from "lucide-react"

// Etapa 1: /catalogo/componentes — Escolher Tipo Reabilitação
export const catalogoComponentesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalogo/componentes",
  component: CatalogoComponentesPage,
})

// Etapa 2: /catalogo/componentes/$tipoReabId — Escolher Família
export const catalogoComponentesTipoReabRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalogo/componentes/$tipoReabId",
  component: CatalogoComponentesPage,
})

// Etapa 3: /catalogo/componentes/$tipoReabId/$familiaId — Escolher Tipo Abutment
export const catalogoComponentesFamiliaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalogo/componentes/$tipoReabId/$familiaId",
  component: CatalogoComponentesPage,
})

// Etapa 4: /catalogo/componentes/$tipoReabId/$familiaId/$tipoAbutmentId — Lista de Abutments
export const catalogoComponentesTipoAbutmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalogo/componentes/$tipoReabId/$familiaId/$tipoAbutmentId",
  component: CatalogoComponentesPage,
})

function CatalogoComponentesPage() {
  const { data: tiposReab, isLoading: loadingReab } = useTiposReabilitacao()
  const { data: todosAbutments } = useAbutments()
  const navigate = useNavigate()
  const params = useParams({ strict: false }) as Record<string, string | undefined>
  const tipoReabId = params.tipoReabId ?? null
  const familiaId = params.familiaId ?? null
  const tipoAbutmentId = params.tipoAbutmentId ?? null
  const search = useSearch({ strict: false }) as Record<string, string | undefined>
  const empresa = search.empresa ?? null

  const countByTipoReab = useMemo(() => {
    const m: Record<string, number> = {}
    for (const a of todosAbutments ?? []) {
      if (a.tipo_reabilitacao_id) m[a.tipo_reabilitacao_id] = (m[a.tipo_reabilitacao_id] ?? 0) + 1
    }
    return m
  }, [todosAbutments])

  const countByFamilia = useMemo(() => {
    const m: Record<string, number> = {}
    for (const a of todosAbutments ?? []) {
      if (a.familia_id) m[a.familia_id] = (m[a.familia_id] ?? 0) + 1
    }
    return m
  }, [todosAbutments])

  const countByTipoAbutment = useMemo(() => {
    const m: Record<string, number> = {}
    for (const a of todosAbutments ?? []) {
      if (a.tipo_abutment_id) m[a.tipo_abutment_id] = (m[a.tipo_abutment_id] ?? 0) + 1
    }
    return m
  }, [todosAbutments])

  // Etapa 4: Lista de abutments
  if (tipoReabId && familiaId && tipoAbutmentId) return (
    <StoreLayout>
      <AbutmentList
        familiaId={familiaId}
        tipoAbutmentId={tipoAbutmentId}
        tipoReabId={tipoReabId}
        empresa={empresa}
        onBack={() => navigate({ to: '/catalogo/componentes/$tipoReabId/$familiaId', params: { tipoReabId, familiaId }, search: { empresa } })}
      />
    </StoreLayout>
  )

  // Etapa 3: Escolher Tipo Abutment
  if (tipoReabId && familiaId) return (
    <StoreLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <TiposAbutmentList
          familiaId={familiaId}
          tipoReabId={tipoReabId}
          onSelect={(id) => navigate({ to: '/catalogo/componentes/$tipoReabId/$familiaId/$tipoAbutmentId', params: { tipoReabId, familiaId, tipoAbutmentId: id }, search: { empresa } })}
          onBack={() => navigate({ to: '/catalogo/componentes/$tipoReabId', params: { tipoReabId }, search: { empresa } })}
          countByTipoAbutment={countByTipoAbutment}
        />
      </div>
    </StoreLayout>
  )

  // Etapa 2: Escolher Família
  if (tipoReabId) return (
    <StoreLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <FamiliasForReabList
          tipoReabId={tipoReabId}
          onSelect={(id) => navigate({ to: '/catalogo/componentes/$tipoReabId/$familiaId', params: { tipoReabId, familiaId: id }, search: { empresa } })}
          onBack={() => navigate({ to: '/catalogo/componentes', search: { empresa } })}
          countByFamilia={countByFamilia}
        />
      </div>
    </StoreLayout>
  )

  // Etapa 1: Escolher Tipo Reabilitação
  return (
    <StoreLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <DrillDown
          title="Componentes"
          subtitle="unitária, múltipla ou híbrida"
          step={1}
          totalSteps={4}
          options={(tiposReab ?? []).map((t) => ({
            id: t.id,
            label: t.nome,
            count: countByTipoReab[t.id] ?? 0,
          }))}
          onSelect={(id) => navigate({ to: '/catalogo/componentes/$tipoReabId', params: { tipoReabId: id }, search: { empresa } })}
          onBack={() => navigate({ to: '/catalogo', search: { empresa } })}
          isLoading={loadingReab}
        />
      </div>
    </StoreLayout>
  )
}

function FamiliasForReabList({ tipoReabId, onSelect, onBack, countByFamilia }: { tipoReabId: string; onSelect: (id: string) => void; onBack: () => void; countByFamilia: Record<string, number> }) {
  const { data: familias, isLoading } = useFamilias()

  return (
    <DrillDown
      title="Famílias"
      subtitle="família anatômica"
      step={2}
      totalSteps={4}
      options={(familias ?? []).map((f) => ({
        id: f.id,
        label: f.nome,
        sublabel: f.conexao?.nome,
        color: f.cor_identificacao,
        count: countByFamilia[f.id] ?? 0,
      }))}
      onSelect={onSelect}
      onBack={onBack}
      isLoading={isLoading}
    />
  )
}

function TiposAbutmentList({ familiaId, tipoReabId, onSelect, onBack, countByTipoAbutment }: { familiaId: string; tipoReabId: string; onSelect: (id: string) => void; onBack: () => void; countByTipoAbutment: Record<string, number> }) {
  const { data: tipos, isLoading } = useTiposAbutment()
  const { data: familias } = useFamilias()
  const familia = (familias ?? []).find((f) => f.id === familiaId)
  const corFamilia = familia?.cor_identificacao

  return (
    <DrillDown
      title="Tipos de Abutment"
      subtitle="modelo/família do pilar"
      step={3}
      totalSteps={4}
      options={(tipos ?? []).map((t) => ({
        id: t.id,
        label: t.nome,
        sublabel: t.sigla ?? undefined,
        color: corFamilia,
        count: countByTipoAbutment[t.id] ?? 0,
      }))}
      onSelect={onSelect}
      onBack={onBack}
      isLoading={isLoading}
    />
  )
}

function AbutmentList({ familiaId, tipoAbutmentId, tipoReabId, empresa, onBack }: { familiaId: string; tipoAbutmentId: string; tipoReabId: string; empresa?: string; onBack: () => void }) {
  const { data: abutments, isLoading } = useAbutments(familiaId)
  const filtered = (abutments ?? []).filter((a) => a.tipo_abutment_id === tipoAbutmentId)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 rounded-2xl bg-[var(--color-surface)]/50 border border-[var(--color-border-subtle)] animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 sm:space-y-12 w-full">
      {/* Header Premium */}
      <div className="flex items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
        <button 
          onClick={onBack}
          className="group shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface)] hover:border-[var(--color-accent)] transition-all mt-1 sm:mt-0"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
        </button>
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="flex gap-1">
              <div className="w-8 h-1.5 rounded-full bg-[var(--color-accent)] transition-all duration-500" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-accent)] ml-2">Etapa 4 de 4</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-white tracking-tighter text-balance">Selecione o Abutment</h1>
          <p className="text-sm sm:text-lg mt-1 sm:mt-2 text-[var(--color-text-muted)] text-balance">{filtered.length} componente(s) encontrado(s).</p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 backdrop-blur-md">
          <PackageOpen className="h-14 w-14 mx-auto mb-6 opacity-20 text-white" />
          <p className="text-xl font-black text-white tracking-tight">Nenhum componente encontrado</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-2 max-w-sm mx-auto">Este tipo de abutment não possui itens cadastrados. Volte e selecione outra opção.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((a) => (
          <Link to="/catalogo/produto/$tipo/$sku" params={{ tipo: 'abutment', sku: a.sku }} search={{ familia: familiaId, tipoAbutment: tipoAbutmentId, empresa }} className="no-underline" key={a.sku}>
            <ProductCard
              tipo="abutment"
              sku={a.sku}
              nome={`${a.tipo_abutment?.nome ?? ""} ${a.familia?.nome ?? ""}`}
              corIdentificacao={a.familia?.cor_identificacao || ''}
            />
          </Link>
        ))}
      </div>
      )}
    </div>
  )
}
