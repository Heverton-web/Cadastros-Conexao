import { createRoute, Link, useNavigate, useSearch } from "@tanstack/react-router"
import { rootRoute } from "./__root"
import { StoreLayout } from "~/features/catalogo/components/StoreLayout"
import { DrillDown } from "~/features/catalogo/components/DrillDown"
import { ProductCard } from "~/features/catalogo/components/ProductCard"
import { useConexoes, useFamilias, useLinhas, useImplantesPorLinha, useImplantesAtivos } from "~/features/catalogo/hooks/useCatalogo"
import { useState, useEffect, useMemo } from "react"
import { ArrowLeft, PackageOpen } from "lucide-react"
import { cn } from "~/lib/utils"

export const catalogoImplantesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalogo/implantes",
  validateSearch: (s: Record<string, unknown>) => ({
    conexao: (s.conexao as string) || null,
    familia: (s.familia as string) || null,
    linha: (s.linha as string) || null,
  }),
  component: CatalogoImplantesPage,
})

function CatalogoImplantesPage() {
  const { data: conexoes, isLoading: loadingConexoes } = useConexoes()
  const { data: todasFamilias } = useFamilias()
  const { data: todasLinhas } = useLinhas()
  const navigate = useNavigate()
  const search = useSearch({ from: catalogoImplantesRoute.id })
  const [conexaoId, setConexaoId] = useState<string | null>(search.conexao)
  const [familiaId, setFamiliaId] = useState<string | null>(search.familia)
  const [linhaId, setLinhaId] = useState<string | null>(search.linha)

  const countFamiliasByConexao = useMemo(() => {
    const m: Record<string, number> = {}
    for (const f of todasFamilias ?? []) {
      if (f.conexao_id) m[f.conexao_id] = (m[f.conexao_id] ?? 0) + 1
    }
    return m
  }, [todasFamilias])

  const countLinhasByFamilia = useMemo(() => {
    const m: Record<string, number> = {}
    for (const l of todasLinhas ?? []) {
      if (l.familia_id) m[l.familia_id] = (m[l.familia_id] ?? 0) + 1
    }
    return m
  }, [todasLinhas])

  // Etapa 4: Lista de implantes
  if (linhaId) return <StoreLayout><ImplantList linhaId={linhaId} conexaoId={conexaoId!} familiaId={familiaId!} onBack={() => setLinhaId(null)} /></StoreLayout>

  // Etapa 3: Escolher Linha
  if (familiaId) return (
    <StoreLayout>
      <LinhasList familiaId={familiaId} onSelect={setLinhaId} onBack={() => setFamiliaId(null)} />
    </StoreLayout>
  )

  // Etapa 2: Escolher Família
  if (conexaoId) return (
    <StoreLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <FamiliasList conexaoId={conexaoId} onSelect={setFamiliaId} onBack={() => setConexaoId(null)} countLinhasByFamilia={countLinhasByFamilia} />
      </div>
    </StoreLayout>
  )

  // Etapa 1: Escolher Conexão
  return (
    <StoreLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <DrillDown
          title="Implantes"
          subtitle="tipo de conexão do implante (Cone Morse, HE…)"
          step={1}
          totalSteps={4}
          options={(conexoes ?? []).map((c) => ({
            id: c.id,
            label: c.nome,
            sublabel: c.sigla ?? undefined,
            count: countFamiliasByConexao[c.id] ?? 0,
          }))}
          onSelect={setConexaoId}
          onBack={() => navigate({ to: '/catalogo' })}
          isLoading={loadingConexoes}
        />
      </div>
    </StoreLayout>
  )
}

function FamiliasList({ conexaoId, onSelect, onBack, countLinhasByFamilia }: { conexaoId: string; onSelect: (id: string) => void; onBack: () => void; countLinhasByFamilia: Record<string, number> }) {
  const { data: familias, isLoading } = useFamilias(conexaoId)

  return (
    <DrillDown
      title="Famílias"
      subtitle="família anatômica do implante"
      step={2}
      totalSteps={4}
      options={(familias ?? []).map((f) => ({
        id: f.id,
        label: f.nome,
        sublabel: f.conexao?.nome,
        color: f.cor_identificacao,
        count: countLinhasByFamilia[f.id] ?? 0,
      }))}
      onSelect={onSelect}
      onBack={onBack}
      isLoading={isLoading}
    />
  )
}

function LinhasList({ familiaId, onSelect, onBack }: { familiaId: string; onSelect: (id: string) => void; onBack: () => void }) {
  const { data: linhas, isLoading } = useLinhas(familiaId)
  const { data: implantesAtivos } = useImplantesAtivos()
  const { data: familias } = useFamilias()
  const familia = (familias ?? []).find((f) => f.id === familiaId)
  const corFamilia = familia?.cor_identificacao ?? "#c9a655"
  const countByLinha = useMemo(() => {
    const m: Record<string, number> = {}
    for (const i of implantesAtivos ?? []) {
      if (i.linha_id) m[i.linha_id] = (m[i.linha_id] ?? 0) + 1
    }
    return m
  }, [implantesAtivos])

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-12">
        <div className="flex items-center gap-6 mb-16">
          <button onClick={onBack} className="group flex items-center justify-center w-12 h-12 rounded-full border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface)] hover:border-[var(--color-accent)] transition-all">
            <ArrowLeft className="h-5 w-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
          </button>
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={cn("h-1.5 rounded-full transition-all duration-500", i < 3 ? "w-8 bg-[var(--color-accent)]" : "w-2 bg-[var(--color-border-subtle)]")} />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-accent)] ml-2">Etapa 3 de 4</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-white tracking-tighter">Linhas</h1>
            <p className="text-lg mt-2 text-[var(--color-text-muted)]">linha/marca do implante</p>
          </div>
        </div>
        <div className="h-3 w-48 rounded bg-[var(--color-surface)]/50 border-b border-[var(--color-border-subtle)]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-3xl bg-[var(--color-surface)]/50 border border-[var(--color-border-subtle)] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-12">
      {/* Header Premium */}
      <div className="flex items-center gap-6 mb-16">
        <button onClick={onBack} className="group flex items-center justify-center w-12 h-12 rounded-full border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface)] hover:border-[var(--color-accent)] transition-all">
          <ArrowLeft className="h-5 w-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
        </button>
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="flex gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={cn("h-1.5 rounded-full transition-all duration-500", i < 3 ? "w-8 bg-[var(--color-accent)]" : "w-2 bg-[var(--color-border-subtle)]")} />
              ))}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-accent)] ml-2">Etapa 3 de 4</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight text-white tracking-tighter">Linhas</h1>
          <p className="text-lg mt-2 text-[var(--color-text-muted)]">linha/marca do implante</p>
        </div>
      </div>

      <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)] pb-4">
        {(linhas ?? []).length} opção(ões) disponíveis
      </p>

      {(linhas ?? []).length === 0 ? (
        <div className="text-center py-24 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 backdrop-blur-md">
          <PackageOpen className="h-14 w-14 mx-auto mb-6 opacity-20 text-white" />
          <p className="text-xl font-black text-white tracking-tight">Nenhuma linha disponível</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-2 max-w-sm mx-auto">Esta família não possui linhas cadastradas. Volte e selecione outra família.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(linhas ?? []).map((l) => (
          <button
            key={l.id}
            onClick={() => onSelect(l.id)}
            disabled={!l.ativo}
            style={{ "--card-color": corFamilia, borderWidth: "0.5px" } as React.CSSProperties}
            className="group relative text-left rounded-2xl border border-[var(--color-border-subtle)] p-5 transition-all duration-300 overflow-hidden bg-[var(--color-surface)]/50 hover:border-[var(--card-color,var(--color-accent))]/40"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(circle at top left, ${corFamilia}10 0%, transparent 70%)` }}
            />
            <div className="flex items-center gap-4 relative z-10">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                style={{ backgroundColor: `${corFamilia}12` }}
              >
                <div className="w-3 h-3 rounded-full transition-all" style={{ backgroundColor: corFamilia, boxShadow: `0 0 6px ${corFamilia}40` }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm truncate group-hover:text-[var(--card-color,var(--color-accent))] transition-colors">{l.nome}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    l.ativo
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${l.ativo ? "bg-green-400" : "bg-red-400"}`} />
                    {l.ativo ? "Ativa" : "Inativa"}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--color-text-muted)]">
                    {countByLinha[l.id] ?? 0} {countByLinha[l.id] === 1 ? "implante" : "implantes"}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      )}
    </div>
  )
}

function ImplantList({ linhaId, conexaoId, familiaId, onBack }: { linhaId: string; conexaoId: string; familiaId: string; onBack: () => void }) {
  const { data: implantes, isLoading } = useImplantesPorLinha(linhaId)
  const { data: familias } = useFamilias()
  const familia = (familias ?? []).find((f) => f.id === familiaId)
  const corFamilia = familia?.cor_identificacao ?? "#c9a655"

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
          <h1 className="text-4xl md:text-5xl font-black leading-tight text-white tracking-tighter">Selecione o Implante</h1>
          <p className="text-lg mt-2 text-[var(--color-text-muted)]">{implantes?.length ?? 0} produtos compatíveis encontrados.</p>
        </div>
      </div>

      {(implantes ?? []).length === 0 ? (
        <div className="text-center py-24 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 backdrop-blur-md">
          <PackageOpen className="h-14 w-14 mx-auto mb-6 opacity-20 text-white" />
          <p className="text-xl font-black text-white tracking-tight">Nenhum implante encontrado</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-2 max-w-sm mx-auto">Esta linha não possui implantes cadastrados. Volte e selecione outra linha.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(implantes ?? []).map((impl) => (
          <Link
            to="/catalogo/produto/$tipo/$sku"
            params={{ tipo: 'implante', sku: impl.sku }}
            search={{ conexao: conexaoId, familia: familiaId, linha: linhaId }}
            className="no-underline"
            key={impl.sku}
          >
            <ProductCard
              tipo="implante"
              sku={impl.sku}
              nome={`${impl.diametro_mm}×${impl.comprimento_mm} mm`}
              corIdentificacao={impl.linha?.familia?.cor_identificacao || corFamilia}
            />
          </Link>
        ))}
      </div>
      )}
    </div>
  )
}
