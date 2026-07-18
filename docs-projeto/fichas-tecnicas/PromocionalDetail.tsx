
function PromocionalDetail({ id }: { id: string }) {
  const { getIcon } = useTabIcons()
  const { data: promo } = usePromocionalDetalhe(id)
  const [activeTab, setActiveTab] = useState("ficha")

  if (!promo) return <LoadingState />

  if (!promo.ativo) return null

  const itens = promo.itens ?? []
  const itensResolvidos = itens.map((item) => {
    const preco = mockPreco(item.tipo as ProductSheetTipo, item.sku)
    const nome = TIPO_NOME_MAP[item.tipo] ?? item.tipo
    return { ...item, precoResolvido: preco, nomeResolvido: `${nome} — ${item.sku}` }
  })
  const totalItens = itensResolvidos.reduce((acc, i) => acc + i.precoResolvido, 0)
  const economia = totalItens - promo.preco
  const percentualEconomia = totalItens > 0 ? Math.round((economia / totalItens) * 100) : 0

  const cor = "#c9a655"

  const tipoColor = (tipo: string) => {
    switch (tipo) {
      case "implante": return "#c9a655"
      case "abutment": return "#8b5cf6"
      case "fresa": return "#3b82f6"
      case "chave": return "#eab308"
      case "acessorio": return "#22c55e"
      case "instrumental": return "#f43f5e"
      default: return "#94a3b8"
    }
  }

  const tabs: SectionTab[] = [
    { key: "ficha", label: "Ficha", count: 3 },
    { key: "itens", label: "Itens", count: itensResolvidos.length },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Sidebar — Imagem + CTA */}
      <div className="lg:col-span-4 xl:col-span-5">
        <div className="lg:sticky lg:top-28 space-y-6">
          <ProductImage cor={cor} nome={promo.nome} onClick={() => openImageViewer("", promo.nome)} />
          <div className="hidden lg:block">
            <AddButton tipo={"promocional" as ProductSheetTipo} sku={promo.id} nome={promo.nome} cor={cor} precoDB={promo.preco} />
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="lg:col-span-8 xl:col-span-7 space-y-8">
        <ProductHeader cor={cor} badge="Oferta Especial" nome={promo.nome} sku={promo.id} />

        <div className="lg:hidden">
          <AddButton tipo={"promocional" as ProductSheetTipo} sku={promo.id} nome={promo.nome} cor={cor} precoDB={promo.preco} />
        </div>

        {/* Tabs */}
        <SectionTabs tabs={tabs} active={activeTab} onChange={setActiveTab} renderIcon={(key) => { const I = getIcon(key); return <I className="w-5 h-5" /> }} />

        {/* ─── Ficha Técnica ─── */}
        {activeTab === "ficha" && (
          <div className="space-y-6">
            {promo.descricao && (
              <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 p-4 sm:p-6">
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{promo.descricao}</p>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <SpecCard label="Preço Original" value={formatBRL(totalItens)} />
              <SpecCard label="Preço Promocional" value={formatBRL(promo.preco)} />
              <SpecCard label="Economia" value={economia > 0 ? `${percentualEconomia}%` : "—"} />
            </div>
          </div>
        )}

        {/* ─── Itens do Pacote ─── */}
        {activeTab === "itens" && (
          <div className="space-y-3">
            {itensResolvidos.length > 0 ? (
              itensResolvidos.map((item, idx) => (
                <RelatedProductCard
                  key={item.id ?? idx}
                  nome={item.nomeResolvido}
                  sku={item.sku}
                  cor={tipoColor(item.tipo)}
                  preco={item.precoResolvido}
                  tipo={item.tipo as ProductSheetTipo}
                  onImageClick={() => openImageViewer("", item.nomeResolvido)}
                >
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    {TIPO_NOME_MAP[item.tipo] ?? item.tipo}
                  </span>
                </RelatedProductCard>
              ))
            ) : (
              <EmptyState msg="Nenhum item neste pacote" hint="Adicione itens ao pacote na edição." />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Loading State ────────────────────────────────────────────────── */
