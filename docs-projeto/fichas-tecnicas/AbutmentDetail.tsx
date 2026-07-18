/* ─── Abutment Detail ──────────────────────────────────────────────── */

function AbutmentDetail({ sku }: { sku: string }) {
  const { getIcon } = useTabIcons()
  const { data: ab } = useAbutmentDetalhe(sku)
  const { data: guias } = useGuias({ familia_id: ab?.familia_id })
  const { data: imagens } = useImagensProduto("abutment", sku)
  const { data: kits } = useKitsComChavesEmComum(sku)
  const [activeTab, setActiveTab] = useState("ficha")

  if (!ab) return <LoadingState />

  // ── Inativo: não renderiza ──
  if (!ab.ativo) return null

  const cor = ab.familia?.cor_identificacao ?? "#c9a655"
  const nome = `${ab.tipo_abutment?.nome ?? ""} ${ab.familia?.nome ?? ""}`
  const imageUrl = imagens?.[0]?.url_imagem ?? null

  // ── Filtra dados nulos/vazios ──
  const specs: Array<{ label: string; value: string }> = [
    { label: "Plataforma", value: ab.diametro_plataforma ? `${ab.diametro_plataforma} mm` : "—" },
    { label: "Angulação", value: ab.angulacao_graus != null ? `${ab.angulacao_graus}°` : "—" },
    { label: "Transmucoso", value: ab.altura_transmucoso != null ? `${ab.altura_transmucoso} mm` : "—" },
    { label: "Corpo", value: ab.altura_corpo != null ? `${ab.altura_corpo} mm` : "—" },
    { label: "Torque", value: ab.torque_ncm != null ? `${ab.torque_ncm} N·cm` : "—" },
    ab.material ? { label: "Material", value: ab.material } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>

  // ── Filtra kits ativos ──
  const kitsAtivos = kits?.filter((k) => k.ativo) ?? []

  // ── Tabs ──
  const tabs: SectionTab[] = [
    { key: "ficha", label: "Ficha", count: specs.length },
    { key: "sequencia", label: "Sequência", count: 1 },
    { key: "kits", label: "Kits", count: kitsAtivos.length },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Sidebar — Imagem + CTA */}
      <div className="lg:col-span-4 xl:col-span-5">
        <div className="lg:sticky lg:top-28 space-y-6">
          <ProductImage cor={cor} nome={nome} onClick={() => openImageViewer(imageUrl ?? "", nome)} imageUrl={imageUrl} />
          {/* Miniaturas */}
          {imagens && imagens.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {imagens.map((img) => (
                <button
                  key={img.id}
                  onClick={() => openImageViewer(img.url_imagem, nome)}
                  className="shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)] transition-colors"
                >
                  <img src={img.url_imagem} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
          <div className="hidden lg:block">
            <AddButton tipo="abutment" sku={ab.sku} nome={nome} cor={cor} precoDB={ab.preco} />
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="lg:col-span-8 xl:col-span-7 space-y-8">
        <ProductHeader cor={cor} badge={ab.familia?.nome} nome={nome} sku={ab.sku} />

        <div className="lg:hidden">
          <AddButton tipo="abutment" sku={ab.sku} nome={nome} cor={cor} precoDB={ab.preco} />
        </div>

        {/* Tabs */}
        <SectionTabs tabs={tabs} active={activeTab} onChange={setActiveTab} renderIcon={(key) => { const I = getIcon(key); return <I className="w-5 h-5" /> }} />

        {/* ─── Ficha Técnica ─── */}
        {activeTab === "ficha" && (
          <div className="space-y-6">
            {/* Sigla + Descrição */}
            {ab.sigla && (
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/40">
                <Tag className="w-3 h-3 mr-1.5 text-[var(--color-text-muted)]" />
                <span className="text-xs font-bold text-white/80">{ab.sigla}</span>
              </div>
            )}

            {ab.descricao && (
              <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 p-4 sm:p-6">
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{ab.descricao}</p>
              </div>
            )}

            {/* Specs — só renderiza não nulos */}
            {specs.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map((s) => (
                  <SpecCard key={s.label} label={s.label} value={s.value} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Sequência Protética ─── */}
        {activeTab === "sequencia" && (
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 p-4 sm:p-6 shadow-lg shadow-black/20 backdrop-blur-sm">
            <SequenciaProtetica
              familiaId={ab.familia_id}
              tipoAbutmentId={ab.tipo_abutment_id}
              familiaNome={ab.familia?.nome ?? ""}
              tipoAbutmentNome={ab.tipo_abutment?.nome ?? ""}
              abutmentSku={ab.sku}
            />
          </div>
        )}

        {/* ─── Kits ─── */}
        {activeTab === "kits" && (
          <div className="space-y-3">
            {kitsAtivos.length > 0 ? (
              kitsAtivos.map((kit) => (
                <RelatedProductCard
                  key={kit.sku}
                  nome={kit.nome}
                  sku={kit.sku}
                  cor={cor}
                  preco={kit.preco}
                  tipo="kit"
                  imageUrl={kit.imagens?.[0]?.url_imagem}
                  onImageClick={() => openImageViewer(kit.imagens?.[0]?.url_imagem ?? "", kit.nome)}
                >
                  {kit.tipo_kit?.nome && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                      {kit.tipo_kit.nome}
                    </span>
                  )}
                </RelatedProductCard>
              ))
            ) : (
              <EmptyState msg="Nenhum kit disponível" hint="Nenhum kit com chaves em comum foi encontrado." />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Kit Detail ───────────────────────────────────────────────────── */
