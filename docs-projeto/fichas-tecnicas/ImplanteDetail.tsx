function ImplanteDetail({ sku }: { sku: string }) {
  const { getIcon } = useTabIcons()
  const { data: impl } = useImplanteDetalhe(sku)
  const { data: protocolos } = useProtocoloFresagem(sku)
  const { data: imagens } = useImagensProduto("implante", sku)
  const { data: chaves } = useChavesDoImplante(sku)
  const { data: cicatrizadores } = useCicatrizadoresDoImplante(sku)
  const { data: abutments } = useAbutmentsDaFamilia(impl?.familia_id)
  const { data: kits } = useKitsComChavesEmComum(sku)
  const [activeTab, setActiveTab] = useState("ficha")

  if (!impl) return <LoadingState />

  // ── Inativo: não renderiza ──
  if (!impl.ativo) return null

  const cor = impl.linha?.familia?.cor_identificacao ?? "#c9a655"
  const nome = `${impl.linha?.familia?.nome ?? ""} ${impl.diametro_mm}×${impl.comprimento_mm}`
  const imageUrl = imagens?.[0]?.url_imagem ?? null

  // ── Filtra dados nulos/vazios ──
  const specs: Array<{ label: string; value: string }> = [
    { label: "Diâmetro", value: `${impl.diametro_mm} mm` },
    { label: "Comprimento", value: `${impl.comprimento_mm} mm` },
    impl.diametro_plataforma_mm != null ? { label: "Ø Plataforma", value: `${impl.diametro_plataforma_mm} mm` } : null,
    impl.rosca_interna ? { label: "Rosca Interna", value: impl.rosca_interna } : null,
    impl.torque_insercao != null ? { label: "Torque Max", value: `${impl.torque_insercao} N·cm` } : null,
    impl.regiao_apical ? { label: "Região Apical", value: impl.regiao_apical } : null,
    impl.regiao_cervical ? { label: "Região Cervical", value: impl.regiao_cervical } : null,
    impl.macrogeometria ? { label: "Macrogeometria", value: impl.macrogeometria } : null,
    (impl.detalhes_extras as Record<string, unknown>)?.material
      ? { label: "Material", value: String((impl.detalhes_extras as Record<string, unknown>).material) } : null,
    (impl.detalhes_extras as Record<string, unknown>)?.superficie
      ? { label: "Superfície", value: String((impl.detalhes_extras as Record<string, unknown>).superficie) } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>

  // ── Filtra itens ativos ──
  const chavesAtivas = chaves?.filter((c) => c.ativo) ?? []
  const cicatAtivos = cicatrizadores?.filter((c) => c.ativo) ?? []
  const abutAtivos = abutments?.filter((a) => a.ativo) ?? []
  const kitsAtivos = kits?.filter((k) => k.ativo) ?? []

  // ── Tabs (só inclui se tiver dados) ──
  const tabs: SectionTab[] = [
    { key: "ficha", label: "Ficha", count: specs.length },
    { key: "fresagem", label: "Protocolos", count: protocolos?.length ?? 0 },
    { key: "chaves", label: "Chaves", count: chavesAtivas.length },
    { key: "kits", label: "Kits", count: kitsAtivos.length },
    { key: "cicatrizadores", label: "Cicatriz.", count: cicatAtivos.length },
    { key: "abutments", label: "Abutments", count: abutAtivos.length },
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
            <AddButton tipo="implante" sku={impl.sku} nome={nome} cor={cor} precoDB={impl.preco} />
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="lg:col-span-8 xl:col-span-7 space-y-8">
        <ProductHeader cor={cor} badge={impl.linha?.familia?.nome} nome={nome} sku={impl.sku} />

        <div className="lg:hidden">
          <AddButton tipo="implante" sku={impl.sku} nome={nome} cor={cor} precoDB={impl.preco} />
        </div>

        {/* Tabs */}
        <SectionTabs tabs={tabs} active={activeTab} onChange={setActiveTab} renderIcon={(key) => { const I = getIcon(key); return <I className="w-5 h-5" /> }} />

        {/* ─── Ficha Técnica ─── */}
        {activeTab === "ficha" && (
          <div className="space-y-6">
            {/* Breadcrumb hierárquico */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
              {impl.categoria_id && <span>{impl.linha?.familia?.conexao?.categoria?.nome ?? impl.categoria_id}</span>}
              {impl.conexao_id && (
                <>
                  {impl.categoria_id && <span className="opacity-40">/</span>}
                  <span>{impl.linha?.familia?.conexao?.nome ?? impl.conexao_id}</span>
                </>
              )}
              {impl.familia_id && (
                <>
                  {(impl.categoria_id || impl.conexao_id) && <span className="opacity-40">/</span>}
                  <span>{impl.linha?.familia?.nome ?? impl.familia_id}</span>
                </>
              )}
              {impl.linha_id && (
                <>
                  <span className="opacity-40">/</span>
                  <span>{impl.linha?.nome ?? impl.linha_id}</span>
                </>
              )}
            </div>

            {/* Sigla + Descrição */}
            {impl.sigla && (
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/40">
                <Tag className="w-3 h-3 mr-1.5 text-[var(--color-text-muted)]" />
                <span className="text-xs font-bold text-white/80">{impl.sigla}</span>
              </div>
            )}

            {impl.descricao && (
              <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 p-4 sm:p-6">
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{impl.descricao}</p>
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

        {/* ─── Protocolos de Fresagem ─── */}
        {activeTab === "fresagem" && (
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 p-4 sm:p-6 shadow-lg shadow-black/20 backdrop-blur-sm">
            {protocolos && protocolos.length > 0 ? (
              <FresagemTimeline implanteSku={impl.sku} protocolos={protocolos} />
            ) : (
              <EmptyState msg="Nenhum protocolo de fresagem cadastrado" hint="Adicione uma sequência de fresagem na edição do implante." />
            )}
          </div>
        )}

        {/* ─── Chaves ─── */}
        {activeTab === "chaves" && (
          <div className="space-y-3">
            {chavesAtivas.map((chave) => (
              <RelatedProductCard
                key={chave.sku}
                nome={chave.nome}
                sku={chave.sku}
                cor={cor}
                preco={chave.preco}
                tipo="chave"
                imageUrl={chave.imagens?.[0]?.url_imagem}
                onImageClick={() => openImageViewer(chave.imagens?.[0]?.url_imagem ?? "", chave.nome)}
              >
                {chave.tipo_chave?.nome && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    {chave.tipo_chave.nome}
                  </span>
                )}
              </RelatedProductCard>
            ))}
          </div>
        )}

        {/* ─── Kits ─── */}
        {activeTab === "kits" && (
          <div className="space-y-3">
            {kitsAtivos.map((kit) => (
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
            ))}
          </div>
        )}

        {/* ─── Cicatrizadores ─── */}
        {activeTab === "cicatrizadores" && (
          <div className="space-y-3">
            {cicatAtivos.map((cic) => (
              <RelatedProductCard
                key={cic.sku}
                nome={cic.nome}
                sku={cic.sku}
                cor={cor}
                preco={cic.preco}
                tipo="cicatrizador"
                imageUrl={cic.imagens?.[0]?.url_imagem}
                onImageClick={() => openImageViewer(cic.imagens?.[0]?.url_imagem ?? "", cic.nome)}
              >
                {cic.sigla && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    {cic.sigla}
                  </span>
                )}
              </RelatedProductCard>
            ))}
          </div>
        )}

        {/* ─── Abutments ─── */}
        {activeTab === "abutments" && (
          <div className="space-y-3">
            {abutAtivos.map((ab) => (
              <RelatedProductCard
                key={ab.sku}
                nome={`${ab.tipo_abutment?.nome ?? ""} ${ab.familia?.nome ?? ""}`.trim()}
                sku={ab.sku}
                cor={cor}
                preco={ab.preco}
                tipo="abutment"
                imageUrl={ab.imagens?.[0]?.url_imagem}
                onImageClick={() => openImageViewer(ab.imagens?.[0]?.url_imagem ?? "", ab.nome ?? ab.sku)}
              >
                {ab.tipo_abutment?.nome && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    {ab.tipo_abutment.nome}
                  </span>
                )}
              </RelatedProductCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
