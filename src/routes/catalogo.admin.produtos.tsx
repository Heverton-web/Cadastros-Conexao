import { createRoute } from "@tanstack/react-router"
import { authLayout } from "./_auth"
import { AdminLayout } from "~/features/catalogo/components/AdminLayout"
import { DataTable } from "~/features/catalogo/components/DataTable"
import {
  useTodosImplantes, useTodosKits, useAbutments,
  useToggleImplanteAtivo, useToggleKitAtivo,
  useRemoverImplante, useRemoverKit, useRemoverAbutment,
  useCriarImplante, useCriarAbutment, useCriarKit,
  useCategorias, useConexoes, useFamilias, useLinhas,
  useFresas, useCategoriasKit, useChavesFerramental,
  useAcessorios, useInstrumentais, useTiposReabilitacao, useTiposAbutment,
} from "~/features/catalogo/hooks/useCatalogo"
import { useState } from "react"
import { Trash2, Plus, Package, Layers, ShoppingBag } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "~/components/ui/sheet"
import { supabase } from "~/core/supabase"
import { useQueryClient } from "@tanstack/react-query"
import { useCatalogoEmpresaId } from "~/features/catalogo/hooks/useCatalogoEmpresa"

export const catalogoAdminProdutosRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/catalogo/admin/produtos",
  component: AdminProdutosPage,
})

function AdminProdutosPage() {
  const { data: implantes } = useTodosImplantes()
  const { data: abutments } = useAbutments()
  const { data: kits } = useTodosKits()
  const toggleImplante = useToggleImplanteAtivo()
  const toggleKit = useToggleKitAtivo()
  const removeImplante = useRemoverImplante()
  const removeKit = useRemoverKit()
  const removeAbutment = useRemoverAbutment()
  const [itemParaDeletar, setItemParaDeletar] = useState<{ sku: string; tipo: string } | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<{ sku: string; tipo: string } | null>(null)

  const allItems = [
    ...(implantes ?? []).map((i) => ({ sku: i.sku, nome: `${i.linha?.familia?.nome ?? ""} ${i.diametro_mm}×${i.comprimento_mm}`, tipo: "Implante", ativo: i.ativo })),
    ...(abutments ?? []).map((a) => ({ sku: a.sku, nome: `${a.tipo_abutment?.nome ?? ""} ${a.familia?.nome ?? ""}`, tipo: "Componente", ativo: true })),
    ...(kits ?? []).map((k) => ({ sku: k.sku, nome: k.nome, tipo: "Kit", ativo: k.ativo })),
  ]

  function handleDelete() {
    if (!itemParaDeletar) return
    const { sku, tipo } = itemParaDeletar
    if (tipo === "Implante") removeImplante.mutate(sku)
    else if (tipo === "Kit") removeKit.mutate(sku)
    else removeAbutment.mutate(sku)
    setItemParaDeletar(null)
  }

  function handleToggle(sku: string, tipo: string, ativo: boolean) {
    if (tipo === "Implante") toggleImplante.mutate({ sku, ativo: !ativo })
    else if (tipo === "Kit") toggleKit.mutate({ sku, ativo: !ativo })
  }

  function handleEdit(sku: string, tipo: string) {
    setEditingItem({ sku, tipo })
    setFormOpen(true)
  }

  function handleNew() {
    setEditingItem(null)
    setFormOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border-subtle)] shadow-lg">
          <div>
            <h1 className="text-2xl font-black text-white">Gestão de SKUs e Produtos</h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted, #94a3b8)" }}>
              Crie, edite, ative/inative ou exclua itens do catálogo (Vitrine).
            </p>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-transform hover:scale-105"
            style={{ background: "linear-gradient(135deg, #c9a655, #e8d48b)", color: "#0f172a" }}
          >
            <Plus className="h-4 w-4" /> NOVO SKU
          </button>
        </div>

        <div className="bg-[var(--color-surface)]/50 p-6 rounded-2xl border border-[var(--color-border-subtle)] backdrop-blur-md">
          <DataTable
            headers={['SKU', 'Produto', 'Tipo', 'Ações']}
            rows={allItems}
            onToggle={(sku, ativo) => {
              const item = allItems.find(i => i.sku === sku);
              if (item) handleToggle(sku, item.tipo, ativo);
            }}
          />
        </div>

        <AlertDialog open={!!itemParaDeletar} onOpenChange={(o) => !o && setItemParaDeletar(null)}>
          <AlertDialogContent style={{ background: "var(--color-card, #1e293b)", borderColor: "rgba(201,166,85,0.15)" }}>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Excluir item?</AlertDialogTitle>
              <AlertDialogDescription>Esta ação apagará {itemParaDeletar?.sku} do banco.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-500 text-white hover:bg-red-600">Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <ProdutoFormSheet
          open={formOpen}
          onOpenChange={setFormOpen}
          editingItem={editingItem}
        />
      </div>
    </AdminLayout>
  )
}

type ProdutoTipo = "implante" | "abutment" | "kit"

function ProdutoFormSheet({
  open, onOpenChange, editingItem,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: { sku: string; tipo: string } | null
}) {
  const empresaId = useCatalogoEmpresaId()
  const qc = useQueryClient()
  const criarImplante = useCriarImplante()
  const criarAbutment = useCriarAbutment()
  const criarKit = useCriarKit()

  const { data: categorias } = useCategorias()
  const { data: conexoes } = useConexoes()
  const { data: familias } = useFamilias()
  const { data: linhas } = useLinhas()
  const { data: fresas } = useFresas()
  const { data: catsKit } = useCategoriasKit()
  const { data: chaves } = useChavesFerramental()
  const { data: acessorios } = useAcessorios()
  const { data: instrumentais } = useInstrumentais()
  const { data: tiposReab } = useTiposReabilitacao()
  const { data: tiposAbutment } = useTiposAbutment()

  const [tipo, setTipo] = useState<ProdutoTipo>("implante")
  const [saving, setSaving] = useState(false)

  const [implante, setImplante] = useState({
    categoria_id: "", conexao_id: "", familia_id: "", linha_id: "",
    sku: "", diametro_mm: 0, comprimento_mm: 0, torque_insercao: 0,
    rosca_interna: "", regiao_apical: "", regiao_cervical: "",
    material: "", superficie: "", tratamento: "", chave_sku: "",
  })

  const [abutment, setAbutment] = useState({
    familia_id: "", tipo_reabilitacao_id: "", tipo_abutment_id: "",
    sku: "", diametro_plataforma: "", angulacao_graus: 0,
    altura_transmucoso: 0, altura_corpo: 0, torque_ncm: 0,
  })

  const [kit, setKit] = useState({
    categoria_id: "", sku: "", nome: "", descricao: "",
    familia_ids: [] as string[],
  })

  const [fresagemHard, setFresagemHard] = useState<{ fresa_sku: string; ordem: number }[]>([])
  const [fresagemSoft, setFresagemSoft] = useState<{ fresa_sku: string; ordem: number }[]>([])

  function resetForms() {
    setImplante({ categoria_id: "", conexao_id: "", familia_id: "", linha_id: "", sku: "", diametro_mm: 0, comprimento_mm: 0, torque_insercao: 0, rosca_interna: "", regiao_apical: "", regiao_cervical: "", material: "", superficie: "", tratamento: "", chave_sku: "" })
    setAbutment({ familia_id: "", tipo_reabilitacao_id: "", tipo_abutment_id: "", sku: "", diametro_plataforma: "", angulacao_graus: 0, altura_transmucoso: 0, altura_corpo: 0, torque_ncm: 0 })
    setKit({ categoria_id: "", sku: "", nome: "", descricao: "", familia_ids: [] })
    setFresagemHard([])
    setFresagemSoft([])
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (tipo === "implante") {
        const payload = {
          sku: implante.sku,
          linha_id: implante.linha_id,
          diametro_mm: implante.diametro_mm,
          comprimento_mm: implante.comprimento_mm,
          torque_insercao: implante.torque_insercao || undefined,
          rosca_interna: implante.rosca_interna || undefined,
          regiao_apical: implante.regiao_apical || undefined,
          regiao_cervical: implante.regiao_cervical || undefined,
        }
        await criarImplante.mutateAsync(payload)

        for (const f of fresagemHard) {
          await supabase.from("catalogo_protocolo_fresagem").insert({
            empresa_id: empresaId, implante_sku: implante.sku,
            fresa_sku: f.fresa_sku, tipo_osso: "Hard (I-II)", ordem_uso: f.ordem,
          })
        }
        for (const f of fresagemSoft) {
          await supabase.from("catalogo_protocolo_fresagem").insert({
            empresa_id: empresaId, implante_sku: implante.sku,
            fresa_sku: f.fresa_sku, tipo_osso: "Soft (III-IV)", ordem_uso: f.ordem,
          })
        }
      } else if (tipo === "abutment") {
        await criarAbutment.mutateAsync({
          sku: abutment.sku,
          familia_id: abutment.familia_id,
          tipo_reabilitacao_id: abutment.tipo_reabilitacao_id,
          tipo_abutment_id: abutment.tipo_abutment_id,
          diametro_plataforma: abutment.diametro_plataforma || undefined,
          angulacao_graus: abutment.angulacao_graus || undefined,
          altura_transmucoso: abutment.altura_transmucoso || undefined,
          altura_corpo: abutment.altura_corpo || undefined,
          torque_ncm: abutment.torque_ncm || undefined,
        })
      } else {
        await criarKit.mutateAsync({
          sku: kit.sku,
          categoria_id: kit.categoria_id,
          nome: kit.nome,
          descricao: kit.descricao || undefined,
          familia_ids: kit.familia_ids,
        })
      }

      qc.invalidateQueries({ queryKey: ["catalogo"] })
      onOpenChange(false)
      resetForms()
    } catch (err) {
      console.error("Erro ao salvar produto:", err)
    } finally {
      setSaving(false)
    }
  }

  function addFresagem(tipoOsso: "hard" | "soft") {
    const setter = tipoOsso === "hard" ? setFresagemHard : setFresagemSoft
    const arr = tipoOsso === "hard" ? fresagemHard : fresagemSoft
    setter([...arr, { fresa_sku: "", ordem: arr.length + 1 }])
  }

  function removeFresagem(tipoOsso: "hard" | "soft", idx: number) {
    const setter = tipoOsso === "hard" ? setFresagemHard : setFresagemSoft
    const arr = tipoOsso === "hard" ? fresagemHard : fresagemSoft
    setter(arr.filter((_, i) => i !== idx))
  }

  function updateFresagem(tipoOsso: "hard" | "soft", idx: number, field: string, value: string | number) {
    const setter = tipoOsso === "hard" ? setFresagemHard : setFresagemSoft
    const arr = tipoOsso === "hard" ? [...fresagemHard] : [...fresagemSoft]
    arr[idx] = { ...arr[idx], [field]: value }
    setter(arr)
  }

  const selectCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
  const inputCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
  const labelCls = "text-xs font-bold uppercase tracking-widest text-gray-400"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-[#0f172a] border-l-[var(--color-border-subtle)] p-0 flex flex-col">
        <SheetHeader className="p-6 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
          <div className="inline-flex items-center px-3 py-1 rounded-full border mb-2 border-[#c9a655] bg-[#c9a655]/10 text-[#c9a655] w-fit">
            <span className="text-[10px] font-black uppercase tracking-widest">
              {editingItem ? `Editando ${editingItem.tipo}` : "Novo Produto"}
            </span>
          </div>
          <SheetTitle className="text-2xl font-black text-white">
            {editingItem ? editingItem.sku : "Cadastrar novo SKU"}
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            Preencha as informações detalhadas para a vitrine pública.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className={labelCls}>Tipo de Produto</label>
            <div className="flex gap-2">
              {(["implante", "abutment", "kit"] as ProdutoTipo[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    tipo === t
                      ? "bg-[#c9a655] text-[#0f172a]"
                      : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-white/5 hover:border-white/10"
                  }`}
                >
                  {t === "implante" && <Package className="h-4 w-4" />}
                  {t === "abutment" && <Layers className="h-4 w-4" />}
                  {t === "kit" && <ShoppingBag className="h-4 w-4" />}
                  {t === "implante" ? "Implante" : t === "abutment" ? "Componente" : "Kit"}
                </button>
              ))}
            </div>
          </div>

          {/* Formulário de Implante */}
          {tipo === "implante" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Hierarquia</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={labelCls}>Categoria *</label>
                  <select value={implante.categoria_id} onChange={(e) => setImplante({ ...implante, categoria_id: e.target.value })} className={selectCls}>
                    <option value="">Selecione...</option>
                    {categorias?.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Conexão *</label>
                  <select value={implante.conexao_id} onChange={(e) => setImplante({ ...implante, conexao_id: e.target.value })} className={selectCls}>
                    <option value="">Selecione...</option>
                    {conexoes?.filter((c) => !implante.categoria_id || c.categoria_id === implante.categoria_id).map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Família *</label>
                  <select value={implante.familia_id} onChange={(e) => setImplante({ ...implante, familia_id: e.target.value })} className={selectCls}>
                    <option value="">Selecione...</option>
                    {familias?.filter((f) => !implante.conexao_id || f.conexao_id === implante.conexao_id).map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Linha *</label>
                  <select value={implante.linha_id} onChange={(e) => setImplante({ ...implante, linha_id: e.target.value })} className={selectCls}>
                    <option value="">Selecione...</option>
                    {linhas?.filter((l) => !implante.familia_id || l.familia_id === implante.familia_id).map((l) => <option key={l.id} value={l.id}>{l.nome}</option>)}
                  </select>
                </div>
              </div>

              <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655] pt-2">Identificação</h3>
              <div className="space-y-2">
                <label className={labelCls}>SKU *</label>
                <input type="text" value={implante.sku} onChange={(e) => setImplante({ ...implante, sku: e.target.value })} className={inputCls} placeholder="Ex: 524385" />
              </div>

              <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655] pt-2">Especificações Cirúrgicas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={labelCls}>Ø mm *</label>
                  <input type="number" step="0.1" value={implante.diametro_mm} onChange={(e) => setImplante({ ...implante, diametro_mm: Number(e.target.value) })} className={inputCls} />
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Comp. mm *</label>
                  <input type="number" step="0.1" value={implante.comprimento_mm} onChange={(e) => setImplante({ ...implante, comprimento_mm: Number(e.target.value) })} className={inputCls} />
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Torque N·cm</label>
                  <input type="number" value={implante.torque_insercao} onChange={(e) => setImplante({ ...implante, torque_insercao: Number(e.target.value) })} className={inputCls} />
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Rosca Interna</label>
                  <input type="text" value={implante.rosca_interna} onChange={(e) => setImplante({ ...implante, rosca_interna: e.target.value })} className={inputCls} placeholder="Ex: M 1.6" />
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Região Apical</label>
                  <input type="text" value={implante.regiao_apical} onChange={(e) => setImplante({ ...implante, regiao_apical: e.target.value })} className={inputCls} placeholder="Ex: Cônico" />
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Região Cervical</label>
                  <input type="text" value={implante.regiao_cervical} onChange={(e) => setImplante({ ...implante, regiao_cervical: e.target.value })} className={inputCls} placeholder="Ex: Cilíndrico" />
                </div>
              </div>

              <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655] pt-2">Material & Superfície</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={labelCls}>Material</label>
                  <input type="text" value={implante.material} onChange={(e) => setImplante({ ...implante, material: e.target.value })} className={inputCls} placeholder="Ex: Titânio Grau 4" />
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Superfície</label>
                  <input type="text" value={implante.superficie} onChange={(e) => setImplante({ ...implante, superficie: e.target.value })} className={inputCls} placeholder="Ex: Porous" />
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Tratamento</label>
                  <input type="text" value={implante.tratamento} onChange={(e) => setImplante({ ...implante, tratamento: e.target.value })} className={inputCls} placeholder="Ex: SLA" />
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Chave de Instalação</label>
                  <select value={implante.chave_sku} onChange={(e) => setImplante({ ...implante, chave_sku: e.target.value })} className={selectCls}>
                    <option value="">Selecione...</option>
                    {chaves?.map((c) => <option key={c.sku} value={c.sku}>{c.nome}</option>)}
                  </select>
                </div>
              </div>

              <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655] pt-2">Sequência de Fresagem — Osso Hard (I-II)</h3>
              {fresagemHard.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-8">{i + 1}.</span>
                  <select value={f.fresa_sku} onChange={(e) => updateFresagem("hard", i, "fresa_sku", e.target.value)} className={selectCls + " flex-1"}>
                    <option value="">Selecione a fresa...</option>
                    {fresas?.map((fr) => <option key={fr.sku} value={fr.sku}>{fr.nome} (Ø{fr.diametro_mm})</option>)}
                  </select>
                  <button onClick={() => removeFresagem("hard", i)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              ))}
              <button onClick={() => addFresagem("hard")} className="text-xs font-bold text-[#c9a655] hover:text-[#e8d48b] transition-colors">+ Adicionar fresa Hard</button>

              <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655] pt-2">Sequência de Fresagem — Osso Soft (III-IV)</h3>
              {fresagemSoft.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-8">{i + 1}.</span>
                  <select value={f.fresa_sku} onChange={(e) => updateFresagem("soft", i, "fresa_sku", e.target.value)} className={selectCls + " flex-1"}>
                    <option value="">Selecione a fresa...</option>
                    {fresas?.map((fr) => <option key={fr.sku} value={fr.sku}>{fr.nome} (Ø{fr.diametro_mm})</option>)}
                  </select>
                  <button onClick={() => removeFresagem("soft", i)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              ))}
              <button onClick={() => addFresagem("soft")} className="text-xs font-bold text-[#c9a655] hover:text-[#e8d48b] transition-colors">+ Adicionar fresa Soft</button>
            </div>
          )}

          {/* Formulário de Componente (Abutment) */}
          {tipo === "abutment" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Identificação</h3>
              <div className="space-y-2">
                <label className={labelCls}>SKU *</label>
                <input type="text" value={abutment.sku} onChange={(e) => setAbutment({ ...abutment, sku: e.target.value })} className={inputCls} placeholder="Ex: AB1002" />
              </div>

              <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655] pt-2">Relacionamentos</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={labelCls}>Família *</label>
                  <select value={abutment.familia_id} onChange={(e) => setAbutment({ ...abutment, familia_id: e.target.value })} className={selectCls}>
                    <option value="">Selecione...</option>
                    {familias?.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Tipo Reabilitação *</label>
                  <select value={abutment.tipo_reabilitacao_id} onChange={(e) => setAbutment({ ...abutment, tipo_reabilitacao_id: e.target.value })} className={selectCls}>
                    <option value="">Selecione...</option>
                    {tiposReab?.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Tipo Abutment *</label>
                  <select value={abutment.tipo_abutment_id} onChange={(e) => setAbutment({ ...abutment, tipo_abutment_id: e.target.value })} className={selectCls}>
                    <option value="">Selecione...</option>
                    {tiposAbutment?.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </select>
                </div>
              </div>

              <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655] pt-2">Especificações</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={labelCls}>Ø Plataforma (mm)</label>
                  <input type="text" value={abutment.diametro_plataforma} onChange={(e) => setAbutment({ ...abutment, diametro_plataforma: e.target.value })} className={inputCls} placeholder="Ex: 3.5" />
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Angulação (graus)</label>
                  <input type="number" value={abutment.angulacao_graus} onChange={(e) => setAbutment({ ...abutment, angulacao_graus: Number(e.target.value) })} className={inputCls} />
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Altura Transmucoso (mm)</label>
                  <input type="number" step="0.1" value={abutment.altura_transmucoso} onChange={(e) => setAbutment({ ...abutment, altura_transmucoso: Number(e.target.value) })} className={inputCls} />
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Altura Corpo (mm)</label>
                  <input type="number" step="0.1" value={abutment.altura_corpo} onChange={(e) => setAbutment({ ...abutment, altura_corpo: Number(e.target.value) })} className={inputCls} />
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Torque (N·cm)</label>
                  <input type="number" value={abutment.torque_ncm} onChange={(e) => setAbutment({ ...abutment, torque_ncm: Number(e.target.value) })} className={inputCls} />
                </div>
              </div>
            </div>
          )}

          {/* Formulário de Kit */}
          {tipo === "kit" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Identificação</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={labelCls}>SKU *</label>
                  <input type="text" value={kit.sku} onChange={(e) => setKit({ ...kit, sku: e.target.value })} className={inputCls} placeholder="Ex: 950000-KIT" />
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Categoria Kit</label>
                  <select value={kit.categoria_id} onChange={(e) => setKit({ ...kit, categoria_id: e.target.value })} className={selectCls}>
                    <option value="">Selecione...</option>
                    {catsKit?.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Nome *</label>
                <input type="text" value={kit.nome} onChange={(e) => setKit({ ...kit, nome: e.target.value })} className={inputCls} placeholder="Ex: Kit Master Flex" />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Descrição</label>
                <textarea value={kit.descricao} onChange={(e) => setKit({ ...kit, descricao: e.target.value })} className={inputCls + " min-h-[80px]"} placeholder="Descrição do kit..." />
              </div>

              <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655] pt-2">Famílias Compatíveis</h3>
              <div className="flex flex-wrap gap-2">
                {familias?.map((f) => {
                  const selected = kit.familia_ids.includes(f.id)
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        setKit({
                          ...kit,
                          familia_ids: selected
                            ? kit.familia_ids.filter((id) => id !== f.id)
                            : [...kit.familia_ids, f.id],
                        })
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                        selected
                          ? "bg-[#c9a655]/20 text-[#c9a655] border-[#c9a655]/30"
                          : "bg-[var(--color-surface)] text-gray-400 border-white/10 hover:border-white/20"
                      }`}
                    >
                      {f.nome}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)] flex gap-4">
          <button onClick={() => onOpenChange(false)} className="flex-1 py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5">Cancelar</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-4 rounded-xl text-[#0f172a] font-black hover:scale-105 transition-transform disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #c9a655, #e8d48b)" }}
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
