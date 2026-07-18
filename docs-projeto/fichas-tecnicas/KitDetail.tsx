
function KitDetail({ sku }: { sku: string }) {
  const { getIcon } = useTabIcons()
  const { data: kit } = useKitDetalhe(sku)
  const { data: imagens } = useImagensProduto("kit", sku)
  const [activeTab, setActiveTab] = useState("ficha")

  if (!kit) return <LoadingState />

  // ── Inativo: não renderiza ──
  if (!kit.ativo) return null

  const cor = "#c9a655"
  const nome = kit.nome
  const imageUrl = imagens?.[0]?.url_imagem ?? null

  // ── Specs da ficha técnica ──
  const specs: Array<{ label: string; value: string }> = [
    { label: "Nome do Kit", value: kit.nome },
    kit.tipo_kit?.nome ? { label: "Tipo", value: kit.tipo_kit.nome } : null,
    kit.descricao ? { label: "Descrição", value: kit.descricao } : null,
    { label: "SKU", value: kit.sku },
  ].filter(Boolean) as Array<{ label: string; value: string }>

  // ── Filtra itens inativos do BOM ──
  const rawBom = ((kit as unknown as Record<string, unknown[]>).composicao ?? []) as Record<string, unknown>[]
  const bomItems = rawBom
    .filter((item) => {
      const related = item.fresa ?? item.chave ?? item.acessorio ?? item.instrumental ?? item.implante
      if (related && typeof related === "object" && "ativo" in (related as Record<string, unknown>)) {
        return (related as Record<string, unknown>).ativo !== false
      }
      return true
    })
    .map((item) => resolveBOMItem(item as Parameters<typeof resolveBOMItem>[0]))
    .filter(Boolean) as { tipo: string; sku: string; nome: string; quantidade: number; preco?: number }[]

  const tabs: SectionTab[] = [
    { key: "ficha", label: "Ficha", count: specs.length },
    { key: "composicao", label: "Composição", count: bomItems.length },
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
            <AddButton tipo="kit" sku={kit.sku} nome={nome} cor={cor} precoDB={kit.preco} />
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="lg:col-span-8 xl:col-span-7 space-y-8">
        <ProductHeader cor={cor} badge={kit.tipo_kit?.nome} nome={nome} sku={kit.sku} />

        <div className="lg:hidden">
          <AddButton tipo="kit" sku={kit.sku} nome={nome} cor={cor} precoDB={kit.preco} />
        </div>

        {/* Tabs */}
        <SectionTabs tabs={tabs} active={activeTab} onChange={setActiveTab} renderIcon={(key) => { const I = getIcon(key); return <I className="w-5 h-5" /> }} />

        {/* ─── Ficha Técnica ─── */}
        {activeTab === "ficha" && (
          <div className="space-y-6">
            {/* Specs — só renderiza não nulos */}
            {specs.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map((s) => (
                  <SpecCard key={s.label} label={s.label} value={s.value} />
                ))}
              </div>
            ) : (
              <EmptyState msg="Nenhuma especificação cadastrada" hint="Preencha os dados técnicos na edição do kit." />
            )}
          </div>
        )}

        {/* ─── Composição ─── */}
        {activeTab === "composicao" && (
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30 p-4 sm:p-6 shadow-lg shadow-black/20 backdrop-blur-sm">
            {bomItems.length > 0 ? (
              <BomTable items={bomItems} />
            ) : (
              <EmptyState msg="Nenhum item na composição" hint="Adicione itens à composição na edição do kit." />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Promocional Detail ───────────────────────────────────────────── */

const TIPO_NOME_MAP: Record<string, string> = {
  implante: "Implante",
  abutment: "Abutment",
  fresa: "Fresa",
  chave: "Chave",
  acessorio: "Acessório",
  instrumental: "Instrumental",
  kit: "Kit",
}
