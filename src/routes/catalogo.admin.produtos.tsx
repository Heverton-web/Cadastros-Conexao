import { RequirePermission } from "~/components/guards"
import { createRoute } from "@tanstack/react-router"
import { authLayout } from "./_auth"
import { EmpresaCrudGuard } from "~/features/catalogo/components/EmpresaCrudGuard"
import { AdminLayout } from "~/features/catalogo/components/AdminLayout"
import {
  useTodosImplantes, useTodosKits, useAbutments,
  useToggleImplanteAtivo, useToggleKitAtivo,
  useRemoverImplante, useRemoverKit, useRemoverAbutment,
  useCriarImplante, useCriarAbutment, useCriarKit,
  useCategorias, useConexoes, useFamilias, useLinhas,
  useFresas, useCategoriasKit, useChavesFerramental,
  useAcessorios, useInstrumentais, useTiposReabilitacao, useTiposAbutment,
} from "~/features/catalogo/hooks/useCatalogo"
import { useState, useEffect } from "react"
import { Trash2, Plus, Pencil, Search, Eye, EyeOff, Package, Layers, ShoppingBag, Building2 } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Badge } from "~/components/ui/badge"
import { supabase } from "~/core/supabase"
import { useQueryClient } from "@tanstack/react-query"
import { useCatalogoEmpresaId } from "~/features/catalogo/hooks/useCatalogoEmpresa"
import { useAuth } from "~/lib/auth"
import { listarEmpresas, type Empresa } from "~/shared/empresas"
import { salvarSequenciaProtetica } from "~/features/catalogo/services/sequencia-protetica.service"
import { adicionarBOMItem } from "~/features/catalogo/services/kits.service"

export const catalogoAdminProdutosRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/catalogo/admin/produtos",
  component: () => (
    <RequirePermission modulo="catalogo" permissions={["catalogo_gerenciar_produtos"]}>
      <EmpresaCrudGuard>
        <AdminProdutosPage />
      </EmpresaCrudGuard>
    </RequirePermission>
  ),
})

function AdminProdutosPage() {
  const { profile } = useAuth()
  const isSuperAdmin = profile?.is_super_admin === true
  const empresaIdAuth = profile?.empresa_id ?? ""

  // Super Admin: seletor de empresa
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string>(empresaIdAuth)

  useEffect(() => {
    if (isSuperAdmin) {
      listarEmpresas().then(setEmpresas).catch(() => {})
    } else {
      setSelectedEmpresaId(empresaIdAuth)
    }
  }, [isSuperAdmin, empresaIdAuth])

  // Dados
  const { data: implantes, isLoading: loadingImplantes } = useTodosImplantes()
  const { data: abutments, isLoading: loadingAbutments } = useAbutments()
  const { data: kits, isLoading: loadingKits } = useTodosKits()

  // Mutations
  const toggleImplante = useToggleImplanteAtivo()
  const toggleKit = useToggleKitAtivo()
  const removeImplante = useRemoverImplante()
  const removeKit = useRemoverKit()
  const removeAbutment = useRemoverAbutment()

  // UI State
  const [search, setSearch] = useState("")
  const [filtroTipo, setFiltroTipo] = useState<string>("todos")
  const [itemParaDeletar, setItemParaDeletar] = useState<{ sku: string; tipo: string; nome: string } | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<{ sku: string; tipo: string } | null>(null)

  const loading = loadingImplantes || loadingAbutments || loadingKits

  // Montar lista unificada
  const allItems = [
    ...(implantes ?? []).map((i) => ({
      sku: i.sku,
      nome: `${i.linha?.familia?.nome ?? ""} ${i.diametro_mm}×${i.comprimento_mm}`,
      tipo: "Implante",
      tipoKey: "implante",
      ativo: i.ativo,
      preco: (i as any).preco ?? null,
    })),
    ...(abutments ?? []).map((a) => ({
      sku: a.sku,
      nome: `${a.tipo_abutment?.nome ?? ""} ${a.familia?.nome ?? ""}`,
      tipo: "Componente",
      tipoKey: "abutment",
      ativo: true,
      preco: (a as any).preco ?? null,
    })),
    ...(kits ?? []).map((k) => ({
      sku: k.sku,
      nome: k.nome,
      tipo: "Kit",
      tipoKey: "kit",
      ativo: k.ativo,
      preco: (k as any).preco ?? null,
    })),
  ]

  // Filtros
  const itensFiltrados = allItems.filter((item) => {
    const matchBusca = !search ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.nome.toLowerCase().includes(search.toLowerCase())
    const matchTipo = filtroTipo === "todos" || item.tipoKey === filtroTipo
    return matchBusca && matchTipo
  })

  function handleDelete() {
    if (!itemParaDeletar) return
    const { sku, tipoKey } = itemParaDeletar as any
    if (tipoKey === "implante") removeImplante.mutate(sku)
    else if (tipoKey === "kit") removeKit.mutate(sku)
    else removeAbutment.mutate(sku)
    setItemParaDeletar(null)
  }

  function handleToggle(sku: string, tipoKey: string, ativo: boolean) {
    if (tipoKey === "implante") toggleImplante.mutate({ sku, ativo: !ativo })
    else if (tipoKey === "kit") toggleKit.mutate({ sku, ativo: !ativo })
  }

  function handleEdit(sku: string, tipoKey: string) {
    setEditingItem({ sku, tipo: tipoKey })
    setFormOpen(true)
  }

  function handleNew() {
    setEditingItem(null)
    setFormOpen(true)
  }

  const tipoBadgeColor: Record<string, string> = {
    implante: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    abutment: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
    kit: "bg-green-500/15 text-green-400 border border-green-500/20",
  }

  const tipoLabel: Record<string, string> = {
    implante: "Implante",
    abutment: "Componente",
    kit: "Kit",
  }

  function formatBRL(v: number | null) {
    if (v == null) return "—"
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border-subtle)] shadow-lg">
          <div>
            <h1 className="text-2xl font-black text-white">Gestão de Produtos</h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted, #94a3b8)" }}>
              Crie, edite, ative/inative ou exclua itens do catálogo.
            </p>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-transform hover:scale-105"
            style={{ background: "linear-gradient(135deg, #c9a655, #e8d48b)", color: "#0f172a" }}
          >
            <Plus className="h-4 w-4" /> NOVO PRODUTO
          </button>
        </div>

        {/* Seletor de empresa (Super Admin) */}
        {isSuperAdmin && (
          <div className="flex items-center gap-4 bg-[var(--color-surface)] p-4 rounded-2xl border border-[var(--color-border-subtle)]">
            <Building2 size={18} className="text-[#c9a655] shrink-0" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Empresa:</span>
            <select
              value={selectedEmpresaId}
              onChange={(e) => setSelectedEmpresaId(e.target.value)}
              className="flex-1 bg-[var(--color-surface)] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">Selecione uma empresa...</option>
              {empresas.map((e) => (
                <option key={e.id} value={e.id}>{e.nome}</option>
              ))}
            </select>
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              placeholder="Buscar por SKU ou nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 pl-9 text-white placeholder-gray-500"
            />
          </div>
          <div className="flex gap-1">
            {[
              { key: "todos", label: "Todos" },
              { key: "implante", label: "Implantes" },
              { key: "abutment", label: "Componentes" },
              { key: "kit", label: "Kits" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFiltroTipo(f.key)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                  filtroTipo === f.key
                    ? "bg-[#c9a655] text-[#0f172a]"
                    : "bg-[var(--color-surface)] text-gray-400 border border-white/10 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Carregando produtos...</p>
          </div>
        ) : itensFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border-subtle)]">
            <Package className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Nenhum produto encontrado</p>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--color-surface)]">
                  <th className="p-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">SKU</th>
                  <th className="p-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Produto</th>
                  <th className="p-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo</th>
                  <th className="p-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Preço</th>
                  <th className="p-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 w-28"></th>
                </tr>
              </thead>
              <tbody>
                {itensFiltrados.map((item) => (
                  <tr key={`${item.tipoKey}_${item.sku}`} className={`border-b border-[var(--color-border-subtle)] ${!item.ativo ? "opacity-50" : ""}`}>
                    <td className="p-4 font-mono text-sm text-white">{item.sku}</td>
                    <td className="p-4 text-white font-medium">{item.nome}</td>
                    <td className="p-4">
                      <Badge variant="outline" className={tipoBadgeColor[item.tipoKey] ?? "border-white/20 text-gray-300"}>
                        {tipoLabel[item.tipoKey] ?? item.tipo}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-300 text-sm">{formatBRL(item.preco)}</td>
                    <td className="p-4">
                      <Badge variant={item.ativo ? "default" : "secondary"} className={item.ativo ? "bg-green-500/20 text-green-400 border border-green-500/20" : "bg-red-500/20 text-red-400 border border-red-500/20"}>
                        {item.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggle(item.sku, item.tipoKey, item.ativo)}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          title={item.ativo ? "Desativar" : "Ativar"}
                        >
                          {item.ativo ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(item.sku, item.tipoKey)}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setItemParaDeletar(item)}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Contador */}
        <div className="text-xs text-gray-500 text-right">
          {itensFiltrados.length} de {allItems.length} produtos
        </div>

        {/* AlertDialog de exclusão */}
        <AlertDialog open={!!itemParaDeletar} onOpenChange={(o) => !o && setItemParaDeletar(null)}>
          <AlertDialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Esta ação não pode ser desfeita. O produto <strong className="text-white">{itemParaDeletar?.sku}</strong> será removido permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-[var(--color-surface)] border border-white/10 text-white hover:bg-white/10">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Modal de formulário */}
        <ProdutoFormModal
          open={formOpen}
          onOpenChange={setFormOpen}
          editingItem={editingItem}
        />
      </div>
    </AdminLayout>
  )
}

// ============================================================
// Modal de Formulário de Produto
// ============================================================

type ProdutoTipo = "implante" | "abutment" | "kit"

function ProdutoFormModal({
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

  const [tipo, setTipo] = useState<ProdutoTipo>(
    editingItem?.tipo === "implante" ? "implante" :
    editingItem?.tipo === "abutment" ? "abutment" : "kit"
  )
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

  // Sequência Protética (Abutments)
  interface SeqEtapa { etapa_nome: string; acessorio_sku: string }
  const [seqAnalógica, setSeqAnalógica] = useState<SeqEtapa[]>([])
  const [seqDigital, setSeqDigital] = useState<SeqEtapa[]>([])

  // Composição do Kit (BOM)
  interface BomItem { tipo: "fresa" | "chave" | "acessorio" | "instrumental" | "implante"; sku: string; quantidade: number }
  const [kitBom, setKitBom] = useState<BomItem[]>([])

  function resetForms() {
    setImplante({ categoria_id: "", conexao_id: "", familia_id: "", linha_id: "", sku: "", diametro_mm: 0, comprimento_mm: 0, torque_insercao: 0, rosca_interna: "", regiao_apical: "", regiao_cervical: "", material: "", superficie: "", tratamento: "", chave_sku: "" })
    setAbutment({ familia_id: "", tipo_reabilitacao_id: "", tipo_abutment_id: "", sku: "", diametro_plataforma: "", angulacao_graus: 0, altura_transmucoso: 0, altura_corpo: 0, torque_ncm: 0 })
    setKit({ categoria_id: "", sku: "", nome: "", descricao: "", familia_ids: [] })
    setFresagemHard([])
    setFresagemSoft([])
    setSeqAnalógica([])
    setSeqDigital([])
    setKitBom([])
  }

  useEffect(() => {
    if (open) {
      if (editingItem) {
        setTipo(editingItem.tipo as ProdutoTipo)
      } else {
        setTipo("implante")
        resetForms()
      }
    }
  }, [open, editingItem])

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

        // Salvar sequências protéticas
        const allEtapas = [
          ...seqAnalógica.map((e, i) => ({ tipo_workflow: "analógico" as const, etapa_ordem: i + 1, etapa_nome: e.etapa_nome, acessorio_sku: e.acessorio_sku })),
          ...seqDigital.map((e, i) => ({ tipo_workflow: "digital" as const, etapa_ordem: i + 1, etapa_nome: e.etapa_nome, acessorio_sku: e.acessorio_sku })),
        ]
        await salvarSequenciaProtetica(empresaId, abutment.sku, allEtapas)

      } else {
        await criarKit.mutateAsync({
          sku: kit.sku,
          categoria_id: kit.categoria_id,
          nome: kit.nome,
          descricao: kit.descricao || undefined,
          familia_ids: kit.familia_ids,
        })

        // Salvar composição do kit (BOM)
        for (const item of kitBom) {
          await adicionarBOMItem(empresaId, kit.sku, { tipo: item.tipo, sku: item.sku, quantidade: item.quantidade })
        }
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

  // Helpers — Sequência Protética
  function addSeqEtapa(tipo: "analógico" | "digital") {
    const setter = tipo === "analógico" ? setSeqAnalógica : setSeqDigital
    setter([...(tipo === "analógico" ? seqAnalógica : seqDigital), { etapa_nome: "", acessorio_sku: "" }])
  }
  function removeSeqEtapa(tipo: "analógico" | "digital", idx: number) {
    const setter = tipo === "analógico" ? setSeqAnalógica : setSeqDigital
    setter((tipo === "analógico" ? seqAnalógica : seqDigital).filter((_, i) => i !== idx))
  }
  function updateSeqEtapa(tipo: "analógico" | "digital", idx: number, field: string, value: string) {
    const setter = tipo === "analógico" ? setSeqAnalógica : setSeqDigital
    const arr = [...(tipo === "analógico" ? seqAnalógica : seqDigital)]
    arr[idx] = { ...arr[idx], [field]: value }
    setter(arr)
  }

  // Helpers — Composição do Kit (BOM)
  function addBomItem() {
    setKitBom([...kitBom, { tipo: "fresa", sku: "", quantidade: 1 }])
  }
  function removeBomItem(idx: number) {
    setKitBom(kitBom.filter((_, i) => i !== idx))
  }
  function updateBomItem(idx: number, field: string, value: string | number) {
    const arr = [...kitBom]
    arr[idx] = { ...arr[idx], [field]: value }
    setKitBom(arr)
  }

  const selectCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
  const inputCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
  const labelCls = "text-xs font-bold uppercase tracking-widest text-gray-400"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white max-w-2xl flex flex-col max-h-[85vh] overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle>{editingItem ? `Editar ${editingItem.tipo}` : "Novo Produto"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {editingItem ? `Editando ${editingItem.sku}` : "Preencha as informações para cadastrar um novo produto."}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
          {/* Seletor de tipo */}
          <div className="space-y-2">
            <label className={labelCls}>Tipo de Produto</label>
            <div className="flex gap-2">
              {(["implante", "abutment", "kit"] as ProdutoTipo[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  disabled={!!editingItem}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    tipo === t
                      ? "bg-[#c9a655] text-[#0f172a]"
                      : "bg-[var(--color-surface)] text-gray-400 border border-white/5 hover:border-white/10"
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

              <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#c9a655]">Sequência de Fresagem — Osso Hard (I-II)</h3>
                {fresagemHard.length === 0 && (
                  <p className="text-xs text-gray-500 italic">Nenhuma fresa adicionada.</p>
                )}
                {fresagemHard.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[var(--color-background)] rounded-lg p-3 border border-white/5">
                    <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#c9a655]/10 text-[#c9a655] text-xs font-black shrink-0">{i + 1}</span>
                    <select value={f.fresa_sku} onChange={(e) => updateFresagem("hard", i, "fresa_sku", e.target.value)} className={selectCls + " flex-1"}>
                      <option value="">Selecione a fresa...</option>
                      {fresas?.map((fr) => <option key={fr.sku} value={fr.sku}>{fr.nome} (Ø{fr.diametro_mm})</option>)}
                    </select>
                    <button onClick={() => removeFresagem("hard", i)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
                <button onClick={() => addFresagem("hard")} className="flex items-center gap-1.5 text-xs font-bold text-[#c9a655] hover:text-[#e8d48b] transition-colors pt-1">
                  <span className="text-lg leading-none">+</span> Adicionar fresa Hard
                </button>
              </div>

              <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#c9a655]">Sequência de Fresagem — Osso Soft (III-IV)</h3>
                {fresagemSoft.length === 0 && (
                  <p className="text-xs text-gray-500 italic">Nenhuma fresa adicionada.</p>
                )}
                {fresagemSoft.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[var(--color-background)] rounded-lg p-3 border border-white/5">
                    <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#c9a655]/10 text-[#c9a655] text-xs font-black shrink-0">{i + 1}</span>
                    <select value={f.fresa_sku} onChange={(e) => updateFresagem("soft", i, "fresa_sku", e.target.value)} className={selectCls + " flex-1"}>
                      <option value="">Selecione a fresa...</option>
                      {fresas?.map((fr) => <option key={fr.sku} value={fr.sku}>{fr.nome} (Ø{fr.diametro_mm})</option>)}
                    </select>
                    <button onClick={() => removeFresagem("soft", i)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
                <button onClick={() => addFresagem("soft")} className="flex items-center gap-1.5 text-xs font-bold text-[#c9a655] hover:text-[#e8d48b] transition-colors pt-1">
                  <span className="text-lg leading-none">+</span> Adicionar fresa Soft
                </button>
              </div>
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

              {/* Sequência Protética — Analógica */}
              <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#c9a655]">Sequência Protética — Analógica</h3>
                {seqAnalógica.length === 0 && (
                  <p className="text-xs text-gray-500 italic">Nenhuma etapa adicionada.</p>
                )}
                {seqAnalógica.map((e, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[var(--color-background)] rounded-lg p-3 border border-white/5">
                    <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#c9a655]/10 text-[#c9a655] text-xs font-black shrink-0">{i + 1}</span>
                    <input type="text" value={e.etapa_nome} onChange={(e2) => updateSeqEtapa("analógico", i, "etapa_nome", e2.target.value)} className={inputCls + " flex-1"} placeholder="Nome da etapa (ex: Cicatrização)" />
                    <select value={e.acessorio_sku} onChange={(e2) => updateSeqEtapa("analógico", i, "acessorio_sku", e2.target.value)} className={selectCls + " flex-1"}>
                      <option value="">Selecione o acessório...</option>
                      {acessorios?.map((a) => <option key={a.sku} value={a.sku}>{a.nome}</option>)}
                    </select>
                    <button onClick={() => removeSeqEtapa("analógico", i)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
                <button onClick={() => addSeqEtapa("analógico")} className="flex items-center gap-1.5 text-xs font-bold text-[#c9a655] hover:text-[#e8d48b] transition-colors pt-1">
                  <span className="text-lg leading-none">+</span> Adicionar etapa Analógica
                </button>
              </div>

              {/* Sequência Protética — Digital */}
              <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#c9a655]">Sequência Protética — Digital</h3>
                {seqDigital.length === 0 && (
                  <p className="text-xs text-gray-500 italic">Nenhuma etapa adicionada.</p>
                )}
                {seqDigital.map((e, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[var(--color-background)] rounded-lg p-3 border border-white/5">
                    <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#c9a655]/10 text-[#c9a655] text-xs font-black shrink-0">{i + 1}</span>
                    <input type="text" value={e.etapa_nome} onChange={(e2) => updateSeqEtapa("digital", i, "etapa_nome", e2.target.value)} className={inputCls + " flex-1"} placeholder="Nome da etapa (ex: Cicatrização)" />
                    <select value={e.acessorio_sku} onChange={(e2) => updateSeqEtapa("digital", i, "acessorio_sku", e2.target.value)} className={selectCls + " flex-1"}>
                      <option value="">Selecione o acessório...</option>
                      {acessorios?.map((a) => <option key={a.sku} value={a.sku}>{a.nome}</option>)}
                    </select>
                    <button onClick={() => removeSeqEtapa("digital", i)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
                <button onClick={() => addSeqEtapa("digital")} className="flex items-center gap-1.5 text-xs font-bold text-[#c9a655] hover:text-[#e8d48b] transition-colors pt-1">
                  <span className="text-lg leading-none">+</span> Adicionar etapa Digital
                </button>
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

              {/* Composição do Kit (BOM) */}
              <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#c9a655]">Composição do Kit (BOM)</h3>
                {kitBom.length === 0 && (
                  <p className="text-xs text-gray-500 italic">Nenhum item adicionado.</p>
                )}
                {kitBom.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[var(--color-background)] rounded-lg p-3 border border-white/5">
                    <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#c9a655]/10 text-[#c9a655] text-xs font-black shrink-0">{i + 1}</span>
                    <select value={item.tipo} onChange={(e2) => updateBomItem(i, "tipo", e2.target.value)} className={selectCls + " w-36"}>
                      <option value="fresa">Fresa</option>
                      <option value="chave">Chave</option>
                      <option value="acessorio">Acessório</option>
                      <option value="instrumental">Instrumental</option>
                      <option value="implante">Implante</option>
                    </select>
                    <select value={item.sku} onChange={(e2) => updateBomItem(i, "sku", e2.target.value)} className={selectCls + " flex-1"}>
                      <option value="">Selecione o produto...</option>
                      {item.tipo === "fresa" && fresas?.map((p) => <option key={p.sku} value={p.sku}>{p.nome}</option>)}
                      {item.tipo === "chave" && chaves?.map((p) => <option key={p.sku} value={p.sku}>{p.nome}</option>)}
                      {item.tipo === "acessorio" && acessorios?.map((p) => <option key={p.sku} value={p.sku}>{p.nome}</option>)}
                      {item.tipo === "instrumental" && instrumentais?.map((p) => <option key={p.sku} value={p.sku}>{p.nome}</option>)}
                      {item.tipo === "implante" && implantes?.map((p) => <option key={p.sku} value={p.sku}>{p.sku}</option>)}
                    </select>
                    <input type="number" min={1} value={item.quantidade} onChange={(e2) => updateBomItem(i, "quantidade", Number(e2.target.value))} className={inputCls + " w-20 text-center"} />
                    <button onClick={() => removeBomItem(i)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
                <button onClick={addBomItem} className="flex items-center gap-1.5 text-xs font-bold text-[#c9a655] hover:text-[#e8d48b] transition-colors pt-1">
                  <span className="text-lg leading-none">+</span> Adicionar item ao kit
                </button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="shrink-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full px-6 py-3 rounded-xl text-[#0f172a] font-black hover:scale-105 transition-transform disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #c9a655, #e8d48b)" }}
          >
            {saving ? "Salvando..." : editingItem ? "Salvar" : "Criar Produto"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
