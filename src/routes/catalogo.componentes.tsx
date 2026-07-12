import { createRoute, Link, useNavigate, useSearch } from "@tanstack/react-router"
import { rootRoute } from "./__root"
import { StoreLayout } from "~/features/catalogo/components/StoreLayout"
import { DrillDown } from "~/features/catalogo/components/DrillDown"
import { ProductCard } from "~/features/catalogo/components/ProductCard"
import { useTiposReabilitacao, useFamilias, useTiposAbutment, useAbutments } from "~/features/catalogo/hooks/useCatalogo"
import { useState, useMemo } from "react"
import { ArrowLeft, PackageOpen } from "lucide-react"

export const catalogoComponentesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalogo/componentes",
  validateSearch: (s: Record<string, unknown>) => ({
    tipoReab: (s.tipoReab as string) || null,
    familia: (s.familia as string) || null,
    tipoAbutment: (s.tipoAbutment as string) || null,
  }),
  component: CatalogoComponentesPage,
})

function CatalogoComponentesPage() {
  const { data: tiposReab, isLoading: loadingReab } = useTiposReabilitacao()
  const { data: todosAbutments } = useAbutments()
  const navigate = useNavigate()
  const search = useSearch({ from: catalogoComponentesRoute.id })
  const [tipoReabId, setTipoReabId] = useState<string | null>(search.tipoReab)
  const [familiaId, setFamiliaId] = useState<string | null>(search.familia)
  const [tipoAbutmentId, setTipoAbutmentId] = useState<string | null>(search.tipoAbutment)

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
  if (familiaId && tipoAbutmentId) return (
    <StoreLayout>
      <AbutmentList familiaId={familiaId} tipoAbutmentId={tipoAbutmentId} onBack={() => setTipoAbutmentId(null)} />
    </StoreLayout>
  )

  // Etapa 3: Escolher Tipo Abutment
  if (familiaId) return (
    <StoreLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <TiposAbutmentList familiaId={familiaId} onSelect={setTipoAbutmentId} onBack={() => setFamiliaId(null)} countByTipoAbutment={countByTipoAbutment} />
      </div>
    </StoreLayout>
  )

  // Etapa 2: Escolher Família
  if (tipoReabId) return (
    <StoreLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <FamiliasForReabList tipoReabId={tipoReabId} onSelect={setFamiliaId} onBack={() => setTipoReabId(null)} countByFamilia={countByFamilia} />
      </div>
    </StoreLayout>
  )

  // Etapa 1: Escolher Tipo Reabilitação
  return (
    <StoreLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">
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
          onSelect={setTipoReabId}
          onBack={() => navigate({ to: '/catalogo' })}
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

function TiposAbutmentList({ familiaId, onSelect, onBack, countByTipoAbutment }: { familiaId: string; onSelect: (id: string) => void; onBack: () => void; countByTipoAbutment: Record<string, number> }) {
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

function AbutmentList({ familiaId, tipoAbutmentId, onBack }: { familiaId: string; tipoAbutmentId: string; onBack: () => void }) {
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
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-12">
      {/* Header Premium */}
      <div className="flex items-center gap-6 mb-16">
        <button 
          onClick={onBack}
          className="group flex items-center justify-center w-12 h-12 rounded-full border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface)] hover:border-[var(--color-accent)] transition-all"
        >
          <ArrowLeft className="h-5 w-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
        </button>
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="flex gap-1">
              <div className="w-8 h-1.5 rounded-full bg-[var(--color-accent)]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-accent)] ml-2">Etapa 4 de 4</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight text-white tracking-tighter">Selecione o Abutment</h1>
          <p className="text-lg mt-2 text-[var(--color-text-muted)]">{filtered.length} componentes encontrados.</p>
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
          <Link to="/catalogo/produto/$tipo/$sku" params={{ tipo: 'abutment', sku: a.sku }} search={{ familia: familiaId, tipoAbutment: tipoAbutmentId }} className="no-underline" key={a.sku}>
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
